"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check, Mail, Github, Instagram } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const command = "./contact_me.sh";

  const contacts = [
    {
      label: "GitHub",
      value: "@arya240410",
      link: "https://github.com/arya240410",
      color: "text-white",
      icon: Github,
    },
    {
      label: "Instagram",
      value: "@panggilajeryaa",
      link: "https://instagram.com/panggilajeryaa",
      color: "text-pink-400",
      icon: Instagram,
    },
    {
      label: "Email",
      value: "raditiaarya0@gmail.com",
      link: "mailto:raditiaarya0@gmail.com",
      color: "text-green-400",
      icon: Mail,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText("raditiaarya0@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full bg-[#1e1e1e] rounded-xl border border-white/10 shadow-2xl overflow-hidden font-mono text-sm md:text-base"
        >
          <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Terminal size={12} />
              <span>arya@portfolio: ~/contact</span>
            </div>
            <div className="w-16" />
          </div>

          <div className="p-6 md:p-8 min-h-[300px] text-slate-300 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-green-400">arya@desktop:~$</span>
              <span className="flex">
                <Typewriter
                  text={command}
                  onComplete={() => setTypingComplete(true)}
                />
              </span>
            </div>

            {typingComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 pt-2"
              >
                <div className="text-slate-400">
                  Executing script...{" "}
                  <span className="text-green-400">Done!</span>
                </div>

                <div className="text-white">
                  Halo! Saya saat ini terbuka untuk peluang baru.
                  <br />
                  Jangan ragu untuk menghubungi melalui:
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-white/10">
                  {contacts.map((contact, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 group"
                    >
                      <span className="w-24 text-slate-500">
                        {contact.label}:
                      </span>
                      <a
                        href={contact.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 ${contact.color} hover:underline decoration-wavy decoration-from-font underline-offset-4 transition-all`}
                      >
                        <contact.icon size={16} />
                        {contact.value}
                      </a>

                      {contact.label === "Email" && (
                        <button
                          onClick={handleCopy}
                          className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-white transition-colors ml-auto md:ml-0 opacity-0 group-hover:opacity-100"
                          title="Copy Email"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 text-slate-500 animate-pulse">_</div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Typewriter({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        onComplete();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}
