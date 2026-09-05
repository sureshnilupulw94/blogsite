import { NextResponse } from "next/server";
import { consumeLoginToken, signSession, PORTAL_COOKIE } from "@/lib/portal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const client = await consumeLoginToken(token);

  if (!client) {
    return NextResponse.redirect(new URL("/portal/login?error=invalid", request.url));
  }

  const response = NextResponse.redirect(new URL("/portal", request.url));
  response.cookies.set(PORTAL_COOKIE, signSession(client.email, client.slug), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
