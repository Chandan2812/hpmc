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

const items = [
  { number: "50+", label: "Years Experience" },
  { number: "12K+", label: "Machines Installed" },
  { number: "25+", label: "Countries Served" },
  { number: "24/7", label: "Technical Support" },
];

const journeyTimeline = [
  {
    year: "1972",
    title: "Company Founded",
    description:
      "Started with a vision to provide reliable extrusion machinery solutions.",
  },
  {
    year: "1985",
    title: "Expansion of Manufacturing",
    description:
      "Established advanced production facilities and expanded capabilities.",
  },
  {
    year: "2000",
    title: "Global Market Entry",
    description:
      "Successfully exported extrusion plants to international markets.",
  },
  {
    year: "2010",
    title: "Technology Advancement",
    description:
      "Introduced energy-efficient and high-speed extrusion systems.",
  },
  {
    year: "2020",
    title: "Industry Leadership",
    description:
      "Recognized among leading manufacturers serving customers worldwide.",
  },
  {
    year: "Today",
    title: "Future Ready",
    description:
      "Driving innovation through automation, sustainability, and smart manufacturing.",
  },
];

export default function OurJourney() {
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
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; Our Journey
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              A Legacy Of
              <span className="text-[#65BC4F]"> Innovation & Excellence</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              Since 1972, HPMC has been shaping the future of extrusion
              technology. From humble beginnings to becoming a globally
              recognized manufacturer, our journey has been defined by
              innovation, engineering excellence, customer trust, and a
              relentless pursuit of progress.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Start Your Journey With Us
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
          <div className="text-center mb-20">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Our Journey
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold mt-4">
              Five Decades Of
              <span className="text-[var(--primary)]"> Innovation</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-[2px] bg-[var(--border)] hidden lg:block" />

            {journeyTimeline.map((item, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 mb-16 items-center ${
                  index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div className="bg-[var(--card)] p-8 rounded-3xl shadow-lg">
                    <span className="text-[var(--primary)] text-5xl font-black">
                      {item.year}
                    </span>

                    <h3 className="text-2xl font-bold mt-4">{item.title}</h3>

                    <p className="mt-4 text-[var(--text-secondary)] leading-8">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="hidden lg:flex justify-center">
                  <div className="w-5 h-5 rounded-full bg-[var(--primary)] z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">50+</h3>
              <p className="text-white text-xl mt-3">Years of Experience</p>
            </div>

            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">1K+</h3>
              <p className="text-white text-xl mt-3">Machines Installed</p>
            </div>

            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">25+</h3>
              <p className="text-white text-xl mt-3">Countries Served</p>
            </div>

            <div>
              <h3 className="text-7xl font-black text-[var(--primary)]">
                24/7
              </h3>
              <p className="text-white text-xl mt-3">Technical Support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto text-center px-5">
          <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
            Looking Ahead
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold mt-5">
            The Journey
            <span className="text-[var(--primary)]"> Continues</span>
          </h2>

          <p className="mt-8 text-lg text-[var(--text-secondary)] leading-8">
            As industries evolve, we continue to invest in technology,
            automation, sustainability, and customer-focused innovation to
            deliver world-class extrusion solutions for future generations.
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
