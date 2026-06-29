"use client";

import {
  Clock3,
  Eye,
  Filter,
  Mail,
  MessageCircle,
  Phone,
  PhoneCall,
  RefreshCw,
  Search,
  StickyNote,
  TrendingDown,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

interface Lead {
  _id: string;
  name: string;
  companyName?: string;
  phone: string;
  email: string;
  message?: string;
  leadStatus?: string;
  verified?: boolean;
  createdAt: string;
  customFields?: Record<string, string | number | boolean | string[]>;
  notes?: Note[];
}

interface Note {
  text: string;
  createdAt: string;
}

export default function MyLeadsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("employeeToken");
      const res = await fetch(`${API_BASE}/employee/my-leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setLeads(data.leads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchLeads();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const saveNote = async () => {
    if (!selectedLead || !note.trim()) return;

    try {
      setSavingNote(true);

      const token = localStorage.getItem("employeeToken");

      const res = await fetch(`${API_BASE}/employee/${selectedLead._id}/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: note,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setSelectedLead(null);
      setNote("");

      await fetchLeads();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        (String(lead.customFields?.companyName ?? "") || "")
          .toLowerCase()
          .includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query);

      const matchesStatus =
        statusFilter === "all" || (lead.leadStatus || "new") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      interested: leads.filter((lead) => lead.leadStatus === "interested")
        .length,
      contacted: leads.filter((lead) => lead.leadStatus === "contacted").length,
      followup: leads.filter((lead) => lead.leadStatus === "follow-up").length,
      notInterested: leads.filter(
        (lead) => lead.leadStatus === "not-interested",
      ).length,
    }),
    [leads],
  );

  const getStatusClass = (status: string) => {
    switch (status) {
      case "interested":
        return "bg-green-500/10 text-green-600";
      case "not-interested":
        return "bg-red-500/10 text-red-600";
      case "contacted":
        return "bg-blue-500/10 text-blue-600";
      case "follow-up":
        return "bg-yellow-500/10 text-yellow-600";
      default:
        return "bg-[var(--primary)]/10 text-[var(--primary)]";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
      </div>
    );
  }

  return (
    <section className="pb-24 md:pb-10">
      <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
              Lead Management
            </p>
            <h1 className="text-4xl font-bold">My Leads</h1>
            <p className="mt-2 text-[var(--text-secondary)]">
              Manage assigned leads, follow-ups and customer interest.
            </p>
          </div>

          <button
            onClick={fetchLeads}
            className="flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white transition hover:opacity-90"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={<PhoneCall size={20} />}
        />
        <StatCard
          title="Follow Up"
          value={stats.followup}
          icon={<Clock3 size={20} />}
        />
        <StatCard
          title="Interested"
          value={stats.interested}
          icon={<Trophy size={20} />}
        />
        <StatCard
          title="Not Interested"
          value={stats.notInterested}
          icon={<TrendingDown size={20} />}
        />
      </div>

      <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] pl-11 pr-4 outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] pl-11 pr-4 outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow-up">Follow Up</option>
              <option value="interested">Interested</option>
              <option value="not-interested">Not Interested</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-[var(--text-secondary)]">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <tr>
                {[
                  "Lead",
                  "Contact",
                  "Address",
                  "Latest Note",
                  "Status",
                  "Submitted",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)]"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--background-secondary)]"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/employee/my-leads/${lead._id}`}
                      className="font-semibold text-[var(--text-primary)] hover:text-[var(--primary)]"
                    >
                      {lead.name}
                    </Link>
                    <p className="mt-1 max-w-[260px] truncate text-xs text-[var(--text-secondary)]">
                      {String(
                        lead.customFields?.companyName ?? "No company detail",
                      )}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="flex items-center gap-2">
                      <Phone size={14} /> {lead.phone}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[var(--text-secondary)]">
                      <Mail size={14} /> {lead.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="flex items-center gap-2">
                      {Array.isArray(lead.customFields?.address)
                        ? lead.customFields?.address.join(", ")
                        : String(lead.customFields?.address ?? "-")}
                    </p>
                  </td>

                  <td className="w-[320px] px-5 py-4">
                    {lead.notes?.length ? (
                      <>
                        <div>
                          <p className="line-clamp-2 text-sm font-medium text-[var(--text-primary)]">
                            {lead.notes?.length
                              ? lead.notes[lead.notes.length - 1].text
                              : "No notes yet"}
                          </p>

                          {lead.notes?.length && (
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setNote("");
                              }}
                              className="mt-2 text-xs font-semibold text-[var(--primary)] hover:underline"
                            >
                              Read More
                            </button>
                          )}
                        </div>

                        <p className="mt-2 text-xs text-[var(--text-secondary)]">
                          {new Date(
                            lead.notes[lead.notes.length - 1].createdAt,
                          ).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-[var(--text-secondary)]">
                        No notes yet
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          lead.leadStatus || "new",
                        )}`}
                      >
                        {(lead.leadStatus || "new").replace("-", " ")}
                      </span>
                      {lead.verified && (
                        <span className="rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-semibold text-green-600">
                          Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="grid h-9 w-9 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-500/10"
                        title="WhatsApp"
                      >
                        <FaWhatsapp size={16} />
                      </a>
                      <a
                        href={`mailto:${lead.email}`}
                        className="grid h-9 w-9 place-items-center rounded-lg text-blue-600 hover:bg-blue-500/10"
                        title="Email"
                      >
                        <Mail size={16} />
                      </a>

                      <Link
                        href={`/employee/my-leads/${lead._id}`}
                        className="grid h-9 w-9 place-items-center rounded-lg text-[var(--primary)] hover:bg-[var(--primary)]/10"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeads.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-[var(--border)] p-14 text-center">
          <Users
            size={50}
            className="mx-auto mb-4 text-[var(--text-secondary)]"
          />
          <h3 className="text-xl font-semibold">No Leads Found</h3>
          <p className="mt-2 text-[var(--text-secondary)]">
            Try changing search or filters.
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl bg-red-500/10 p-4 text-red-500">
          {error}
        </div>
      )}

      {selectedLead && (
        <NoteModal
          lead={selectedLead}
          note={note}
          saving={savingNote}
          onNoteChange={setNote}
          onClose={() => {
            setSelectedLead(null);
            setNote("");
          }}
          onSubmit={saveNote}
        />
      )}
    </section>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
        {icon}
      </div>
      <h3 className="text-2xl font-bold md:text-3xl">{value}</h3>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{title}</p>
    </div>
  );
}

