"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Layout, Palette, Code } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/#about" },
    {
      name: "Proyek",
      href: "/#projects",
      dropdown: [
        { name: "Desain Web", href: "/?filter=Web#projects", icon: Layout },
        { name: "UI/UX", href: "/?filter=UI/UX#projects", icon: Palette },
      ],
    },
    { name: "Kontak", href: "/#contact" },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.2 },
    },
    exit: { opacity: 0, y: -10, height: 0 },
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-purple-900/10"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg group-hover:rotate-12 transition-transform">
              A
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Arya
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() =>
                  link.dropdown && setActiveDropdown(link.name)
                }
                onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2"
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full right-0 min-w-[200px] bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden mt-1"
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors group/item"
                        >
                          <div className="p-2 rounded-lg bg-white/5 group-hover/item:bg-purple-500/20 group-hover/item:text-purple-300 transition-colors">
                            <item.icon size={16} />
                          </div>
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <Link
              href="/#contact"
              className="px-5 py-2.5 rounded-full bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition-colors shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.5)]"
            >
              Mari Berkolaborasi
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col">
                  {link.dropdown ? (
                    <>
                      <div className="flex items-center justify-between text-lg font-medium text-slate-300 py-4 border-b border-white/5">
                        {link.name}
                        <ChevronDown size={16} />
                      </div>
                      <div className="flex flex-col gap-2 pl-4 mt-2">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 py-3 text-slate-400 hover:text-white"
                          >
                            <item.icon size={18} />
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-slate-300 hover:text-white py-4 border-b border-white/5"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}

              <Link
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-6 w-full py-4 text-center rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
              >
                Mari Berkolaborasi
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
