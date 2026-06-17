"use client";
import Image from "next/image";

import Link from "next/link";

import { useRef, useState, type MouseEvent } from "react";
import CTA from "../components/CTA";
import FloatingContact from "../components/FloatingButton";
import PopupForm from "../components/Popup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { Play, Pause } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import DemoPopup from "../components/PopupDemo";
import { thead } from "framer-motion/client";

const galleryImages = [
  "/product.jpg",
  "/imag1.png",
  "/product.jpg",
  "/product.jpg",
];

const features = [
  {
    title: "Two Layer Die Head",
    desc: "Precision-engineered two-layer die head designed for uniform insulation and sheathing applications. Ensures consistent material flow, excellent concentricity, and superior cable quality.",
    image: "/product.jpg",
    highlights: [
      "Two-layer extrusion",
      "Uniform material flow",
      "Superior cable quality",
    ],
  },

  {
    title: "Capstan",
    desc: "Designed for efficient transmission of tractive forces and smooth cable movement. Suitable for cable diameters ranging from 10mm to 50mm, ensuring stable and reliable production.",
    image: "/product.jpg",
    highlights: [
      "10mm–50mm cable range",
      "Smooth traction control",
      "High production efficiency",
    ],
  },

  {
    title: "Advanced Screw Design",
    desc: "Barrier screw design provides homogeneous mixing, while the grooved barrel design delivers higher output. Equipped with powerful air blowers and cooling jackets for precise temperature control.",
    image: "/product.jpg",
    highlights: [
      "Barrier screw design",
      "Grooved barrel technology",
      "Excellent temperature control",
    ],
  },

  {
    title: "Cross-Head",
    desc: "Available in fixed-center or die-center configurations to ensure accurate insulation and sheathing applications across a wide range of cable manufacturing requirements.",
    image: "/product.jpg",
    highlights: [
      "Fixed center option",
      "Die center option",
      "Accurate cable coating",
    ],
  },

  {
    title: "Haul-Off Caterpillar",
    desc: "Pneumatically operated caterpillar haul-off system synchronized with the main extruder. Designed to allow irregularities to pass through smoothly while maintaining stable cable pulling.",
    image: "/product.jpg",
    highlights: [
      "Pneumatic operation",
      "Extruder synchronized",
      "Smooth cable handling",
    ],
  },
];

const applications = [
  {
    image: "/images (2).png",
    title: "Oil Packaging Film",
    description: "Used for edible oil and liquid packaging solutions.",
  },
  {
    image: "/images (3).png",
    title: "Vacuum Bags",
    description: "Ideal for food preservation and industrial packaging.",
  },
  {
    image: "/images (4).png",
    title: "Food Packaging Film",
    description: "Safe and durable packaging for food products.",
  },
  {
    image: "/images (5).png",
    title: "Stretch Film",
    description: "Widely used for pallet wrapping and logistics.",
  },
  {
    image: "/images (2).png",
    title: "Milk Packaging Film",
    description: "Flexible film solutions for dairy packaging.",
  },
  {
    image: "/images (3).png",
    title: "Industrial Packaging",
    description: "Heavy-duty packaging for industrial applications.",
  },
];

