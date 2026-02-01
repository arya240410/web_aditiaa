"use client";

import { motion, Variants } from "framer-motion";
import { GraduationCap, Code2, Target, ArrowRight, User } from "lucide-react";

export default function About() {
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const techStack = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
    "Three.js",
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2 -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col items-center text-center mb-16">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium backdrop-blur-sm mb-6"
            >
              <User size={14} className="text-purple-400" />
              <span>Siapa Saya</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold text-white mb-6"
            >
              Tentang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Saya
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-400 max-w-2xl leading-relaxed"
            >
              Pengembang yang bersemangat menjelajahi dunia piksel dan logika.
              Ini sekilas tentang latar belakang saya dan apa yang mendorong
              kode saya.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            <motion.div
              variants={itemVariants}
              className="lg:col-span-7 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400">
                  <GraduationCap size={32} />
                </div>
                <span className="text-xs font-mono text-slate-500 border border-white/10 px-2 py-1 rounded">
                  2025 - Present
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                SMKN 46 Jakarta
              </h3>
              <p className="text-purple-400 font-medium mb-4">
                PPLG - Pengembangan Perangkat Lunak dan Game
              </p>

              <p className="text-slate-400 leading-relaxed">
                Saat ini sedang mengasah kemampuan dalam rekayasa perangkat
                lunak. Mempelajari segala hal mulai dari algoritma dan manajemen
                basis data hingga kerangka kerja web modern. Waktu saya di sini
                telah memperkuat semangat saya untuk membangun perangkat lunak
                yang berdampak.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center hover:border-blue-500/30 transition-colors relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 ">
                <Target size={120} />
              </div>

              <div className="relative z-10">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 w-fit mb-6">
                  <Code2 size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Calon Frontend Dev
                </h3>
                <p className="text-slate-400">
                  Tujuan saya adalah membuat antarmuka web yang indah,
                  berkinerja tinggi, dan mudah diakses. Saya berusaha
                  menjembatani kesenjangan antara desain dan teknologi.
                </p>
              </div>
            </motion.div>

            {/* Tech Stack - Wide */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-12 bg-slate-950/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8"
            >
              <div className="text-center md:text-left min-w-[200px]">
                <h4 className="text-xl font-bold text-white mb-1">Teknologi</h4>
                <p className="text-sm text-slate-500">Alat yang digunakan</p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start flex-1">
                {techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 hover:border-purple-500/30 hover:text-white transition-all cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA / Transition */}
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <button className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              Lihat apa yang telah saya buat
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
