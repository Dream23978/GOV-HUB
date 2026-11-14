import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("biometric_schedules")
      .select("*")
      .eq("is_active", true)
      .order("tanggal", { ascending: true });

    if (!error && data) {
      return NextResponse.json({ success: true, data });
    }

    const admin = createAdminClient();
    if (admin) {
      const { data: adminData } = await admin
        .from("biometric_schedules")
        .select("*")
        .eq("is_active", true)
        .order("tanggal", { ascending: true });
      return NextResponse.json({ success: true, data: adminData || [] });
    }

    return NextResponse.json({ success: false, error: error?.message }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
