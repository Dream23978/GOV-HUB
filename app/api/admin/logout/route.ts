import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/security";

export async function POST(request: Request) {
  const isHttps =
    request.headers.get("x-forwarded-proto") === "https" ||
    new URL(request.url).protocol === "https:";

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
