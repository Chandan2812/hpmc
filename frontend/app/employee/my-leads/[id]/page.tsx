"use client";

import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Save,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Person {
  name: string;
  email: string;
}

interface Note {
  text: string;
  createdAt: string;
  createdBy?: Person;
}

interface ActivityItem {
  type: string;
  message: string;
  createdAt: string;
  employee?: Person;
}

interface Lead {
  _id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  products?: string[];
  message?: string;
  leadStatus: string;
  priority?: string;
  source?: string;
  followUpDate?: string | null;
  followUpRemark?: string;
  createdAt: string;
  assignedTo?: Person;
  notes: Note[];
  activityLog?: ActivityItem[];
}

const statuses = ["new", "contacted", "follow-up", "qualified", "won", "lost"];

export default function LeadDetailsPage() {
  const { id } = useParams();
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("new");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpRemark, setFollowUpRemark] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("employeeToken") : "";

  const fetchLead = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/employee/${id}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Lead not found");

      setLead(data.lead);
      setStatus(data.lead.leadStatus || "new");
      setFollowUpDate(data.lead.followUpDate ? data.lead.followUpDate.slice(0, 16) : "");
      setFollowUpRemark(data.lead.followUpRemark || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLead();
  }, [id]);

  const timeline = useMemo(
    () =>
      [...(lead?.activityLog || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [lead],
  );

  const updateStatus = async () => {
    await saveRequest(`${API_BASE}/employee/${id}/lead-status`, "PATCH", { leadStatus: status });
  };

  const saveFollowUp = async () => {
    if (!followUpDate) {
      setError("Please select a follow-up date.");
      return;
    }
    await saveRequest(`${API_BASE}/employee/${id}/follow-up`, "PATCH", {
      followUpDate,
      followUpRemark,
    });
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await saveRequest(`${API_BASE}/employee/${id}/note`, "POST", { text: note.trim() });
    setNote("");
  };

  const saveRequest = async (url: string, method: string, body: object) => {
    try {
      setSaving(true);
      setError("");
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed");
      await fetchLead();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
      </div>
    );
  }

  if (!lead) {
    return <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-600">{error || "Lead not found"}</div>;
  }

  return (
    <section className="pb-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/employee/my-leads" className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary)]">
          <ArrowLeft size={18} /> Back to leads
        </Link>
        <button onClick={fetchLead} className="flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] px-4">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">Assigned Lead</p>
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">{lead.name}</h1>
            <p className="mt-2 text-[var(--text-secondary)]">{lead.companyName}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge value={lead.leadStatus || "new"} />
              <Badge value={`${lead.priority || "medium"} priority`} />
              <Badge value={lead.source || "Website"} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Action href={`tel:${lead.phone}`} icon={<Phone size={18} />} label="Call" />
            <Action href={`mailto:${lead.email}`} icon={<Mail size={18} />} label="Email" />
            <Action href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} icon={<MessageCircle size={18} />} label="WhatsApp" external />
          </div>
        </div>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-600">{error}</div>}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Panel title="Contact Information" icon={<Phone size={18} />}>
            <Info label="Phone" value={lead.phone} />
            <Info label="Email" value={lead.email} />
            <Info label="Company" value={lead.companyName} />
            <Info label="Created" value={new Date(lead.createdAt).toLocaleString()} />
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Message</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">{lead.message || "No message provided."}</p>
            </div>
          </Panel>

          <Panel title="Products" icon={<CheckCircle2 size={18} />}>
            <div className="md:col-span-2 flex flex-wrap gap-2">
              {lead.products?.length ? lead.products.map((product) => (
                <span key={product} className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)]">{product}</span>
              )) : <span className="text-sm text-[var(--text-secondary)]">No product selected.</span>}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Update Pipeline" icon={<Save size={18} />}>
            <div className="md:col-span-2 grid gap-4 sm:grid-cols-[1fr_auto]">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none">
                {statuses.map((item) => <option key={item} value={item}>{item.replace("-", " ")}</option>)}
              </select>
              <button onClick={updateStatus} disabled={saving} className="h-11 rounded-xl bg-[var(--primary)] px-5 font-medium text-white disabled:opacity-60">
                Save Status
              </button>
            </div>
          </Panel>

          <Panel title="Schedule Follow Up" icon={<CalendarClock size={18} />}>
            <input
              type="datetime-local"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none"
            />
            <input
              value={followUpRemark}
              onChange={(e) => setFollowUpRemark(e.target.value)}
              placeholder="Follow-up remark"
              className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none"
            />
            <button onClick={saveFollowUp} disabled={saving} className="md:col-span-2 h-11 rounded-xl bg-[var(--primary)] px-5 font-medium text-white disabled:opacity-60">
              Save Follow Up
            </button>
          </Panel>

          <Panel title="Add Note" icon={<StickyNote size={18} />}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write call summary, requirement, quotation update..."
              className="md:col-span-2 min-h-[120px] rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3 outline-none"
            />
            <button onClick={addNote} disabled={saving || !note.trim()} className="md:col-span-2 h-11 rounded-xl bg-[var(--primary)] px-5 font-medium text-white disabled:opacity-60">
              Save Note
            </button>
          </Panel>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Notes Timeline" icon={<StickyNote size={18} />}>
          <div className="md:col-span-2 space-y-3">
            {lead.notes?.length ? lead.notes.map((item, index) => (
              <div key={`${item.createdAt}-${index}`} className="rounded-xl bg-[var(--background-secondary)] p-4">
                <p className="text-sm">{item.text}</p>
                <p className="mt-2 text-xs text-[var(--text-secondary)]">{item.createdBy?.name || "You"} - {new Date(item.createdAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-sm text-[var(--text-secondary)]">No notes yet.</p>}
          </div>
        </Panel>

        <Panel title="Activity" icon={<CalendarClock size={18} />}>
          <div className="md:col-span-2 space-y-4">
            {timeline.length ? timeline.map((item, index) => (
              <div key={`${item.createdAt}-${index}`} className="border-l-2 border-[var(--primary)]/40 pl-4">
                <p className="text-sm font-medium">{item.message}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-sm text-[var(--text-secondary)]">No activity recorded.</p>}
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">{icon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 break-words font-medium">{value}</p>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold capitalize text-[var(--primary)]">{value.replace("-", " ")}</span>;
}

function Action({ href, icon, label, external }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex h-20 min-w-[86px] flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border)] text-sm font-medium transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
    >
      {icon}
      {label}
    </a>
  );
}
