import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertProfile, getProfileById } from "./profile.service";
import { Profile } from "@/types/database";

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

  let { data, error } = await supabase.auth.signInWithPassword({
    email: nikToAuthEmail(nik),
    password,
  });

  if (error) {
    const fallbackResult = await supabase.auth.signInWithPassword({
      email: `${nik}@local`,
      password,
    });
    if (!fallbackResult.error && fallbackResult.data.user) {
      data = fallbackResult.data;
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
  if (!profile) {
    const fallbackName =
      data.user.user_metadata?.nama_lengkap ||
      data.user.user_metadata?.full_name ||
      `Warga ${nik.slice(-4)}`;

    const createRes = await upsertProfile({
      id: data.user.id,
      nik: nik,
      nama_lengkap: fallbackName,
      nomor_telepon: data.user.user_metadata?.nomor_telepon || null,
      role: "warga",
      desil_saat_ini: 5,
      kota: "Surabaya",
      provinsi: "Jawa Timur",
    });
    profile = createRes.data || null;
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
 * Menghilangkan sepenuhnya pesan error email rate limit
 */
export async function signUpWithNik({
  nik,
  emailPhone,
  password,
  namaLengkap,
}: SignUpParams): Promise<AuthResponse<{ user: unknown; profile: Profile | null }>> {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailPhone.trim());
  const phoneNumber = !isEmail ? emailPhone.trim() : null;
  const contactEmail = isEmail ? emailPhone.trim() : null;
  const resolvedNama = namaLengkap?.trim() || `Warga ${nik.slice(-4)}`;
  const authEmail = nikToAuthEmail(nik);

  const adminClient = createAdminClient();

  // 1. Jika ada SUPABASE_SERVICE_ROLE_KEY di .env.local, gunakan admin API (100% bypass email limit)
  if (adminClient) {
    const { data: adminUser, error: adminError } = await adminClient.auth.admin.createUser({
      email: authEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        nik,
        nama_lengkap: resolvedNama,
        email_kontak: contactEmail,
        nomor_telepon: phoneNumber,
        role: "warga",
      },
    });

    if (!adminError && adminUser?.user) {
      await upsertProfile({
        id: adminUser.user.id,
        nik: nik,
        nama_lengkap: resolvedNama,
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

  // 2. Client biasa
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: authEmail,
    password: password,
    options: {
      data: {
        nik,
        nama_lengkap: resolvedNama,
        email_kontak: contactEmail,
        nomor_telepon: phoneNumber,
        role: "warga",
      },
    },
  });

  if (authError) {
    const errMsg = authError.message.toLowerCase();

    // JIKA ERROR ADALAH EMAIL RATE LIMIT:
    // Abaikan error rate limit email dari Supabase, dan langsung coba login session
    if (errMsg.includes("rate limit") || errMsg.includes("over_email_send_rate_limit") || authError.status === 429) {
      const signInCheck = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: password,
      });

      if (!signInCheck.error && signInCheck.data.user) {
        await upsertProfile({
          id: signInCheck.data.user.id,
          nik: nik,
          nama_lengkap: resolvedNama,
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

      // Jika user belum bisa login karena Supabase memblokir total saat kirim email:
      return {
        success: false,
        error: "Sistem pendaftaran sedang sibuk (email confirmation aktif di Supabase). Silakan matikan 'Confirm email' di Dashboard Supabase atau gunakan menu Masuk jika akun sudah terbuat.",
      };
    }

    if (authError.message.includes("already registered") || authError.status === 422) {
      return {
        success: false,
        error: "NIK ini sudah terdaftar. Silakan gunakan menu Masuk.",
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
      nik: nik,
      nama_lengkap: resolvedNama,
      nomor_telepon: phoneNumber,
      role: "warga",
      desil_saat_ini: 5,
      kota: "Surabaya",
      provinsi: "Jawa Timur",
    });
    profile = profileRes.data || null;
  }

  return {
    success: true,
    data: { user, profile },
  };
}

export async function getCurrentUserWithProfile() {
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.getUser();

  if (error || !authData?.user) {
    return { user: null, profile: null };
  }

  const profile = await getProfileById(authData.user.id);
  return { user: authData.user, profile };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