const extruderSpecifications = [
  {
    model: "45/30",
    motorLoad: "10/5",
    maxRpm: "70/70",
    ldRatio: "26/26",
    heatingPower: "10/5",
    pvcOutput: "60",
    xlpeOutput: "-",
  },
  {
    model: "45/45",
    motorLoad: "10/10",
    maxRpm: "70/70",
    ldRatio: "26/26",
    heatingPower: "10/10",
    pvcOutput: "80",
    xlpeOutput: "50",
  },
  {
    model: "65/45",
    motorLoad: "20/10",
    maxRpm: "70/70",
    ldRatio: "26/26",
    heatingPower: "12/10",
    pvcOutput: "120",
    xlpeOutput: "85",
  },
  {
    model: "100/65",
    motorLoad: "40/20",
    maxRpm: "60/70",
    ldRatio: "26/26",
    heatingPower: "22/12",
    pvcOutput: "280",
    xlpeOutput: "200",
  },
];
const capstanSpecifications = [
  {
    parameter: "Wheel Dia",
    values: ["400", "630", "800", "1000"],
  },
  {
    parameter: "Max. Traction Force (Kg.)",
    values: ["200", "500", "800", "1000"],
  },
  {
    parameter: "Max. Dia of Cable (mm)",
    values: ["10", "20", "30", "40"],
  },
  {
    parameter: "Max Speed (m/min)",
    values: ["400", "250", "150", "80"],
  },
  {
    parameter: "AC Drive (HP)",
    values: ["2", "3", "5", "75"],
  },
];
const hpmcSpecifications = [
  {
    model: "HPMC30",
    motorLoad: "5",
    maxRpm: "70",
    ldRatio: "26",
    heatingPower: "5",
    pvcOutput: "20",
    xlpeOutput: "-",
  },
  {
    model: "HPMC45",
    motorLoad: "10",
    maxRpm: "70",
    ldRatio: "26",
    heatingPower: "10",
    pvcOutput: "40",
    xlpeOutput: "25",
  },
  {
    model: "HPMC65",
    motorLoad: "20",
    maxRpm: "70",
    ldRatio: "26",
    heatingPower: "12",
    pvcOutput: "80",
    xlpeOutput: "60",
  },
  {
    model: "HPMC75",
    motorLoad: "30",
    maxRpm: "70",
    ldRatio: "26",
    heatingPower: "16",
    pvcOutput: "120",
    xlpeOutput: "90",
  },
  {
    model: "HPMC90",
    motorLoad: "40",
    maxRpm: "60",
    ldRatio: "26",
    heatingPower: "20",
    pvcOutput: "150",
    xlpeOutput: "115",
  },
  {
    model: "HPMC100",
    motorLoad: "40",
    maxRpm: "60",
    ldRatio: "26",
    heatingPower: "22",
    pvcOutput: "200",
    xlpeOutput: "140",
  },
  {
    model: "HPMC120",
    motorLoad: "60",
    maxRpm: "60",
    ldRatio: "26",
    heatingPower: "30",
    pvcOutput: "350",
    xlpeOutput: "250",
  },
];
const caterpillarSpecifications = [
  {
    parameter: "Max Line Speed",
    values: ["200", "160", "125", "100", "80"],
  },
  {
    parameter: "Max Traction Force",
    values: ["400", "800", "1200", "1600", "2000"],
  },
  {
    parameter: "Max Cable Opening",
    values: ["60", "100", "120", "160", "160"],
  },
  {
    parameter: "Gripping Length",
    values: ["900", "1200", "1500", "1800", "2100"],
  },
  {
    parameter: "Width of Belt",
    values: ["80", "100", "120", "160", "160"],
  },
  {
    parameter: "Drive (HP)",
    values: ["3", "5", "7.5", "10", "15"],
  },
];

