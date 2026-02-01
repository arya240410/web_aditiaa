"use client";

/**
 * NoCopy Component
 * Komponen untuk mencegah copy-paste konten, inspect element, dan proteksi lainnya
 */

import { useEffect } from "react";

interface NoCopyProps {
  children?: React.ReactNode;
  disableCopy?: boolean;
  disableRightClick?: boolean;
  disableSelection?: boolean;
  disableDragDrop?: boolean;
  disableInspect?: boolean;
  disablePrintScreen?: boolean;
}

export default function NoCopy({
  children,
  disableCopy = true,
  disableRightClick = true,
  disableSelection = true,
  disableDragDrop = true,
  disableInspect = true,
  disablePrintScreen = true,
}: NoCopyProps) {
  useEffect(() => {
    // Hanya aktif di production
    if (process.env.NODE_ENV !== "production") return;

    // Disable copy
    const handleCopy = (e: ClipboardEvent) => {
      if (disableCopy) {
        e.preventDefault();
        e.clipboardData?.setData(
          "text/plain",
          "Konten dilindungi. Copy tidak diizinkan.",
        );
      }
    };

    // Disable cut
    const handleCut = (e: ClipboardEvent) => {
      if (disableCopy) {
        e.preventDefault();
      }
    };

    // Disable right click
    const handleContextMenu = (e: MouseEvent) => {
      if (disableRightClick) {
        const target = e.target as HTMLElement;
        // Izinkan right-click pada input dan textarea
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      if (disableSelection) {
        const target = e.target as HTMLElement;
        // Izinkan selection pada input dan textarea
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      if (disableDragDrop) {
        e.preventDefault();
      }
    };

    // Disable keyboard shortcuts untuk inspect
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disableInspect) {
        // F12
        if (e.key === "F12") {
          e.preventDefault();
          return false;
        }

        // Ctrl+Shift+I (Inspect)
        if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) {
          e.preventDefault();
          return false;
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) {
          e.preventDefault();
          return false;
        }

        // Ctrl+Shift+C (Element picker)
        if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) {
          e.preventDefault();
          return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
          e.preventDefault();
          return false;
        }

        // Ctrl+S (Save Page)
        if (e.ctrlKey && (e.key === "S" || e.key === "s")) {
          e.preventDefault();
          return false;
        }
      }

      // Print Screen
      if (disablePrintScreen && e.key === "PrintScreen") {
        e.preventDefault();
        // Blur halaman sebentar untuk mencegah screenshot
        document.body.style.filter = "blur(10px)";
        setTimeout(() => {
          document.body.style.filter = "none";
        }, 1000);
        return false;
      }
    };

    // Add event listeners
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    // Disable text selection via CSS
    if (disableSelection) {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    }

    // Cleanup
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);

      if (disableSelection) {
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
      }
    };
  }, [
    disableCopy,
    disableRightClick,
    disableSelection,
    disableDragDrop,
    disableInspect,
    disablePrintScreen,
  ]);

  return <>{children}</>;
}
