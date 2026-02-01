"use client";

/**
 * Security Hooks
 * React hooks untuk keamanan website
 */

import { useEffect, useCallback, useRef, useState } from "react";
import {
  isBlockedDomain,
  containsBlockedKeyword,
  sanitizeHTML,
  RateLimiter,
  logSecurityEvent,
} from "./utils";

/**
 * Hook untuk mencegah iklan judol yang di-inject via DOM manipulation
 */
export function useAntiJudol() {
  useEffect(() => {
    // Observer untuk mendeteksi perubahan DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            checkAndRemoveJudol(node);
          }
        });
      });
    });

    // Fungsi untuk mengecek dan menghapus element judol
    const checkAndRemoveJudol = (element: HTMLElement) => {
      // Cek semua link
      const links = element.querySelectorAll("a[href]");
      links.forEach((link) => {
        const href = link.getAttribute("href") || "";
        if (isBlockedDomain(href)) {
          logSecurityEvent("blocked", "Blocked judol link", { href });
          link.remove();
        }
      });

      // Cek iframe
      const iframes = element.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        const src = iframe.getAttribute("src") || "";
        if (isBlockedDomain(src)) {
          logSecurityEvent("blocked", "Blocked judol iframe", { src });
          iframe.remove();
        }
      });

      // Cek script yang di-inject
      const scripts = element.querySelectorAll("script");
      scripts.forEach((script) => {
        const src = script.getAttribute("src") || "";
        const content = script.textContent || "";

        if (isBlockedDomain(src) || containsBlockedKeyword(content)) {
          logSecurityEvent("blocked", "Blocked malicious script", { src });
          script.remove();
        }
      });

      // Cek div dengan konten mencurigakan
      if (containsBlockedKeyword(element.textContent || "")) {
        // Cek apakah ini bukan bagian dari konten yang sah
        if (element.tagName === "DIV" && element.style.position === "fixed") {
          logSecurityEvent("blocked", "Blocked suspicious overlay", {
            content: element.textContent?.substring(0, 100),
          });
          element.remove();
        }
      }

      // Cek style yang mencurigakan (popup/overlay)
      const suspiciousStyles = element.querySelectorAll(
        '[style*="position: fixed"], [style*="position:fixed"], [style*="z-index: 9999"], [style*="z-index:9999"]',
      );
      suspiciousStyles.forEach((el) => {
        // Skip navbar/footer yang legitimate
        if (el.closest("nav") || el.closest("header") || el.closest("footer"))
          return;

        const content = el.textContent || "";
        if (containsBlockedKeyword(content)) {
          logSecurityEvent("blocked", "Blocked popup overlay", {
            content: content.substring(0, 100),
          });
          (el as HTMLElement).remove();
        }
      });
    };

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Intercept document.write
    const originalWrite = document.write;
    document.write = function (content: string) {
      if (containsBlockedKeyword(content) || isBlockedDomain(content)) {
        logSecurityEvent(
          "blocked",
          "Blocked document.write with malicious content",
        );
        return;
      }
      originalWrite.call(document, sanitizeHTML(content));
    };

    // Cleanup
    return () => {
      observer.disconnect();
      document.write = originalWrite;
    };
  }, []);
}

/**
 * Hook untuk mencegah DDoS client-side
 */
export function useAntiDDoS(
  maxRequests: number = 50,
  windowMs: number = 60000,
) {
  const rateLimiter = useRef(new RateLimiter(maxRequests, windowMs));
  const [isBlocked, setIsBlocked] = useState(false);
  const requestCount = useRef(0);

  useEffect(() => {
    // Intercept fetch untuk rate limiting
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
      const clientId = "client"; // Bisa diganti dengan fingerprint

      if (!rateLimiter.current.isAllowed(clientId)) {
        setIsBlocked(true);
        logSecurityEvent("blocked", "Rate limit exceeded", {
          requestCount: requestCount.current,
        });
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      requestCount.current++;
      return originalFetch.apply(this, args);
    };

    // Intercept XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    const XHRProxy = function (this: XMLHttpRequest) {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      xhr.open = function (
        method: string,
        url: string | URL,
        async?: boolean,
        username?: string | null,
        password?: string | null,
      ) {
        const clientId = "client";

        if (!rateLimiter.current.isAllowed(clientId)) {
          setIsBlocked(true);
          logSecurityEvent("blocked", "XHR rate limit exceeded");
          throw new Error("Rate limit exceeded");
        }

        return originalOpen.call(
          xhr,
          method,
          url,
          async ?? true,
          username,
          password,
        );
      };

      return xhr;
    };

    window.XMLHttpRequest = XHRProxy as unknown as typeof XMLHttpRequest;

    // Cleanup
    return () => {
      window.fetch = originalFetch;
      window.XMLHttpRequest = originalXHR;
    };
  }, []);

  const resetBlock = useCallback(() => {
    setIsBlocked(false);
    rateLimiter.current.resetAll();
    requestCount.current = 0;
  }, []);

  return { isBlocked, resetBlock, requestCount: requestCount.current };
}

