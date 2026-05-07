import type { CookieOptions } from "express";

/**
 * Cross-origin SPA (e.g. Vercel) → API (e.g. Render) needs SameSite=None and Secure.
 * SameSite=Lax does not attach cookies on cross-site fetch/XHR.
 *
 * Override: AUTH_COOKIE_SAME_SITE=lax|none (optional). Local dev on different ports may need none + Secure (Chrome allows on localhost).
 */
export function getAuthCookieOptions(): CookieOptions {
  const override = process.env.AUTH_COOKIE_SAME_SITE?.toLowerCase();
  const crossSite =
    override === "none"
      ? true
      : override === "lax"
        ? false
        : process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? "none" : "lax",
    path: "/",
  };
}
