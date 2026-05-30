"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

import { useEffect, useState } from "react";

import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./Theme-toggle";
import PopupForm from "./Popup";

const productsData = [
  {
    title: "Pipe Extrusion",
    children: [
      {
        name: "HDPE Pipe Plant",
        link: "/hdpe-pipe-plant",
      },
      {
        name: "PVC Pipe Plant",
        link: "/pvc-pipe-plant",
      },
      {
        name: "Drip Irrigation Plant",
        link: "/drip-irrigation-plant",
      },
    ],
  },

  {
    title: "Profile Extrusion",
    children: [
      {
        name: "WPC Profile",
        link: "/wpc-profile",
      },
      {
        name: "PVC Profile",
        link: "/pvc-profile",
      },
      {
        name: "Door Frame",
        link: "/door-frame",
      },
      {
        name: "Ceiling Panel",
        link: "/ceiling-panel",
      },
    ],
  },

  {
    title: "Recycling Machine",
    children: [
      {
        name: "Plastic Recycling",
        link: "/plastic-recycling",
      },
      {
        name: "Agglomerator",
        link: "/agglomerator",
      },
      {
        name: "Grinder",
        link: "/grinder",
      },
      {
        name: "Crusher",
        link: "/crusher",
      },
    ],
  },
];

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            autoDisplay?: boolean;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(0);

  const [mobileMenu, setMobileMenu] = useState(false);

  const [mobileProduct, setMobileProduct] = useState(false);

  const [openMobileCategory, setOpenMobileCategory] = useState<number | null>(
    null,
  );
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    const loadGoogleTranslateScript = () => {
      if (!window.googleTranslateElementInit) {
        const script = document.createElement("script");

        script.src =
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        document.body.appendChild(script);

        window.googleTranslateElementInit = googleTranslateElementInit;
      }
    };

    loadGoogleTranslateScript();
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-[72px]">
            {/* LOGO */}
            <Link href="/">
              <Image
                src="/hp-logo.png"
                alt="HPMC Logo"
                width={120}
                height={40}
                priority
              />
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden lg:flex items-center gap-7 h-full">
              {/* HOME */}
              <Link
                href="/"
                className="relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide text-[var(--primary)]"
              >
                Home
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
              </Link>

              {/* ABOUT */}
              <Link
                href="/about"
                className="relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide text-[var(--text-primary)] hover:text-[var(--primary)] transition"
              >
                About Us
              </Link>

              {/* PRODUCTS */}
              <div
                className="relative group h-full flex items-center"
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-[14px] uppercase font-semibold tracking-wide text-[var(--text-primary)] hover:text-[var(--primary)] transition h-full">
                  Products
                  <ChevronDown size={16} />
                </button>

                {/* DROPDOWN */}
                <div className="absolute top-full left-0 mt-0 w-[220px] bg-[var(--card)] shadow-[var(--shadow-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-[var(--border)]">
                  {productsData.map((item, index) => (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(index)}
                    >
                      {/* LEFT */}
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-[var(--muted)] cursor-pointer transition">
                        <span className="text-[var(--text-primary)] font-medium">
                          {item.title}
                        </span>

                        <ChevronRight
                          size={16}
                          className="text-[var(--text-secondary)]"
                        />
                      </div>

                      {/* RIGHT */}
                      {activeDropdown === index && (
                        <div className="absolute left-full top-0 w-[270px] bg-[var(--card)] shadow-[var(--shadow-primary)] border border-[var(--border)]">
                          {item.children.map((child, i) => (
                            <Link
                              href={child.link}
                              key={i}
                              className="block px-4 py-3 hover:bg-[var(--muted)] hover:text-[var(--primary)] transition text-[var(--text-secondary)]"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICES */}
              <Link
                href="/services"
                className="relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide text-[var(--text-primary)] hover:text-[var(--primary)] transition"
              >
                Services
              </Link>

              {/* GALLERY */}
              <Link
                href="/gallery"
                className="relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide text-[var(--text-primary)] hover:text-[var(--primary)] transition"
              >
                Gallery
              </Link>

              {/* BLOG */}
              <Link
                href="/blog"
                className="relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide text-[var(--text-primary)] hover:text-[var(--primary)] transition"
              >
                Blog
              </Link>

              {/* CONTACT */}
              <Link
                href="/contact"
                className="relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide text-[var(--text-primary)] hover:text-[var(--primary)] transition"
              >
                Contact Us
              </Link>
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">
              <div className="notranslate">
                <LanguageSelector />
              </div>

              <ThemeToggle />

              {/* BUTTON */}
              <button
                onClick={() => setOpenPopup(true)}
                className="hidden lg:flex items-center gap-3 bg-[var(--primary)] rounded-full pl-4 pr-1 py-1 group hover:bg-[var(--background)] border-2 border-[var(--primary)] transition-all duration-300"
              >
                <span className="text-[14px] uppercase font-semibold text-white group-hover:text-[var(--text-primary)]">
                  Get A Quote
                </span>

                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:bg-[var(--primary)] transition">
                  <span className="text-[var(--primary)] group-hover:text-white text-lg">
                    →
                  </span>
                </div>
              </button>

              {/* MOBILE BUTTON */}
              <button
                onClick={() => setMobileMenu(true)}
                className="lg:hidden text-[var(--text-primary)]"
              >
                <Menu size={32} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-screen w-full bg-[var(--background)] z-[100] transition-all duration-300 lg:hidden overflow-hidden ${
          mobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* TOP */}
          <div className="flex items-center justify-between pb-5">
            <Image src="/hp-logo.png" alt="logo" width={160} height={60} />

            <button onClick={() => setMobileMenu(false)}>
              <X size={30} className="text-[var(--text-primary)]" />
            </button>
          </div>

          {/* MENU */}
          <div className="flex flex-col mt-8">
            <Link
              href="/"
              className="py-4 text-[var(--primary)] font-semibold uppercase text-sm"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
            >
              About Us
            </Link>

            {/* PRODUCTS */}
            <div>
              <button
                onClick={() => setMobileProduct(!mobileProduct)}
                className="w-full flex items-center justify-between py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
              >
                Products
                <div className="w-6 h-6 flex items-center justify-center">
                  {mobileProduct ? "-" : "+"}
                </div>
              </button>

              {/* DROPDOWN */}
              {mobileProduct && (
                <div className="pb-4 pl-3 max-h-[400px] overflow-y-auto">
                  {productsData.map((item, index) => (
                    <div key={index} className="mb-3 pb-3">
                      <button
                        onClick={() =>
                          setOpenMobileCategory(
                            openMobileCategory === index ? null : index,
                          )
                        }
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-[var(--text-primary)]">
                          {item.title}
                        </span>

                        <div className="w-5 h-5 flex items-center justify-center text-sm">
                          {openMobileCategory === index ? "-" : "+"}
                        </div>
                      </button>

                      {openMobileCategory === index && (
                        <div className="mt-3 pl-4 flex flex-col gap-3">
                          {item.children.map((child, i) => (
                            <Link
                              href={child.link}
                              key={i}
                              className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/services"
              className="py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
            >
              Services
            </Link>

            <Link
              href="/gallery"
              className="py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
            >
              Gallery
            </Link>

            <Link
              href="/blog"
              className="py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
            >
              Contact Us
            </Link>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setOpenPopup(true)}
              className="mt-8 flex items-center justify-center gap-4 border-2 border-[var(--primary)] rounded-full py-2 group"
            >
              <span className="text-[14px] uppercase font-semibold text-[var(--text-primary)]">
                Get A Quote
              </span>

              <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                <span className="text-white text-lg">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </>
  );
}
