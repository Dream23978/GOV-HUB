"use server";

import {
  createKtpSubmission,
  getMyKtpSubmissions,
  CreateKtpSubmissionParams,
} from "@/lib/services/ktp.service";

export async function submitKtpAction(params: CreateKtpSubmissionParams) {
  return await createKtpSubmission(params);
}

export async function getMyKtpSubmissionsAction() {
  return await getMyKtpSubmissions();
}
