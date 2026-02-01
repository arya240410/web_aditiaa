"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  useAntiJudol,
  useAntiDDoS,
  useSafePaste,
  useURLProtection,
  useConsoleSecurity,
  useDevToolsDetection,
} from "./hooks";
import { BLOCKED_KEYWORDS, BLOCKED_DOMAINS } from "./config";

interface SecurityContextType {
  isSecure: boolean;
  isBlocked: boolean;
  threatCount: number;
  resetSecurity: () => void;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecure: true,
  isBlocked: false,
  threatCount: 0,
  resetSecurity: () => {},
});

export const useSecurityContext = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: ReactNode;
  enableAntiJudol?: boolean;
  enableAntiDDoS?: boolean;
  enableSafePaste?: boolean;
  enableURLProtection?: boolean;
  enableConsoleSecurity?: boolean;
  enableDevToolsDetection?: boolean;
  onSecurityViolation?: (
    type: string,
    details: Record<string, unknown>,
  ) => void;
}

export function SecurityProvider({
  children,
  enableAntiJudol = true,
  enableAntiDDoS = true,
  enableSafePaste = true,
  enableURLProtection = true,
  enableConsoleSecurity = true,
  enableDevToolsDetection = false,
  onSecurityViolation,
}: SecurityProviderProps) {
  const [threatCount, setThreatCount] = useState(0);
  const [isSecure, setIsSecure] = useState(true);

  if (enableAntiJudol) useAntiJudol();
  if (enableSafePaste) useSafePaste();
  if (enableURLProtection) useURLProtection();
  if (enableConsoleSecurity) useConsoleSecurity();

  const { isBlocked, resetBlock } = enableAntiDDoS
    ? useAntiDDoS(50, 60000)
    : { isBlocked: false, resetBlock: () => {} };

  if (enableDevToolsDetection) {
    useDevToolsDetection(() => {
      setThreatCount((prev) => prev + 1);
      onSecurityViolation?.("devtools", {});
    });
  }

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (process.env.NODE_ENV === "production") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "F12") {
          e.preventDefault();
          return false;
        }

        if (e.ctrlKey && e.shiftKey && e.key === "I") {
          e.preventDefault();
          return false;
        }
        if (e.ctrlKey && e.shiftKey && e.key === "J") {
          e.preventDefault();
          return false;
        }
        if (e.ctrlKey && e.key === "u") {
          e.preventDefault();
          return false;
        }
        if (e.ctrlKey && e.shiftKey && e.key === "C") {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data =
        typeof event.data === "string"
          ? event.data
          : JSON.stringify(event.data);

      const hasBlockedKeyword = BLOCKED_KEYWORDS.some((kw) =>
        data.toLowerCase().includes(kw.toLowerCase()),
      );
      const hasBlockedDomain = BLOCKED_DOMAINS.some((domain) =>
        data.toLowerCase().includes(domain.toLowerCase()),
      );

      if (hasBlockedKeyword || hasBlockedDomain) {
        setThreatCount((prev) => prev + 1);
        setIsSecure(false);
        onSecurityViolation?.("postMessage", {
          origin: event.origin,
          data: data.substring(0, 100),
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSecurityViolation]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLScriptElement) {
              const src = node.src || "";
              const content = node.textContent || "";

              const isSuspicious = BLOCKED_DOMAINS.some(
                (domain) =>
                  src.toLowerCase().includes(domain.toLowerCase()) ||
                  content.toLowerCase().includes(domain.toLowerCase()),
              );

              if (isSuspicious) {
                node.remove();
                setThreatCount((prev) => prev + 1);
                onSecurityViolation?.("script_injection", { src });
              }
            }
          });
        }
      });
    });

    observer.observe(document.head, { childList: true });
    observer.observe(document.body, { childList: true });

    return () => observer.disconnect();
  }, [onSecurityViolation]);

  const resetSecurity = () => {
    setThreatCount(0);
    setIsSecure(true);
    resetBlock();
  };

  const value = {
    isSecure,
    isBlocked,
    threatCount,
    resetSecurity,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}

      {isBlocked && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            color: "white",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
          <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>
            Aktivitas Mencurigakan Terdeteksi
          </h1>
          <p style={{ fontSize: "16px", opacity: 0.8, marginBottom: "20px" }}>
            Terlalu banyak request dalam waktu singkat. Mohon tunggu beberapa
            saat.
          </p>
          <button
            onClick={resetSecurity}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Coba Lagi
          </button>
        </div>
      )}
    </SecurityContext.Provider>
  );
}

export default SecurityProvider;
