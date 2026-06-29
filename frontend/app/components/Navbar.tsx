"use client";

import Image from "next/image";
import Link from "next/link";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

import { useEffect, useState } from "react";

import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./Theme-toggle";
import PopupForm from "./Popup";
import { usePathname } from "next/navigation";

const productsData = [
  {
    title: "PVC Pipe Plant",
    children: [
      {
        name: "Single Screw Extruder",
        link: "/single-screw-extruder",
      },
      {
        name: "Twin Screw Extruder",
        link: "/twin-screw-extruder",
      },
      {
        name: "PVC Conduit Pipe Plant (Two Pipes)",
        link: "/pvc-conduit-pipe-plant-two-pipes",
      },
      {
        name: "PVC Conduit Pipe Plant (Four Pipes)",
        link: "/pvc-conduit-pipe-plant-four-pipes",
      },
    ],
  },

  {
    title: "HDPE Pipe Plant",
    children: [
      {
        name: "High Speed HDPE Pipe Plant",
        link: "/high-speed-hdpe-pipe-plant",
      },
    ],
  },

  {
    title: "PVC Compounding Extruder",
    children: [
      {
        name: "Twin Screw Plant for PVC Compounding",
        link: "/pvc-compounding",
      },
    ],
  },
  {
    title: "PPR Pipe Extruder",
    children: [
      {
        name: "Single Screw Plant for PPR Pipe",
        link: "/ppr-pipe-extruder",
      },
    ],
  },
  {
    title: "Plastic Pelletizing Plant",
    children: [
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
    ],
  },
  {
    title: "Co-Rotating Twin Screw Extruder",
    children: [
      {
        name: "Soft Cable Grade PVC Compounding Plant",
        link: "/soft-cable-grade-pvc-compounding-plant",
      },
      {
        name: "Corotating Twin Screw Extruder for Compounding & Recycling",
        link: "/corotating-twin-screw-extruder-for-compounding-&-recycling",
      },
      {
        name: "Corotating Triple Screw Extruder for Compounding & Recycling (Engineering Plastic)",
        link: "/corotating-triple-screw-extruder-for-compounding-&-recycling",
      },
    ],
  },
  {
    title: "Cable Extruder",
    children: [
      {
        name: "High Speed Two Layer Cable Plant",
        link: "/high-speed-two-layer-cable-plant",
      },
    ],
  },
  {
    title: "PVC Trunking Extruder",
    children: [
      {
        name: "Twin Screw Plant for PVC Trunking",
        link: "/twin-screw-plant-for-pvc-trunking",
      },
    ],
  },
  {
    title: "PVC Profile Extruder",
    children: [
      {
        name: "Single Screw Plant for PVC Profile",
        link: "/single-screw-plant-for-pvc-profile",
      },
      {
        name: "Twin Screw Plant for PVC Profile",
        link: "/twin-screw-plant-for-pvc-profile",
      },
    ],
  },
  {
    title: "Garden Pipe Extruder",
    children: [
      {
        name: "Single Screw Plant for Garden Pipe",
        link: "/single-screw-plant-for-garden-pipe",
      },
    ],
  },
  {
    title: "LLDPE Pipe Extruder",
    children: [
      {
        name: "LLDPE Pipe Plant",
        link: "/lldpe-pipe-plant",
      },
    ],
  },
  {
    title: "CPVC Pipe Extruder",
    children: [
      {
        name: "Twin Screw Plant for CPVC Pipe",
        link: "/twin-screw-plant-for-cpvc-pipe",
      },
    ],
  },
];

const companyMenu = [
  {
    name: "About Us",
    link: "/about",
  },
  {
    name: "Vision & Mission",
    link: "/vision-mission",
  },
  {
    name: "Our Journey",
    link: "/our-journey",
  },
  {
    name: "Leadership Team",
    link: "/leadership-team",
  },
  {
    name: "Manufacturing Facility",
    link: "/manufacturing-facility",
  },
  {
    name: "Global Reach",
    link: "/global-reach",
  },
  {
    name: "Memberships",
    link: "/memberships",
  },
  {
    name: "Clients",
    link: "/clients",
  },
  {
    name: "Code of Conduct",
    link: "/code-of-conduct",
  },
  {
    name: "Milestones",
    link: "/milestones",
  },
  {
    name: "Awards & Recognition",
    link: "/awards-recognition",
  },
  {
    name: "CSR Activities",
    link: "/csr",
  },
  {
    name: "FAQs",
    link: "/faq",
  },
];

