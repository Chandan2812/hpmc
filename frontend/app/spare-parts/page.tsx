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

export default function SpareParts() {
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
              Home &gt; Spare Parts
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Spare
              <span className="text-[#65BC4F]"> Parts</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              Genuine spare parts, fast dispatch, and reliable inventory support
              to ensure uninterrupted machine performance and maximum production
              uptime.
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
          <div className="text-center mb-20">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Genuine Components
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold mt-4">
              Reliable
              <span className="text-[var(--primary)]">
                {" "}
                Spare Parts Support
              </span>
            </h2>

            <p className="max-w-3xl mx-auto mt-6 text-[var(--text-secondary)] leading-8">
              We maintain a comprehensive inventory of critical spare parts and
              components to help customers minimize downtime and ensure
              continuous machine operation.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <p className="mt-6 text-[var(--text-secondary)] leading-8">
                HPMC provides complete lifecycle support through genuine spare
                parts, equipment maintenance solutions, technical assistance,
                and customer support services. We understand that even a single
                component failure can disrupt production, which is why
                maintaining the availability of critical spare parts remains one
                of our highest priorities.
              </p>

              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                Our inventory includes essential machine components that are
                readily available for dispatch. Every customer receives detailed
                product documentation with clear spare part identification and
                reference numbers, making the ordering process simple, accurate,
                and efficient. Subject to order confirmation and commercial
                formalities, most spare parts can be dispatched within 24 hours.
              </p>

              {/* CONTACT CARD */}
              <div className="mt-10 bg-[var(--card)] border border-[var(--border)] rounded-[28px] p-6 shadow-[var(--shadow-primary)]">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  Need Spare Parts?
                </h3>

                <p className="mt-3 text-[var(--text-secondary)] leading-7">
                  Contact our support team for spare part identification,
                  pricing, availability, and expedited dispatch assistance.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Email:
                    </span>

                    <span className="text-[var(--primary)]">
                      info@company.com
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Phone:
                    </span>

                    <span className="text-[var(--primary)]">
                      +91 XXXXX XXXXX
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="relative h-[650px] rounded-[32px] overflow-hidden border border-[var(--border)]">
                <Image
                  src="/team.png"
                  alt="Field Services"
                  fill
                  className="object-cover"
                />
              </div>
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
