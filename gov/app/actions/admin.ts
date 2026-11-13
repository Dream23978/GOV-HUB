"use server";

import {
  getAdminDesilSubmissions,
  updateDesilSubmissionStatus,
  getAdminKtpSubmissions,
  updateKtpSubmissionStatus,
  authenticateAdmin,
  lookupAdminByNip,
} from "@/lib/services/admin.service";

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
  status: "selesai" | "diproses" | "ditolak";
  catatan?: string;
}) {
  return await updateKtpSubmissionStatus(params);
}
