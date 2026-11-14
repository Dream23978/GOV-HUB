import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertProfile, getProfileById, findProfileByIdentifier } from "./profile.service";
import { sendOtpEmail } from "./email.service";
import { Profile } from "@/types/database";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Fungsi pembantu untuk menghasilkan hash kata sandi terenkripsi
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

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

/**
 * Service login menggunakan identitas NIK dan Password
 */
export async function signInWithNik({ nik, password }: SignInParams): Promise<AuthResponse<{ user: unknown; profile: Profile | null }>> {
  const supabase = await createClient();
  const adminClient = createAdminClient();
  const cleanNik = nik.trim();

  // 1. Cari email asli warga: coba via profiles, lalu fallback via metadata admin
  let targetEmail = "";
  try {
    const { data: profileRecord } = await supabase
      .from("profiles")
      .select("email")
      .eq("nik", cleanNik)
      .maybeSingle();

    if (profileRecord?.email) {
      targetEmail = profileRecord.email;
    }
  } catch {
    // Abaikan jika query gagal
  }

  // Fallback cari email dari admin API jika tabel profiles terkendala izin schema
  if (!targetEmail && adminClient) {
    try {
      const { data: usersData } = await adminClient.auth.admin.listUsers();
      const match = usersData?.users?.find(
        (u) =>
          u.user_metadata?.nik === cleanNik ||
          u.email?.startsWith(cleanNik)
      );
      if (match?.email) {
        targetEmail = match.email;
      }
    } catch (err) {
      console.warn("Notice admin fallback:", err);
    }
  }

  // 2. Coba login dengan email asli yang terdaftar
  const signInResult = targetEmail
    ? await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      })
    : { data: null, error: { message: "Email not found" } };

  let data = signInResult.data;
  let error = signInResult.error;

  // 3. Fallback: Coba format {nik}@govhub.id jika belum berhasil
  if (error || !data?.user) {
    const fallbackGovHub = await supabase.auth.signInWithPassword({
      email: nikToAuthEmail(cleanNik),
      password,
    });
    if (!fallbackGovHub.error && fallbackGovHub.data.user) {
      data = fallbackGovHub.data;
      error = null;
    }
  }

  // 4. Fallback: Coba format {nik}@local
  if (error || !data?.user) {
    const fallbackLocal = await supabase.auth.signInWithPassword({
      email: `${cleanNik}@local`,
      password,
    });
    if (!fallbackLocal.error && fallbackLocal.data.user) {
      data = fallbackLocal.data;
      error = null;
    }
  }

  if (error || !data?.user) {
    return {
      success: false,
      error: "NIK atau password yang Anda masukkan tidak sesuai.",
    };
  }

  // 5. Ambil atau inisialisasi profil di tabel public.profiles
  let profile = await getProfileById(data.user.id);
  const fallbackEmail =
    profile?.email ||
    data.user.email ||
    data.user.user_metadata?.email_kontak ||
    targetEmail;
  const currentPasswordHash = hashPassword(password);

  if (!profile) {
    const fallbackName =
      data.user.user_metadata?.nama_lengkap ||
      data.user.user_metadata?.full_name ||
      `Warga ${cleanNik.slice(-4)}`;

    const createRes = await upsertProfile({
      id: data.user.id,
      nik: cleanNik,
      nama_lengkap: fallbackName,
      email: fallbackEmail,
      password_hash: currentPasswordHash,
      nomor_telepon: data.user.user_metadata?.nomor_telepon || null,
      role: "warga",
      desil_saat_ini: 5,
      kota: "Surabaya",
      provinsi: "Jawa Timur",
    });
    profile = createRes.data || null;
  } else if (!profile.password_hash || !profile.email) {
    // Sinkronkan otomatis jika sebelumnya masih NULL
    await upsertProfile({
      id: profile.id,
      nik: profile.nik,
      nama_lengkap: profile.nama_lengkap,
      email: profile.email || fallbackEmail,
      password_hash: profile.password_hash || currentPasswordHash,
      nomor_telepon: profile.nomor_telepon,
      role: profile.role,
      desil_saat_ini: profile.desil_saat_ini,
      kota: profile.kota,
      provinsi: profile.provinsi,
    });
    profile = await getProfileById(data.user.id);
  }

  return {
    success: true,
    data: {
      user: data.user,
      profile,
    },
  };
}

/**
 * Service registrasi warga baru ke Supabase Auth & Tabel public.profiles
 * Menggunakan EMAIL ASLI yang diinputkan user di tabel auth.users
 */
