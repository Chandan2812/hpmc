"use client";
import Image from "next/image";

import Link from "next/link";

import { useEffect, useState } from "react";
import CTA from "../components/CTA";
import FloatingContact from "../components/FloatingButton";
import PopupForm from "../components/Popup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

export default function GlobalReach() {
  const [openPopup, setOpenPopup] = useState(false);
  return (
    <div>
      <Navbar />

      <section className="relative w-full min-h-[650px] lg:h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/about-hero.png')",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
          <div className="max-w-[520px] pt-24 lg:pt-0">
            {/* Heading */}
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-3">
              Home &gt; Global Reach
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Connecting Industries
              <span className="text-[#65BC4F]"> Across The Globe</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              From our manufacturing facility in India to customers worldwide,
              HPMC delivers advanced extrusion solutions trusted by
              manufacturers across multiple continents and industries.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-5">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Connect Worldwide
                </span>

                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Worldwide Presence
              </span>

              <h2 className="text-5xl lg:text-6xl font-bold mt-4">
                Trusted Beyond
                <span className="text-[var(--primary)]"> Borders</span>
              </h2>

              <p className="mt-8 text-[var(--text-secondary)] leading-8">
                Over the years, HPMC has expanded its footprint across
                international markets, delivering reliable extrusion technology
                solutions to customers worldwide.
              </p>

              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                Our machines operate across Asia, Africa, the Middle East,
                Europe, and other global markets, helping manufacturers improve
                productivity and efficiency.
              </p>
            </div>

            <div className="relative h-[400px]">
              <Image
                src="/worldmap.png"
                fill
                alt="Global Presence"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">25+</h3>
              <p className="text-white text-xl mt-3">Countries Served</p>
            </div>

            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">1K+</h3>
              <p className="text-white text-xl mt-3">Machines Installed</p>
            </div>

            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">50+</h3>
              <p className="text-white text-xl mt-3">Years Experience</p>
            </div>

            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">
                24/7
              </h3>
              <p className="text-white text-xl mt-3">Global Support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]/70">
        <div className="max-w-5xl mx-auto text-center px-5">
          <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
            Export Excellence
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold mt-5">
            Engineering Solutions
            <span className="text-[var(--primary)]">
              {" "}
              For Global Industries
            </span>
          </h2>

          <p className="mt-8 text-lg text-[var(--text-secondary)] leading-8">
            Our commitment to quality, innovation, and customer satisfaction
            enables us to deliver reliable extrusion systems that meet
            international manufacturing standards and customer expectations.
          </p>
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
