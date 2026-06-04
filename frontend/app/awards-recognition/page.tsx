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

const awards = [
  {
    year: "2024",
    title: "Manufacturing Excellence Award",
  },
  {
    year: "2022",
    title: "Innovation in Extrusion Technology",
  },
  {
    year: "2020",
    title: "Global Export Achievement",
  },
  {
    year: "2018",
    title: "Customer Excellence Recognition",
  },
  {
    year: "2015",
    title: "Industry Leadership Award",
  },
  {
    year: "2010",
    title: "Quality Manufacturing Recognition",
  },
];

export default function AwardsRecognition() {
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
              Home &gt; Awards & Recognition
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Excellence
              <span className="text-[#65BC4F]"> Recognized</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              Our achievements reflect decades of dedication to innovation,
              manufacturing excellence, customer satisfaction, and industry
              leadership.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-5">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Talk To Our Experts Team
                </span>

                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)] ">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Awards Timeline
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mt-4">
              Recognized Through The Years
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awards.map((award) => (
              <div className="group bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[var(--primary)] transition">
                <span className="text-[var(--primary)] text-6xl font-black">
                  {award.year}
                </span>

                <h3 className="text-[var(--text-primary)] text-2xl font-bold mt-6">
                  {award.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto text-center px-5">
          <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
            Looking Forward
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold mt-5">
            Recognition Drives
            <span className="text-[var(--primary)]"> Responsibility</span>
          </h2>

          <p className="mt-8 text-lg text-[var(--text-secondary)] leading-8">
            Every award and recognition strengthens our commitment to
            innovation, quality, and customer success as we continue building
            the future of extrusion technology.
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
