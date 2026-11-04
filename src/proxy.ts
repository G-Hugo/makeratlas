import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site-url";

/** Set by the language switcher: a visitor's own choice beats the browser's. */
const LOCALE_COOKIE = "locale";

/** French when it is the browser's preferred language, English for everyone else. */
function negotiateLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  let best = "";
  let bestQ = 0;
  for (const part of header.split(",")) {
    const [tag, ...params] = part.trim().toLowerCase().split(";");
    const qParam = params.map((x) => x.trim()).find((x) => x.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (tag && tag !== "*" && q > bestQ) {
      best = tag;
      bestQ = q;
    }
  }
  return best.split("-")[0] === "fr" ? "fr" : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // One canonical host: www.maker-atlas.com -> maker-atlas.com (permanent).
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "").toLowerCase();
  if (host.startsWith("www.")) {
    return NextResponse.redirect(`${SITE_URL}${pathname}${search}`, 308);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) return NextResponse.next();

  const locale = negotiateLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|machines/).*)"],
};
