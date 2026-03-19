import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const shopEnabled = process.env.NEXT_PUBLIC_SHOP_ENABLED !== "false";
  if (shopEnabled) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.hash = "preregistro";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/shop/:path*", "/checkout/:path*"],
};

