"use client";

import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/arya240410", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/arya", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/arya", label: "Instagram" },
  ];

  return (
    <footer className="w-full bg-slate-950 py-8 border-t border-white/10 relative z-50">
      <div className="container mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate-500 text-sm font-medium">
          &copy; 2026 Arya. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map((social, index) => (
            <Link
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-purple-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <social.icon size={20} strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
