"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { QrCode, Wifi, ShieldCheck, Gamepad2 } from "lucide-react";
import React from "react";

export default function Lanyard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-200, 200], [15, -15]);
  const rotateY = useTransform(mouseX, [-200, 200], [-15, 15]);

  return (
    <div
      className="w-full h-full flex items-center justify-center perspective-[1200px]"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[320px] h-[480px] rounded-[30px] bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(168,85,247,0.3)] transition-all duration-200"
      >
        <div
          className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
          style={{ transform: "translateZ(1px)" }}
        />
        <div className="flex flex-col h-full p-6 text-white relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Gamepad2 size={20} className="text-purple-400" />
              <span className="text-xs font-mono tracking-wider">
                PPLG Student
              </span>
            </div>
            <Wifi size={20} className="text-slate-500 animate-pulse" />
          </div>

          <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden border-2 border-white/10 shadow-inner bg-slate-800">
            <Image
              src="/assets/arya.png"
              alt="Arya"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 mix-blend-overlay" />
          </div>

          <div
            className="space-y-1 text-center mb-auto"
            style={{ transform: "translateZ(20px)" }}
          >
            <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ARYA
            </h2>
            <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              <p className="text-xs font-bold text-purple-300 tracking-[0.2em]">
                FRONTEND DEVELOPER
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center opacity-60">
            <div className="space-y-1">
              <div className="h-1 w-12 bg-white/20 rounded-full" />
              <div className="h-1 w-8 bg-white/10 rounded-full" />
            </div>
            <QrCode size={32} className="text-white/80" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-600/30 rounded-full blur-[60px] -z-10" />
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-500/20 rounded-full blur-[50px] -z-10" />
      </motion.div>
    </div>
  );
}
