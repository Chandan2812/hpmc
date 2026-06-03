"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LeadForm from "../components/LeadForm";
import ScrollToTop from "../components/ScrollToTop";
import CTA from "../components/CTA";
import FloatingContact from "../components/FloatingButton";
import Footer from "../components/Footer";
import PopupForm from "../components/Popup";
import Navbar from "../components/Navbar";
import LeadForm2 from "../components/LeadForm2";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  datePublished: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const BLOGS_PER_PAGE = 10;

/* ================= SKELETON ================= */

function BlogSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 grid grid-cols-1 lg:grid-cols-5 gap-12">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] overflow-hidden animate-pulse"
          >
            {/* Image */}
            <div className="h-64 bg-[var(--muted)]" />

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="h-3 w-20 rounded-full bg-[var(--primary)]/20" />

              <div className="h-6 w-3/4 rounded bg-[var(--muted)]" />

              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[var(--muted)]" />
                <div className="h-4 w-5/6 rounded bg-[var(--muted)]" />
                <div className="h-4 w-2/3 rounded bg-[var(--muted)]" />
              </div>

              <div className="h-4 w-24 rounded bg-[var(--muted)]" />
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Skeleton */}
      <div className="lg:col-span-2">
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--card)] p-8 animate-pulse">
          <div className="h-8 w-40 rounded bg-[var(--muted)] mb-6" />

          <div className="space-y-3 mb-8">
            <div className="h-4 rounded bg-[var(--muted)]" />
            <div className="h-4 rounded bg-[var(--muted)]" />
            <div className="h-4 w-3/4 rounded bg-[var(--muted)]" />
          </div>

          <div className="h-12 rounded-xl bg-[var(--muted)] mb-4" />
          <div className="h-12 rounded-xl bg-[var(--muted)] mb-4" />
          <div className="h-32 rounded-xl bg-[var(--muted)] mb-4" />
          <div className="h-12 rounded-xl bg-[var(--primary)]/20" />
        </div>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function BlogPage() {
  const [openPopup, setOpenPopup] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE}/blog/viewblog`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (res.ok) {
          setBlogs(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);

  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * BLOGS_PER_PAGE,
    currentPage * BLOGS_PER_PAGE,
  );

  return (
    <div className="bg-[var(--bg)]">
      <Navbar />

      {/* HERO */}
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
            <p className="text-[var(--primary)] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; Blogs
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[var(--text-primary)]">
              Latest
              <span className="text-[var(--primary)]"> Insights</span>
            </h1>

            <p className="mt-6 text-[var(--text-secondary)] text-sm md:text-base leading-7 max-w-[550px]">
              Explore industry trends, expert opinions, practical guides, and
              valuable insights designed to help businesses stay informed,
              innovate faster, and achieve sustainable growth.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[var(--primary)] hover:opacity-90 transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Let's Talk
                </span>

                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-24 bg-[var(--background)]">
        {/* LOADING */}
        {loading && <BlogSkeleton />}

        {/* EMPTY STATE */}
        {!loading && blogs.length === 0 && (
          <div className="max-w-3xl mx-auto px-5">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] p-12 text-center shadow-[var(--shadow-primary)]">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>

              <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                Blogs Coming Soon
              </h2>

              <p className="text-[var(--text-secondary)] text-lg leading-8 max-w-xl mx-auto mb-10">
                We're preparing insightful articles, industry trends, expert
                opinions, and business growth strategies. Stay connected for
                valuable content and updates.
              </p>

              <button
                onClick={() => setOpenPopup(true)}
                className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl hover:opacity-90 transition-all"
              >
                Start a Conversation
              </button>
            </div>
          </div>
        )}

        {/* BLOGS */}
        {!loading && blogs.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            {/* BLOG GRID */}
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-8">
                {paginatedBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog.slug}`}
                    className="group"
                  >
                    <article className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-[var(--shadow-primary)] transition-all duration-500">
                      {/* IMAGE */}
                      <div className="relative h-[340px] overflow-hidden">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-700"
                        />

                        {/* DARK OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-all duration-500" />

                        {/* HOVER CONTENT */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                          <h3 className="text-2xl font-bold text-white line-clamp-2">
                            {blog.title}
                          </h3>

                          <p className="mt-4 text-white/80 leading-7 line-clamp-3 opacity-0 group-hover:opacity-100 transition duration-500">
                            {blog.excerpt}
                          </p>

                          <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100">
                            <span className="text-white/70 text-sm">
                              {new Date(
                                blog.datePublished,
                              ).toLocaleDateString()}
                            </span>

                            <span className="text-[var(--primary)] font-semibold">
                              Read More →
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="h-12 px-6 rounded-xl border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 transition-all"
                  >
                    Previous
                  </button>

                  <div className="h-12 min-w-[50px] px-4 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-medium">
                    {currentPage}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="h-12 px-6 rounded-xl border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-40 transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-[24px] p-8 shadow-[var(--shadow-primary)]">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                    Need Assistance?
                  </h3>

                  <p className="text-[var(--text-secondary)] leading-7 mb-8">
                    Have questions about our services or need expert guidance?
                    Fill out the form and our team will get back to you shortly.
                  </p>

                  <LeadForm2 />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
}
