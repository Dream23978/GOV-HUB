"use server";

import { cookies, headers } from "next/headers";
import {
  getAdminDesilSubmissions,
  updateDesilSubmissionStatus,
  getAdminKtpSubmissions,
  updateKtpSubmissionStatus,
  getAdminDataWarga,
  authenticateAdmin,
  getAdminAccountsList,
  adminUpdateAccountPassword,
  adminDeleteAccount,
  verifyAdminSession,
} from "@/lib/services/admin.service";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
} from "@/lib/security";

export async function getAdminDataWargaAction() {
  const auth = await verifyAdminSession(["dinsos", "dukcapil", "pusat"]);
  if (!auth.authorized) {
    return { success: false, data: [], error: auth.error };
  }
  return await getAdminDataWarga();
}

export async function adminLoginAction(params: { nip: string; password: string }) {
  const authRes = await authenticateAdmin(params.nip, params.password);
  if (!authRes.success || !authRes.token || !authRes.user) {
    return { success: false, error: authRes.error || "Autentikasi gagal." };
  }

  const hdrs = await headers();
  const isHttps =
    hdrs.get("x-forwarded-proto") === "https" ||
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") === true;

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, authRes.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return {
    success: true,
    user: authRes.user,
  };
}

export async function getAdminDesilSubmissionsAction() {
  return await getAdminDesilSubmissions();
}

export async function updateDesilSubmissionStatusAction(params: {
  id: string;
  status: "disetujui" | "ditolak" | "diproses";
  desilHasil?: number;
  catatan?: string;
  petugasName?: string;
}) {
  return await updateDesilSubmissionStatus({
    id: params.id,
    status: params.status,
    desilHasil: params.desilHasil,
    catatan: params.catatan,
  });
}

export async function getAdminKtpSubmissionsAction() {
  return await getAdminKtpSubmissions();
}

export async function updateKtpSubmissionStatusAction(params: {
  id: string;
  status: "selesai" | "diproses" | "menunggu_cetak" | "ditolak";
  catatan?: string;
}) {
  return await updateKtpSubmissionStatus(params);
}

export async function getAdminAccountsListAction() {
  return await getAdminAccountsList();
}

export async function adminUpdateAccountPasswordAction(params: {
  accountId: string;
  newPassword: string;
}) {
  return await adminUpdateAccountPassword(params);
}

export async function adminDeleteAccountAction(params: { accountId: string }) {
  return await adminDeleteAccount(params);
}
