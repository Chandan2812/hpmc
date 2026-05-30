"use client";

import Link from "next/link";
import PopupForm from "./Popup";
import { useState } from "react";

export default function CTA() {
  const [openPopup, setOpenPopup] = useState(false);
  return (
    <section className="relative bg-[var(--background)] overflow-hidden">
      <div>
        {/* CTA BOX */}
        <div className="relative overflow-hidden  bg-[#1d7a40] border border-[var(--border)] shadow-[var(--shadow-primary)]">
          {/* GRADIENT LAYER */}
          <div className="absolute inset-0 bg-[var(--gradient-dark)] opacity-100 dark:opacity-100" />

          {/* GLOW */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--primary)]/10 blur-[120px]" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 px-6 md:px-10 py-8">
            {" "}
            {/* LEFT CONTENT */}
            <div className="flex items-start gap-5 lg:max-w-[42%]">
              {" "}
              {/* ICON */}
              <div className="min-w-[64px] h-[64px] rounded-2xl bg-[var(--primary)]/20 border border-[var(--primary)]/20 flex items-center justify-center text-3xl">
                📞
              </div>
              {/* TEXT */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] ">
                  Have a project in mind?
                </h2>

                <p className="mt-2 text-[15px] md:text-base text-white/80  leading-7 max-w-[520px]">
                  lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod
                </p>
              </div>
            </div>
            {/* RIGHT SIDE */}
            <div className="flex flex-col sm:flex-row gap-8 lg:items-center shrink-0">
              {" "}
              {/* CALL */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-[var(--border)] bg-white/5 flex items-center justify-center text-xl">
                  ☎️
                </div>

                <div>
                  <p className="text-sm text-white/70">Call Us</p>

                  <h4 className="text-[var(--foreground)]  font-semibold whitespace-nowrap">
                    {" "}
                    +91 98765 43210
                  </h4>
                </div>
              </div>
              {/* EMAIL */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-[var(--border)] bg-white/5 flex items-center justify-center text-xl">
                  ✉️
                </div>

                <div>
                  <p className="text-sm text-white/70">Email Us</p>

                  <h4 className="text-[var(--foreground)]  font-semibold whitespace-nowrap">
                    {" "}
                    info@company.com
                  </h4>
                </div>
              </div>
              {/* BUTTON */}
              <button
                onClick={() => setOpenPopup(true)}
                className="hidden lg:flex items-center gap-3 bg-[var(--primary)] rounded-full pl-4 pr-1 py-1 group hover:bg-[var(--background)] border-2 border-[var(--primary)] transition-all duration-300"
              >
                <span className="text-[14px] uppercase font-semibold text-white group-hover:text-[var(--text-primary)]">
                  Request A Quote
                </span>

                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:bg-[var(--primary)] transition">
                  <span className="text-[var(--primary)] group-hover:text-white text-lg">
                    →
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </section>
  );
}
