"use server";

import {
  getAdminDesilSubmissions,
  updateDesilSubmissionStatus,
  getAdminKtpSubmissions,
  updateKtpSubmissionStatus,
  authenticateAdmin,
  lookupAdminByNip,
  getAdminDataWarga,
  getAdminAccountsList,
  adminUpdateAccountPassword,
  adminDeleteAccount,
} from "@/lib/services/admin.service";

export async function getAdminDataWargaAction(params?: { kecamatan?: string; kota?: string }) {
  return await getAdminDataWarga(params);
}

export async function lookupAdminByNipAction(nip: string) {
  return await lookupAdminByNip(nip);
}

export async function adminLoginAction(params: { nip: string; password: string }) {
  return await authenticateAdmin(params.nip, params.password);
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
  return await updateDesilSubmissionStatus(params);
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

export async function adminDeleteAccountAction(params: {
  accountId: string;
}) {
  return await adminDeleteAccount(params);
}
