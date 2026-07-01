"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const footerProducts = [
  {
    name: "Single Screw Extruder",
    link: "/single-screw-extruder",
  },
  {
    name: "Twin Screw Extruder",
    link: "/twin-screw-extruder",
  },
  {
    name: "PVC Conduit Pipe Plant (Four Pipes)",
    link: "/pvc-conduit-pipe-plant-four-pipes",
  },
  {
    name: "PVC Conduit Pipe Plant (Two Pipes)",
    link: "/pvc-conduit-pipe-plant-two-pipes",
  },
  {
    name: "High Speed HDPE Pipe Plant",
    link: "/high-speed-hdpe-pipe-plant",
  },
  {
    name: "Twin Screw Plant for PVC Compounding",
    link: "/pvc-compounding",
  },
  {
    name: "Single Screw Plant for PPR Pipe",
    link: "/ppr-pipe-extruder",
  },
  {
    name: "Two Stage Recycling Plant",
    link: "/two-stage-recycling-plant",
  },
  {
    name: "Vented Recycling Plant",
    link: "/vented-recycling-plant",
  },
  {
    name: "Recycling Plant With Compactor",
    link: "/recycling-plant-with-compactor",
  },
  {
    name: "Soft Cable Grade PVC Compounding Plant",
    link: "/soft-cable-grade-pvc-compounding-plant",
  },
  {
    name: "Corotating Twin Screw Extruder",
    link: "/corotating-twin-screw-extruder-for-compounding-&-recycling",
  },
  {
    name: "Corotating Triple Screw Extruder",
    link: "/corotating-triple-screw-extruder-for-compounding-&-recycling",
  },
  {
    name: "High Speed Two Layer Cable Plant",
    link: "/high-speed-two-layer-cable-plant",
  },
  {
    name: "Twin Screw Plant for PVC Trunking",
    link: "/twin-screw-plant-for-pvc-trunking",
  },
  {
    name: "Single Screw Plant for PVC Profile",
    link: "/single-screw-plant-for-pvc-profile",
  },
  {
    name: "Twin Screw Plant for PVC Profile",
    link: "/twin-screw-plant-for-pvc-profile",
  },
  {
    name: "Single Screw Plant for Garden Pipe",
    link: "/single-screw-plant-for-garden-pipe",
  },
  {
    name: "LLDPE Pipe Plant",
    link: "/lldpe-pipe-plant",
  },
  {
    name: "Twin Screw Plant for CPVC Pipe",
    link: "/twin-screw-plant-for-cpvc-pipe",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/subscribers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Subscribed successfully");
        setMessageType("success");
        setEmail("");
      } else {
        setMessage(data.message || "Email already subscribed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);

      setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
    }
  };
  return (
    <footer className="relative bg-[#03111F] overflow-hidden">
      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0b2a4a,transparent_60%)] opacity-40" />

      <div className="relative z-10">
        {/* NEWSLETTER */}
        <div className="border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
            <div className="relative overflow-hidden  bg-[var(--gradient-dark)]  p-4 ">
              {/* GLOW */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--primary)]/10 blur-[120px]" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* LEFT */}
                <div className="max-w-[500px]">
                  <p className="uppercase tracking-[3px] text-[var(--primary)] text-sm font-semibold mb-3">
                    Newsletter
                  </p>

                  <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                    Subscribe For Latest Updates & Innovations
                  </h2>

                  <p className="mt-4 text-white/70 leading-7 text-[15px]">
                    Stay informed with the latest industry trends, product
                    innovations, extrusion technologies, and company updates
                    delivered directly to your inbox.
                  </p>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-auto">
                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full sm:w-[320px] h-[55px] px-5 outline-none bg-transparent text-white placeholder:text-white/40 rounded-xl"
                      />

                      <button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full sm:w-auto h-[55px] px-8 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition flex items-center justify-center gap-3 text-white font-semibold whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            Subscribe
                            <Send size={18} className="rotate-[45deg]" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Message */}
                    {message && (
                      <p
                        className={`mt-2 ml-2 text-sm font-medium ${
                          messageType === "success"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* LOGO */}
            <div>
              <Image src="/hp-logo.png" alt="logo" width={200} height={80} />

              <p className="text-gray-400 leading-[30px] mt-6 text-sm">
                HPMC is a leading manufacturer of extrusion and recycling
                machinery since 1972. Trusted by customers worldwide.
              </p>

              <div className="flex flex-col gap-5 mt-7">
                <div className="flex gap-4 items-start">
                  <MapPin
                    className="text-lime-400 mt-1 min-w-[18px] flex-shrink-0"
                    size={18}
                  />

                  <p className="text-gray-400 text-sm leading-7">
                    5, Category II, DSIDC Industrial Area Nangloi, Delhi-110041
                  </p>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-lime-400" size={18} />

                  <p className="text-gray-400 text-sm">+91 95605 96392</p>
                </div>

                <div className="flex gap-4">
                  <Mail className="text-lime-400" size={18} />

                  <p className="text-gray-400 text-sm break-all">
                    info@hindustanplastics.com
                  </p>
                </div>
              </div>

              {/* SOCIAL */}
              <div className="flex items-center gap-4 mt-8">
                <a
                  href="https://www.linkedin.com/company/132303934/admin/dashboard/?editPageActiveTab=info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaLinkedinIn size={18} />
                </a>

                <a
                  href="https://www.facebook.com/profile.php?fb_profile_edit_entry_point=%7B%22click_point%22%3A%22edit_profile_button%22%2C%22feature%22%3A%22profile_header%22%7D&id=61591089651211&sk=about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaFacebookF size={18} />
                </a>

                <a
                  href="https://www.youtube.com/@HindustanPlasticsMachineCorpor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaYoutube size={18} />
                </a>

                <a
                  href="https://www.instagram.com/hindustanplasticsofficial?igsh=ZzkzdWc3Y2YxbGd4&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                The Company
              </h3>

              <div className="flex flex-col gap-4">
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  About Us
                </Link>

                <Link
                  href="/vision-mission"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Vision & Mission
                </Link>

                <Link
                  href="/our-journey"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Our Journey
                </Link>
                <Link
                  href="/leadership-team"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Leadership Teams
                </Link>

                <Link
                  href="/manufacturing-facility"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Manufacturing Facility
                </Link>
                <Link
                  href="/global-reach"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Global Reach
                </Link>
                <Link
                  href="/memberships"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Memberships
                </Link>
                <Link
                  href="/code-of-conduct"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Code of Conduct
                </Link>
                <Link
                  href="/milestones"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Milestones
                </Link>
                <Link
                  href="/awards-recognition"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Awards & Recognition
                </Link>
                <Link
                  href="/csr"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  CSR Activities
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  FAQs
                </Link>
              </div>
            </div>

            {/* PRODUCTS */}
            <div className="md:col-span-2">
              <h3 className="text-white text-lg font-semibold mb-6">
                Products
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {footerProducts.map((product) => (
                  <Link
                    key={product.link}
                    href={product.link}
                    className="text-gray-400 hover:text-lime-400 transition text-sm"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* SERVICES */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Service & Support
              </h3>

              <div className="flex flex-col gap-4">
                <Link
                  href="/technical-assistance"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Technical Assistance
                </Link>

                <Link
                  href="/field-services"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Field Services
                </Link>

                <Link
                  href="/spare-parts"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Spare Parts
                </Link>

                <Link
                  href="/training"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Training
                </Link>

                <Link
                  href="/manuals"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Manuals
                </Link>
                <Link
                  href="/extrusion-hints"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Extrusion Hints
                </Link>
                <Link
                  href="/trouble-shooting"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Trouble Shooting
                </Link>
              </div>
            </div>

            {/* CONTACT */}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 pb-12 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left */}
              <p className="text-gray-500 text-sm">
                © 2026 HPMC. All Rights Reserved.
              </p>

              {/* Center */}
              <p className="text-sm text-gray-400 text-center">
                Crafted with <span className="text-red-500">❤</span> by{" "}
                <span className="font-semibold text-lime-400">
                  Bigwig Media
                </span>
              </p>

              {/* Right */}
              <div className="flex items-center gap-8">
                <Link
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-lime-400 text-sm transition"
                >
                  Privacy Policy
                </Link>

                <Link
                  href="/terms-and-conditions"
                  className="text-gray-500 hover:text-lime-400 text-sm transition"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
