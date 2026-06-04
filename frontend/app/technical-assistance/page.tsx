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
import { Headset, Wrench, GraduationCap } from "lucide-react";

export default function TechnicalAssistance() {
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
              Home &gt; Technical Assistance
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Technical
              <span className="text-[#65BC4F]"> Assistance</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              Expert guidance, troubleshooting, and after-sales support to
              ensure maximum machine performance, minimal downtime, and
              long-term operational efficiency.
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

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* IMAGE */}
            <div className="relative">
              <div className="relative h-[500px] rounded-[32px] overflow-hidden border border-[var(--border)]">
                <Image
                  src="/imag1.png"
                  alt="Technical Assistance"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Card */}
              <div
                className="
          absolute
          -bottom-6
          right-6
          bg-[var(--card)]
          border
          border-[var(--border)]
          rounded-2xl
          px-6
          py-5
          shadow-[var(--shadow-primary)]
        "
              >
                <p className="text-3xl font-bold text-[var(--primary)]">24/7</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Technical Support
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Expert Support
              </span>

              <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                Reliable Assistance For
                <span className="text-[var(--primary)]">
                  {" "}
                  Continuous Production
                </span>
              </h2>

              <p className="mt-6 text-[var(--text-secondary)] leading-8">
                Our technical support team provides comprehensive assistance
                throughout the lifecycle of your machinery. From installation
                and commissioning to troubleshooting and process optimization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                {[
                  "Machine Installation",
                  "Process Optimization",
                  "Troubleshooting Support",
                  "Remote Assistance",
                  "Operator Training",
                  "Maintenance Guidance",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="
                flex
                items-center
                gap-3
                bg-[var(--card)]
                border
                border-[var(--border)]
                rounded-2xl
                p-4
                transition-all
                duration-300
                hover:border-[var(--primary)]
                hover:-translate-y-1
              "
                  >
                    <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />

                    <span className="font-medium text-[var(--text-primary)]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              How We Help
            </span>

            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
              Fast & Effective
              <span className="text-[var(--primary)]"> Technical Support</span>
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-[var(--text-secondary)]">
              A streamlined support process designed to resolve issues quickly
              and maximize machine productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Service & Support",
                icon: Headset,
                desc: "lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores officiis expedita laborum consequatur.",
              },
              {
                number: "02",
                title: "Spares",
                icon: Wrench,
                desc: "lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores officiis expedita laborum consequatur.",
              },
              {
                number: "03",
                title: "Training",
                icon: GraduationCap,
                desc: "lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores officiis expedita laborum consequatur.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="
            relative
            bg-[var(--card)]
            border
            border-[var(--border)]
            rounded-[28px]
            p-8
            overflow-hidden
            transition-all
            duration-500
            hover:-translate-y-3
            hover:border-[var(--primary)]
            hover:shadow-[var(--shadow-primary)]
          "
              >
                {/* BIG NUMBER */}
                <div
                  className="
            absolute
            top-4
            right-5
            text-7xl
            font-black
            text-[var(--primary)]
            opacity-10
          "
                >
                  {item.number}
                </div>

                <div
                  className="
      w-14
      h-14
      rounded-2xl
      bg-[var(--primary)]
      text-white
      flex
      items-center
      justify-center
      shadow-lg
    "
                >
                  <item.icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <p className="mt-4 text-[var(--text-secondary)] leading-7">
                  {item.desc}
                </p>
              </div>
            ))}
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
