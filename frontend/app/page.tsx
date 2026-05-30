"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import CTA from "./components/CTA";
import Clients from "./components/Client";
import PopupForm from "./components/Popup";
import { useEffect, useState } from "react";
import FloatingContact from "./components/FloatingButton";
import { Quote, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    name: "John Smith",
    company: "ABC Industries",
    review:
      "Their team delivered our project ahead of schedule with exceptional quality. Communication was seamless throughout the entire process.",
  },
  {
    name: "Sarah Johnson",
    company: "Global Manufacturing",
    review:
      "Professional, reliable, and highly skilled. We have worked together on multiple projects and the results have always exceeded expectations.",
  },
  {
    name: "Michael Brown",
    company: "Tech Solutions Ltd",
    review:
      "Outstanding service and technical expertise. Their attention to detail and commitment to quality truly set them apart.",
  },
  {
    name: "Emma Wilson",
    company: "Future Engineering",
    review:
      "The entire experience was fantastic. From planning to execution, everything was handled professionally and efficiently.",
  },
];

interface CounterProps {
  end: number;
  suffix?: string;
}

export default function Home() {
  const [openPopup, setOpenPopup] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("popupShown");

    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setOpenPopup(true);
      sessionStorage.setItem("popupShown", "true");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div>
      <Navbar />
      <section className="relative w-full h-[50vh] lg:h-[100vh] overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/home-hero.png')",
          }}
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/10" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-full flex items-center">
          {/* CONTENT BOX */}
          <div className="max-w-[620px] w-full mt-16 sm:mt-20 md:mt-24 lg:mt-0">
            {/* SMALL TEXT */}
            <p className="text-[#65BC4F] font-semibold uppercase tracking-[2px] mb-2 text-[10px] sm:text-xs md:text-sm">
              Extrusion Redefined
            </p>

            {/* HEADING */}
            <h1 className="text-[22px] sm:text-[34px] md:text-[46px] lg:text-[68px] leading-[1.05] font-bold text-[#0B1220]">
              Precision.
              <br />
              Performance.
              <br />
              <span className="text-[#65BC4F]">Possibilities.</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-3 sm:mt-4 text-[12px] sm:text-[14px] md:text-[16px] leading-[22px] md:leading-[28px] text-gray-700 max-w-[520px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              voluptatibus.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-row gap-3 mt-5">
              {/* BUTTON 1 */}
              <Link href="/products">
                {" "}
                <button className="flex items-center justify-center gap-3 bg-[#65BC4F] hover:bg-lime-600 transition px-5 py-2.5 rounded-lg group w-full sm:w-auto">
                  <span className="uppercase text-white font-semibold text-xs sm:text-sm">
                    Explore Products
                  </span>

                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-sm">→</span>
                  </div>
                </button>
              </Link>

              {/* BUTTON 2 */}
              <button
                onClick={() => setOpenVideo(true)}
                className="flex items-center justify-center gap-3 border border-gray-300 hover:border-[#65BC4F] transition px-5 py-2.5 rounded-lg group bg-white/70 backdrop-blur-sm w-full sm:w-auto"
              >
                <span className="uppercase font-semibold text-xs sm:text-sm text-black group-hover:text-lime-600">
                  Watch Video
                </span>

                <div className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#65BC4F]">
                  <span className="text-xs text-black group-hover:text-lime-600">
                    ▶
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[var(--card)] shadow-[var(--shadow-primary)] border border-[var(--border)] overflow-hidden ">
            {/* GRID */}
            <div className="grid grid-cols-4 md:grid-cols-5">
              {/* ITEM */}
              <div className="flex flex-col items-center text-center p-5 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                {/* ICON */}
                <div className="relative w-[58px] h-[58px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mb-4">
                  <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-[62px] h-[31px] border-t-[3px] border-[var(--primary)] rounded-t-full" />
                  <span className="text-2xl">🏆</span>
                </div>

                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  <Counter end={50} suffix="+" />
                </h3>

                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-6">
                  Years of Experience
                </p>
              </div>

              {/* ITEM */}
              <div className="flex flex-col items-center text-center p-5 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                <div className="relative w-[58px] h-[58px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mb-4">
                  <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-[62px] h-[31px] border-t-[3px] border-[var(--primary)] rounded-t-full" />
                  <span className="text-2xl">⚙️</span>
                </div>

                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  <Counter end={12000} suffix="+" />
                </h3>

                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-6">
                  Machines Installed
                </p>
              </div>

              {/* ITEM */}
              <div className="flex flex-col items-center text-center p-5 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                <div className="relative w-[58px] h-[58px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mb-4">
                  <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-[62px] h-[31px] border-t-[3px] border-[var(--primary)] rounded-t-full" />
                  <span className="text-2xl">🌍</span>
                </div>

                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  <Counter end={80} suffix="+" />
                </h3>

                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-6">
                  Countries Worldwide
                </p>
              </div>

              {/* ITEM */}
              <div className="hidden md:flex flex-col items-center text-center p-5 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                <div className="relative w-[58px] h-[58px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mb-4">
                  <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-[62px] h-[31px] border-t-[3px] border-[var(--primary)] rounded-t-full" />
                  <span className="text-2xl">👨‍🔧</span>
                </div>

                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  <Counter end={100} suffix="+" />
                </h3>

                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-6">
                  Expert Engineers
                </p>
              </div>

              {/* ITEM */}
              <div className="flex flex-col items-center text-center p-5 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                <div className="relative w-[58px] h-[58px] rounded-full border-2 border-[var(--border)] flex items-center justify-center mb-4">
                  <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-[62px] h-[31px] border-t-[3px] border-[var(--primary)] rounded-t-full" />
                  <span className="text-2xl">🎯</span>
                </div>

                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  <Counter end={100} suffix="%" />
                </h3>

                <p className="text-sm text-[var(--text-secondary)] mt-1 leading-6">
                  Customer Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16  overflow-hidden bg-[var(--background)]">
        {/* DARK GRADIENT ONLY FOR DARK MODE */}
        <div className="absolute inset-0 dark:bg-[var(--gradient-dark)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* LEFT CONTENT */}
            <div>
              <p className="text-[var(--primary)] font-semibold uppercase tracking-[2px] text-sm">
                About HPMC
              </p>

              <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-[var(--foreground)]">
                Redefining Extrusion
                <br />
                Since <span className="text-[var(--primary)]">1971</span>
              </h2>

              <p className="mt-4 text-[15px] md:text-[17px] leading-8 text-[var(--text-secondary)] max-w-[620px]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
                ratione illum eaque architecto doloremque, dignissimos
                voluptatem beatae autem molestiae.
              </p>

              {/* FEATURES */}
              <div className="mt-4 space-y-2">
                {[
                  "Lorem ipsum dolor sit amet consectetur",
                  "Lorem ipsum dolor sit amet adipisicing elit",
                  "Lorem ipsum dolor sit amet consectetur elit",
                  "Lorem ipsum dolor sit amet consectetur",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm">
                      ✓
                    </div>

                    <p className="text-[var(--text-primary)]">{item}</p>
                  </div>
                ))}
              </div>

              {/* BUTTON */}
              <Link href="/about">
                <button className="mt-5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition px-8 py-4 rounded-xl text-white font-semibold uppercase tracking-wide flex items-center gap-3">
                  Know More About Us
                  <span>→</span>
                </button>
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative hidden md:block">
              <div className="relative overflow-hidden rounded-[30px] border border-[var(--border)]">
                <img
                  src="/product.jpg"
                  alt="about"
                  className="w-full h-[400px] md:h-[480px] object-cover"
                />

                {/* LIGHT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:from-black/50" />
              </div>

              {/* FLOATING CARD */}
              <div className="absolute bottom-6 left-6 right-6 md:w-[320px] bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-primary)]">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  50+ Years
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                  molestiae dolores eaque.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TOP CONTENT */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            {/* LEFT SIDE */}
            <div className="max-w-3xl">
              <p className="text-[var(--primary)] font-semibold uppercase tracking-[2px] text-sm">
                Our Products
              </p>

              <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                Engineered For Every Need
              </h2>

              {/* LINE */}
              <div className="w-16 h-[3px] bg-[var(--primary)] mt-4 rounded-full" />

              <p className="mt-5 text-[15px] md:text-[17px] leading-8 text-[var(--text-secondary)] max-w-2xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
                architecto cupiditate modi nostrum accusamus reprehenderit
                possimus, voluptas magni pariatur necessitatibus.
              </p>
            </div>

            {/* RIGHT SIDE BUTTON */}
            <div className="flex lg:justify-end">
              <Link href="/products">
                <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition px-8 py-4 rounded-xl text-white font-semibold uppercase tracking-wide flex items-center gap-3 whitespace-nowrap">
                  View All Products
                  <span>→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD */}
            <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-[var(--shadow-primary)] transition duration-300 group">
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src="/product.jpg"
                  alt="product"
                  className="w-full h-[220px] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="relative px-5 pt-10 pb-6">
                {/* ICON */}
                <div className="absolute -top-8 left-5 w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">⚙️</span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Pipe Extrusion Lines
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempore, exercitationem.
                </p>

                <button className="mt-5 text-[var(--primary)] font-semibold text-sm uppercase flex items-center gap-2 hover:gap-3 transition-all">
                  View Details
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-[var(--shadow-primary)] transition duration-300 group">
              <div className="overflow-hidden">
                <img
                  src="/product.jpg"
                  alt="product"
                  className="w-full h-[220px] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="relative px-5 pt-10 pb-6">
                <div className="absolute -top-8 left-5 w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🏭</span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Profile Extrusion
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempore, exercitationem.
                </p>

                <button className="mt-5 text-[var(--primary)] font-semibold text-sm uppercase flex items-center gap-2 hover:gap-3 transition-all">
                  View Details
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-[var(--shadow-primary)] transition duration-300 group">
              <div className="overflow-hidden">
                <img
                  src="/product.jpg"
                  alt="product"
                  className="w-full h-[220px] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="relative px-5 pt-10 pb-6">
                <div className="absolute -top-8 left-5 w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">♻️</span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Recycling Machines
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempore, exercitationem.
                </p>

                <button className="mt-5 text-[var(--primary)] font-semibold text-sm uppercase flex items-center gap-2 hover:gap-3 transition-all">
                  View Details
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-[var(--card)] rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-[var(--shadow-primary)] transition duration-300 group">
              <div className="overflow-hidden">
                <img
                  src="/product.jpg"
                  alt="product"
                  className="w-full h-[220px] object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="relative px-5 pt-10 pb-6">
                <div className="absolute -top-8 left-5 w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">📦</span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Sheet & Board Lines
                </h3>

                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Tempore, exercitationem.
                </p>

                <button className="mt-5 text-[var(--primary)] font-semibold text-sm uppercase flex items-center gap-2 hover:gap-3 transition-all">
                  View Details
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Clients />

      <section className="relative py-16  bg-[var(--background)] overflow-hidden">
        {/* BACKGROUND EFFECT */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--primary)]/5 blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TOP CONTENT */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            {/* LEFT */}
            <div className="max-w-3xl">
              <p className="text-[var(--primary)] font-semibold uppercase tracking-[2px] text-sm">
                Why Choose Us
              </p>

              <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                Delivering Engineering
                <br />
                Excellence Worldwide
              </h2>

              {/* LINE */}
              <div className="w-16 h-[3px] bg-[var(--primary)] mt-4 rounded-full" />

              <p className="mt-5 text-[15px] md:text-[17px] leading-8 text-[var(--text-secondary)] max-w-2xl">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Reprehenderit, laboriosam. Lorem ipsum dolor sit amet
                consectetur adipisicing elit.
              </p>
            </div>

            {/* RIGHT BUTTON */}
            <div>
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition px-8 py-4 rounded-xl text-white font-semibold uppercase tracking-wide flex items-center gap-3">
                Explore More
                <span>→</span>
              </button>
            </div>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD */}
            <div className="group bg-[var(--card)] border border-[var(--border)] rounded-3xl p-7 hover:-translate-y-2 hover:shadow-[var(--shadow-primary)] transition duration-300">
              {/* ICON */}
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-[var(--primary)] transition">
                <span className="group-hover:scale-110 transition">⚙️</span>
              </div>

              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Advanced Technology
              </h3>

              <p className="mt-4 text-[15px] leading-7 text-[var(--text-secondary)]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae, laboriosam.
              </p>
            </div>

            {/* CARD */}
            <div className="group bg-[var(--card)] border border-[var(--border)] rounded-3xl p-7 hover:-translate-y-2 hover:shadow-[var(--shadow-primary)] transition duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-[var(--primary)] transition">
                <span className="group-hover:scale-110 transition">🌍</span>
              </div>

              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Global Presence
              </h3>

              <p className="mt-4 text-[15px] leading-7 text-[var(--text-secondary)]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae, laboriosam.
              </p>
            </div>

            {/* CARD */}
            <div className="group bg-[var(--card)] border border-[var(--border)] rounded-3xl p-7 hover:-translate-y-2 hover:shadow-[var(--shadow-primary)] transition duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-[var(--primary)] transition">
                <span className="group-hover:scale-110 transition">👨‍🔧</span>
              </div>

              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Expert Engineers
              </h3>

              <p className="mt-4 text-[15px] leading-7 text-[var(--text-secondary)]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae, laboriosam.
              </p>
            </div>

            {/* CARD */}
            <div className="group bg-[var(--card)] border border-[var(--border)] rounded-3xl p-7 hover:-translate-y-2 hover:shadow-[var(--shadow-primary)] transition duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-3xl mb-6 group-hover:bg-[var(--primary)] transition">
                <span className="group-hover:scale-110 transition">🏆</span>
              </div>

              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Trusted Quality
              </h3>

              <p className="mt-4 text-[15px] leading-7 text-[var(--text-secondary)]">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Molestiae, laboriosam.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 bg-[var(--background)]">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-[var(--primary)] font-semibold uppercase tracking-[2px] text-sm">
              Testimonials
            </p>

            <h2 className="mt-3 text-3xl md:text-5xl font-bold text-[var(--text-primary)]">
              What Our Clients Say
            </h2>

            <div className="w-16 h-[3px] bg-[var(--primary)] mx-auto mt-4 rounded-full" />

            <p className="mt-5 max-w-2xl mx-auto text-[var(--text-secondary)] leading-8">
              Trusted by businesses worldwide for delivering quality,
              reliability, and innovation.
            </p>
          </div>

          {/* Slider */}
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            loop
            spaceBetween={24}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
          >
            {testimonials.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="group flex h-[340px] flex-col rounded-3xl border p-6 transition-all duration-500 hover:shadow-2xl"
                  style={{
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Quote */}
                  <div className="mb-6 flex justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-[var(--primary)] text-[var(--primary)]"
                        />
                      ))}
                    </div>

                    <Quote
                      size={34}
                      className="text-[var(--primary)] opacity-30"
                    />
                  </div>

                  {/* Review */}
                  <div className="mb-6 flex-1 overflow-y-auto pr-2">
                    <p className="leading-8 text-[var(--text-secondary)]">
                      "{item.review}"
                    </p>
                  </div>

                  {/* User */}
                  <div className="mt-auto flex items-center gap-4 border-t pt-5 border-[var(--border)]">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold"
                      style={{
                        borderColor: "var(--primary)",
                        background: "rgba(132,204,22,0.12)",
                        color: "var(--primary)",
                      }}
                    >
                      {item.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {item.name}
                      </h4>

                      <p className="text-sm text-[var(--text-secondary)]">
                        {item.company}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <CTA />
      <Footer />
      <FloatingContact />
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />

      {openVideo && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpenVideo(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpenVideo(false)}
              className="absolute -top-12 right-0 text-white text-4xl leading-none hover:text-[#65BC4F]"
            >
              ×
            </button>

            {/* Video */}
            <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">
              <video controls preload="metadata" className="w-full h-auto">
                <source src="/abc.mp4" type="video/mp4" />
                Your browser does not support video playback.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Counter({ end, suffix = "" }: CounterProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0,
  });

  return (
    <div ref={ref}>
      {inView ? (
        <CountUp
          start={0}
          end={end}
          duration={2.5}
          separator=","
          suffix={suffix}
        />
      ) : (
        `0${suffix}`
      )}
    </div>
  );
}
