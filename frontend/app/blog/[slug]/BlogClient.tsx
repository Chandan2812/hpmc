"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LeadForm2 from "@/app/components/LeadForm2";
import Navbar from "@/app/components/Navbar";
import CTA from "@/app/components/CTA";
import Footer from "@/app/components/Footer";
import PopupForm from "@/app/components/Popup";
import ScrollToTop from "@/app/components/ScrollToTop";
import FloatingContact from "@/app/components/FloatingButton";

interface RelatedBlogType {
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  datePublished: string;
  author?: string;
}

export default function BlogClient({
  blog,
  relatedBlogs,
}: {
  blog: any;
  relatedBlogs: RelatedBlogType[];
}) {
  const [openPopup, setOpenPopup] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  /* popup buttons inside blog html */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-open-popup='true']")) {
        setOpenPopup(true);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="bg-[var(--background)] min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="pt-20 py-7 border-b border-[var(--border)]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <h1 className="font-serif text-[38px] md:text-[50px] lg:text-[60px] leading-[1.15] text-[var(--text-primary)] max-w-5xl">
            {" "}
            {blog.title}
          </h1>

          <p className="mt-5 text-[var(--text-light)] text-sm md:text-base">
            By{" "}
            <span className="text-[var(--text-primary)] font-medium">
              {" "}
              {blog.author || "Bigwig Team"}
            </span>{" "}
            • {new Date(blog.datePublished).toLocaleDateString()}
          </p>
        </div>
      </section>

      {/* COVER IMAGE */}
      {blog.coverImage && (
        <section className="py-5">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="relative h-[280px] sm:h-[420px] md:h-[550px] lg:h-[650px] rounded-2xl overflow-hidden">
              <Image
                src={blog.coverImage}
                alt={blog.coverImageAlt || blog.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* CONTENT */}
      <section className="pb-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* BLOG CONTENT */}
          <article className="lg:col-span-3">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-10 shadow-[var(--shadow-primary)]">
              {" "}
              <div
                className="blog-content text-[var(--text-primary)]"
                dangerouslySetInnerHTML={{
                  __html: blog.content,
                }}
              />
            </div>
            {/* FAQ SECTION */}
            {blog.faqs && blog.faqs.length > 0 && (
              <section className="mt-10">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-[24px] p-6 md:p-10 shadow-[var(--shadow-primary)]">
                  <div className="mb-8">
                    <span className="text-[var(--primary)] uppercase tracking-[3px] text-sm font-semibold">
                      FAQs
                    </span>

                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
                      Frequently Asked Questions
                    </h2>

                    <p className="mt-3 text-[var(--text-secondary)]">
                      Find quick answers to the most common questions about this
                      topic.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {blog.faqs.map((faq: any, index: number) => {
                      const isOpen = openIndex === index;

                      return (
                        <div
                          key={index}
                          className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                            isOpen
                              ? "border-[var(--primary)]"
                              : "border-[var(--border)]"
                          }`}
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full flex items-center justify-between gap-4 p-5 text-left bg-[var(--card)] hover:bg-[var(--muted)] transition-all"
                          >
                            <span className="font-semibold text-[var(--text-primary)] text-base md:text-lg">
                              {faq.question}
                            </span>

                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                                isOpen
                                  ? "bg-[var(--primary)] text-white rotate-45"
                                  : "bg-[var(--muted)] text-[var(--text-primary)]"
                              }`}
                            >
                              +
                            </div>
                          </button>

                          <div
                            className={`grid transition-all duration-300 ease-in-out ${
                              isOpen
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="px-5 pb-5 border-t border-[var(--border)]">
                                <p className="pt-4 text-[var(--text-secondary)] leading-8">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-28 space-y-8">
              <LeadForm2 />

              {/* RELATED BLOGS */}
              {relatedBlogs?.length > 0 && (
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-[24px] overflow-hidden shadow-[var(--shadow-primary)]">
                  {/* Header */}
                  <div className="p-6 border-b border-[var(--border)]">
                    <span className="text-[var(--primary)] uppercase tracking-[3px] text-xs font-semibold">
                      More Articles
                    </span>

                    <h3 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                      Related Articles
                    </h3>
                  </div>

                  {/* Articles */}
                  <div className="divide-y divide-[var(--border)]">
                    {relatedBlogs.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/blog/${item.slug}`}
                        className="group flex gap-4 p-5 hover:bg-[var(--muted)] transition-all duration-300"
                      >
                        {/* Image */}
                        {item.coverImage && (
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                            <Image
                              src={item.coverImage}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition duration-500"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs uppercase tracking-[2px] text-[var(--primary)] font-medium mb-2">
                            Blog
                          </p>

                          <h4 className="line-clamp-2 text-[var(--text-primary)] font-semibold leading-6 group-hover:text-[var(--primary)] transition">
                            {item.title}
                          </h4>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm text-[var(--text-light)]">
                              {new Date(
                                item.datePublished,
                              ).toLocaleDateString()}
                            </span>

                            <span className="text-[var(--primary)] text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                              Read →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <CTA />

      <Footer />
      <ScrollToTop />
      <FloatingContact />
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
}
