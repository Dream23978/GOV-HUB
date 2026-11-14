import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword, verifyPassword } from "@/lib/password";
import { upsertProfile, getProfileById, findProfileByIdentifier } from "./profile.service";
import { sendOtpEmail } from "./email.service";
import { Profile } from "@/types/database";
import { cookies, headers } from "next/headers";
import { createHash, randomBytes, randomInt } from "node:crypto";

export interface SignInParams {
  nik: string;
  password: string;
}

export interface SignUpParams {
  nik: string;
  emailPhone: string;
  password: string;
  namaLengkap?: string;
}

export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function nikToAuthEmail(nik: string): string {
  return `${nik}@govhub.id`;
}

function isStrongPassword(password: string): boolean {
  return (
    Boolean(password) &&
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function normalizeResetIdentifier(contact: string): string {
  const trimmed = contact.trim();
  return trimmed.includes("@") ? trimmed.toLowerCase() : trimmed;
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function isHttpsRequest(): Promise<boolean> {
  const hdrs = await headers();
  return (
    hdrs.get("x-forwarded-proto") === "https" ||
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") === true
  );
}

/**
 * Service login warga menggunakan identitas NIK 16 digit dan Password
 */
export async function signInWithNik({
  nik,
  password,
}: SignInParams): Promise<AuthResponse<{ user: unknown; profile: Profile | null }>> {
  const cleanNik = nik.trim();
  if (!/^\d{16}$/.test(cleanNik) || !password) {
    return {
      success: false,
      error: "NIK (16 digit) atau kata sandi yang Anda masukkan tidak sesuai.",
    };
  }

  const supabase = await createClient();
  const adminClient = createAdminClient();

  let targetEmail: string | null = null;
  if (adminClient) {
    const { data: profileRecord } = await adminClient
      .from("profiles")
      .select("email")
      .eq("nik", cleanNik)
      .maybeSingle();
    if (profileRecord?.email) {
      targetEmail = profileRecord.email;
    }
  }

  let data: { user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null } | null = null;
  let error: { message?: string } | null = null;

  if (targetEmail) {
    const res = await supabase.auth.signInWithPassword({ email: targetEmail, password });
    data = res.data;
    error = res.error;
  }

  if (error || !data?.user) {
    const fallbackRes = await supabase.auth.signInWithPassword({
      email: nikToAuthEmail(cleanNik),
      password,
    });
    if (!fallbackRes.error && fallbackRes.data.user) {
      data = fallbackRes.data;
      error = null;
    }
  }

  if (error || !data?.user) {
    return {
      success: false,
      error: "NIK atau password yang Anda masukkan tidak sesuai.",
    };
  }

  let profile = await getProfileById(data.user.id);
  const resolvedEmail =
    profile?.email ||
    data.user.email ||
    (typeof data.user.user_metadata?.email_kontak === "string"
      ? data.user.user_metadata.email_kontak
      : null) ||
    targetEmail;

  if (!profile) {
    const fallbackName =
      (typeof data.user.user_metadata?.nama_lengkap === "string"
        ? data.user.user_metadata.nama_lengkap
        : null) || `Warga ${cleanNik.slice(-4)}`;

    const createRes = await upsertProfile({
      id: data.user.id,
      nik: cleanNik,
      nama_lengkap: fallbackName,
      email: resolvedEmail || undefined,
      nomor_telepon:
        typeof data.user.user_metadata?.nomor_telepon === "string"
          ? data.user.user_metadata.nomor_telepon
          : null,
      kota: "Surabaya",
      provinsi: "Jawa Timur",
    });
    profile = createRes.data || null;
  }

  return {
    success: true,
    data: {
      user: { id: data.user.id, email: data.user.email },
      profile,
    },
  };
}

/**
 * Service registrasi warga baru ke Supabase Auth & Tabel public.profiles
 */
export async function signUpWithNik({
  nik,
  emailPhone,
  password,
  namaLengkap,
}: SignUpParams): Promise<AuthResponse<{ user: unknown; profile: Profile | null }>> {
  const cleanNik = nik.trim();
  const cleanContact = emailPhone.trim();
  if (!/^\d{16}$/.test(cleanNik)) {
    return { success: false, error: "NIK harus terdiri dari 16 digit angka." };
  }
  if (!isStrongPassword(password)) {
    return {
      success: false,
      error:
        "Kata sandi minimal 8 karakter dan wajib mengandung huruf besar, huruf kecil, angka, serta karakter khusus.",
    };
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanContact);
  const phoneNumber = !isEmail ? cleanContact : null;
  const contactEmail = isEmail ? cleanContact.toLowerCase() : null;
  const resolvedNama = (namaLengkap?.trim() || `Warga ${cleanNik.slice(-4)}`).slice(0, 120);
  const authEmail = contactEmail || nikToAuthEmail(cleanNik);
  const adminClient = createAdminClient();

  if (adminClient) {
    const { data: existingNik } = await adminClient
      .from("profiles")
      .select("id")
      .eq("nik", cleanNik)
      .maybeSingle();

    if (existingNik) {
      return {
        success: false,
        error: "NIK atau Email ini sudah terdaftar. Silakan gunakan menu Masuk.",
      };
    }

    const { data: adminUser, error: adminError } = await adminClient.auth.admin.createUser({
      email: authEmail,
      password,
      email_confirm: true,
      user_metadata: {
        nik: cleanNik,
        nama_lengkap: resolvedNama,
        email_kontak: contactEmail,
        nomor_telepon: phoneNumber,
      },
    });

    if (!adminError && adminUser?.user) {
      await upsertProfile({
        id: adminUser.user.id,
        nik: cleanNik,
        nama_lengkap: resolvedNama,
        email: authEmail,
        nomor_telepon: phoneNumber,
        kota: "Surabaya",
        provinsi: "Jawa Timur",
      });

      const supabase = await createClient();
      await supabase.auth.signInWithPassword({ email: authEmail, password });
      const profile = await getProfileById(adminUser.user.id);
      return {
        success: true,
        data: { user: { id: adminUser.user.id, email: adminUser.user.email }, profile },
      };
    }

    if (adminError?.message?.toLowerCase().includes("already")) {
      return {
        success: false,
        error: "NIK atau Email ini sudah terdaftar. Silakan gunakan menu Masuk.",
      };
    }
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: authEmail,
    password,
    options: {
      data: {
        nik: cleanNik,
        nama_lengkap: resolvedNama,
        email_kontak: contactEmail,
        nomor_telepon: phoneNumber,
      },
    },
  });

  if (authError) {
    if (authError.message.toLowerCase().includes("already registered") || authError.status === 422) {
      return {
        success: false,
        error: "NIK atau Email ini sudah terdaftar. Silakan gunakan menu Masuk.",
      };
    }
    return {
      success: false,
      error: "Gagal melakukan registrasi akun. Silakan periksa kembali data Anda.",
    };
  }

  const user = authData?.user;
  let profile: Profile | null = null;

  if (user) {
    const profileRes = await upsertProfile({
      id: user.id,
      nik: cleanNik,
      nama_lengkap: resolvedNama,
      email: authEmail,
      nomor_telepon: phoneNumber,
      kota: "Surabaya",
      provinsi: "Jawa Timur",
    });
    profile = profileRes.data || null;

    await supabase.auth.signInWithPassword({ email: authEmail, password });
  }

  return {
    success: true,
    data: { user: user ? { id: user.id, email: user.email } : null, profile },
  };
}

/**
 * Service untuk mengambil user yang sedang login dan profil lengkapnya
 */
export async function getCurrentUserWithProfile() {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData?.user) {
    return { user: null, profile: null };
  }

  const profile = await getProfileById(authData.user.id);
  return { user: authData.user, profile };
}

/**
 * Service logout pengguna
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

const RESET_COOKIE = "gov_pw_reset";
const MAX_OTP_ATTEMPTS = 5;

/**
 * Service meminta kode reset password (OTP) ke email terdaftar
 */
export async function requestPasswordReset(
  contact: string
): Promise<AuthResponse<{ email: string; nik?: string }>> {
  const identifier = normalizeResetIdentifier(contact);
  if (!identifier) {
    return { success: false, error: "Masukkan Email, No. Handphone, atau NIK yang terdaftar." };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Layanan reset kata sandi belum dikonfigurasi." };
  }

  const { profile, matchedNik, matchedEmail } = await findProfileByIdentifier(identifier);
  if (!profile?.id || !matchedEmail || matchedEmail.endsWith("@govhub.id")) {
    return {
      success: false,
      error:
        "Akun dengan email aktif tidak ditemukan. Pastikan Anda memiliki alamat email terdaftar pada akun GOV-HUB.",
    };
  }

  // Normalize canonical identifier so cooldown & lookup are case-insensitive across all inputs
  const storageIdentifier = matchedEmail.trim().toLowerCase();

  const { data: lastReq } = await adminClient
    .from("password_resets")
    .select("created_at")
    .eq("identifier", storageIdentifier)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastReq && Date.now() - new Date(lastReq.created_at).getTime() < 60_000) {
    return { success: false, error: "Tunggu 1 menit sebelum meminta kode OTP baru." };
  }

  const otpCode = randomInt(10000, 100000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await adminClient.from("password_resets").delete().eq("identifier", storageIdentifier);

  const { error: insertErr } = await adminClient.from("password_resets").insert({
    identifier: storageIdentifier,
    token: hashPassword(otpCode),
    expires_at: expiresAt,
  });

  if (insertErr) {
    return { success: false, error: "Gagal membuat kode OTP. Coba lagi nanti." };
  }

  const emailRes = await sendOtpEmail({
    to: matchedEmail,
    otpCode,
  });

  if (!emailRes.success) {
    await adminClient.from("password_resets").delete().eq("identifier", storageIdentifier);
    return { success: false, error: emailRes.error || "Gagal mengirim email kode OTP." };
  }

  return {
    success: true,
    data: {
      email: storageIdentifier,
      nik: matchedNik || undefined,
    },
  };
}

/**
 * Service memverifikasi token OTP 5 digit pemulihan kata sandi (atomic attempts tracking)
 */
export async function verifyPasswordResetOtp({
  email,
  token,
}: {
  email: string;
  token: string;
}): Promise<AuthResponse<{ verified: boolean }>> {
  const cleanToken = token.trim();
  const identifier = normalizeResetIdentifier(email);
  const invalid = {
    success: false,
    error: "Kode OTP salah atau telah kedaluwarsa. Silakan periksa kembali.",
  };

  const adminClient = createAdminClient();
  if (!adminClient || !identifier || !/^\d{5}$/.test(cleanToken)) {
    return invalid;
  }

  // Lookup canonical email if caller typed NIK/phone or different casing
  const { matchedEmail } = await findProfileByIdentifier(identifier);
  const lookupIds = Array.from(
    new Set([identifier, matchedEmail?.trim().toLowerCase()].filter(Boolean) as string[])
  );

  const { data: row } = await adminClient
    .from("password_resets")
    .select("id, token, attempts")
    .in("identifier", lookupIds)
    .is("used_at", null)
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!row) return invalid;

  // Atomically consume an attempt slot before checking OTP so concurrent brute-force is serialized
  const { data: attemptRows } = await adminClient.rpc("increment_otp_attempt", {
    p_reset_id: row.id,
    p_max_attempts: MAX_OTP_ATTEMPTS,
  });

  if (!attemptRows || attemptRows.length === 0) {
    return { success: false, error: "Terlalu banyak percobaan. Silakan minta kode OTP baru." };
  }

  const { valid } = verifyPassword(cleanToken, row.token);
  if (!valid) {
    return invalid;
  }

  const resetToken = randomBytes(32).toString("hex");
  const { error: updateErr } = await adminClient
    .from("password_resets")
    .update({ reset_token: sha256Hex(resetToken), attempts: MAX_OTP_ATTEMPTS })
    .eq("id", row.id);

  if (updateErr) {
    return { success: false, error: "Gagal memproses sesi reset kata sandi." };
  }

  const secure = await isHttpsRequest();
  (await cookies()).set(RESET_COOKIE, resetToken, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60,
  });

  return { success: true, data: { verified: true } };
}

