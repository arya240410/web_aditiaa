"use client";

import { GridScan } from "../background/GridScan";
import Lanyard from "../decoration/lanyard";
import { motion, Variants } from "framer-motion";
import { Code2, Terminal, Cpu } from "lucide-react";
import Image from "next/image";
import ScrollDown from "../ui/scroll-down";

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-hidden selection:bg-purple-500/30 font-sans">
      <div className="fixed inset-0 z-0">
        <GridScan
          sensitivity={0.4}
          lineThickness={1.2}
          linesColor="#2a2438"
          gridScale={0.08}
          scanColor="#b05bf5"
          scanOpacity={0.35}
          enablePost
          bloomIntensity={0.8}
          chromaticAberration={0.003}
          noiseIntensity={0.02}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] pointer-events-none opacity-80" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-6 max-w-6xl py-20 md:py-0"
        >
          <section
            id="home"
            className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-between w-full"
          >
            <motion.div
              variants={itemVariants}
              className="flex-1 space-y-6 text-center md:text-left pt-10 md:pt-0"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium backdrop-blur-sm">
                <Terminal size={14} />
                <span>Siswa PPLG</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-slate-400">
                Halo, Saya
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {" "}
                  Arya
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                Saya menciptakan pengalaman digital dan membangun perangkat
                lunak fungsional. Bersemangat tentang coding, desain, dan
                memecahkan masalah kompleks melalui teknologi.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <button className="px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-200 transition-colors flex items-center gap-2 group">
                  Proyek Saya
                  <Code2
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 text-white font-medium hover:bg-slate-800 transition-all backdrop-blur-sm">
                  Hubungi Saya
                </button>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative w-full max-w-[400px] h-[500px] md:h-[600px] flex items-center justify-center"
            >
              <Lanyard />
            </motion.div>
          </section>

          {/* Scroll Down Indicator */}
          <div className="hidden md:block">
            <ScrollDown />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
