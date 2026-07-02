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

export default function CurrentOpening() {
  const [openPopup, setOpenPopup] = useState(false);
  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/career/active`,
        );

        const result = await res.json();

        setOpenings(result.data || []);
      } catch (error) {
        console.error("Career Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpenings();
  }, []);

  return (
    <div>
      <Navbar />

      <section className="relative w-full min-h-[650px] lg:h-screen overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/herosection/career.png')",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
          <div className="max-w-[520px] pt-24 lg:pt-0">
            {/* Heading */}
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; Current Openings
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Current
              <span className="text-[#65BC4F]"> Openings</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              Join our growing team and build a rewarding career in the plastic
              extrusion machinery industry. Explore available opportunities and
              become part of our innovation-driven organization.
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

      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Careers
            </span>

            <h2 className="text-5xl lg:text-6xl font-bold mt-4 text-[var(--text-primary)]">
              Current
              <span className="text-[var(--primary)]"> Openings</span>
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-[var(--text-secondary)] leading-8">
              Explore exciting career opportunities and join our growing team.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <p className="text-[var(--text-secondary)]">
                Loading openings...
              </p>
            </div>
          ) : openings.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {openings.map((job: any) => (
                <div
                  key={job._id}
                  className="
    group
    relative
    overflow-hidden
    rounded-[32px]
    border
    border-[var(--border)]
    bg-[var(--card)]
    p-8
    transition-all
    duration-300
    hover:-translate-y-2
    hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
  "
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--primary)]" />

                  <div className="flex items-center justify-between mb-6">
                    <span className="px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold">
                      {job.department}
                    </span>

                    <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-xs">
                      {job.employmentType}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap gap-5 text-sm text-[var(--text-secondary)] mb-5">
                    <span>📍 {job.location}</span>

                    <span>💼 {job.experience || "Freshers Welcome"}</span>
                  </div>

                  <p className="text-[var(--text-secondary)] leading-7 line-clamp-3">
                    {job.description}
                  </p>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="
        flex-1
        h-12
        rounded-xl
        border
        border-[var(--primary)]
        text-[var(--primary)]
        font-semibold
        hover:bg-[var(--primary)]
        hover:text-white
        transition
      "
                    >
                      View Details
                    </button>

                    <Link
                      href={`/submit-resume?careerId=${job._id}`}
                      className="
        flex-1
        h-12
        rounded-xl
        bg-[var(--primary)]
        text-white
        font-semibold
        flex
        items-center
        justify-center
        hover:opacity-90
        transition
      "
                    >
                      Apply →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
          relative
          overflow-hidden
          rounded-[40px]
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-10
          lg:p-20
          text-center
        "
            >
              <div className="relative z-10">
                <div
                  className="
              w-28
              h-28
              mx-auto
              rounded-full
              bg-[var(--primary)]/10
              flex
              items-center
              justify-center
              mb-8
            "
                >
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="text-[var(--primary)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M4 16l4-4 4 4 8-8M4 20h16"
                    />
                  </svg>
                </div>

                <h3 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                  No Open Positions Available Right Now
                </h3>

                <p className="max-w-2xl mx-auto mt-6 text-[var(--text-secondary)] leading-8">
                  We currently do not have any active job openings. However, you
                  can still submit your resume and our HR team will contact you
                  when a suitable opportunity becomes available.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedJob && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-[32px] bg-[var(--card)] border border-[var(--border)] shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
            {/* Close */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white transition-all"
            >
              ✕
            </button>

            {/* Header */}
            <div className="px-8 md:px-10 py-8 border-b border-[var(--border)]">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium">
                  {selectedJob.department}
                </span>

                <span className="px-3 py-1 rounded-full border border-[var(--border)] text-xs text-[var(--text-secondary)]">
                  {selectedJob.employmentType}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                {selectedJob.title}
              </h2>

              <p className="mt-2 text-[var(--text-secondary)]">
                Explore this opportunity and become part of our growing team.
              </p>
            </div>

            {/* Body */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-8 p-6 md:p-8">
              {/* LEFT */}
              <div className="space-y-6">
                {/* About */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
                    About This Role
                  </h3>

                  <p className="leading-8 text-[var(--text-secondary)] whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Responsibilities */}
                {selectedJob.responsibilities?.length > 0 && (
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-5">
                      Responsibilities
                    </h3>

                    <div className="space-y-3">
                      {selectedJob.responsibilities.map(
                        (item: string, index: number) => (
                          <div
                            key={index}
                            className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-xs flex-shrink-0">
                              ✓
                            </div>

                            <p className="text-[var(--text-secondary)]">
                              {item}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {selectedJob.requirements?.length > 0 && (
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-6">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-5">
                      Requirements
                    </h3>

                    <div className="space-y-3">
                      {selectedJob.requirements.map(
                        (item: string, index: number) => (
                          <div
                            key={index}
                            className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
                          >
                            <div className="w-6 h-6 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center text-xs flex-shrink-0">
                              ✓
                            </div>

                            <p className="text-[var(--text-secondary)]">
                              {item}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="space-y-5">
                {/* Job Details */}
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-6">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-5">
                    Job Details
                  </h3>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                        Location
                      </p>

                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        {selectedJob.location}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                        Experience
                      </p>

                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        {selectedJob.experience || "Freshers Welcome"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                        Employment Type
                      </p>

                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        {selectedJob.employmentType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                        Department
                      </p>

                      <p className="mt-1 font-medium text-[var(--text-primary)]">
                        {selectedJob.department}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Apply Card */}
                <div className="rounded-3xl bg-[var(--primary)] p-6 text-white">
                  <h3 className="text-xl font-bold">Ready to Apply?</h3>

                  <p className="mt-2 text-sm text-white/80">
                    Take the next step in your career and join our team.
                  </p>

                  <Link
                    href={`/submit-resume?careerId=${selectedJob._id}`}
                    className="mt-5 h-12 rounded-xl bg-white text-[var(--primary)] font-semibold flex items-center justify-center"
                  >
                    Apply Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
}
