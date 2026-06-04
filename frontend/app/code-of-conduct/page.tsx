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

const principles = [
  {
    title: "Integrity",
    desc: "Act honestly and ethically in every business interaction.",
  },
  {
    title: "Respect",
    desc: "Treat colleagues, customers, and partners with dignity.",
  },
  {
    title: "Accountability",
    desc: "Take responsibility for actions and decisions.",
  },
  {
    title: "Compliance",
    desc: "Follow all applicable laws and regulations.",
  },
  {
    title: "Transparency",
    desc: "Promote open and honest communication.",
  },
  {
    title: "Sustainability",
    desc: "Support responsible and sustainable growth.",
  },
];

export default function CodeOfConduct() {
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
              Home &gt; Code of Conduct
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Integrity In Every
              <span className="text-[#65BC4F]"> Decision We Make</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              Our Code of Conduct defines the values, ethical standards, and
              professional responsibilities that guide every employee, partner,
              supplier, and stakeholder associated with HPMC.
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

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Our Commitment
              </span>

              <h2 className="text-5xl lg:text-6xl font-bold mt-4">
                Built On Trust,
                <span className="text-[var(--primary)]"> Guided By Ethics</span>
              </h2>

              <p className="mt-8 text-[var(--text-secondary)] leading-8">
                We believe long-term success is achieved through honesty,
                transparency, accountability, and respect for all stakeholders.
              </p>

              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                Every business decision reflects our commitment to ethical
                conduct, compliance, and responsible corporate citizenship.
              </p>
            </div>

            <div className="relative h-[550px] rounded-[40px] overflow-hidden">
              <Image src="/team.png" fill alt="" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Core Principles
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold text-white mt-4">
              The Standards We Follow
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[var(--primary)] transition"
              >
                <div className="text-[var(--primary)] text-5xl font-black">
                  0{index + 1}
                </div>

                <h3 className="text-2xl font-bold text-white mt-6">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-4 leading-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-5xl mx-auto text-center px-5">
          <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
            Leadership Commitment
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold mt-5">
            Ethics Are Not A Policy,
            <span className="text-[var(--primary)]"> They Are Our Culture</span>
          </h2>

          <p className="mt-8 text-lg text-[var(--text-secondary)] leading-8">
            Our leadership team remains committed to fostering a culture of
            integrity, fairness, accountability, and respect throughout every
            aspect of our business operations.
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
