
import {
  BLOCKED_DOMAINS,
  BLOCKED_KEYWORDS,
  CSP_CONFIG,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "./config";

export function isBlockedDomain(url: string): boolean {
  if (!url) return false;

  const lowerUrl = url.toLowerCase();
  return BLOCKED_DOMAINS.some((domain) =>
    lowerUrl.includes(domain.toLowerCase()),
  );
}

export function containsBlockedKeyword(text: string): boolean {
  if (!text) return false;

  const lowerText = text.toLowerCase();
  return BLOCKED_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword.toLowerCase()),
  );
}

export function sanitizeInput(input: string): string {
  if (!input) return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    .replace(/=/g, "&#x3D;");
}

export function decodeInput(input: string): string {
  if (!input) return "";

  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x60;/g, "`")
    .replace(/&#x3D;/g, "=");
}

export function sanitizeUrl(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }
    if (isBlockedDomain(url)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export function generateCSP(): string {
  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CSP_CONFIG.allowedDomains.join(" ")}`,
    `style-src 'self' 'unsafe-inline' ${CSP_CONFIG.allowedDomains.join(" ")}`,
    `font-src 'self' ${CSP_CONFIG.allowedDomains.join(" ")}`,
    `img-src ${CSP_CONFIG.imageSources.join(" ")}`,
    `frame-src ${CSP_CONFIG.frameSources.join(" ")}`,
    `frame-ancestors 'self'`,
    `connect-src 'self' https: wss:`,
    `media-src 'self' https:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ];

  return directives.join("; ");
}

export function validateFileUpload(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipe file tidak diizinkan. Hanya: ${ALLOWED_FILE_TYPES.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimal (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
    };
  }

  const dangerousPatterns = [
    "..",
    "/",
    "\\",
    "<",
    ">",
    ":",
    '"',
    "|",
    "?",
    "*",
  ];
  if (dangerousPatterns.some((pattern) => file.name.includes(pattern))) {
    return {
      valid: false,
      error: "Nama file mengandung karakter tidak valid",
    };
  }

  return { valid: true };
}

export function sanitizeHTML(html: string): string {
  if (!html) return "";

  return (
    html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s*on\w+\s*=\s*[^\s>]+/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/data:(?!image\/)/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/expression\s*\(/gi, "")
      .replace(
        /<iframe(?![^>]*src=["']https:\/\/(www\.)?(youtube\.com|google\.com|maps\.google\.com))[^>]*>/gi,
        "",
      )
  );
}

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function isSuspiciousUserAgent(userAgent: string): boolean {
  if (!userAgent) return true;

  const suspiciousPatterns = [
    /curl/i,
    /wget/i,
    /python-requests/i,
    /scrapy/i,
    /httpclient/i,
    /java\//i,
    /libwww/i,
    /lwp-/i,
    /httpunit/i,
    /nutch/i,
    /phpcrawl/i,
    /msnbot/i,
    /jyxobot/i,
    /fast-/i,
    /feedfetcher/i,
    /slurp/i,
    /ask jeeves/i,
    /teoma/i,
    /ia_archiver/i,
  ];

  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /duckduckbot/i,
    /baiduspider/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegrambot/i,
    /pinterest/i,
    /discordbot/i,
    /slackbot/i,
  ];

  if (allowedBots.some((pattern) => pattern.test(userAgent))) {
    return false;
  }
  return suspiciousPatterns.some((pattern) => pattern.test(userAgent));
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const requests = this.requests.get(key) || [];

    const recentRequests = requests.filter((time) => time > windowStart);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    return true;
  }

  reset(key: string): void {
    this.requests.delete(key);
  }

  resetAll(): void {
    this.requests.clear();
  }
}

export function detectSQLInjection(input: string): boolean {
  if (!input) return false;

  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION(\s+)ALL(\s+)SELECT/i,
    /UNION(\s+)SELECT/i,
    /INSERT(\s+)INTO/i,
    /DELETE(\s+)FROM/i,
    /DROP(\s+)TABLE/i,
    /UPDATE(\s+)\w+(\s+)SET/i,
    /SELECT(\s+)\*(\s+)FROM/i,
    /OR(\s+)1(\s*)=(\s*)1/i,
    /OR(\s+)'1'(\s*)=(\s*)'1'/i,
    /;(\s*)DROP/i,
    /;(\s*)DELETE/i,
    /;(\s*)UPDATE/i,
    /;(\s*)INSERT/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

export function detectXSS(input: string): boolean {
  if (!input) return false;

  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<script[^>]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /expression\s*\(/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
    /<svg[^>]*onload/gi,
    /<img[^>]*onerror/gi,
    /<body[^>]*onload/gi,
    /<input[^>]*onfocus/gi,
    /document\.(cookie|location|write)/gi,
    /window\.(location|open)/gi,
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /Function\s*\(/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

export function logSecurityEvent(
  type: "warning" | "error" | "blocked",
  message: string,
  details?: Record<string, unknown>,
): void {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    message,
    details,
  };

  if (process.env.NODE_ENV === "development") {
    console.warn("[SECURITY]", event);
  }
}
