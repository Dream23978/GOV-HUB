import { NextResponse } from "next/server";
import { createKtpSubmission, getMyKtpSubmissions } from "@/lib/services/ktp.service";

/**
 * GET /api/ktp/submissions
 * Mengambil daftar riwayat pengajuan KTP user yang sedang login
 */
export async function GET() {
  const result = await getMyKtpSubmissions();
  if (!result.success) {
    const status = result.error?.includes("login") ? 401 : 400;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}

/**
 * POST /api/ktp/submissions
 * Mengajukan KTP baru
 */
export async function POST(request: Request) {
  let body: Record<string, string | undefined>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Format JSON tidak valid" }, { status: 400 });
  }

  try {
    const nomorTiket = body.nomorTiket || `KTP-${Date.now().toString().slice(-8)}`;

    const result = await createKtpSubmission({
      nomorTiket,
      jenisPengajuan: body.jenisPengajuan || "KTP Baru / Pertama Kali",
      dokumenKkUrl: body.dokumenKkUrl,
      dokumenAktaUrl: body.dokumenAktaUrl,
      suratKehilanganUrl: body.suratKehilanganUrl,
      waktuKehadiranBiometrik: body.waktuKehadiranBiometrik,
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
