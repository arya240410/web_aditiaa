"use client";

/**
 * Security Wrapper Component
 * Wrapper yang mengintegrasikan semua komponen keamanan
 */

import { ReactNode } from "react";
import { SecurityProvider } from "@/app/lib/security";
import { NoCopy, AntiAdInjection } from "@/app/components/security";

interface SecurityWrapperProps {
  children: ReactNode;
  // Konfigurasi opsional
  enableNoCopy?: boolean;
  enableAntiAdInjection?: boolean;
  enableAntiJudol?: boolean;
  enableAntiDDoS?: boolean;
  enableSafePaste?: boolean;
  enableURLProtection?: boolean;
  enableConsoleSecurity?: boolean;
  enableDevToolsDetection?: boolean;
}

export default function SecurityWrapper({
  children,
  enableNoCopy = true,
  enableAntiAdInjection = true,
  enableAntiJudol = true,
  enableAntiDDoS = true,
  enableSafePaste = true,
  enableURLProtection = true,
  enableConsoleSecurity = true,
  enableDevToolsDetection = false,
}: SecurityWrapperProps) {
  return (
    <SecurityProvider
      enableAntiJudol={enableAntiJudol}
      enableAntiDDoS={enableAntiDDoS}
      enableSafePaste={enableSafePaste}
      enableURLProtection={enableURLProtection}
      enableConsoleSecurity={enableConsoleSecurity}
      enableDevToolsDetection={enableDevToolsDetection}
      onSecurityViolation={(type, details) => {
        console.warn(`[SECURITY VIOLATION] Type: ${type}`, details);
      }}
    >
      {/* Anti Ad Injection - selalu aktif untuk proteksi */}
      {enableAntiAdInjection && <AntiAdInjection />}

      {/* NoCopy wrapper */}
      {enableNoCopy ? (
        <NoCopy
          disableCopy={true}
          disableRightClick={true}
          disableSelection={false} // Izinkan selection untuk UX
          disableDragDrop={true}
          disableInspect={true}
          disablePrintScreen={false}
        >
          {children}
        </NoCopy>
      ) : (
        children
      )}
    </SecurityProvider>
  );
}
