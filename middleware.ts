import { NextRequest, NextResponse } from "next/server";
import {
  SECURITY_HEADERS,
  RATE_LIMIT_CONFIG,
  BLOCKED_DOMAINS,
  BLOCKED_KEYWORDS,
} from "./app/lib/security/config";
import { generateCSP, isSuspiciousUserAgent } from "./app/lib/security/utils";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    });
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
  }

  if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  rateLimitMap.set(ip, record);
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - record.count,
  };
}

setInterval(
  () => {
    const now = Date.now();
    rateLimitMap.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    });
  },
  5 * 60 * 1000,
);

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const userAgent = request.headers.get("user-agent") || "";

  const { allowed, remaining } = getRateLimit(ip);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "Terlalu banyak request. Silakan coba lagi nanti.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      },
    );
  }

  if (isSuspiciousUserAgent(userAgent)) {
    console.warn(
      `[SECURITY] Suspicious user agent: ${userAgent} from IP: ${ip}`,
    );
  }

  const url = request.nextUrl.pathname + request.nextUrl.search;

  const hasBlockedDomain = BLOCKED_DOMAINS.some((domain) =>
    url.toLowerCase().includes(domain.toLowerCase()),
  );

  if (hasBlockedDomain) {
    console.warn(`[SECURITY] Blocked domain in URL: ${url} from IP: ${ip}`);
    return NextResponse.redirect(new URL("/", request.url));
  }

  const searchParams = request.nextUrl.searchParams.toString();
  const hasBlockedKeyword = BLOCKED_KEYWORDS.some((keyword) =>
    searchParams
      .toLowerCase()
      .includes(keyword.toLowerCase().replace(/\s+/g, "+")),
  );

  if (hasBlockedKeyword) {
    console.warn(
      `[SECURITY] Blocked keyword in URL: ${searchParams} from IP: ${ip}`,
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  const referer = request.headers.get("referer") || "";
  if (referer) {
    const refererBlocked = BLOCKED_DOMAINS.some((domain) =>
      referer.toLowerCase().includes(domain.toLowerCase()),
    );

    if (refererBlocked) {
      console.warn(`[SECURITY] Blocked referrer: ${referer} from IP: ${ip}`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  response.headers.set("Content-Security-Policy", generateCSP());

  response.headers.set(
    "X-RateLimit-Limit",
    RATE_LIMIT_CONFIG.maxRequests.toString(),
  );
  response.headers.set("X-RateLimit-Remaining", remaining.toString());

  response.headers.delete("X-Powered-By");
  response.headers.delete("Server");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
