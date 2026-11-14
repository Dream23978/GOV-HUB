import { NextResponse } from "next/server";
import { z } from "zod";
import { createKtpSubmission, getMyKtpSubmissions } from "@/lib/services/ktp.service";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

const ktpSubmissionSchema = z
  .object({
    jenisPengajuan: z.string().trim().min(2).max(100).optional(),
    scheduleId: z.string().uuid().optional(),
    dokumenKkUrl: z.string().trim().max(1024).optional(),
    dokumenAktaUrl: z.string().trim().max(1024).optional(),
    suratKehilanganUrl: z.string().trim().max(1024).optional(),
    waktuKehadiranBiometrik: z.string().trim().max(100).optional(),
  })
  .strict();

export async function GET() {
  const result = await getMyKtpSubmissions();
  if (!result.success) {
    const status = result.error?.includes("login") ? 401 : 400;
    return NextResponse.json(result, { status, headers: NO_STORE_HEADERS });
  }
  return NextResponse.json(result, { headers: NO_STORE_HEADERS });
}

export async function POST(request: Request) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Format JSON tidak valid" },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
    return NextResponse.json(
      { success: false, error: "Payload harus berupa objek JSON." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const parsed = ktpSubmissionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Data pengajuan KTP tidak valid." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const result = await createKtpSubmission({
      jenisPengajuan: parsed.data.jenisPengajuan || "KTP Baru / Pertama Kali",
      scheduleId: parsed.data.scheduleId,
      dokumenKkUrl: parsed.data.dokumenKkUrl,
      dokumenAktaUrl: parsed.data.dokumenAktaUrl,
      suratKehilanganUrl: parsed.data.suratKehilanganUrl,
      waktuKehadiranBiometrik: parsed.data.waktuKehadiranBiometrik,
    });

    if (!result.success) {
      const status = result.error?.includes("login") ? 401 : 400;
      return NextResponse.json(result, { status, headers: NO_STORE_HEADERS });
    }

    return NextResponse.json(result, { status: 201, headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { success: false, error: "Kesalahan server internal" },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
