import { NextRequest, NextResponse } from "next/server";

// Rotte pubbliche non protette
const PUBLIC_PATHS = [
  "/gate",
  "/_next",
  "/api",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/foto",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // consenti asset statici comuni e path pubblici
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|txt|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("site_authorized")?.value;
  const password = process.env.SITE_PASSWORD || "2025@2025@Rally";

  if (cookie !== password) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/gate";
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };
