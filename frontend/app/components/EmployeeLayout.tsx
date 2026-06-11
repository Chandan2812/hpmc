"use client";

import { FaBars, FaTimes, FaMailBulk } from "react-icons/fa";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import {
  Briefcase,
  Building2,
  FileCheck,
  Gauge,
  LogOut,
  MonitorPlay,
  Newspaper,
  User2,
  UserCog,
  Users,
  Users2,
} from "lucide-react";

import Cookies from "js-cookie";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      icon: <Gauge size={18} />,
      label: "Dashboard",
      to: "/employee",
    },
  ];

  const handleLogout = () => {
    Cookies.remove("employeeAuth");
    router.push("/login");
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      {" "}
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden text-[var(--text-primary)] flex items-center justify-between px-5 py-4 shadow-sm border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Image
            src="/hp-logo.png"
            alt="logo"
            width={40}
            height={40}
            className="object-contain"
          />

          <span className="text-lg font-semibold text-[var(--text)]">
            Employee
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
            <Image src="/hp-logo.png" alt="logo" width={40} height={40} />

            <span className="text-lg font-semibold text-[var(--text)]">
              Employee
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
        <nav className="flex flex-col mt-6 px-3 gap-2">
          {navItems.map(({ icon, label, to }) => (
            <Link
              key={to}
              href={to}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                  flex items-center gap-3
                  px-4 py-3 rounded-xl
                  text-sm font-medium
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
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-0 w-full px-3">
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
      {/* DESKTOP SIDEBAR */}
      <aside
        className="
    hidden lg:flex
    flex-col
    w-48
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
            src="/hp-logo.png"
            alt="logo"
            width={140}
            height={100}
            className="object-contain"
          />
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <nav className="flex flex-col gap-2">
            {navItems.map(({ icon, label, to }) => (
              <Link
                key={to}
                href={to}
                className={`
            flex items-center gap-3
            px-4 py-3 rounded-xl
            text-sm font-medium
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
          </nav>
        </div>

        {/* Fixed Logout */}
        <div className="p-5 border-t border-[var(--border)] shrink-0">
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
      </aside>
      {/* MAIN CONTENT */}
      <main
        className="
    flex-1 lg:ml-48
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
