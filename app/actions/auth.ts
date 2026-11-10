"use server";

import {
  signInWithNik,
  signUpWithNik,
  signOut,
  SignInParams,
  SignUpParams,
} from "@/lib/services/auth.service";

/**
 * Server Action untuk Login berbasis NIK
 */
export async function signInAction(params: SignInParams) {
  try {
    const result = await signInWithNik(params);
    return result;
  } catch (error) {
    console.error("Kesalahan pada signInAction:", error);
    return {
      success: false,
      error: "Terjadi kesalahan pada sistem autentikasi.",
    };
  }
}

/**
 * Server Action untuk Pendaftaran Warga Baru
 */
export async function signUpAction(params: SignUpParams) {
  try {
    const result = await signUpWithNik(params);
    return result;
  } catch (error) {
    console.error("Kesalahan pada signUpAction:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat mendaftarkan akun.",
    };
  }
}

/**
 * Server Action untuk Logout
 */
export async function signOutAction() {
  try {
    return await signOut();
  } catch (error) {
    console.error("Kesalahan pada signOutAction:", error);
    return { success: false, error: "Gagal keluar dari sesi." };
  }
}
