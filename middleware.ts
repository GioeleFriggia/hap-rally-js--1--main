// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Protegge SOLO /admin/**
 * Le altre rotte del sito (/, /team, /gallery, /news, /partners, /contatti)
 * NON vengono toccate e funzionano normalmente.
 */
export function middleware(req: NextRequest) {
  const pass = process.env.SITE_PASSWORD;
  // Se non c'è password configurata, non proteggere nulla
  if (!pass) return NextResponse.next();

  // Verifica cookie impostato dopo il login su /gate
  const auth = req.cookies.get("site-auth")?.value;
  if (auth === "ok") return NextResponse.next();

  // Reindirizza a /gate, poi torna alla pagina richiesta
  const url = new URL("/gate", req.url);
  url.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"], // <-- SOLO /admin è protetta
};