export async function signUpWithNik({
  nik,
  emailPhone,
  password,
  namaLengkap,
}: SignUpParams): Promise<AuthResponse<{ user: unknown; profile: Profile | null }>> {
  const cleanNik = nik.trim();
  if (!/^\d{16}$/.test(cleanNik)) {
    return { success: false, error: "NIK harus terdiri dari 16 digit angka." };
  }
  if (!password || password.length < 8) {
    return { success: false, error: "Kata sandi minimal harus 8 karakter." };
  }
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPhone.trim());
  const phoneNumber = !isEmail ? emailPhone.trim() : null;
  const contactEmail = isEmail ? emailPhone.trim() : null;
  const resolvedNama = (namaLengkap?.trim() || `Warga ${cleanNik.slice(-4)}`).slice(0, 120);

  // JIKA USER INPUT EMAIL ASLI: DAFTARKAN DENGAN EMAIL ASLI TERSEBUT
  // Hanya gunakan format internal jika user murni memasukkan nomor telepon
  const authEmail = isEmail ? emailPhone.trim() : nikToAuthEmail(cleanNik);
  const passwordHash = hashPassword(password);

  const adminClient = createAdminClient();

  // Pastikan NIK belum digunakan oleh akun lain sebelum membuat akun baru
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
  }

  // 1. Jika ada SUPABASE_SERVICE_ROLE_KEY di .env.local, gunakan admin API
  if (adminClient) {
    const { data: adminUser, error: adminError } = await adminClient.auth.admin.createUser({
      email: authEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        nik: cleanNik,
        nama_lengkap: resolvedNama,
        email_kontak: contactEmail,
        nomor_telepon: phoneNumber,
        role: "warga",
      },
    });

    if (!adminError && adminUser?.user) {
      await upsertProfile({
        id: adminUser.user.id,
        nik: cleanNik,
        nama_lengkap: resolvedNama,
        email: authEmail,
        password_hash: passwordHash,
        nomor_telepon: phoneNumber,
        role: "warga",
        desil_saat_ini: 5,
        kota: "Surabaya",
        provinsi: "Jawa Timur",
      });

      const supabase = await createClient();
      await supabase.auth.signInWithPassword({
        email: authEmail,
        password: password,
      });

      const profile = await getProfileById(adminUser.user.id);
      return {
        success: true,
        data: { user: adminUser.user, profile },
      };
    }
  }

  // 2. Registrasi via client biasa
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: authEmail,
    password: password,
    options: {
      data: {
        nik: cleanNik,
        nama_lengkap: resolvedNama,
        email_kontak: contactEmail,
        nomor_telepon: phoneNumber,
        role: "warga",
      },
    },
  });

  if (authError) {
    const errMsg = authError.message.toLowerCase();

    // Bypass rate limit email Supabase
    if (errMsg.includes("rate limit") || errMsg.includes("over_email_send_rate_limit") || authError.status === 429) {
      const signInCheck = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: password,
      });

      if (!signInCheck.error && signInCheck.data.user) {
        await upsertProfile({
          id: signInCheck.data.user.id,
          nik: cleanNik,
          nama_lengkap: resolvedNama,
          email: authEmail,
          password_hash: passwordHash,
          nomor_telepon: phoneNumber,
          role: "warga",
          desil_saat_ini: 5,
          kota: "Surabaya",
          provinsi: "Jawa Timur",
        });

        const profile = await getProfileById(signInCheck.data.user.id);
        return {
          success: true,
          data: { user: signInCheck.data.user, profile },
        };
      }

      return {
        success: false,
        error: "Sistem pendaftaran sedang sibuk. Silakan gunakan menu Masuk jika akun sudah terbuat.",
      };
    }

    if (authError.message.includes("already registered") || authError.status === 422) {
      return {
        success: false,
        error: "NIK atau Email ini sudah terdaftar. Silakan gunakan menu Masuk.",
      };
    }

    return {
      success: false,
      error: authError.message || "Gagal melakukan registrasi akun.",
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
      password_hash: passwordHash,
      nomor_telepon: phoneNumber,
      role: "warga",
      desil_saat_ini: 5,
      kota: "Surabaya",
      provinsi: "Jawa Timur",
    });
    profile = profileRes.data || null;

    // Login otomatis setelah registrasi berhasil agar session langsung aktif
    await supabase.auth.signInWithPassword({
      email: authEmail,
      password: password,
    });
  }

  return {
    success: true,
    data: { user, profile },
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

/**
 * Service meminta kode reset password (OTP)
 * Mendeteksi akun & NIK pemilik berdasarkan input Email, No HP, atau NIK.
 */
export async function requestPasswordReset(contact: string): Promise<AuthResponse<{ email: string; nik?: string }>> {
  const trimmed = contact.trim();

  // 1. Deteksi akun warga dari tabel profiles & auth
  const { profile, matchedNik, matchedEmail } = await findProfileByIdentifier(trimmed);

  // Jika akun tidak ditemukan sama sekali dan format bukan NIK terdaftar
  const resolvedNik = matchedNik || (/^\d{16}$/.test(trimmed) ? trimmed : null);
  const resolvedEmail = matchedEmail || (trimmed.includes("@") ? trimmed : null);

  if (!resolvedNik && !resolvedEmail) {
    return {
      success: false,
      error: "Akun dengan Email/No. Handphone/NIK tersebut tidak terdaftar di sistem GOV-HUB.",
    };
  }

  const targetSendEmail = resolvedEmail || (trimmed.includes("@") ? trimmed : null);

  // Tabel password_resets hanya boleh diakses server (service role), bukan anon
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Konfigurasi server belum lengkap (SUPABASE_SERVICE_ROLE_KEY)." };
  }

  // Cooldown 60 detik per identifier agar OTP tidak bisa di-spam / di-brute-force via request ulang
  const { data: lastReq } = await adminClient
    .from("password_resets")
    .select("created_at")
    .eq("identifier", trimmed)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lastReq && Date.now() - new Date(lastReq.created_at).getTime() < 60_000) {
    return { success: false, error: "Tunggu 1 menit sebelum meminta kode OTP baru." };
  }

  // OTP 5 digit dari CSPRNG
  const otpCode = crypto.randomInt(10000, 100000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Berlaku 15 menit

  // Satu OTP aktif per identifier; disimpan dalam bentuk hash
  await adminClient.from("password_resets").delete().eq("identifier", trimmed);
  const { error: insertErr } = await adminClient
    .from("password_resets")
    .insert({ identifier: trimmed, token: hashPassword(otpCode), expires_at: expiresAt });
  if (insertErr) {
    console.error("Gagal menyimpan OTP:", insertErr.message);
    return { success: false, error: "Gagal membuat kode OTP. Coba lagi nanti." };
  }

  console.log(`[OTP] Kode reset dibuat untuk ${profile?.nama_lengkap || "warga"} (berlaku 15 menit)`);

  // Kirim email sungguhan via Resend jika alamat email tujuan valid
  if (targetSendEmail) {
    await sendOtpEmail({
      to: targetSendEmail,
      otpCode: otpCode,
    });
  }

  return {
    success: true,
    data: {
      email: trimmed,
      nik: resolvedNik || undefined,
    },
  };
}

const RESET_COOKIE = "gov_pw_reset";
const MAX_OTP_ATTEMPTS = 5;

/**
 * Service memverifikasi token OTP 5 digit pemulihan kata sandi
 */
export async function verifyPasswordResetOtp({
  email,
  token,
}: {
  email: string;
  token: string;
}): Promise<AuthResponse<{ verified: boolean }>> {
  const cleanToken = token.trim();
  const identifier = email.trim();
  const invalid = { success: false, error: "Kode OTP salah atau telah kedaluwarsa. Silakan periksa kembali." };

  const adminClient = createAdminClient();
  if (!adminClient || !/^\d{5}$/.test(cleanToken)) return invalid;

  const { data: row } = await adminClient
    .from("password_resets")
    .select("id, token, attempts")
    .eq("identifier", identifier)
    .is("used_at", null)
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!row) return invalid;
  if (row.attempts >= MAX_OTP_ATTEMPTS) {
    return { success: false, error: "Terlalu banyak percobaan. Silakan minta kode OTP baru." };
  }

  const a = Buffer.from(row.token);
  const b = Buffer.from(hashPassword(cleanToken));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    await adminClient.from("password_resets").update({ attempts: row.attempts + 1 }).eq("id", row.id);
    return invalid;
  }

  // OTP benar -> terbitkan token reset sekali pakai, hanya disimpan di cookie httpOnly
  const resetToken = crypto.randomBytes(32).toString("hex");
  await adminClient
    .from("password_resets")
    .update({ reset_token: hashPassword(resetToken), attempts: MAX_OTP_ATTEMPTS })
    .eq("id", row.id);

  (await cookies()).set(RESET_COOKIE, resetToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60,
  });

  return { success: true, data: { verified: true } };
}

/**
 * Service memperbarui kata sandi baru.
 * Hanya bisa dipakai oleh: user yang sedang login (akun sendiri), atau
 * pemegang cookie reset yang diterbitkan setelah OTP valid.
 * Parameter email diabaikan (tidak dipercaya), dipertahankan agar pemanggil lama tetap kompatibel.
 */
