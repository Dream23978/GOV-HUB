"use server";

import {
  signInWithNik,
  signUpWithNik,
  signOut,
  requestPasswordReset,
  verifyPasswordResetOtp,
  updateUserPassword,
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

/**
 * Server Action untuk Meminta Kode OTP Lupa Password
 */
export async function requestPasswordResetAction(contact: string) {
  try {
    return await requestPasswordReset(contact);
  } catch (error) {
    console.error("Kesalahan pada requestPasswordResetAction:", error);
    return { success: false, error: "Gagal mengirimkan permintaan kode OTP." };
  }
}

/**
 * Server Action untuk Memverifikasi Kode OTP Lupa Password
 */
export async function verifyPasswordResetOtpAction(email: string, token: string) {
  try {
    return await verifyPasswordResetOtp({ email, token });
  } catch (error) {
    console.error("Kesalahan pada verifyPasswordResetOtpAction:", error);
    return { success: false, error: "Gagal memverifikasi kode OTP." };
  }
}

/**
 * Server Action untuk Memperbarui Password Baru
 */
export async function updateUserPasswordAction(newPassword: string, email?: string) {
  try {
    return await updateUserPassword(newPassword, email);
  } catch (error) {
    console.error("Kesalahan pada updateUserPasswordAction:", error);
    return { success: false, error: "Gagal memperbarui kata sandi." };
  }
}
