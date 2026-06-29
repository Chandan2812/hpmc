"use client";

import Cookies from "js-cookie";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  StickyNote,
  UserPlus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ActionType = "note" | "follow-up" | "quotation";

interface Employee {
  name?: string;
}

interface ActivityItem {
  _id?: string;
  type: string;
  message: string;
  createdAt: string;
  employee?: {
    name?: string;
    email?: string;
  };
  lead?: {
    _id: string;
    name: string;
    companyName?: string;
  };
}

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  leadStatus?: string;
  followUpDate?: string | null;
  followUpRemark?: string;
  createdAt: string;
  lastActivityAt?: string;
  customFields?: Record<string, string | number | boolean | string[]>;
  aging?: {
    leadAgeDays: number;
    lastContactDays: number;
    noFollowUpDays: number;
    tone: "green" | "yellow" | "red";
  };
}

interface WorkDesk {
  summary: {
    followUpsDue: number;
    overdue: number;
    newLeads: number;
    siteVisits: number;
    quotationPending: number;
    openLeads: number;
    interestedLeads: number;
    notInterestedLeads: number;
  };
  priorityLeads: Lead[];
  recentActivity: ActivityItem[];
}

const EMPTY_DESK: WorkDesk = {
  summary: {
    followUpsDue: 0,
    overdue: 0,
    newLeads: 0,
    siteVisits: 0,
    quotationPending: 0,
    openLeads: 0,
    interestedLeads: 0,
    notInterestedLeads: 0,
  },
  priorityLeads: [],
  recentActivity: [],
};

