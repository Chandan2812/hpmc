"use client";

import { BadgeCheck, BriefcaseBusiness, Mail, Phone, RefreshCw, Target, Trophy, UserRound } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

interface Employee {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  monthlyTarget?: number;
  createdAt?: string;
}

interface Stats {
  assigned: number;
  contacted: number;
  followUps: number;
  won: number;
  lost: number;
  conversion: number;
}

export default function EmployeeProfilePage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const cookieEmployee = typeof window !== "undefined" ? JSON.parse(Cookies.get("employee") || "{}") : {};
  const [employee, setEmployee] = useState<Employee>(cookieEmployee);
  const [stats, setStats] = useState<Stats>({ assigned: 0, contacted: 0, followUps: 0, won: 0, lost: 0, conversion: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("employeeToken");
      const res = await fetch(`${API_BASE}/employee/me/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load profile");
      setEmployee(data.employee);
      setStats(data.stats);
      Cookies.set("employee", JSON.stringify(data.employee), { expires: 1, sameSite: "strict" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [API_BASE]);

  return (
    <section className="pb-24">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">Employee Profile</p>
          <h1 className="text-4xl font-bold">{employee?.name || "Employee"}</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Your CRM profile, targets, and current pipeline performance.</p>
        </div>
        <button onClick={fetchProfile} className="flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white">
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      {error && <div className="mb-6 rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <UserRound size={30} />
          </div>
          <h2 className="text-2xl font-semibold">{employee?.name || "Employee"}</h2>
          <p className="mt-1 text-[var(--text-secondary)]">{employee?.role || "Sales Executive"}</p>

          <div className="mt-6 space-y-4">
            <Info icon={<Mail size={17} />} label="Email" value={employee?.email || "-"} />
            <Info icon={<Phone size={17} />} label="Phone" value={employee?.phone || "-"} />
            <Info icon={<BriefcaseBusiness size={17} />} label="Department" value={employee?.department || "Sales"} />
            <Info icon={<Target size={17} />} label="Monthly Target" value={`${employee?.monthlyTarget || 0} deals`} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Metric label="Assigned Leads" value={stats.assigned} icon={<BadgeCheck size={18} />} />
            <Metric label="Won Deals" value={stats.won} icon={<Trophy size={18} />} />
            <Metric label="Conversion" value={`${stats.conversion}%`} icon={<Target size={18} />} />
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="mb-5 text-lg font-semibold">Pipeline Breakdown</h2>
            <div className="space-y-4">
              <Bar label="Contacted" value={stats.contacted} total={stats.assigned} />
              <Bar label="Follow Ups" value={stats.followUps} total={stats.assigned} />
              <Bar label="Won" value={stats.won} total={stats.assigned} />
              <Bar label="Lost" value={stats.lost} total={stats.assigned} />
            </div>
          </div>
        </div>
      </div>

      {loading && <p className="mt-6 text-sm text-[var(--text-secondary)]">Refreshing profile...</p>}
    </section>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[var(--background-secondary)] p-4">
      <span className="text-[var(--primary)]">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
        <p className="mt-1 font-medium">{value}</p>
      </div>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const width = total ? Math.min(100, (value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[var(--background-secondary)]">
        <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
