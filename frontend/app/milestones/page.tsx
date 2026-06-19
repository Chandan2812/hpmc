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

const milestones = [
  {
    year: "1972",
    title: "Company Founded",
    desc: "Started operations with a vision to serve the plastics industry.",
  },
  {
    year: "1988",
    title: "Manufacturing Expansion",
    desc: "Expanded production capacity and modernized facilities.",
  },
  {
    year: "2000",
    title: "International Exports",
    desc: "Successfully entered global markets.",
  },
  {
    year: "2012",
    title: "Technology Advancement",
    desc: "Introduced high-efficiency extrusion systems.",
  },
  {
    year: "2020",
    title: "Global Recognition",
    desc: "Established presence across multiple countries.",
  },
  {
    year: "Today",
    title: "Industry Leadership",
    desc: "Continuing to innovate and expand worldwide.",
  },
];

export default function Milestones() {
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
              Home &gt; Milestones
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Celebrating
              <span className="text-[#65BC4F]"> Milestones That Matter</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              Every milestone reflects our commitment to innovation, engineering
              excellence, customer satisfaction, and sustainable growth over the
              past five decades.
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

      <section className="py-24 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Our Achievements
            </span>

            <h2 className="text-5xl lg:text-7xl font-bold mt-4">
              Milestones That
              <span className="text-[var(--primary)]"> Define Us</span>
            </h2>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-[var(--border)]" />

            {milestones.map((item, index) => (
              <div
                key={index}
                className={`relative grid lg:grid-cols-2 gap-12 items-center mb-20 ${
                  index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Content Card */}
                <div>
                  <div className="group bg-[var(--card)] border border-[var(--border)] rounded-[32px] p-10 hover:-translate-y-2 transition duration-500">
                    <span className="text-[90px] leading-none font-black text-[var(--primary)]/15">
                      {item.year}
                    </span>

                    <h3 className="text-3xl font-bold mt-4 text-[var(--text-primary)]">
                      {item.title}
                    </h3>

                    <p className="mt-5 text-[var(--text-secondary)] leading-8">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="hidden lg:flex justify-center">
                  <div className="relative z-10">
                    <div className="w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-lg">
                        {item.year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]/70">
        <div className="max-w-5xl mx-auto text-center px-5">
          <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
            The Next Chapter
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold mt-5">
            Building Tomorrow's
            <span className="text-[var(--primary)]"> Milestones</span>
          </h2>

          <p className="mt-8 text-lg text-[var(--text-secondary)] leading-8">
            While we take pride in our achievements, our focus remains on
            creating new opportunities, driving innovation, and delivering
            greater value for customers around the world.
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
