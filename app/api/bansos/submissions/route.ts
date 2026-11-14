import { NextResponse } from "next/server";
import { z } from "zod";
import { createDesilSubmission, getMyDesilSubmissions } from "@/lib/services/bansos.service";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

const desilSubmissionSchema = z
  .object({
    alasan: z.string().trim().max(300).optional(),
    keterangan: z.string().trim().max(1000).optional(),
    jumlahTanggungan: z.number().int().min(0).max(30).optional(),
    pekerjaanKepalaKeluarga: z.string().trim().max(120).optional(),
    penghasilanBulanan: z.number().min(0).max(1_000_000_000).optional(),
    pengeluaranBulanan: z.number().min(0).max(1_000_000_000).optional(),
    desilDiajukan: z.number().int().min(1).max(10).optional(),
    fotoRumahDepanUrl: z.string().trim().max(2_500_000).optional(),
    fotoRuangTengahUrl: z.string().trim().max(2_500_000).optional(),
    fotoDapurUrl: z.string().trim().max(2_500_000).optional(),
    buktiSlipGajiUrl: z.string().trim().max(1024).optional(),
    buktiRekeningListrikUrl: z.string().trim().max(1024).optional(),
  })
  .strict();

export async function GET() {
  const result = await getMyDesilSubmissions();
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

  const parsed = desilSubmissionSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message || "Data pengajuan desil tidak valid." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  try {
    const result = await createDesilSubmission(parsed.data);
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
