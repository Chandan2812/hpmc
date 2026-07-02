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
import {
  Cog,
  ShieldCheck,
  Lightbulb,
  Handshake,
  TrendingUp,
  HardHat,
  Factory,
} from "lucide-react";

const features = [
  {
    title: "Engineering Excellence",
    desc: "Precision manufacturing backed by over five decades of industry expertise.",
    icon: Cog,
  },
  {
    title: "Quality",
    desc: "Built with robust engineering standards and rigorous quality control.",
    icon: ShieldCheck,
  },
  {
    title: "Innovation",
    desc: "Advanced extrusion technologies designed for higher productivity.",
    icon: Lightbulb,
  },
  {
    title: "Customer Success",
    desc: "Focused on helping customers build profitable manufacturing businesses.",
    icon: Handshake,
  },
  {
    title: "Reliability",
    desc: "Trusted by manufacturers for long-term performance and support.",
    icon: TrendingUp,
  },
];

export default function About() {
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
            {/* Breadcrumb */}
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; About Us
            </p>

            {/* Heading */}
            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              About <span className="text-[#65BC4F]">HPMC</span>
              <br />
              Extrusion Machinery
            </h1>

            {/* Description */}
            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              For more than five decades, Hindustan Plastics & Machine
              Corporation has been delivering innovative, reliable, and
              high-performance plastic extrusion machinery solutions to
              manufacturers across India and global markets.
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

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 items-stretch">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[var(--primary)] uppercase font-semibold tracking-wider text-sm">
                  OUR STORY
                </span>

                <div className="w-12 h-[2px] bg-[var(--primary)]"></div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-8">
                Engineering Excellence.
                <br />
                Since 1972.
              </h2>

              <p className="text-[var(--text-secondary)] leading-8 mb-6">
                For over 50 years, HPMC has been a trusted name in plastic
                processing and extrusion machinery, helping businesses
                establish, expand, and modernize their manufacturing operations
                with confidence.
              </p>

              <p className="text-[var(--text-secondary)] leading-8 mb-10">
                With more than 1,000 successful installations, we serve
                entrepreneurs, SMEs, and large-scale manufacturers through
                innovative machinery, engineering expertise, and complete
                turnkey manufacturing solutions.
              </p>
            </div>

            {/* CENTER IMAGE */}
            <div className="lg:col-span-5">
              <div className="relative h-[520px] rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow-primary)]">
                <Image
                  src="/images/img1.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* RIGHT IMAGES */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="relative h-[248px] rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow-primary)]">
                <Image
                  src="/images/img2.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative h-[248px] rounded-[var(--radius)] overflow-hidden shadow-[var(--shadow-primary)]">
                <Image
                  src="/images/img3.jpg"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* VALUES */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="text-center px-4">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-[var(--primary)] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[var(--primary)]" />
                  </div>

                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] leading-6">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* WHY CHOOSE SECTION */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{
              backgroundImage: "url('/worldmap.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-10 p-10 lg:p-14">
              <div className="max-w-xl">
                <span className="text-[var(--primary)] font-semibold uppercase tracking-wider text-sm">
                  Why Choose HPMC?
                </span>

                <ul className="mt-6 space-y-4">
                  {[
                    "Proven Industry Experience",
                    "Transparent Business Practices",
                    "Superior Product Quality",
                    "Competitive Pricing",
                    "Timely Project Execution",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-xs">
                        ✓
                      </div>

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className=" mx-auto">
          <div className="relative overflow-hidden  border border-[var(--border)] bg-[var(--card)]">
            <div className="grid lg:grid-cols-2">
              {/* LEFT IMAGE */}
              <div className="relative min-h-[320px] ">
                <Image
                  src="/team.png"
                  alt="Our Team"
                  fill
                  className="object-cover"
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="relative bg-[var(--card)]">
                {/* ANGLED SHAPE */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[80px] bg-[var(--card)] hidden lg:block"
                  style={{
                    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                    transform: "translateX(-79px)",
                  }}
                />

                <div className="h-full flex flex-col justify-center px-8 lg:px-12 py-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[var(--primary)] uppercase font-semibold text-sm tracking-wider">
                      Our People
                    </span>

                    <div className="w-12 h-[2px] bg-[var(--primary)]" />
                  </div>

                  <h2 className="text-2xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight">
                    Built For Performance.
                    <br />
                    <span className="text-[var(--primary)]">
                      Built For Performance.
                    </span>
                  </h2>

                  <p className="mt-4 text-[var(--text-secondary)] leading-8">
                    Our experienced engineers, technicians, and support
                    professionals work together to deliver advanced extrusion
                    solutions that help manufacturers achieve higher efficiency,
                    consistent quality, lower operational costs, and long-term
                    business growth.
                  </p>

                  {/* FEATURES */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-full border border-[var(--border)] flex items-center justify-center mb-3">
                        <HardHat className="w-5 h-5 text-[var(--primary)]" />
                      </div>

                      <h4 className="font-semibold text-[var(--text-primary)]">
                        Experienced
                      </h4>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Engineers
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-full border border-[var(--border)] flex items-center justify-center mb-3">
                        <Cog className="w-5 h-5 text-[var(--primary)]" />
                      </div>

                      <h4 className="font-semibold text-[var(--text-primary)]">
                        Technical
                      </h4>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Experts
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-full border border-[var(--border)] flex items-center justify-center mb-3">
                        <Factory className="w-5 h-5 text-[var(--primary)]" />
                      </div>

                      <h4 className="font-semibold text-[var(--text-primary)]">
                        Industry
                      </h4>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Specialists
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-full border border-[var(--border)] flex items-center justify-center mb-3">
                        <Handshake className="w-5 h-5 text-[var(--primary)]" />
                      </div>

                      <h4 className="font-semibold text-[var(--text-primary)]">
                        Dedicated
                      </h4>

                      <p className="text-sm text-[var(--text-secondary)]">
                        Support Team
                      </p>
                    </div>
                  </div>
                </div>
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