export async function updateUserPassword(
  newPassword: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _emailFromClient?: string
): Promise<AuthResponse<{ updated: boolean }>> {
  if (
    !newPassword ||
    newPassword.length < 8 ||
    !/[A-Z]/.test(newPassword) ||
    !/[a-z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword)
  ) {
    return {
      success: false,
      error: "Kata sandi baru minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka.",
    };
  }
  const supabase = await createClient();
  const newHash = hashPassword(newPassword);
  const cookieStore = await cookies();
  const resetToken = cookieStore.get(RESET_COOKIE)?.value;

  // 1. User yang sedang login mengganti password akunnya sendiri
  if (!resetToken) {
    const { error: sessionError } = await supabase.auth.updateUser({ password: newPassword });
    if (!sessionError) return { success: true, data: { updated: true } };
    return { success: false, error: "Sesi reset password tidak valid atau kedaluwarsa. Silakan ulangi dari awal." };
  }

  // 2. Alur lupa password: validasi token reset sekali pakai
  const adminClient = createAdminClient();
  if (!adminClient) {
    return { success: false, error: "Konfigurasi server belum lengkap (SUPABASE_SERVICE_ROLE_KEY)." };
  }

  const { data: resetRow } = await adminClient
    .from("password_resets")
    .select("id, identifier")
    .eq("reset_token", hashPassword(resetToken))
    .is("used_at", null)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!resetRow) {
    cookieStore.delete(RESET_COOKIE);
    return { success: false, error: "Sesi reset password tidak valid atau kedaluwarsa. Silakan ulangi dari awal." };
  }

  {
    const cleanIdentifier = resetRow.identifier.trim();
    let targetUserId: string | null = null;

    // A. Cari ID user di tabel profiles menggunakan hak akses Admin
    try {
      // Cek berdasarkan NIK
      const { data: pByNik } = await adminClient
        .from("profiles")
        .select("id, nik, email")
        .eq("nik", cleanIdentifier)
        .maybeSingle();

      if (pByNik?.id) {
        targetUserId = pByNik.id;
      }

      // Cek berdasarkan Email jika belum ketemu
      if (!targetUserId && cleanIdentifier.includes("@")) {
        const { data: pByEmail } = await adminClient
          .from("profiles")
          .select("id, nik, email")
          .eq("email", cleanIdentifier)
          .maybeSingle();

        if (pByEmail?.id) {
          targetUserId = pByEmail.id;
        }
      }
    } catch (err) {
      console.warn("Notice query profiles:", err);
    }

    // B. Cari di auth.users melalui Admin API
    if (!targetUserId) {
      const { data: usersData, error: listUsersErr } = await adminClient.auth.admin.listUsers();
      if (listUsersErr) {
        console.error("[LIST USERS ERROR - Cek format SUPABASE_SERVICE_ROLE_KEY Anda]:", listUsersErr.message);
      }
      if (usersData?.users) {
        console.log(`[ADMIN SEARCH] Ditemukan ${usersData.users.length} user di auth.users. Mencocokkan: ${cleanIdentifier}`);
        const targetUser = usersData.users.find(
          (u) =>
            u.email?.toLowerCase() === cleanIdentifier.toLowerCase() ||
            u.user_metadata?.nik === cleanIdentifier ||
            u.user_metadata?.email_kontak === cleanIdentifier ||
            (cleanIdentifier.length === 16 && u.email?.startsWith(cleanIdentifier))
        );
        if (targetUser) {
          targetUserId = targetUser.id;
          console.log(`[MATCH FOUND] Akun cocok! User ID: ${targetUserId}`);
        }
      }
    }

    // C. Eksekusi pembaruan kata sandi di auth.users dan profiles
    if (targetUserId) {
      const { error: adminUpdateErr } = await adminClient.auth.admin.updateUserById(
        targetUserId,
        { password: newPassword }
      );

      if (adminUpdateErr) {
        console.error("[UPDATE PASSWORD ERROR via Admin]:", adminUpdateErr.message);
        return {
          success: false,
          error: adminUpdateErr.message || "Gagal memperbarui kata sandi di database.",
        };
      }

      // Sinkronkan juga password_hash di tabel public.profiles
      try {
        await adminClient
          .from("profiles")
          .update({
            password_hash: newHash,
            updated_at: new Date().toISOString(),
          })
          .eq("id", targetUserId);
      } catch (syncErr) {
        console.warn("Notice: Gagal update password_hash di profiles:", syncErr);
      }

      // Tandai token reset telah terpakai dan hapus cookie
      await adminClient
        .from("password_resets")
        .update({ used_at: new Date().toISOString() })
        .eq("id", resetRow.id);
      cookieStore.delete(RESET_COOKIE);

      console.log(`[UPDATE PASSWORD SUCCESS] Password berhasil diperbarui untuk User ID: ${targetUserId}`);
      return { success: true, data: { updated: true } };
    }
  }

  return {
    success: false,
    error: "Akun pengguna tidak ditemukan untuk memperbarui kata sandi.",
  };
}