export default function Dashboard() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const employee: Employee =
    typeof window !== "undefined"
      ? JSON.parse(Cookies.get("employee") || "{}")
      : {};

  const [desk, setDesk] = useState<WorkDesk>(EMPTY_DESK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [actionType, setActionType] = useState<ActionType>("note");
  const [note, setNote] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpRemark, setFollowUpRemark] = useState("");
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const fetchDesk = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("employeeToken");
      const res = await fetch(`${API_BASE}/employee/me/work-desk`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok || !data.success)
        throw new Error(data.message || "Failed to load work desk");
      setDesk({
        summary: data.summary || EMPTY_DESK.summary,
        priorityLeads: data.priorityLeads || [],
        recentActivity: data.recentActivity || [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load work desk");
    } finally {
      setLoading(false);
    }
  };
  const visibleTimeline = showAllTimeline
    ? desk.recentActivity
    : desk.recentActivity.slice(0, 4);

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchDesk();
  }, [API_BASE]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const urgentCount = useMemo(
    () =>
      desk.summary.overdue + desk.summary.followUpsDue + desk.summary.newLeads,
    [desk.summary],
  );

  const recordQuickAction = async (
    lead: Lead,
    type: "call" | "whatsapp" | "email",
  ) => {
    await saveAction(lead, type, {});
    if (type === "call") window.open(`tel:${lead.phone}`, "_self");
    if (type === "whatsapp")
      window.open(`https://wa.me/${lead.phone.replace(/\D/g, "")}`, "_blank");
    if (type === "email") window.open(`mailto:${lead.email}`, "_self");
  };

  const openAction = (lead: Lead, type: ActionType) => {
    setSelectedLead(lead);
    setActionType(type);
    setNote("");
    setFollowUpDate("");
    setFollowUpRemark("");
  };

  const saveAction = async (
    lead: Lead,
    type: string,
    payload: Record<string, string>,
  ) => {
    const token = localStorage.getItem("employeeToken");
    const res = await fetch(`${API_BASE}/employee/${lead._id}/action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actionType: type, ...payload }),
    });
    const data = await res.json();
    if (!res.ok || !data.success)
      throw new Error(data.message || "Action failed");
  };

  const submitModalAction = async () => {
    if (!selectedLead) return;

    try {
      setSaving(true);
      setError("");

      if (actionType === "follow-up") {
        await saveAction(selectedLead, "follow-up", {
          followUpDate,
          followUpRemark,
          note: followUpRemark,
        });
      } else {
        await saveAction(selectedLead, actionType, { note });
      }

      setSelectedLead(null);
      await fetchDesk();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
        <p className="mt-5 text-sm text-[var(--text-secondary)]">
          Loading work desk...
        </p>
      </div>
    );
  }

  return (
    <section className="pb-24 md:pb-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
            Lead Work Desk
          </p>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Today, {employee?.name || "Employee"}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Start from here: overdue work, due follow-ups, fresh leads, and
            pending quotations.
          </p>
        </div>
        <button
          onClick={fetchDesk}
          className="flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white"
        >
          <RefreshCw size={17} /> Refresh
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Metric
          label="Follow-ups Due"
          value={desk.summary.followUpsDue}
          icon={<CalendarClock size={18} />}
          tone="amber"
        />
        <Metric
          label="Overdue"
          value={desk.summary.overdue}
          icon={<AlertTriangle size={18} />}
          tone="red"
        />
        <Metric
          label="New Leads"
          value={desk.summary.newLeads}
          icon={<UserPlus size={18} />}
          tone="blue"
        />
        <Metric
          label="Open Leads"
          value={desk.summary.openLeads}
          icon={<ClipboardList size={18} />}
          tone="slate"
        />
        <Metric
          label="Interested"
          value={desk.summary.interestedLeads}
          icon={<CheckCircle2 size={18} />}
          tone="green"
        />

        <Metric
          label="Not Interested"
          value={desk.summary.notInterestedLeads}
          icon={<AlertTriangle size={18} />}
          tone="red"
        />
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Priority Queue</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {urgentCount} items need attention today. Work top to bottom.
            </p>
          </div>
          <span className="w-fit rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--primary)]">
            {desk.priorityLeads.length} visible
          </span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.75fr)]">
        <div className="space-y-4">
          {desk.priorityLeads.map((lead) => (
            <LeadWorkCard
              key={lead._id}
              lead={lead}
              onQuickAction={recordQuickAction}
              onOpenAction={openAction}
            />
          ))}

          {desk.priorityLeads.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--text-secondary)]">
              No priority work right now.
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="mb-5 flex items-center gap-2">
            <Clock3 size={18} className="text-[var(--primary)]" />
            <h2 className="font-semibold">Recent Timeline</h2>
          </div>

          <div className="space-y-4">
            {desk.recentActivity.length ? (
              visibleTimeline.map((item, index) => (
                <div
                  key={item._id || `${item.createdAt}-${index}`}
                  className="border-l-2 border-[var(--primary)]/40 pl-4"
                >
                  <p className="text-sm font-medium">{item.message}</p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {item.lead?.name || "Lead"} -{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">
                No activity recorded yet.
              </p>
            )}
          </div>

          {/* Add here */}
          {desk.recentActivity.length > 4 && (
            <button
              onClick={() => setShowAllTimeline(!showAllTimeline)}
              className="mt-4 w-full rounded-xl border border-[var(--border)] py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5"
            >
              {showAllTimeline ? "Show Less" : "Show More"}
            </button>
          )}
        </aside>
      </div>

      {selectedLead && (
        <ActionModal
          lead={selectedLead}
          type={actionType}
          note={note}
          followUpDate={followUpDate}
          followUpRemark={followUpRemark}
          saving={saving}
          onNoteChange={setNote}
          onFollowUpDateChange={setFollowUpDate}
          onFollowUpRemarkChange={setFollowUpRemark}
          onClose={() => setSelectedLead(null)}
          onSubmit={submitModalAction}
        />
      )}
    </section>
  );
}

function LeadWorkCard({
  lead,
  onQuickAction,
  onOpenAction,
}: {
  lead: Lead;
  onQuickAction: (lead: Lead, type: "call" | "whatsapp" | "email") => void;
  onOpenAction: (lead: Lead, type: ActionType) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <AgingBadge lead={lead} />
            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold capitalize text-[var(--primary)]">
              {(lead.leadStatus || "new").replace("-", " ")}
            </span>
            {lead.followUpDate && (
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600">
                {new Date(lead.followUpDate).toLocaleString()}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)]">
            {lead.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {String(lead.customFields?.companyName) || "No company"}
          </p>
          <div className="mt-4 grid gap-2 text-sm text-[var(--text-secondary)] sm:grid-cols-2">
            <span>{lead.phone}</span>
            <span className="break-words">{lead.email}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <AgeChip
              label="Created"
              value={`${lead.aging?.leadAgeDays || 0} days ago`}
            />
            <AgeChip
              label="Last contact"
              value={`${lead.aging?.lastContactDays || 0} days ago`}
            />
            <AgeChip
              label="No follow-up"
              value={`${lead.aging?.noFollowUpDays || 0} days`}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3">
          <IconButton
            label="Call"
            icon={<Phone size={17} />}
            onClick={() => onQuickAction(lead, "call")}
            tone="green"
          />
          <IconButton
            label="WhatsApp"
            icon={<MessageCircle size={17} />}
            onClick={() => onQuickAction(lead, "whatsapp")}
            tone="emerald"
          />
          <IconButton
            label="Email"
            icon={<Mail size={17} />}
            onClick={() => onQuickAction(lead, "email")}
            tone="blue"
          />
          <IconButton
            label="Note"
            icon={<StickyNote size={17} />}
            onClick={() => onOpenAction(lead, "note")}
            tone="slate"
          />
          <IconButton
            label="Follow-up"
            icon={<CalendarClock size={17} />}
            onClick={() => onOpenAction(lead, "follow-up")}
            tone="amber"
          />
        </div>
      </div>
    </div>
  );
}

function ActionModal({
  lead,
  type,
  note,
  followUpDate,
  followUpRemark,
  saving,
  onNoteChange,
  onFollowUpDateChange,
  onFollowUpRemarkChange,
  onClose,
  onSubmit,
}: {
  lead: Lead;
  type: ActionType;
  note: string;
  followUpDate: string;
  followUpRemark: string;
  saving: boolean;
  onNoteChange: (value: string) => void;
  onFollowUpDateChange: (value: string) => void;
  onFollowUpRemarkChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const title = {
    note: "Add Note",
    "follow-up": "Schedule Follow-up",
    quotation: "Quotation Update",
  }[type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[4px] text-[var(--primary)]">
              {title}
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{lead.name}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {String(lead.customFields?.companyName) || "No company"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 rounded-xl border border-[var(--border)] px-4 text-sm"
          >
            Close
          </button>
        </div>

        {type === "follow-up" ? (
          <div className="space-y-4">
            <input
              type="datetime-local"
              value={followUpDate}
              onChange={(event) => onFollowUpDateChange(event.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none"
            />
            <textarea
              value={followUpRemark}
              onChange={(event) => onFollowUpRemarkChange(event.target.value)}
              placeholder="Follow-up remark"
              className="min-h-[110px] w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3 outline-none"
            />
          </div>
        ) : (
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder={
              type === "quotation"
                ? "Quotation amount, PDF sent, next step..."
                : "Call summary, requirement, next step..."
            }
            className="min-h-[150px] w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3 outline-none"
          />
        )}

        <button
          onClick={onSubmit}
          disabled={
            saving || (type === "follow-up" ? !followUpDate : !note.trim())
          }
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] font-medium text-white disabled:opacity-60"
        >
          <Send size={16} /> {saving ? "Saving..." : "Save Action"}
        </button>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: string;
}) {
  const tones: Record<string, string> = {
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    red: "border-red-500/20 bg-red-500/10 text-red-600",
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-600",
    green: "border-green-500/20 bg-green-500/10 text-green-600",
    slate: "border-slate-500/20 bg-slate-500/10 text-slate-600",
  };
  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </span>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function AgingBadge({ lead }: { lead: Lead }) {
  const tone = lead.aging?.tone || "green";
  const styles = {
    green: "bg-green-500/10 text-green-600",
    yellow: "bg-amber-500/10 text-amber-600",
    red: "bg-red-500/10 text-red-600",
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {tone === "green" ? (
        <CheckCircle2 size={13} />
      ) : (
        <AlertTriangle size={13} />
      )}
      {tone.toUpperCase()}
    </span>
  );
}

function AgeChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-[var(--text-secondary)]">
      {label}:{" "}
      <span className="font-semibold text-[var(--text-primary)]">{value}</span>
    </span>
  );
}

function IconButton({
  label,
  icon,
  tone,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  tone: string;
  onClick: () => void;
}) {
  const styles: Record<string, string> = {
    green: "text-green-600 hover:bg-green-500/10",
    emerald: "text-emerald-600 hover:bg-emerald-500/10",
    blue: "text-blue-600 hover:bg-blue-500/10",
    slate: "text-slate-600 hover:bg-slate-500/10",
    amber: "text-amber-600 hover:bg-amber-500/10",
    violet: "text-violet-600 hover:bg-violet-500/10",
  };
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex h-16 min-w-[72px] flex-col items-center justify-center gap-1 rounded-xl border border-[var(--border)] text-xs font-semibold ${styles[tone]}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