function NoteModal({
  lead,
  note,
  saving,
  onNoteChange,
  onClose,
  onSubmit,
}: {
  lead: Lead;
  note: string;
  saving: boolean;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[var(--border)] p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[4px] text-[var(--primary)]">
                Add Note
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {lead.name}
              </h2>

              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {String(lead.customFields?.companyName ?? "No company")}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm transition hover:bg-[var(--background-secondary)]"
            >
              Close
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Recent Notes */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Recent Notes
                </h3>

                <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                  {lead.notes?.length || 0} Notes
                </span>
              </div>

              <div className="max-h-64 space-y-3 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3">
                {lead.notes?.length ? (
                  [...lead.notes]
                    .reverse()
                    .slice(0, 3)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-[var(--card)] p-4 shadow-sm"
                      >
                        <p className="mb-2 text-xs font-medium text-[var(--text-secondary)]">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        <p className="whitespace-pre-wrap text-sm leading-6 text-[var(--text-primary)]">
                          {item.text}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
                    No notes available.
                  </div>
                )}
              </div>
            </div>

            {/* Add Note */}
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
                Add New Note
              </h3>

              <textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Write call summary, customer requirements, follow-up discussion, next action..."
                className="h-40 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-4 outline-none transition focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-[var(--border)] p-6">
            <button
              onClick={onClose}
              className="rounded-xl border border-[var(--border)] px-5 py-2 font-medium transition hover:bg-[var(--background-secondary)]"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={saving || !note.trim()}
              className="rounded-xl bg-[var(--primary)] px-6 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