const serviceSupportMenu = [
  {
    name: "Technical Assistance",
    link: "/technical-assistance",
  },
  {
    name: "Field Services",
    link: "/field-services",
  },

  {
    name: "Spare Parts",
    link: "/spare-parts",
  },
  {
    name: "Training",
    link: "/training",
  },
  {
    name: "Manuals",
    link: "/manuals",
  },
  {
    name: "Extrusion Hints",
    link: "/extrusion-hints",
  },
  {
    name: "Trouble Shooting",
    link: "/trouble-shooting",
  },
];

const contactMenu = [
  {
    title: "Contact Us",
    children: [
      {
        name: "Get In Touch",
        link: "/get-in-touch",
      },
      {
        name: "Schedule a Site Visit",
        link: "/schedule-a-site-visit",
      },
      {
        name: "Become An Agent",
        link: "/become-an-agent",
      },
      {
        name: "Vendor Registration",
        link: "/vendor-registration",
      },
      {
        name: "Overseas Agents",
        link: "/overseas-agents",
      },
    ],
  },

  {
    title: "Careers",
    children: [
      {
        name: "Current Openings",
        link: "/current-openings",
      },
      {
        name: "Submit Resume",
        link: "/submit-resume",
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
  const [mobileContact, setMobileContact] = useState(false);

  const [openMobileCategory, setOpenMobileCategory] = useState<number | null>(
    null,
  );
  const [openPopup, setOpenPopup] = useState(false);

  const [mobileCompany, setMobileCompany] = useState(false);
  const [mobileService, setMobileService] = useState(false);
  const pathname = usePathname();
  const isCompanyActive = companyMenu.some((item) => pathname === item.link);

  const isServiceActive = serviceSupportMenu.some(
    (item) => pathname === item.link,
  );

  const isProductActive = productsData.some((category) =>
    category.children.some((product) => pathname === product.link),
  );
  const isContactActive = contactMenu.some((category) =>
    category.children.some((contact) => pathname === contact.link),
  );

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
                width={170}
                height={80}
                priority
              />
            </Link>

            {/* DESKTOP MENU */}
            <nav className="hidden lg:flex items-center gap-7 h-full">
              {/* HOME */}
              <Link
                href="/"
                className={`relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide transition ${
                  pathname === "/"
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                }`}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
                )}
              </Link>

              {/* ABOUT */}
              <div className="relative group h-full flex items-center">
                <button
                  className={`flex items-center gap-1 text-[14px] uppercase font-semibold tracking-wide transition h-full ${
                    isCompanyActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  Company
                  <ChevronDown size={16} />
                </button>

                {isCompanyActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
                )}

                <div className="absolute top-full left-0 w-[280px] bg-[var(--card)] shadow-[var(--shadow-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-[var(--border)]">
                  <div className="max-h-[480px] overflow-y-auto">
                    {companyMenu.map((item) => (
                      <Link
                        key={item.link}
                        href={item.link}
                        className={`block px-4 py-1 transition ${
                          pathname === item.link
                            ? "bg-[var(--muted)] text-[var(--primary)]"
                            : "hover:bg-[var(--muted)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* PRODUCTS */}
              <div
                className="relative group h-full flex items-center"
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 text-[14px] uppercase font-semibold tracking-wide transition h-full ${
                    isProductActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {" "}
                  Products
                  <ChevronDown size={16} />
                </button>

                {isProductActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
                )}

                {/* DROPDOWN */}
                <div className="absolute top-full left-0 mt-0 w-[340px] bg-[var(--card)] shadow-[var(--shadow-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-[var(--border)]">
                  {productsData.map((item, index) => (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(index)}
                    >
                      {/* LEFT */}
                      <div className="flex items-center justify-between px-4 py-1 hover:bg-[var(--muted)] cursor-pointer transition">
                        <span className="text-[var(--text-secondary)] font-medium">
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
                              className="block px-4 py-1 hover:bg-[var(--muted)] hover:text-[var(--primary)] transition text-[var(--text-secondary)]"
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
              <div className="relative group h-full flex items-center">
                <button
                  className={`flex items-center gap-1 text-[14px] uppercase font-semibold tracking-wide transition h-full ${
                    isServiceActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  Support
                  <ChevronDown size={16} />
                </button>

                {isServiceActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
                )}

                <div className="absolute top-full left-0 w-[240px] bg-[var(--card)] shadow-[var(--shadow-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-[var(--border)]">
                  {serviceSupportMenu.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      className={`block px-4 py-1 transition ${
                        pathname === item.link
                          ? "bg-[var(--muted)] text-[var(--primary)]"
                          : "hover:bg-[var(--muted)] text-[var(--text-secondary)]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* GALLERY */}
              {/* <Link
                href="/gallery"
                className={`relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide transition ${
                  pathname === "/gallery"
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                }`}
              >
                Gallery
                {pathname === "/gallery" && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
                )}
              </Link> */}

              {/* BLOG */}
              <Link
                href="/blog"
                className={`relative h-full flex items-center text-[14px] uppercase font-semibold tracking-wide transition ${
                  pathname === "/blog"
                    ? "text-[var(--primary)]"
                    : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                }`}
              >
                Blog
                {pathname === "/blog" && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
                )}
              </Link>

              {/* CONTACT */}
              <div
                className="relative group h-full flex items-center"
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`flex items-center gap-1 text-[14px] uppercase font-semibold tracking-wide transition h-full ${
                    isContactActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-primary)] hover:text-[var(--primary)]"
                  }`}
                >
                  {" "}
                  Contact
                  <ChevronDown size={16} />
                </button>

                {isContactActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--primary)] rounded-full" />
                )}

                {/* DROPDOWN */}
                <div className="absolute top-full left-0 mt-0 w-[200px] bg-[var(--card)] shadow-[var(--shadow-primary)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-[var(--border)]">
                  {contactMenu.map((item, index) => (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(index)}
                    >
                      {/* LEFT */}
                      <div className="flex items-center justify-between px-4 py-1 hover:bg-[var(--muted)] cursor-pointer transition">
                        <span className="text-[var(--text-secondary)] font-medium">
                          {item.title}
                        </span>

                        <ChevronRight
                          size={16}
                          className="text-[var(--text-secondary)]"
                        />
                      </div>

                      {/* RIGHT */}
                      {activeDropdown === index && (
                        <div className="absolute left-full top-0 w-[200px] bg-[var(--card)] shadow-[var(--shadow-primary)] border border-[var(--border)]">
                          {item.children.map((child, i) => (
                            <Link
                              href={child.link}
                              key={i}
                              className="block px-4 py-1 hover:bg-[var(--muted)] hover:text-[var(--primary)] transition text-[var(--text-secondary)]"
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
                  Get In Touch
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

            {/* THE COMPANY */}
            <div>
              <button
                onClick={() => setMobileCompany(!mobileCompany)}
                className="w-full flex items-center justify-between py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
              >
                The Company
                <div className="w-6 h-6 flex items-center justify-center">
                  {mobileCompany ? "-" : "+"}
                </div>
              </button>

              {mobileCompany && (
                <div className="pl-4 pb-4 flex flex-col gap-3">
                  {companyMenu.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      className={`text-sm transition ${
                        pathname === item.link
                          ? "text-[var(--primary)] font-semibold"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

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

            {/* SERVICE & SUPPORT */}
            <div>
              <button
                onClick={() => setMobileService(!mobileService)}
                className="w-full flex items-center justify-between py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
              >
                Service & Support
                <div className="w-6 h-6 flex items-center justify-center">
                  {mobileService ? "-" : "+"}
                </div>
              </button>

              {mobileService && (
                <div className="pl-4 pb-4 flex flex-col gap-3">
                  {serviceSupportMenu.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      className={`text-sm transition ${
                        pathname === item.link
                          ? "text-[var(--primary)] font-semibold"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* <Link
              href="/gallery"
              className="py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
            >
              Gallery
            </Link> */}

            <Link
              href="/blog"
              className="py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
            >
              Blog
            </Link>

            <div>
              <button
                onClick={() => setMobileContact(!mobileContact)}
                className="w-full flex items-center justify-between py-4 text-[var(--text-primary)] font-semibold uppercase text-sm"
              >
                Contact
                <div className="w-6 h-6 flex items-center justify-center">
                  {mobileContact ? "-" : "+"}
                </div>
              </button>

              {/* DROPDOWN */}
              {mobileContact && (
                <div className="pb-4 pl-3 max-h-[400px] overflow-y-auto">
                  {contactMenu.map((item, index) => (
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

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setOpenPopup(true)}
              className="mt-8 flex items-center justify-center gap-4 border-2 border-[var(--primary)] rounded-full py-2 group"
            >
              <span className="text-[14px] uppercase font-semibold text-[var(--text-primary)]">
                Get In Touch
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
