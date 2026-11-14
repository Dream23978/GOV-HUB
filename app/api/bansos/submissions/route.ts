import { NextResponse } from "next/server";
import { createDesilSubmission, getMyDesilSubmissions } from "@/lib/services/bansos.service";

export const dynamic = "force-dynamic";

function sanitizeHousePhotoUrl(val: unknown): string | undefined {
  if (typeof val !== "string") return undefined;
  const trimmed = val.trim();
  if (/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(trimmed)) return trimmed;
  if (/^https:\/\/[^\s]+$/i.test(trimmed)) return trimmed;
  return undefined;
}

/**
 * GET /api/bansos/submissions
 * Mengambil daftar pengajuan peninjauan desil user saat ini
 */
export async function GET() {
  const result = await getMyDesilSubmissions();
  if (!result.success) {
    const status = result.error?.includes("login") ? 401 : 400;
    return NextResponse.json(result, {
      status,
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }
  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

/**
 * POST /api/bansos/submissions
 * Mengajukan permohonan peninjauan desil baru
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Format JSON tidak valid" }, { status: 400 });
  }

  try {
    const result = await createDesilSubmission({
      alasan: typeof body.alasan === "string" ? body.alasan : undefined,
      keterangan: typeof body.keterangan === "string" ? body.keterangan : undefined,
      jumlahTanggungan: typeof body.jumlahTanggungan === "number" ? body.jumlahTanggungan : undefined,
      pekerjaanKepalaKeluarga:
        typeof body.pekerjaanKepalaKeluarga === "string" ? body.pekerjaanKepalaKeluarga : undefined,
      penghasilanBulanan:
        typeof body.penghasilanBulanan === "number" ? body.penghasilanBulanan : undefined,
      pengeluaranBulanan:
        typeof body.pengeluaranBulanan === "number" ? body.pengeluaranBulanan : undefined,
      desilDiajukan: typeof body.desilDiajukan === "number" ? body.desilDiajukan : undefined,
      fotoRumahDepanUrl: sanitizeHousePhotoUrl(body.fotoRumahDepanUrl),
    });

    if (!result.success) {
      const status = result.error?.includes("login") ? 401 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Kesalahan server internal" }, { status: 500 });
  }
}
