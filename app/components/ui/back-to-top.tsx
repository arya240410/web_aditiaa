"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);

      setIsVisible(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-lg shadow-purple-500/20 group cursor-pointer"
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg
              className="absolute w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray="283" // 2 * pi * 45 ≈ 282.7
                strokeDashoffset={283 - (283 * progress) / 100}
                className="text-purple-500 transition-all duration-100 ease-out"
                strokeLinecap="round"
              />
            </svg>

            <div className="bg-purple-600 rounded-full p-2 group-hover:bg-purple-500 transition-colors">
              <ArrowUp size={20} className="text-white" />
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
