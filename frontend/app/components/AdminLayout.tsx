"use client";

import { FaBars, FaMailBulk, FaTimes } from "react-icons/fa";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useSettings } from "../context/SettingsContext";
import {
  Briefcase,
  Building2,
  FileCheck,
  Gauge,
  LogOut,
  MonitorPlay,
  Newspaper,
  Settings,
  User2,
  UserCog,
  Users,
  Users2,
} from "lucide-react";

import Cookies from "js-cookie";
import { FaUserGraduate } from "react-icons/fa6";
import { GrAnalytics } from "react-icons/gr";
import { IoAnalyticsOutline } from "react-icons/io5";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useSettings();
  const navSections = [
    {
      title: "Overview",
      items: [
        {
          key: "dashboard",
          icon: <Gauge size={18} />,
          label: "Dashboard",
          to: "/admin",
        },
        {
          key: "analytics",
          icon: <IoAnalyticsOutline size={18} />,
          label: "Analytics",
          to: "/admin/analytics",
        },
      ],
    },
    {
      title: "Lead Generation",
      items: [
        {
          key: "leads",
          icon: <Users size={18} />,
          label: "Leads",
          to: "/admin/lead",
        },
        {
          key: "siteVisits",
          icon: <MonitorPlay size={18} />,
          label: "Site Visits",
          to: "/admin/site-visit",
        },
      ],
    },
    {
      title: "Content & Audience",
      items: [
        {
          key: "subscribers",
          icon: <User2 size={18} />,
          label: "Subscribers",
          to: "/admin/subscribers",
        },
        {
          key: "newsletter",
          icon: <FaMailBulk size={18} />,
          label: "Newsletter",
          to: "/admin/newsletter",
        },
        {
          key: "blogs",
          icon: <Newspaper size={18} />,
          label: "Blogs",
          to: "/admin/blogs",
        },
      ],
    },
    {
      title: "Hiring",
      items: [
        {
          key: "openings",
          icon: <Briefcase size={18} />,
          label: "Job Openings",
          to: "/admin/openings",
        },
        {
          key: "jobApplications",
          icon: <FileCheck size={18} />,
          label: "Applications",
          to: "/admin/job-applications",
        },
      ],
    },
    {
      title: "Brand Trust",
      items: [
        {
          key: "clients",
          icon: <Users2 size={18} />,
          label: "Clients",
          to: "/admin/clients",
        },
      ],
    },
    {
      title: "Network",
      items: [
        {
          key: "agents",
          icon: <UserCog size={18} />,
          label: "Agents",
          to: "/admin/agents",
        },
        {
          key: "vendors",
          icon: <Building2 size={18} />,
          label: "Vendors",
          to: "/admin/vendors",
        },
      ],
    },
    {
      title: "Team",
      items: [
        {
          key: "employees",
          icon: <FaUserGraduate size={18} />,
          label: "Employees",
          to: "/admin/employee",
        },
      ],
    },
  ];

  const filteredNavSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => item.to === "/admin" || settings?.modules?.[item.key],
      ),
    }))
    .filter((section) => section.items.length > 0);
  const logoUrl = settings?.branding?.logo || "/logo.png";
  const handleLogout = () => {
    Cookies.remove("adminAuth");
    router.push("/login");
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {" "}
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden text-[var(--text-primary)] flex items-center justify-between px-5 py-4 shadow-sm border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Image
            src={logoUrl}
            alt="logo"
            width={40}
            height={40}
            className="object-contain"
          />

          <span className="text-lg font-semibold text-[var(--text)]">
            Admin
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[var(--text)] text-2xl"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* MOBILE SIDEBAR */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50
          w-3/4 sm:w-2/5
          bg-[var(--card)]
          border-r border-[var(--border)]
          shadow-xl
          transform transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Image
              src={logoUrl}
              alt="logo"
              width={40}
              height={40}
              className="object-contain"
            />

            <span className="text-lg font-semibold text-[var(--text)]">
              Admin
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-[var(--text)] text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-5 flex max-h-[calc(100vh-190px)] flex-col gap-5 overflow-y-auto px-3 pb-4">
          {filteredNavSections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-secondary)]">
                {section.title}
              </p>
              <div className="flex flex-col gap-1.5">
                {section.items.map(({ icon, label, to }) => (
                  <Link
                    key={to}
                    href={to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                      transition-all duration-300
                      ${
                        pathname === to
                          ? "bg-[var(--primary)] text-white shadow-[0_8px_20px_rgba(184,155,94,0.25)]"
                          : "text-[var(--text-light)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)]"
                      }
                    `}
                  >
                    {icon}
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-0 w-full px-3">
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`
        flex h-11 items-center justify-center gap-2
        rounded-xl border border-[var(--border)]
        text-sm font-medium
        transition-all
        ${
          pathname === "/admin/settings"
            ? "bg-[var(--primary)] text-white"
            : "hover:bg-[var(--bg-secondary)]"
        }
      `}
            >
              <Settings size={17} />
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="
    flex h-11 w-full items-center justify-center gap-2
    rounded-xl border border-red-500/20
    bg-red-500/5 px-4
    text-sm font-medium text-red-500
    transition-all
    hover:border-red-500/30 hover:bg-red-500/10
  "
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* DESKTOP SIDEBAR */}
      <aside
        className="
    hidden lg:flex
    flex-col
    w-60
    fixed
    h-screen
    bg-[var(--sidebar-card)]
    border-r border-[var(--border)]
    backdrop-blur-xl
  "
      >
        {/* Logo */}
        <div className="p-5 shrink-0">
          <Image
            src={logoUrl}
            alt="logo"
            width={140}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <nav className="flex flex-col gap-5">
            {filteredNavSections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[2px] text-[var(--text-secondary)]">
                  {section.title}
                </p>
                <div className="flex flex-col gap-1.5">
                  {section.items.map(({ icon, label, to }) => (
                    <Link
                      key={to}
                      href={to}
                      className={`
                        flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium
                        transition-all duration-300
                        ${
                          pathname === to
                            ? "bg-[var(--primary)] text-white shadow-lg"
                            : "text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--primary)]"
                        }
                      `}
                    >
                      {icon}
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Fixed Logout */}
        <div className="p-5 border-t border-[var(--border)] shrink-0">
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/settings"
              className={`
        flex h-11 items-center justify-center gap-2
        rounded-xl border border-[var(--border)]
        text-sm font-medium
        transition-all
        ${
          pathname === "/admin/settings"
            ? "bg-[var(--primary)] text-white"
            : "hover:bg-[var(--muted)]"
        }
      `}
            >
              <Settings size={17} />
              Settings
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
    flex h-11 w-full items-center justify-center gap-2
    rounded-xl border border-red-500/20
    bg-red-500/5 px-4
    text-sm font-medium text-red-500
    transition-all
    hover:border-red-500/30 hover:bg-red-500/10
  "
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </aside>
      {/* MAIN CONTENT */}
      <main
        className="
    flex-1 lg:ml-60
    overflow-y-auto
    min-h-screen
    p-5 sm:p-8
    bg-[var(--background)]
    text-[var(--text-primary)]
  "
      >
        {" "}
        {children}
      </main>
    </div>
  );
}
