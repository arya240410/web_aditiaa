"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github, Layers, Palette, Globe } from "lucide-react";

type Project = {
  id: number;
  title: string;
  category: "Web" | "UI/UX";
  description: string;
  image: string;
  tech: string[];
  links: {
    demo?: string;
    github?: string;
  };
};

const projectsData: Project[] = [
  {
    id: 1,
    title: "Neotrisi",
    category: "Web",
    description:
      "Platform kesehatan digital yang komprehensif untuk memantau asupan nutrisi harian. Dilengkapi dengan fitur pelacakan kalori, rekomendasi makanan berbasis AI, dan laporan kesehatan mingguan untuk membantu pengguna mencapai gaya hidup yang lebih sehat.",
    image: "/assets/neotrisi.png",
    tech: ["Nuxt", "Tailwind CSS"],
    links: {
      demo: "#",
      github: "#",
    },
  },
  {
    id: 2,
    title: "E-Learning Dashboard",
    category: "UI/UX",
    description:
      "Desain antarmuka modern untuk platform pembelajaran daring. Fokus pada pengalaman pengguna yang intuitif, aksesibilitas tinggi, dan visualisasi data kemajuan belajar yang menarik agar siswa tetap termotivasi.",
    image: "",
    tech: ["Figma", "Prototyping", "User Research"],
    links: {
      demo: "#",
    },
  },
  {
    id: 3,
    title: "Company Profile Corporate",
    category: "Web",
    description:
      "Website profil perusahaan yang responsif dan elegan untuk sebuah firma hukum. Menampilkan animasi halus, struktur konten yang jelas, dan optimasi SEO untuk meningkatkan kredibilitas klien di ranah digital.",
    image: "",
    tech: ["React", "Framer Motion", "SEO"],
    links: {
      demo: "#",
    },
  },
];

export default function Projects() {
  const [filter, setFilter] = useState<"All" | "Web" | "UI/UX">("All");
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("filter");
    if (category === "Web") setFilter("Web");
    else if (category === "UI/UX") setFilter("UI/UX");
  }, [searchParams]);

  const filteredProjects = projectsData.filter(
    (project) => filter === "All" || project.category === filter,
  );

  return (
    <section id="projects" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-medium"
          >
            <Layers size={14} className="text-purple-400" />
            <span>Portofolio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white"
          >
            Proyek{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Terbaru
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl leading-relaxed"
          >
            Kumpulan hasil karya terbaik saya dalam pengembangan website dan
            desain antarmuka. Menggabungkan estetika modern dengan
            fungsionalitas yang handal.
          </motion.p>
        </div>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {["All", "Web", "UI/UX"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                filter === category
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category === "All" ? "Semua" : category}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="relative w-full h-56 overflow-hidden">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-800/80 transition-colors">
                      {project.category === "Web" ? (
                        <Globe className="text-slate-600" size={48} />
                      ) : (
                        <Palette className="text-slate-600" size={48} />
                      )}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

                  <div className="absolute top-4 left-4 px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-full text-xs font-semibold text-white">
                    {project.category}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/5 border border-white/5 rounded text-[10px] uppercase tracking-wider text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex gap-4">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          className="text-slate-400 hover:text-white transition-colors"
                          aria-label="GitHub Repo"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          className="text-slate-400 hover:text-white transition-colors"
                          aria-label="Live Demo"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>

                    <span className="text-xs text-slate-500 font-medium group-hover:text-purple-400 transition-colors">
                      Lihat Detail &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
