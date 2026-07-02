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
  { number: "1K+", label: "Machines Installed" },
  { number: "25+", label: "Countries Served" },
  { number: "24/7", label: "Technical Support" },
];

export default function VisionMission() {
  const [openPopup, setOpenPopup] = useState(false);
  return (
    <div>
      <Navbar />

      <section className="relative w-full min-h-[650px] lg:h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/herosection/visionmission.png')",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
          <div className="max-w-[520px] pt-24 lg:pt-0">
            {/* Heading */}
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; Vision & Mission
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Our Vision
              <span className="text-[#65BC4F]"> & Mission</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              Guided by innovation, quality, and customer success, we are
              shaping the future of extrusion technology with solutions built
              for performance, reliability, and long-term growth.
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

      {/* VISION + MISSION */}
      <section className="py-16 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              OUR PURPOSE
            </span>

            <h2 className="mt-4 text-4xl lg:text-6xl font-bold">
              Where We Are
              <span className="text-[var(--primary)]"> Going</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-0 rounded-[40px] overflow-hidden shadow-xl">
            <div className="bg-[#0B1220] text-white p-12 lg:p-16">
              <span className="text-[#65BC4F] text-sm uppercase tracking-[3px]">
                Vision
              </span>

              <h3 className="text-4xl lg:text-5xl font-bold mt-6 leading-tight">
                Engineering Tomorrow's Industry
              </h3>

              <p className="mt-8 text-gray-300 leading-8">
                To become a globally trusted leader in extrusion technology by
                delivering innovative and future-ready manufacturing solutions.
              </p>
            </div>

            <div className="bg-[#65BC4F] p-12 lg:p-16 text-[#0B1220]">
              <span className="text-sm uppercase tracking-[3px] font-semibold">
                Mission
              </span>

              <h3 className="text-4xl lg:text-5xl font-bold mt-6 leading-tight">
                Turning Ideas Into Performance
              </h3>

              <p className="mt-8 leading-8">
                To design and manufacture high-performance extrusion systems
                that maximize productivity and long-term value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE GOALS */}
      <section className="py-20 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-[var(--primary)] uppercase text-sm tracking-wider font-semibold">
              Looking Ahead
            </span>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mt-3">
              Building Tomorrow's Manufacturing Ecosystem
            </h2>

            <p className="mt-6 text-gray-400 leading-8">
              We continue to invest in advanced technology, automation, and
              sustainable manufacturing solutions to support the next generation
              of industrial growth.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 mt-16">
            {items.map((item) => (
              <div className="group">
                <h3
                  className="text-[60px] lg:text-[90px]
      font-black text-white/10 leading-none group-hover:text-[#65BC4F]/20 transition-all"
                >
                  {item.number}
                </h3>

                <p className=" text-white text-xl font-semibold">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP MESSAGE */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="relative h-[600px] rounded-[40px] overflow-hidden">
                <Image src="/team.png" fill alt="" className="object-cover" />
              </div>

              <div
                className="
    lg:absolute
    bottom-10
    right-10
    bg-white
    p-8
    rounded-3xl
    max-w-md
    shadow-xl
  "
              >
                ...
              </div>
            </div>

            <div>
              <span className="text-[var(--primary)] uppercase tracking-wider font-semibold text-sm">
                Leadership Message
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mt-3 leading-tight">
                Our Success Begins With
                <span className="text-[var(--primary)]"> Customer Success</span>
              </h2>

              <p className="mt-6 text-[var(--text-secondary)] leading-8">
                For over five decades, HPMC has remained committed to
                engineering excellence, innovation, and customer satisfaction.
                Every machine we build reflects our dedication to helping
                businesses achieve greater productivity and sustainable growth.
              </p>

              <p className="mt-4 text-[var(--text-secondary)] leading-8">
                As industries evolve, our vision remains clear — to deliver
                world-class extrusion solutions that drive efficiency,
                reliability, and long-term success for manufacturers across the
                globe.
              </p>

              <div className="mt-8">
                <h4 className="font-bold text-xl text-[var(--text-primary)]">
                  HPMC Leadership Team
                </h4>

                <p className="text-[var(--primary)]">Innovating Since 1972</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-6xl lg:text-8xl font-black leading-none">
            Innovation
            <br />
            <span className="text-[var(--primary)]">Quality</span>
            <br />
            Reliability
            <br />
            Growth
          </h2>

          <div className="w-px h-20 bg-[var(--primary)] mx-auto my-8" />

          <p className="uppercase tracking-[5px] text-lg font-semibold">
            Customer Success
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
