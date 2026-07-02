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

const pillars = [
  {
    title: "Education",
    desc: "Supporting learning opportunities and educational development.",
  },
  {
    title: "Environment",
    desc: "Promoting sustainability and environmental stewardship.",
  },
  {
    title: "Skill Development",
    desc: "Empowering individuals through training and knowledge.",
  },
  {
    title: "Community Welfare",
    desc: "Improving quality of life through meaningful initiatives.",
  },
];

export default function CSR() {
  const [openPopup, setOpenPopup] = useState(false);
  return (
    <div>
      <Navbar />

      <section className="relative w-full min-h-[650px] lg:h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/herosection/about.png')",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
          <div className="max-w-[520px] pt-24 lg:pt-0">
            {/* Heading */}
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-3">
              Home &gt; CSR Activities
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Creating Impact
              <span className="text-[#65BC4F]"> Beyond Business</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              At HPMC, we believe success is measured not only by business
              growth but also by the positive impact we create in communities,
              the environment, and the lives of people around us.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-5">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Explore Our Initiatives
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
            <div className="relative h-[550px] rounded-[40px] overflow-hidden">
              <Image src="/team.png" fill alt="" className="object-cover" />
            </div>

            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Corporate Social Responsibility
              </span>

              <h2 className="text-5xl lg:text-6xl font-bold mt-4">
                Building Stronger
                <span className="text-[var(--primary)]"> Communities</span>
              </h2>

              <p className="mt-8 text-[var(--text-secondary)] leading-8">
                Our CSR initiatives focus on creating meaningful and sustainable
                change through education, environmental responsibility, skill
                development, and community welfare programs.
              </p>

              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                We believe that businesses have a responsibility to contribute
                positively to society while fostering long-term sustainable
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Focus Areas
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold text-white mt-4">
              Our CSR Pillars
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:border-[var(--primary)] transition"
              >
                <span className="text-[var(--primary)] text-5xl font-black">
                  0{index + 1}
                </span>

                <h3 className="text-white text-2xl font-bold mt-6">
                  {pillar.title}
                </h3>

                <p className="text-gray-400 mt-4 leading-7">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]/60">
        <div className="max-w-5xl mx-auto text-center px-5">
          <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
            Looking Forward
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold mt-5">
            Creating A Better
            <span className="text-[var(--primary)]"> Tomorrow</span>
          </h2>

          <p className="mt-8 text-lg text-[var(--text-secondary)] leading-8">
            Our CSR journey continues with a commitment to empowering
            communities, protecting the environment, and creating sustainable
            opportunities that contribute to long-term social progress.
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
