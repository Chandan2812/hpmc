"use client";

import { CalendarClock, Mail, MessageCircle, Phone, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Lead {
  _id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  leadStatus?: string;
  followUpDate?: string | null;
  followUpRemark?: string;
  createdAt: string;
}

export default function FollowUpsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("employeeToken");
      const res = await fetch(`${API_BASE}/employee/my-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to load follow-ups");
      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load follow-ups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [API_BASE]);

  const followUps = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads
      .filter((lead) => lead.followUpDate || lead.leadStatus === "follow-up")
      .filter(
        (lead) =>
          !query ||
          lead.name.toLowerCase().includes(query) ||
          lead.companyName.toLowerCase().includes(query) ||
          lead.phone.includes(query),
      )
      .sort((a, b) => {
        const aTime = a.followUpDate ? new Date(a.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.followUpDate ? new Date(b.followUpDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      });
  }, [leads, search]);

  const dueToday = followUps.filter((lead) => {
    if (!lead.followUpDate) return false;
    return new Date(lead.followUpDate).toDateString() === new Date().toDateString();
  }).length;

  const overdue = followUps.filter((lead) => lead.followUpDate && new Date(lead.followUpDate).getTime() < Date.now()).length;

  return (
    <section className="pb-24">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">Follow Up Desk</p>
          <h1 className="text-4xl font-bold">My Follow Ups</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Track the customers you need to call, message, or close next.</p>
        </div>
        <button onClick={fetchLeads} className="flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white">
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Stat label="Total Follow Ups" value={followUps.length} />
        <Stat label="Due Today" value={dueToday} />
        <Stat label="Overdue" value={overdue} />
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search follow-ups..."
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] pl-10 pr-4 outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
        </div>
      ) : (
        <div className="grid gap-4">
          {followUps.map((lead) => (
            <div key={lead._id} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${dueClass(lead.followUpDate)}`}>
                      {lead.followUpDate ? new Date(lead.followUpDate).toLocaleString() : "Date not set"}
                    </span>
                    <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                      {lead.leadStatus || "new"}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold">{lead.name}</h2>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{lead.companyName}</p>
                  {lead.followUpRemark && <p className="mt-3 text-sm">{lead.followUpRemark}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${lead.phone}`} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] text-green-600"><Phone size={17} /></a>
                  <a href={`mailto:${lead.email}`} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] text-blue-600"><Mail size={17} /></a>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] text-emerald-600"><MessageCircle size={17} /></a>
                  <Link href={`/employee/my-leads/${lead._id}`} className="flex h-10 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-sm font-medium text-white">
                    <CalendarClock size={16} /> Open
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && followUps.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--text-secondary)]">
          No follow-ups scheduled yet.
        </div>
      )}

      {error && <div className="mt-6 rounded-2xl bg-red-500/10 p-4 text-red-600">{error}</div>}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function dueClass(date?: string | null) {
  if (!date) return "bg-slate-500/10 text-slate-600";
  const time = new Date(date).getTime();
  if (time < Date.now()) return "bg-red-500/10 text-red-600";
  if (new Date(date).toDateString() === new Date().toDateString()) return "bg-amber-500/10 text-amber-600";
  return "bg-green-500/10 text-green-600";
}