/**
 * Service memperbarui kata sandi baru untuk user login atau pemegang cookie reset terverifikasi
 */
export async function updateUserPassword(
  newPassword: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _emailFromClient?: string
): Promise<AuthResponse<{ updated: boolean }>> {
  if (!isStrongPassword(newPassword)) {
    return {
      success: false,
      error:
        "Kata sandi baru minimal 8 karakter dengan huruf besar, huruf kecil, angka, dan karakter khusus.",
    };
  }

  const supabase = await createClient();
  const cookieStore = await cookies();
  const resetToken = cookieStore.get(RESET_COOKIE)?.value;

  if (!resetToken) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        error: "Sesi reset password tidak valid atau kedaluwarsa. Silakan ulangi dari awal.",
      };
    }

    const { error: sessionError } = await supabase.auth.updateUser({ password: newPassword });
    if (!sessionError) return { success: true, data: { updated: true } };
    return {
      success: false,
      error: "Gagal memperbarui kata sandi akun.",
    };
  }

  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Layanan reset kata sandi belum dikonfigurasi." };
  }

  const { data: resetRow } = await adminClient
    .from("password_resets")
    .select("id, identifier")
    .eq("reset_token", sha256Hex(resetToken))
    .is("used_at", null)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!resetRow) {
    cookieStore.delete(RESET_COOKIE);
    return {
      success: false,
      error: "Sesi reset password tidak valid atau kedaluwarsa. Silakan ulangi dari awal.",
    };
  }

  const { profile } = await findProfileByIdentifier(resetRow.identifier);
  if (!profile?.id) {
    return {
      success: false,
      error: "Akun pengguna tidak ditemukan untuk memperbarui kata sandi.",
    };
  }

  const { error: adminUpdateErr } = await adminClient.auth.admin.updateUserById(profile.id, {
    password: newPassword,
  });

  if (adminUpdateErr) {
    return {
      success: false,
      error: "Gagal memperbarui kata sandi pada server autentikasi.",
    };
  }

  if (profile.role === "admin" || profile.role === "petugas") {
    await adminClient
      .from("profiles")
      .update({
        password_hash: hashPassword(newPassword),
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);
  }

  await adminClient
    .from("password_resets")
    .update({ used_at: new Date().toISOString() })
    .eq("id", resetRow.id);
  cookieStore.delete(RESET_COOKIE);

  return { success: true, data: { updated: true } };
}
