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

export default function Memberships() {
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
              Home &gt; Memberships
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Trusted By
              <span className="text-[#65BC4F]"> Industry Associations</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              Our memberships with leading industry organizations reflect our
              commitment to engineering excellence, innovation, quality
              standards, and continuous advancement within the global plastics
              and extrusion manufacturing sector.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-5">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Partner With Us
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
                Professional Memberships
              </span>

              <h2 className="text-5xl lg:text-6xl font-bold mt-4">
                Connected To The
                <span className="text-[var(--primary)]"> Global Industry</span>
              </h2>

              <p className="mt-8 text-[var(--text-secondary)] leading-8">
                HPMC actively participates in professional and industrial
                associations that promote technological innovation,
                manufacturing excellence, and sustainable industry growth.
              </p>

              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                These memberships help us stay aligned with evolving industry
                standards while strengthening our global network of partners,
                customers, and experts.
              </p>
            </div>

            <div className="relative h-[500px] rounded-[40px] overflow-hidden">
              <Image src="/team.png" fill alt="" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Membership Benefits
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold mt-4">
              Why Industry
              <span className="text-[var(--primary)]"> Memberships Matter</span>
            </h2>

            <p className="max-w-3xl mx-auto mt-6 text-[var(--text-secondary)] leading-8">
              Our association with leading industry organizations helps us stay
              connected with global trends, technological advancements, and best
              manufacturing practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                no: "01",
                title: "Industry Recognition",
                desc: "Memberships reinforce our credibility and commitment to maintaining the highest standards of manufacturing excellence.",
              },
              {
                no: "02",
                title: "Global Networking",
                desc: "Build relationships with industry leaders, partners, suppliers, and customers across international markets.",
              },
              {
                no: "03",
                title: "Technology Updates",
                desc: "Stay informed about emerging technologies, innovations, and future developments in extrusion manufacturing.",
              },
              {
                no: "04",
                title: "Quality Standards",
                desc: "Align our operations with recognized industry practices, certifications, and regulatory requirements.",
              },
            ].map((item) => (
              <div
                key={item.no}
                className="group relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)] p-10 hover:-translate-y-2 transition duration-500"
              >
                <span className="absolute top-5 right-6 text-7xl font-black text-[var(--primary)]/10">
                  {item.no}
                </span>

                <h3 className="text-3xl font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>

                <p className="mt-5 text-[var(--text-secondary)] leading-8">
                  {item.desc}
                </p>

                <div className="w-12 h-1 bg-[var(--primary)] mt-8 group-hover:w-24 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0B1220]">
        <div className="max-w-5xl mx-auto text-center px-5">
          <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
            Industry Commitment
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold text-white mt-5">
            Strengthening Industry
            <span className="text-[var(--primary)]"> Collaboration</span>
          </h2>

          <p className="mt-8 text-lg text-gray-400 leading-8">
            Through active participation in respected organizations, we
            contribute to the advancement of extrusion technology, manufacturing
            best practices, and sustainable industrial growth.
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
