"use client";
import Image from "next/image";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import CTA from "../components/CTA";
import FloatingContact from "../components/FloatingButton";
import PopupForm from "../components/Popup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function Gallery() {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <div>
      <Navbar />

      <section className="relative w-full min-h-[650px] lg:h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/home-hero.png')",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
          <div className="max-w-[520px] pt-24 lg:pt-0">
            {/* Heading */}
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; Gallery
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Our
              <span className="text-[#65BC4F]"> Gallery</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              Explore our machinery, manufacturing facilities, installations,
              exhibitions, and project highlights through our visual showcase.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Talk to Our Experts
                </span>

                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Visual Showcase
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold mt-4 text-[var(--text-primary)]">
              Gallery
              <span className="text-[var(--primary)]"> Coming Soon</span>
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-[var(--text-secondary)] leading-8">
              We're currently preparing a collection of images featuring our
              machinery, manufacturing capabilities, installations, and events.
            </p>
          </div>

          <div
            className="
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-10
        lg:p-20
        text-center
      "
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-6 h-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-[var(--primary)]" />
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <div
                className="
            w-28
            h-28
            mx-auto
            rounded-full
            bg-[var(--primary)]/10
            flex
            items-center
            justify-center
            mb-8
          "
              >
                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-[var(--primary)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M4 16l4-4 4 4 8-8M4 20h16"
                  />
                </svg>
              </div>

              <h3 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                Images Will Be Available Soon
              </h3>

              <p className="max-w-2xl mx-auto mt-6 text-[var(--text-secondary)] leading-8">
                Our gallery is currently being updated with high-quality images
                of our products, facilities, installations, customer success
                stories, and industry events.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
}
