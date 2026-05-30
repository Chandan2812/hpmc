import Image from "next/image";
import Link from "next/link";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptatibus, illum. Stay updated with industry trends.
                  </p>
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-auto">
                  <div className="flex flex-col sm:flex-row items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full sm:w-[320px] h-[55px] px-5 outline-none bg-transparent text-white placeholder:text-white/40 rounded-xl"
                    />

                    <button className="w-full sm:w-auto h-[55px] px-8 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition flex items-center justify-center gap-3 text-white font-semibold whitespace-nowrap">
                      Subscribe
                      <Send size={18} className="rotate-[45deg]" />
                    </button>
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
              <Image src="/hp-logo.png" alt="logo" width={170} height={60} />

              <p className="text-gray-400 leading-[30px] mt-6 text-sm">
                HPMC is a leading manufacturer of extrusion and recycling
                machinery since 1971, trusted by customers worldwide.
              </p>

              {/* SOCIAL */}
              <div className="flex items-center gap-4 mt-8">
                <Link
                  href="/"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaLinkedinIn size={18} />
                </Link>

                <Link
                  href="/"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaFacebookF size={18} />
                </Link>

                <Link
                  href="/"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaYoutube size={18} />
                </Link>

                <Link
                  href="/"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:bg-lime-500 hover:border-lime-500 hover:text-white transition"
                >
                  <FaInstagram size={18} />
                </Link>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Quick Links
              </h3>

              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Home
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  About Us
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Gallery
                </Link>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Blogs
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* PRODUCTS */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Products
              </h3>

              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Pipe Extrusion Lines
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Profile Extrusion
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Recycling Machines
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Sheet & Board Lines
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Compounding Systems
                </Link>
              </div>
            </div>

            {/* SERVICES */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Services
              </h3>

              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Installation
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Training
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Maintenance
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Annual Maintenance
                </Link>

                <Link
                  href="/"
                  className="text-gray-400 hover:text-lime-400 transition text-sm"
                >
                  Upgrades & Retrofits
                </Link>
              </div>
            </div>

            {/* CONTACT */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-6">
                Contact Us
              </h3>

              <div className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <MapPin className="text-lime-400 mt-1" size={18} />

                  <p className="text-gray-400 text-sm leading-[28px]">
                    Lorem ipsum dolor sit amet consectetur , India
                  </p>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-lime-400" size={18} />

                  <p className="text-gray-400 text-sm">+91 98765 43210</p>
                </div>

                <div className="flex gap-4">
                  <Mail className="text-lime-400" size={18} />

                  <p className="text-gray-400 text-sm break-all">
                    info@company.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 pb-12 md:pb-0">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 HPMC. All Rights Reserved.
            </p>

            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-gray-500 hover:text-lime-400 text-sm transition"
              >
                Privacy Policy
              </Link>

              <Link
                href="/"
                className="text-gray-500 hover:text-lime-400 text-sm transition"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
