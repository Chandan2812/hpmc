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

const leaders = [
  {
    name: "John Doe",
    designation: "Managing Director",
    image: "/team1.png",
  },
  {
    name: "Jane Smith",
    designation: "Director - Operations",
    image: "/team2.png",
  },
  {
    name: "Robert Wilson",
    designation: "Technical Director",
    image: "/team3.png",
  },
  {
    name: "Michael Brown",
    designation: "Global Sales Head",
    image: "/team2.png",
  },
];

export default function LeadershipTeam() {
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
              Home &gt; Leadership Team
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              The People Behind
              <span className="text-[#65BC4F]"> Our Success</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              For over five decades, our leadership team has guided HPMC with a
              vision of innovation, excellence, and customer success. Their
              expertise and commitment continue to drive sustainable growth
              across global markets.
            </p>

            <button
              onClick={() => setOpenPopup(true)}
              className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg mt-8"
            >
              <span className="text-white font-semibold uppercase text-sm">
                Connect With Our Team
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] rounded-[40px] overflow-hidden">
              <Image
                src="/team.png"
                fill
                alt="Leadership Team"
                className="object-cover"
              />
            </div>

            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Leadership Excellence
              </span>

              <h2 className="text-5xl font-bold mt-4">
                Leading With Vision,
                <span className="text-[var(--primary)]">
                  {" "}
                  Building With Purpose
                </span>
              </h2>

              <p className="mt-6 text-[var(--text-secondary)] leading-8">
                Our leadership team combines decades of industry expertise,
                engineering excellence, and strategic thinking to ensure every
                solution we deliver creates value for our customers.
              </p>

              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                Through innovation, quality, and customer-first decision making,
                they continue to guide HPMC toward new opportunities and global
                growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]/80">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Meet The Leaders
            </span>

            <h2 className="text-5xl font-bold mt-4">
              Driving Innovation Every Day
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leaders.map((leader) => (
              <div className="group bg-[var(--card)] rounded-3xl overflow-hidden shadow-lg">
                <div className="relative h-[380px] overflow-hidden">
                  <Image
                    src={leader.image}
                    fill
                    alt={leader.name}
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold">{leader.name}</h3>

                  <p className="text-[var(--primary)] mt-2">
                    {leader.designation}
                  </p>
                </div>
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