/**
 * Hook untuk mencegah copy-paste content berbahaya
 */
export function useSafePaste() {
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const pastedData = e.clipboardData?.getData("text") || "";

      if (containsBlockedKeyword(pastedData) || isBlockedDomain(pastedData)) {
        e.preventDefault();
        logSecurityEvent("blocked", "Blocked paste with malicious content");
        alert("Konten yang di-paste mengandung materi yang tidak diizinkan.");
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, []);
}

/**
 * Hook untuk proteksi form dari spam/injection
 */
export function useFormProtection() {
  const [honeypot, setHoneypot] = useState("");
  const submitCount = useRef(0);
  const lastSubmitTime = useRef(0);

  const validateForm = useCallback(
    (formData: Record<string, string>): { valid: boolean; error?: string } => {
      // Cek honeypot (jika terisi, kemungkinan bot)
      if (honeypot) {
        logSecurityEvent("blocked", "Bot detected via honeypot");
        return { valid: false, error: "Spam detected" };
      }

      // Cek rate limiting (max 3 submit per menit)
      const now = Date.now();
      if (now - lastSubmitTime.current < 20000) {
        // 20 detik
        submitCount.current++;
      } else {
        submitCount.current = 1;
        lastSubmitTime.current = now;
      }

      if (submitCount.current > 3) {
        logSecurityEvent("blocked", "Form submission rate limit exceeded");
        return {
          valid: false,
          error: "Terlalu banyak percobaan. Mohon tunggu beberapa saat.",
        };
      }

      // Cek setiap field untuk konten berbahaya
      for (const [, value] of Object.entries(formData)) {
        if (containsBlockedKeyword(value)) {
          logSecurityEvent("blocked", "Form contains blocked keywords", {
            value: value.substring(0, 50),
          });
          return {
            valid: false,
            error: "Konten tidak diizinkan terdeteksi dalam form",
          };
        }

        if (isBlockedDomain(value)) {
          logSecurityEvent("blocked", "Form contains blocked domain", {
            value,
          });
          return {
            valid: false,
            error: "Link tidak diizinkan terdeteksi dalam form",
          };
        }
      }

      return { valid: true };
    },
    [honeypot],
  );

  return { honeypot, setHoneypot, validateForm };
}

/**
 * Hook untuk mendeteksi perubahan URL mencurigakan
 */
export function useURLProtection() {
  useEffect(() => {
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const url = args[2];
      if (url && typeof url === "string" && isBlockedDomain(url)) {
        logSecurityEvent("blocked", "Blocked malicious URL navigation", {
          url,
        });
        return;
      }
      return originalPushState.apply(this, args);
    };

    history.replaceState = function (...args) {
      const url = args[2];
      if (url && typeof url === "string" && isBlockedDomain(url)) {
        logSecurityEvent("blocked", "Blocked malicious URL replacement", {
          url,
        });
        return;
      }
      return originalReplaceState.apply(this, args);
    };

    // Cek apakah URL saat ini aman
    if (isBlockedDomain(window.location.href)) {
      logSecurityEvent("warning", "Current URL contains blocked domain");
    }

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);
}

/**
 * Hook untuk mencegah console manipulation
 */
export function useConsoleSecurity() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // Disable console di production
      const noop = () => {};

      const consoleMethods = [
        "log",
        "warn",
        "info",
        "debug",
        "table",
        "trace",
      ] as const;
      consoleMethods.forEach((method) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (console as any)[method] = noop;
      });

      // Tetap izinkan console.error untuk debugging critical
    }
  }, []);
}

/**
 * Hook untuk mendeteksi DevTools
 */
export function useDevToolsDetection(onDetected?: () => void) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const threshold = 160;

      const checkDevTools = () => {
        const widthThreshold =
          window.outerWidth - window.innerWidth > threshold;
        const heightThreshold =
          window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
          logSecurityEvent("warning", "DevTools detected");
          onDetected?.();
        }
      };

      window.addEventListener("resize", checkDevTools);
      checkDevTools();

      return () => window.removeEventListener("resize", checkDevTools);
    }
  }, [onDetected]);
}
