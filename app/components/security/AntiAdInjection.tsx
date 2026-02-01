"use client";

/**
 * Anti Ad Injection Component
 * Komponen untuk mencegah injeksi iklan judol dan konten berbahaya lainnya
 */

import { useEffect, useCallback, useRef } from "react";
import { BLOCKED_DOMAINS, BLOCKED_KEYWORDS } from "@/app/lib/security/config";

export default function AntiAdInjection() {
  const cleanupCount = useRef(0);

  const isBlockedContent = useCallback((text: string): boolean => {
    if (!text) return false;
    const lowerText = text.toLowerCase();

    return (
      BLOCKED_DOMAINS.some((domain) =>
        lowerText.includes(domain.toLowerCase()),
      ) ||
      BLOCKED_KEYWORDS.some((keyword) =>
        lowerText.includes(keyword.toLowerCase()),
      )
    );
  }, []);

  const cleanupElement = useCallback(
    (element: Element) => {
      // Cek link
      if (element instanceof HTMLAnchorElement) {
        const href = element.href || "";
        if (isBlockedContent(href)) {
          console.warn(
            "[SECURITY] Removed blocked link:",
            href.substring(0, 50),
          );
          element.remove();
          cleanupCount.current++;
          return;
        }
      }

      // Cek iframe
      if (element instanceof HTMLIFrameElement) {
        const src = element.src || "";
        // Izinkan YouTube dan Google Maps
        const allowedSources = [
          "youtube.com",
          "www.youtube.com",
          "google.com",
          "www.google.com",
          "maps.google.com",
        ];

        const isAllowed = allowedSources.some((source) => src.includes(source));
        const isBlocked = isBlockedContent(src);

        if (!isAllowed && (isBlocked || !src.startsWith("https://"))) {
          console.warn(
            "[SECURITY] Removed blocked iframe:",
            src.substring(0, 50),
          );
          element.remove();
          cleanupCount.current++;
          return;
        }
      }

      // Cek script
      if (element instanceof HTMLScriptElement) {
        const src = element.src || "";
        const content = element.textContent || "";

        if (isBlockedContent(src) || isBlockedContent(content)) {
          console.warn(
            "[SECURITY] Removed blocked script:",
            src.substring(0, 50),
          );
          element.remove();
          cleanupCount.current++;
          return;
        }
      }

      // Cek elemen dengan konten mencurigakan dan style fixed/absolute
      if (element instanceof HTMLDivElement) {
        const content = element.textContent || "";
        const style = getComputedStyle(element);

        const isOverlay =
          style.position === "fixed" ||
          (style.position === "absolute" && parseInt(style.zIndex) > 1000);

        if (isOverlay && isBlockedContent(content)) {
          console.warn("[SECURITY] Removed suspicious overlay");
          element.remove();
          cleanupCount.current++;
          return;
        }
      }

      // Cek img dari sumber mencurigakan
      if (element instanceof HTMLImageElement) {
        const src = element.src || "";
        if (isBlockedContent(src)) {
          console.warn(
            "[SECURITY] Removed blocked image:",
            src.substring(0, 50),
          );
          element.remove();
          cleanupCount.current++;
          return;
        }
      }
    },
    [isBlockedContent],
  );

  const scanDocument = useCallback(() => {
    // Scan semua elemen yang berpotensi berbahaya
    const selectors = [
      "a[href]",
      "iframe",
      "script",
      "div[style*='position: fixed']",
      "div[style*='position:fixed']",
      "div[style*='z-index']",
      "img",
      "[onclick]",
      "[onload]",
      "[onerror]",
    ];

    selectors.forEach((selector) => {
      try {
        document.querySelectorAll(selector).forEach(cleanupElement);
      } catch {
        // Ignore selector errors
      }
    });
  }, [cleanupElement]);

  useEffect(() => {
    // Initial scan
    scanDocument();

    // Observer untuk mendeteksi elemen baru
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            cleanupElement(node);

            // Scan child elements juga
            node.querySelectorAll("*").forEach(cleanupElement);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Intercept createElement
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function <K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions,
    ): HTMLElementTagNameMap[K] {
      const element = originalCreateElement(tagName, options);

      // Schedule cleanup check setelah element di-append
      setTimeout(() => {
        if (element.isConnected) {
          cleanupElement(element);
        }
      }, 0);

      return element;
    };

    // Intercept innerHTML setter
    const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(
      Element.prototype,
      "innerHTML",
    );
    if (originalInnerHTMLDescriptor) {
      Object.defineProperty(Element.prototype, "innerHTML", {
        set(value: string) {
          // Cek konten berbahaya
          if (isBlockedContent(value)) {
            console.warn(
              "[SECURITY] Blocked innerHTML with suspicious content",
            );
            return;
          }

          originalInnerHTMLDescriptor.set?.call(this, value);

          // Cleanup setelah di-set
          setTimeout(() => {
            if (this instanceof Element && this.isConnected) {
              this.querySelectorAll("*").forEach(cleanupElement);
            }
          }, 0);
        },
        get() {
          return originalInnerHTMLDescriptor.get?.call(this);
        },
        configurable: true,
      });
    }

    // Periodic scan setiap 5 detik
    const intervalId = setInterval(scanDocument, 5000);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
      document.createElement = originalCreateElement;

      if (originalInnerHTMLDescriptor) {
        Object.defineProperty(
          Element.prototype,
          "innerHTML",
          originalInnerHTMLDescriptor,
        );
      }
    };
  }, [cleanupElement, isBlockedContent, scanDocument]);

  return null; // Komponen ini tidak merender apapun
}
