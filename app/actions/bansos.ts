"use server";

import {
  createDesilSubmission,
  getMyDesilSubmissions,
  CreateDesilSubmissionParams,
} from "@/lib/services/bansos.service";

export async function submitDesilAction(params: CreateDesilSubmissionParams) {
  return await createDesilSubmission(params);
}

export async function getMyDesilSubmissionsAction() {
  return await getMyDesilSubmissions();
}