export default function HighSpeedTwoLayerCablePlant() {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [catalogueToDownload, setCatalogueToDownload] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggleVideo = async () => {
    if (!videoRef.current) return;

    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await videoRef.current.play();
        setPlaying(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDownload = (catalogue: string) => {
    const access = localStorage.getItem("catalogue_access");

    if (access) {
      window.open(catalogue, "_blank");
      return;
    }

    setCatalogueToDownload(catalogue);
    setOpenPopup(true);
  };

  const handleImageZoom = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

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
            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              High Speed Two
              <span className="text-[#65BC4F]"> Layer Cable Plant</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              We manufacture and export High Speed Two Layer Cable Plants along
              with Plastic Extruders, Twin Screw Extruders, PVC Pipe Plants,
              HDPE Pipe Plants, Recycling Machines, Compounding Extruders, and
              other plastic processing machinery. Our systems are designed for
              high-speed production, reliable performance, and long service
              life.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Request a Demo
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
          <span className="text-[var(--primary)] uppercase tracking-[3px] font-semibold text-sm">
            Product Overview
          </span>

          <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight">
            Cable Extruder -
            <span className="text-[var(--primary)]">
              {" "}
              High Speed Two Layer Cable Plant
            </span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* PRODUCT GALLERY */}
            <div>
              {/* Main Image */}
              <div
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleImageZoom}
                className="
            relative
            h-[520px]
            rounded-[32px]
            bg-[var(--card)]
            border
            border-[var(--border)]
            shadow-[var(--shadow-primary)]
            group
            cursor-zoom-in
          "
              >
                <Image
                  src={galleryImages[activeImage]}
                  alt="Single Screw Extruder"
                  fill
                  className="
              object-contain
              p-8
              transition-all
              duration-700
              
            "
                />

                {isZooming && (
                  <>
                    <div
                      className="pointer-events-none absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_12px_35px_rgba(0,0,0,0.18)] hidden lg:block"
                      style={{
                        left: `${zoomPosition.x}%`,
                        top: `${zoomPosition.y}%`,
                      }}
                    />

                    <div
                      className="pointer-events-none absolute left-[calc(100%+24px)] top-0 z-40 hidden h-[520px] w-[520px] rounded-[28px] border border-[var(--border)] bg-white shadow-2xl xl:block"
                      style={{
                        backgroundImage: `url(${galleryImages[activeImage]})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "240%",
                      }}
                    />
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4 mt-5">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`
                relative
                h-24
                rounded-2xl
                overflow-hidden
                border-2
                transition-all
                duration-300
                ${
                  activeImage === index
                    ? "border-[var(--primary)] scale-105"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }
              `}
                  >
                    <Image
                      src={img}
                      alt={`View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <p className="mt-8 text-[var(--text-secondary)] leading-8">
                We manufacture and export a wide range of plastic processing
                machinery, including Plastic Extruders, Twin Screw Extruders,
                PVC Pipe Plants, HDPE Pipe Plants, Recycling Machines, Plastic
                Reprocessing Plants, Co-Rotating Extruders, Compounding
                Extruders, and Plastic Profile Machinery.
              </p>
              <p className="mt-5 text-[var(--text-secondary)] leading-8">
                Our machinery is engineered for high productivity, reliable
                performance, and efficient processing, providing dependable
                solutions for various extrusion and plastic manufacturing
                applications.
              </p>
              {/* Highlights */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  "Plastic Extruders",
                  "Twin Screw Extruders",
                  "PVC Pipe Plants",
                  "HDPE Pipe Plants",
                  "Recycling Machines",
                  "Plastic Profile Machinery",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-[var(--text-primary)] font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    {item}
                  </div>
                ))}
              </div>
              {/* Stats Cards */}{" "}
              <div className="grid grid-cols-3 gap-4 mt-8">
                {" "}
                <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]">
                  {" "}
                  <h4 className="text-2xl font-bold text-[var(--primary)]">
                    15+
                  </h4>{" "}
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {" "}
                    Machine Categories{" "}
                  </p>{" "}
                </div>{" "}
                <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]">
                  {" "}
                  <h4 className="text-2xl font-bold text-[var(--primary)]">
                    100%
                  </h4>{" "}
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {" "}
                    Quality Assured{" "}
                  </p>{" "}
                </div>{" "}
                <div className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]">
                  {" "}
                  <h4 className="text-2xl font-bold text-[var(--primary)]">
                    24/7
                  </h4>{" "}
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {" "}
                    Technical Support{" "}
                  </p>{" "}
                </div>{" "}
              </div>
              {/* Buttons */}
              <div className="flex flex-wrap gap-4 mt-10">
                <button
                  onClick={() => handleDownload("/catalogue.pdf")}
                  className="
        bg-[var(--primary)]
        hover:opacity-90
        text-white
        font-semibold
        px-7
        py-4
        rounded-xl
        transition-all
        duration-300
        flex
        items-center
        gap-3
      "
                >
                  Download Catalogue
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    ↓
                  </span>
                </button>

                <button
                  onClick={() => setOpenPopup2(true)}
                  className="
        border
        border-[var(--border)]
        hover:border-[var(--primary)]
        hover:bg-[var(--primary)]
        hover:text-white
        text-[var(--text-primary)]
        px-7
        py-4
        rounded-xl
        font-semibold
        transition-all
        duration-300
      "
                >
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Key Features
            </span>

            <h2 className="mt-4 text-5xl lg:text-5xl font-bold">
              Why Choose Our
              <span className="text-[var(--primary)]">
                {" "}
                Twin Screw Extruder
              </span>
            </h2>
          </div>

          <div className="relative">
            {features.map((feature, index) => (
              <div
                key={index}
                className="sticky flex min-h-[calc(100vh-120px)] items-center py-6"
                style={{
                  top: `${72 + index * 4}px`,
                  zIndex: index + 1,
                }}
              >
                <div className="bg-[var(--card)] rounded-[28px] overflow-hidden border border-[var(--border)] shadow-[0_15px_50px_rgba(0,0,0,0.08)] mb-6">
                  <div className="grid lg:grid-cols-[1.1fr_0.9fr] min-h-[380px]">
                    {/* LEFT */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      {/* Top */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="h-[1px] flex-1 bg-[var(--border)]" />
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                        {feature.title}
                      </h3>

                      <p className="mt-5 text-[var(--text-secondary)] leading-7">
                        {feature.desc}
                      </p>

                      {/* HIGHLIGHTS */}
                      <div className="mt-8 grid gap-3">
                        {feature.highlights.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-sm font-medium"
                          >
                            <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                            {item}
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <button
                        className="
      mt-8
      w-fit
      px-6
      py-3
      rounded-xl
      bg-[var(--primary)]
      text-white
      font-medium
      transition
      hover:scale-105
    "
                      >
                        Request Quote
                      </button>
                    </div>

                    {/* RIGHT */}
                    <div className="relative bg-gradient-to-br from-white to-[#f5f7f8]">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-contain p-8"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-[var(--background)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
        
          <div className="text-center mb-14">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Applications
            </span>

            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
              Products Manufactured Using Our
              <span className="text-[var(--primary)]"> PVC Pipe Plant</span>
            </h2>

            <p className="mt-5 max-w-3xl mx-auto text-[var(--text-secondary)] leading-8">
              HPMC Single Screw Extruders are widely used for manufacturing a
              variety of PVC pipes and profiles for infrastructure, agriculture,
              construction, and industrial applications.
            </p>
          </div>

    
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1.2}
            loop={true}
            speed={4000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            className="applications-swiper"
          >
            {applications.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="
              group
              relative
              h-[320px]
              rounded-[20px]
              overflow-hidden
              cursor-pointer
            "
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="
                object-cover
                transition-all
                duration-700
                group-hover:scale-110
              "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-white text-2xl font-bold">
                      {item.title}
                    </h3>

                    <p className="text-white/80 mt-3 leading-6">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section> */}

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Product Showcase
            </span>

            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-[var(--text-primary)]">
              See Our Machine
              <span className="text-[var(--primary)]"> In Action</span>
            </h2>

            <p className="mt-5 max-w-3xl mx-auto text-[var(--text-secondary)]">
              Explore detailed machine visuals and watch real production
              demonstrations to understand the performance and quality of our
              extrusion systems.
            </p>
          </div>

          {/* Main Layout */}
          <div>
            {/* Video */}
            <div className="relative h-[500px] rounded-[32px] overflow-hidden border border-[var(--border)] shadow-xl">
              <video
                ref={videoRef}
                controls
                poster="/capture.png"
                className="w-full h-full object-cover"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              >
                <source src="/abc.mp4" type="video/mp4" />
              </video>

              {!playing && (
                <>
                  <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                  <button
                    onClick={toggleVideo}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
                  >
                    <Play size={34} className="ml-1 text-[var(--primary)]" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
              Machine Models
            </span>

            <h2 className="mt-4 text-5xl font-bold text-[var(--text-primary)]">
              Technical
              <span className="text-[var(--primary)]"> Specifications</span>
            </h2>
          </div>

          {/* TABLE 1 */}
          <div
            className="overflow-x-auto rounded-3xl border mb-12"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="px-8 py-5 bg-[var(--muted)] font-bold text-xl">
              Extruder Specifications
            </div>

            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-6 py-4 border">MODEL</th>
                  <th className="px-6 py-4 border">MOTOR LOAD</th>
                  <th className="px-6 py-4 border">MAX RPM</th>
                  <th className="px-6 py-4 border">L/D RATIO</th>
                  <th className="px-6 py-4 border">HEATING POWER</th>
                  <th className="px-6 py-4 border">PVC OUTPUT</th>
                  <th className="px-6 py-4 border">XLPE OUTPUT</th>
                </tr>
              </thead>

              <tbody>
                {extruderSpecifications.map((item) => (
                  <tr key={item.model}>
                    <td className="px-6 py-4 border text-center">
                      {item.model}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.motorLoad}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.maxRpm}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.ldRatio}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.heatingPower}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.pvcOutput}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.xlpeOutput}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE 2 */}
          <div
            className="overflow-x-auto rounded-3xl border mb-12"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="px-8 py-5 bg-[var(--muted)] font-bold text-xl">
              Capstan Specifications
            </div>

            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-6 py-4 border">PARAMETER</th>
                  {["HC 400", "HC 630", "HC 800", "HC 1000"].map((item) => (
                    <th key={item} className="px-6 py-4 border">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {capstanSpecifications.map((row) => (
                  <tr key={row.parameter}>
                    <td className="px-6 py-4 border font-medium">
                      {row.parameter}
                    </td>

                    {row.values.map((value, index) => (
                      <td key={index} className="px-6 py-4 border text-center">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE 3 */}
          <div
            className="overflow-x-auto rounded-3xl border mb-12"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="px-8 py-5 bg-[var(--muted)] font-bold text-xl">
              HPMC Extruder Specifications
            </div>

            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-6 py-4 border">MODEL</th>
                  <th className="px-6 py-4 border">MOTOR LOAD</th>
                  <th className="px-6 py-4 border">MAX RPM</th>
                  <th className="px-6 py-4 border">L/D RATIO</th>
                  <th className="px-6 py-4 border">HEATING POWER</th>
                  <th className="px-6 py-4 border">PVC OUTPUT</th>
                  <th className="px-6 py-4 border">XLPE OUTPUT</th>
                </tr>
              </thead>

              <tbody>
                {hpmcSpecifications.map((item) => (
                  <tr key={item.model}>
                    <td className="px-6 py-4 border text-center">
                      {item.model}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.motorLoad}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.maxRpm}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.ldRatio}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.heatingPower}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.pvcOutput}
                    </td>
                    <td className="px-6 py-4 border text-center">
                      {item.xlpeOutput}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLE 4 */}
          <div
            className="overflow-x-auto rounded-3xl border"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="px-8 py-5 bg-[var(--muted)] font-bold text-xl">
              Caterpillar Specifications
            </div>

            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-[var(--primary)] text-white">
                  <th className="px-6 py-4 border">PARAMETER</th>
                  {["CAT-4", "CAT-8", "CAT-12", "CAT-16", "CAT-20"].map(
                    (item) => (
                      <th key={item} className="px-6 py-4 border">
                        {item}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {caterpillarSpecifications.map((row) => (
                  <tr key={row.parameter}>
                    <td className="px-6 py-4 border font-medium">
                      {row.parameter}
                    </td>

                    {row.values.map((value, index) => (
                      <td key={index} className="px-6 py-4 border text-center">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <DemoPopup open={openPopup} onClose={() => setOpenPopup(false)} />
      <PopupForm open={openPopup2} onClose={() => setOpenPopup2(false)} />
    </div>
  );
}
