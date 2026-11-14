import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("govhub_admin_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}

export async function GET(request: Request) {
  const url = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set("govhub_admin_session", "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  return response;
}
