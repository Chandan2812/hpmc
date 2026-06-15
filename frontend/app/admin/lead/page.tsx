"use client";

import {
  Activity,
  CalendarClock,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  Search,
  Trash2,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type LeadStatus = "new" | "contacted" | "follow-up" | "qualified" | "won" | "lost";
type Priority = "low" | "medium" | "high";

interface Employee {
  _id: string;
  name: string;
  email: string;
}

interface ActivityItem {
  type: string;
  message: string;
  createdAt: string;
  employee?: Employee | null;
}

interface Note {
  text: string;
  createdAt: string;
  createdBy?: Employee | null;
}

interface LeadRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  products?: string[];
  message?: string;
  marked?: boolean;
  verified?: boolean;
  leadStatus?: LeadStatus;
  priority?: Priority;
  source?: string;
  followUpDate?: string | null;
  followUpRemark?: string;
  assignedTo?: Employee | null;
  notes?: Note[];
  activityLog?: ActivityItem[];
  createdAt: string;
  lastActivityAt?: string;
}

const statusOptions: Array<"all" | LeadStatus> = [
  "all",
  "new",
  "contacted",
  "follow-up",
  "qualified",
  "won",
  "lost",
];

const ITEMS_PER_PAGE = 20;

export default function AdminLead() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const [leads, setLeads] = useState<LeadRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadRes, employeeRes] = await Promise.all([
        fetch(`${API_BASE}/lead`, { cache: "no-store" }),
        fetch(`${API_BASE}/employee`, { cache: "no-store" }),
      ]);
      const leadData = await leadRes.json();
      const employeeData = await employeeRes.json();

      setLeads(
        [...(Array.isArray(leadData) ? leadData : [])].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      if (employeeData.success) setEmployees(employeeData.employees || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_BASE]);

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return leads.filter((lead) => {
      const status = lead.leadStatus || "new";
      const priority = lead.priority || "medium";
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        (lead.companyName || "").toLowerCase().includes(query) ||
        (lead.assignedTo?.name || "").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesAssignment =
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned" ? Boolean(lead.assignedTo) : !lead.assignedTo);
      const matchesPriority = priorityFilter === "all" || priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesAssignment && matchesPriority;
    });
  }, [assignmentFilter, leads, priorityFilter, searchQuery, statusFilter]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      assigned: leads.filter((lead) => lead.assignedTo).length,
      unassigned: leads.filter((lead) => !lead.assignedTo).length,
      followUps: leads.filter((lead) => lead.leadStatus === "follow-up").length,
      won: leads.filter((lead) => lead.leadStatus === "won").length,
      pending: leads.filter((lead) => !lead.marked).length,
    }),
    [leads],
  );

  const currentLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const hasFilters =
    searchQuery || statusFilter !== "all" || assignmentFilter !== "all" || priorityFilter !== "all";

  const updateLeadInState = (leadId: string, patch: Partial<LeadRequest>) => {
    setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, ...patch } : lead)));
    setSelectedLead((prev) => (prev?._id === leadId ? { ...prev, ...patch } : prev));
  };

  const handleAssignLead = async (leadId: string, employeeId: string) => {
    const res = await fetch(`${API_BASE}/lead/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, employeeId: employeeId || null }),
    });
    const data = await res.json();
    if (!data.success) {
      alert(data.message || "Failed to assign lead");
      return;
    }
    updateLeadInState(leadId, data.lead);
  };

  const handleMark = async (id: string, marked: boolean) => {
    const res = await fetch(`${API_BASE}/lead/${id}/mark`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marked }),
    });
    const data = await res.json();
    if (data.lead) updateLeadInState(id, data.lead);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`${API_BASE}/lead/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setLeads((prev) => prev.filter((lead) => lead._id !== id));
    if (selectedLead?._id === id) setSelectedLead(null);
  };

  const handleExport = () => {
    const rows = [
      ["Name", "Email", "Phone", "Company", "Status", "Priority", "Assigned To", "Next Follow Up"],
      ...filteredLeads.map((lead) => [
        lead.name,
        lead.email,
        lead.phone,
        lead.companyName || "",
        lead.leadStatus || "new",
        lead.priority || "medium",
        lead.assignedTo?.name || "Unassigned",
        lead.followUpDate ? new Date(lead.followUpDate).toLocaleString() : "",
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = window.URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setAssignmentFilter("all");
    setPriorityFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="pb-24">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">Admin Panel</p>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">Lead CRM</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Assign inquiries, monitor employee follow-ups, and keep the sales pipeline moving.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white">
            <Download size={17} /> Export
          </button>
          {hasFilters && (
            <button onClick={resetFilters} className="flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4">
              <RotateCcw size={16} /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <Stat label="Total" value={stats.total} icon={<Users size={18} />} tone="blue" />
        <Stat label="Assigned" value={stats.assigned} icon={<UserRoundCheck size={18} />} tone="green" />
        <Stat label="Unassigned" value={stats.unassigned} icon={<Filter size={18} />} tone="amber" />
        <Stat label="Follow Ups" value={stats.followUps} icon={<CalendarClock size={18} />} tone="violet" />
        <Stat label="Won" value={stats.won} icon={<CheckCircle2 size={18} />} tone="emerald" />
        <Stat label="Pending" value={stats.pending} icon={<Activity size={18} />} tone="rose" />
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search name, company, phone, employee..."
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] pl-10 pr-4 outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <Select value={statusFilter} onChange={(value) => setStatusFilter(value as (typeof statusOptions)[number])} options={statusOptions} />
          <Select value={assignmentFilter} onChange={setAssignmentFilter} options={["all", "assigned", "unassigned"]} />
          <Select value={priorityFilter} onChange={setPriorityFilter} options={["all", "high", "medium", "low"]} />
        </div>
      </div>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                <tr>
                  {["Lead", "Contact", "Pipeline", "Assigned To", "Next Follow Up", "Actions"].map((head) => (
                    <th key={head} className="px-5 py-4 text-left text-sm font-semibold">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead) => (
                  <tr key={lead._id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background-secondary)]">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{lead.name}</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{lead.companyName || "No company"}</p>
                      <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${priorityClass(lead.priority)}`}>
                        {lead.priority || "medium"} priority
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <p>{lead.phone}</p>
                      <p className="mt-1 text-[var(--text-secondary)]">{lead.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(lead.leadStatus || "new")}`}>
                        {lead.leadStatus || "new"}
                      </span>
                      <button
                        onClick={() => handleMark(lead._id, !lead.marked)}
                        className={`ml-2 rounded-full px-3 py-1 text-xs font-semibold ${lead.marked ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}
                      >
                        {lead.marked ? "Completed" : "Open"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.assignedTo?._id || ""}
                        onChange={(e) => handleAssignLead(lead._id, e.target.value)}
                        className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none"
                      >
                        <option value="">Unassigned</option>
                        {employees.map((employee) => (
                          <option key={employee._id} value={employee._id}>{employee.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      {lead.followUpDate ? (
                        <>
                          <p>{new Date(lead.followUpDate).toLocaleString()}</p>
                          <p className="mt-1 max-w-[220px] truncate text-[var(--text-secondary)]">{lead.followUpRemark}</p>
                        </>
                      ) : (
                        <span className="text-[var(--text-secondary)]">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <a href={`tel:${lead.phone}`} className="grid h-9 w-9 place-items-center rounded-lg text-green-600 hover:bg-green-500/10" title="Call"><Phone size={16} /></a>
                        <a href={`mailto:${lead.email}`} className="grid h-9 w-9 place-items-center rounded-lg text-blue-600 hover:bg-blue-500/10" title="Email"><Mail size={16} /></a>
                        <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-500/10" title="WhatsApp"><MessageCircle size={16} /></a>
                        <button onClick={() => setSelectedLead(lead)} className="grid h-9 w-9 place-items-center rounded-lg text-[var(--primary)] hover:bg-[var(--primary)]/10" title="View"><Eye size={16} /></button>
                        <button onClick={() => handleDelete(lead._id)} className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-500/10" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && filteredLeads.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--text-secondary)]">
          No leads match the selected filters.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-end gap-3">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)} className="h-10 rounded-xl border border-[var(--border)] px-4 disabled:opacity-40">Prev</button>
          <div className="grid h-10 min-w-10 place-items-center rounded-xl bg-[var(--primary)] px-4 text-white">{currentPage}</div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)} className="h-10 rounded-xl border border-[var(--border)] px-4 disabled:opacity-40">Next</button>
        </div>
      )}

      {selectedLead && (
        <LeadModal lead={selectedLead} employees={employees} onClose={() => setSelectedLead(null)} onAssign={handleAssignLead} onMark={handleMark} />
      )}
    </div>
  );
}

function LeadModal({
  lead,
  employees,
  onClose,
  onAssign,
  onMark,
}: {
  lead: LeadRequest;
  employees: Employee[];
  onClose: () => void;
  onAssign: (leadId: string, employeeId: string) => void;
  onMark: (leadId: string, marked: boolean) => void;
}) {
  const timeline = [...(lead.activityLog || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[4px] text-[var(--primary)]">Lead Detail</p>
            <h2 className="font-serif text-3xl">{lead.name}</h2>
          </div>
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border)]"><X size={20} /></button>
        </div>

        <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h3 className="mb-4 font-semibold">Customer</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Company" value={lead.companyName || "-"} />
                <Info label="Email" value={lead.email} />
                <Info label="Phone" value={lead.phone} />
                <Info label="Source" value={lead.source || "Website"} />
              </div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">{lead.message || "No message provided."}</p>
            </section>

            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h3 className="mb-4 font-semibold">Products</h3>
              <div className="flex flex-wrap gap-2">
                {lead.products?.length ? lead.products.map((product) => (
                  <span key={product} className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm text-[var(--primary)]">{product}</span>
                )) : <span className="text-sm text-[var(--text-secondary)]">No product selected.</span>}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h3 className="mb-4 font-semibold">Employee Notes</h3>
              <div className="space-y-3">
                {lead.notes?.length ? lead.notes.map((note, index) => (
                  <div key={`${note.createdAt}-${index}`} className="rounded-xl bg-[var(--background-secondary)] p-4">
                    <p className="text-sm">{note.text}</p>
                    <p className="mt-2 text-xs text-[var(--text-secondary)]">
                      {note.createdBy?.name || "Employee"} - {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                )) : <p className="text-sm text-[var(--text-secondary)]">No notes yet.</p>}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h3 className="mb-4 font-semibold">Assignment</h3>
              <select
                value={lead.assignedTo?._id || ""}
                onChange={(e) => onAssign(lead._id, e.target.value)}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none"
              >
                <option value="">Unassigned</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>{employee.name}</option>
                ))}
              </select>
              <button
                onClick={() => onMark(lead._id, !lead.marked)}
                className="mt-4 h-11 w-full rounded-xl bg-[var(--primary)] font-medium text-white"
              >
                {lead.marked ? "Reopen Lead" : "Mark Completed"}
              </button>
            </section>

            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h3 className="mb-4 font-semibold">Activity Timeline</h3>
              <div className="space-y-4">
                {timeline.length ? timeline.map((item, index) => (
                  <div key={`${item.createdAt}-${index}`} className="border-l-2 border-[var(--primary)]/40 pl-4">
                    <p className="text-sm font-medium">{item.message}</p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {item.employee?.name || "Admin"} - {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                )) : <p className="text-sm text-[var(--text-secondary)]">No activity recorded.</p>}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 capitalize outline-none focus:ring-2 focus:ring-[var(--primary)]"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option.replace("-", " ")}</option>
      ))}
    </select>
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

function Stat({ label, value, icon, tone }: { label: string; value: number; icon: React.ReactNode; tone: string }) {
  const tones: Record<string, string> = {
    blue: "border-blue-500/20 bg-blue-500/10 text-blue-600",
    green: "border-green-500/20 bg-green-500/10 text-green-600",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-600",
    violet: "border-violet-500/20 bg-violet-500/10 text-violet-600",
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
    rose: "border-rose-500/20 bg-rose-500/10 text-rose-600",
  };
  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">{label}</span>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function statusClass(status: LeadStatus) {
  return {
    new: "bg-slate-500/10 text-slate-600",
    contacted: "bg-blue-500/10 text-blue-600",
    "follow-up": "bg-amber-500/10 text-amber-600",
    qualified: "bg-violet-500/10 text-violet-600",
    won: "bg-green-500/10 text-green-600",
    lost: "bg-red-500/10 text-red-600",
  }[status];
}

function priorityClass(priority: Priority = "medium") {
  return {
    low: "bg-slate-500/10 text-slate-600",
    medium: "bg-blue-500/10 text-blue-600",
    high: "bg-red-500/10 text-red-600",
  }[priority];
}
