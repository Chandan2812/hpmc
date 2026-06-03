"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import Footer from "../components/Footer";
import { BiMobile } from "react-icons/bi";
import LeadForm from "../components/LeadForm";
import PopupForm from "../components/Popup";
import CTA from "../components/CTA";
import ScrollToTop from "../components/ScrollToTop";
import FloatingContact from "../components/FloatingButton";

const Contact = () => {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <>
      <div className="relative">
        <Navbar />

        {/* ================= HERO ================= */}
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
                Home &gt; Contact
              </p>

              <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
                Start A<span className="text-[#65BC4F]"> Conversation</span>
              </h1>

              <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
                Connect with our experts for technical assistance, product
                inquiries, service support, and customized industrial solutions.
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

        {/* ================= CONTACT SECTION ================= */}
        <section className="py-24 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[var(--primary)] uppercase tracking-[3px] text-sm font-semibold">
                Get In Touch
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
                We're Here To Help
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-2xl bg-[#65BC4F]/10 flex items-center justify-center mb-6">
                  <MapPin className="text-[#65BC4F]" size={28} />
                </div>

                <h3 className="text-xl font-semibold mb-3">Address</h3>

                <p className="text-[var(--text-secondary)]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
                  repellendus.
                </p>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-2xl bg-[#65BC4F]/10 flex items-center justify-center mb-6">
                  <Phone className="text-[#65BC4F]" size={28} />
                </div>

                <h3 className="text-xl font-semibold mb-3">Call Us</h3>

                <p className="text-[var(--text-secondary)]">+91 9876543210</p>

                <p className="text-[var(--text-secondary)]">0987 654 3210</p>
              </div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-2xl bg-[#65BC4F]/10 flex items-center justify-center mb-6">
                  <Mail className="text-[#65BC4F]" size={28} />
                </div>

                <h3 className="text-xl font-semibold mb-3">Email</h3>

                <p className="text-[var(--text-secondary)]">info@company.com</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[var(--muted)]">
          <div className="max-w-5xl mx-auto px-5 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[var(--primary)] uppercase tracking-[3px] text-sm font-semibold">
                Send Inquiry
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-4">
                Request A Consultation
              </h2>

              <p className="mt-4 text-[var(--text-secondary)]">
                Fill out the form and our team will get back to you shortly.
              </p>
            </div>

            <div className="bg-[var(--card)] rounded-[32px] p-8 md:p-12 shadow-[var(--shadow-primary)] border border-[var(--border)]">
              <LeadForm />
            </div>
          </div>
        </section>

        {/* ================= MAP ================= */}
        <section className="relative h-[420px]" data-aos="zoom-in">
          <iframe
            src="https://maps.google.com/maps?q=Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="600"
            height="450"
            loading="lazy"
            className="w-full"
          />
        </section>
        <CTA />
        <ScrollToTop />
        <FloatingContact />
        <Footer />
        <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
      </div>
    </>
  );
};

export default Contact;
