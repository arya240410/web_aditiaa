"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollDown() {
  const handleScroll = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute bottom-0 right-6 md:right-10 flex flex-col items-center gap-4 cursor-pointer z-50 group pb-8"
      onClick={handleScroll}
    >
      <span
        className="text-xs font-medium tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors uppercase"
        style={{ writingMode: "vertical-rl" }}
      >
        Explore More
      </span>

      <div className="w-[20px] h-[32px] rounded-full border-[1.5px] border-slate-400 group-hover:border-white transition-colors flex justify-center pt-2 box-border">
        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-[2px] h-[6px] rounded-full bg-slate-400 group-hover:bg-white transition-colors"
        />
      </div>

      <div className="w-[1px] h-16 bg-slate-800 overflow-hidden relative">
        <motion.div
          animate={{
            y: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent"
        />
      </div>
    </motion.div>
  );
}
