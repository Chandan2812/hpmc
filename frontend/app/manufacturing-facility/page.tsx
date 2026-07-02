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
import DemoPopup from "../components/PopupDemo";

export default function ManufacturingFacility() {
  const facilityStats = [
    {
      title: "50,000+ Sq Ft",
      description: "Modern Manufacturing Space",
    },
    {
      title: "CNC Machining",
      description: "Precision Component Manufacturing",
    },
    {
      title: "Quality Testing",
      description: "End-to-End Inspection Systems",
    },
    {
      title: "Global Standards",
      description: "Built For International Markets",
    },
  ];

  const facilityImages = [
    "/images/img4.jpg",
    "/images/img5.jpg",
    "/images/img7.jpg",
    "/images/img10.jpg",
    "/images/img11.jpg",
    "/images/img12.jpg",
    "/images/img13.jpg",
    "/images/img14.jpg",
    "/images/img15.jpg",
  ];

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
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; Manufacturing Facility
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Built For
              <span className="text-[#65BC4F]"> Precision Manufacturing</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[540px]">
              Our state-of-the-art manufacturing facility combines advanced
              machinery, skilled engineering expertise, and stringent quality
              control systems to deliver world-class extrusion solutions trusted
              across global markets.
            </p>

            <button
              onClick={() => setOpenPopup(true)}
              className="mt-8 flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
            >
              <span className="text-white font-semibold uppercase text-sm">
                Schedule A Factory Visit
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[650px] rounded-[40px] overflow-hidden">
              <Image
                src="/team.png"
                fill
                alt="Manufacturing Facility"
                className="object-cover"
              />
            </div>

            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Our Infrastructure
              </span>

              <h2 className="text-5xl font-bold mt-4">
                Engineered For
                <span className="text-[var(--primary)]"> Quality & Scale</span>
              </h2>

              <p className="mt-6 text-[var(--text-secondary)] leading-8">
                Spread across a modern production facility, HPMC manufactures
                high-performance extrusion machinery using advanced
                manufacturing processes and globally sourced components.
              </p>

              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                Every machine undergoes rigorous quality inspections,
                performance testing, and precision assembly before delivery to
                ensure long-term reliability and operational excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Facility Highlights
            </span>

            <h2 className="text-5xl font-bold text-white mt-4">
              Manufacturing Excellence
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilityStats.map((item) => (
              <div className="border border-white/10 rounded-3xl p-8">
                <h3 className="text-[var(--primary)] text-3xl font-bold">
                  {item.title}
                </h3>

                <p className="text-gray-300 mt-4">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Production Process
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold mt-4">
              From Concept To
              <span className="text-[var(--primary)]"> Commissioning</span>
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-[var(--text-secondary)] leading-8">
              Every extrusion system undergoes a carefully controlled
              manufacturing process to ensure precision engineering, superior
              quality, and long-term operational reliability.
            </p>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="hidden lg:block absolute top-[85px] left-0 w-full h-[2px] bg-[var(--border)]" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  no: "01",
                  title: "Engineering Design",
                  desc: "Detailed machine design and technical planning based on customer requirements.",
                },
                {
                  no: "02",
                  title: "Precision Manufacturing",
                  desc: "Advanced machining, fabrication, and assembly using modern production equipment.",
                },
                {
                  no: "03",
                  title: "Quality Testing",
                  desc: "Comprehensive inspection and performance validation before dispatch.",
                },
                {
                  no: "04",
                  title: "Installation & Support",
                  desc: "Commissioning, training, and after-sales assistance for smooth operations.",
                },
              ].map((item) => (
                <div key={item.no} className="relative group">
                  {/* Card */}
                  <div className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] p-8 h-full shadow-lg hover:-translate-y-3 transition duration-500">
                    <span className="text-6xl font-black text-[var(--primary)]/20">
                      {item.no}
                    </span>

                    <h3 className="text-2xl font-bold mt-4 text-[var(--text-primary)]">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-[var(--text-secondary)] leading-7">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--background)]/80">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Facility Gallery
            </span>

            <h2 className="text-5xl font-bold mt-4">
              Inside Our Manufacturing Plant
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilityImages.map((img, index) => (
              <div className="relative h-[350px] rounded-3xl overflow-hidden">
                <Image
                  src={img}
                  fill
                  alt=""
                  className="object-cover hover:scale-105 transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <DemoPopup open={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
}
