import { NextResponse } from "next/server";
import { getAdminDesilSubmissions, verifyDinsosAdminSession } from "@/lib/services/admin.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await verifyDinsosAdminSession();
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status }
    );
  }

  const result = await getAdminDesilSubmissions();
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
