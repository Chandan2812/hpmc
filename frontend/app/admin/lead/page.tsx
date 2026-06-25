"use client";

import {
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
  Upload,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { useSettings } from "../../context/SettingsContext";

type LeadStatus =
  | "new"
  | "contacted"
  | "follow-up"
  | "interested"
  | "not-interested";

interface Employee {
  _id: string;
  name: string;
  email: string;
  active?: boolean;
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
  customFields?: Record<string, string | number | boolean>;
  message?: string;
  verified?: boolean;
  leadStatus?: LeadStatus;
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
  "interested",
  "not-interested",
];

const ITEMS_PER_PAGE = 20;

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : "";

const formatFieldValue = (value: unknown) => {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
};

export default function AdminLead() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const { settings, loading: settingsLoading } = useSettings();
  const showAssignment =
    !settingsLoading && settings?.modules?.employees !== false;

  const [leads, setLeads] = useState<LeadRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof statusOptions)[number]>("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!showAssignment) {
      setStatusFilter("all");
      setAssignmentFilter("all");
    }
  }, [showAssignment]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadRes, employeeRes] = await Promise.all([
        fetch(`${API_BASE}/lead`, { cache: "no-store" }),
        showAssignment
          ? fetch(`${API_BASE}/employee`, { cache: "no-store" })
          : Promise.resolve(null),
      ]);
      const leadData = await leadRes.json();
      const employeeData = employeeRes ? await employeeRes.json() : null;

      setLeads(
        [...(Array.isArray(leadData) ? leadData : [])].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      if (employeeData?.success) {
        setEmployees(employeeData.data || employeeData.employees || []);
      } else {
        setEmployees([]);
      }
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchData();
  }, [API_BASE, showAssignment]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return leads.filter((lead) => {
      const status = lead.leadStatus || "new";
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        Object.values(lead.customFields || {}).some((value) =>
          String(value).toLowerCase().includes(query),
        ) ||
        (showAssignment &&
          (lead.assignedTo?.name || "").toLowerCase().includes(query));
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesAssignment =
        !showAssignment ||
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned"
          ? Boolean(lead.assignedTo)
          : !lead.assignedTo);

      return matchesSearch && matchesStatus && matchesAssignment;
    });
  }, [assignmentFilter, leads, searchQuery, showAssignment, statusFilter]);

  const stats = useMemo(
    () => ({
      total: leads.length,
      assigned: showAssignment
        ? leads.filter((lead) => lead.assignedTo).length
        : 0,
      unassigned: showAssignment
        ? leads.filter((lead) => !lead.assignedTo).length
        : 0,
      followUps: leads.filter((lead) => lead.leadStatus === "follow-up").length,
      interested: leads.filter((lead) => lead.leadStatus === "interested")
        .length,
      notInterested: leads.filter(
        (lead) => lead.leadStatus === "not-interested",
      ).length,
      verified: leads.filter((lead) => lead.verified).length,
      open: leads.filter(
        (lead) =>
          !["interested", "not-interested"].includes(lead.leadStatus || "new"),
      ).length,
    }),
    [leads, showAssignment],
  );

  const currentLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const hasFilters =
    searchQuery ||
    statusFilter !== "all" ||
    (showAssignment && assignmentFilter !== "all");

  const updateLeadInState = (leadId: string, patch: Partial<LeadRequest>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead._id === leadId ? { ...lead, ...patch } : lead)),
    );
    setSelectedLead((prev) =>
      prev?._id === leadId ? { ...prev, ...patch } : prev,
    );
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const res = await fetch(`${API_BASE}/lead/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setLeads((prev) => prev.filter((lead) => lead._id !== id));
    if (selectedLead?._id === id) setSelectedLead(null);
  };

  const handleExport = () => {
    const customFieldKeys = Array.from(
      new Set(
        filteredLeads.flatMap((lead) => Object.keys(lead.customFields || {})),
      ),
    );
    const rows = [
      [
        "Name",
        "Email",
        "Phone",
        "Company",
        ...customFieldKeys,
        ...(showAssignment
          ? ["Status", "Assigned To", "Next Follow Up"]
          : ["Verified", "Status", "Submitted At"]),
      ],
      ...filteredLeads.map((lead) => [
        lead.name,
        lead.email,
        lead.phone,
        ...customFieldKeys.map((key) => lead.customFields?.[key] ?? ""),
        ...(showAssignment
          ? [
              lead.leadStatus || "new",
              lead.assignedTo?.name || "Unassigned",
              formatDateTime(lead.followUpDate),
            ]
          : [
              lead.verified ? "Yes" : "No",
              lead.leadStatus || "new",
              formatDateTime(lead.createdAt),
            ]),
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = window.URL.createObjectURL(
      new Blob([csv], { type: "text/csv" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadSample = () => {
    const rows = [
      [
        "name",
        "email",
        "phone",
        "message",
        "source",
        "status",
        "verified",
        "company",
        "budget",
      ],
      [
        "Rahul Sharma",
        "rahul@example.com",
        "9876543210",
        "Interested in product demo",
        "Facebook",
        "new",
        "yes",
        "Acme Pvt Ltd",
        "50000",
      ],
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = window.URL.createObjectURL(
      new Blob([csv], { type: "text/csv" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "lead-import-sample.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportFile = async (file?: File) => {
    if (!file) return;

    const allowedExtensions = [".csv", ".xls", ".xlsx"];
    const isAllowed = allowedExtensions.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    );

    if (!isAllowed) {
      alert("Please upload a CSV, XLS or XLSX file.");
      return;
    }

    setImporting(true);
    setImportMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/lead/import`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!data.success) {
        const firstError = data.errors?.[0]?.message
          ? ` First issue: Row ${data.errors[0].row} - ${data.errors[0].message}`
          : "";
        alert(`${data.message || "Import failed."}${firstError}`);
        return;
      }

      setImportMessage(
        `${data.imported || 0} leads imported${
          data.skipped ? `, ${data.skipped} rows skipped` : ""
        }.`,
      );
      setShowImportModal(false);
      setCurrentPage(1);
      await fetchData();
    } catch (error) {
      console.error(error);
      alert("Failed to import leads. Please try again.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setAssignmentFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="pb-24">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
            Admin Panel
          </p>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">
            Lead CRM
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {showAssignment
              ? "Assign inquiries, monitor employee follow-ups, and keep the sales pipeline moving."
              : "Review incoming inquiries and manage lead intake records."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={(e) => handleImportFile(e.target.files?.[0])}
          />
          <button
            onClick={() => setShowImportModal(true)}
            disabled={importing}
            className="flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 font-medium disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={17} /> {importing ? "Importing..." : "Import"}
          </button>
          <button
            onClick={handleExport}
            className="flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white"
          >
            <Download size={17} /> Export
          </button>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4"
            >
              <RotateCcw size={16} /> Reset
            </button>
          )}
        </div>
      </div>

      {importMessage && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700">
          {importMessage}
        </div>
      )}

      <div
        className={`mb-6 grid grid-cols-2 gap-3 ${
          showAssignment ? "lg:grid-cols-6" : "lg:grid-cols-3"
        }`}
      >
        <Stat
          label="Total"
          value={stats.total}
          icon={<Users size={18} />}
          tone="blue"
        />
        {showAssignment && (
          <>
            <Stat
              label="Assigned"
              value={stats.assigned}
              icon={<UserRoundCheck size={18} />}
              tone="green"
            />
            <Stat
              label="Unassigned"
              value={stats.unassigned}
              icon={<Filter size={18} />}
              tone="amber"
            />
          </>
        )}
        {showAssignment ? (
          <>
            <Stat
              label="Follow Ups"
              value={stats.followUps}
              icon={<CalendarClock size={18} />}
              tone="violet"
            />
            <Stat
              label="Interested"
              value={stats.interested}
              icon={<CheckCircle2 size={18} />}
              tone="emerald"
            />
            <Stat
              label="Not Interested"
              value={stats.notInterested}
              icon={<RxCrossCircled size={18} />}
              tone="rose"
            />
          </>
        ) : (
          <>
            <Stat
              label="Verified"
              value={stats.verified}
              icon={<CheckCircle2 size={18} />}
              tone="emerald"
            />
            <Stat
              label="Open"
              value={stats.open}
              icon={<Filter size={18} />}
              tone="amber"
            />
          </>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div
          className={`grid gap-4 ${
            showAssignment ? "lg:grid-cols-[1.5fr_1fr_1fr]" : "lg:grid-cols-1"
          }`}
        >
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                showAssignment
                  ? "Search name, company, phone, employee..."
                  : "Search name, company, phone..."
              }
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] pl-10 pr-4 outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          {showAssignment && (
            <Select
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as (typeof statusOptions)[number])
              }
              options={statusOptions}
            />
          )}
          {showAssignment && (
            <Select
              value={assignmentFilter}
              onChange={setAssignmentFilter}
              options={["all", "assigned", "unassigned"]}
            />
          )}
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
                  {[
                    "Lead",
                    "Contact",
                    ...(showAssignment
                      ? ["Status", "Assigned To"]
                      : ["Submitted"]),
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-4 text-left text-sm font-semibold"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--background-secondary)]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold">{lead.name}</p>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <p>{lead.phone}</p>
                      <p className="mt-1 text-[var(--text-secondary)]">
                        {lead.email}
                      </p>
                    </td>
                    {showAssignment && (
                      <>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(lead.leadStatus || "new")}`}
                          >
                            {lead.leadStatus || "new"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={lead.assignedTo?._id || ""}
                            onChange={(e) =>
                              handleAssignLead(lead._id, e.target.value)
                            }
                            className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none"
                          >
                            <option value="">Unassigned</option>
                            {employees
                              .filter((employee) => employee.active !== false)
                              .map((employee) => (
                                <option key={employee._id} value={employee._id}>
                                  {employee.name}
                                </option>
                              ))}
                          </select>
                        </td>
                      </>
                    )}
                    {!showAssignment && (
                      <td className="px-5 py-4">
                        <p className="text-sm">
                          {formatDateTime(lead.createdAt)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {lead.verified && (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
                              Verified
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(lead.leadStatus || "new")}`}
                          >
                            {(lead.leadStatus || "new").replace("-", " ")}
                          </span>
                        </div>
                      </td>
                    )}

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-green-600 hover:bg-green-500/10"
                          title="Call"
                        >
                          <Phone size={16} />
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-blue-600 hover:bg-blue-500/10"
                          title="Email"
                        >
                          <Mail size={16} />
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="grid h-9 w-9 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-500/10"
                          title="WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="grid h-9 w-9 place-items-center rounded-lg text-[var(--primary)] hover:bg-[var(--primary)]/10"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="grid h-9 w-9 place-items-center rounded-lg text-red-600 hover:bg-red-500/10"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
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
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="h-10 rounded-xl border border-[var(--border)] px-4 disabled:opacity-40"
          >
            Prev
          </button>
          <div className="grid h-10 min-w-10 place-items-center rounded-xl bg-[var(--primary)] px-4 text-white">
            {currentPage}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="h-10 rounded-xl border border-[var(--border)] px-4 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          employees={employees}
          showAssignment={showAssignment}
          onClose={() => setSelectedLead(null)}
          onAssign={handleAssignLead}
        />
      )}

      {showImportModal && (
        <ImportModal
          importing={importing}
          onClose={() => setShowImportModal(false)}
          onDownloadSample={handleDownloadSample}
          onChooseFile={() => fileInputRef.current?.click()}
        />
      )}
    </div>
  );
}

function ImportModal({
  importing,
  onClose,
  onDownloadSample,
  onChooseFile,
}: {
  importing: boolean;
  onClose: () => void;
  onDownloadSample: () => void;
  onChooseFile: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[3px] text-[var(--primary)]">
              Bulk Import
            </p>
            <h2 className="font-serif text-3xl">Import Leads</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-xl bg-[var(--background-secondary)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
          <p className="font-semibold text-[var(--text-primary)]">
            File format
          </p>
          <p className="mt-2">
            Upload a CSV, XLS, or XLSX file. Required columns are{" "}
            <strong>name</strong>, <strong>email</strong>, and{" "}
            <strong>phone</strong>.
          </p>
          <p className="mt-2">
            Optional columns: message, source, status, verified.
          </p>
          <p className="mt-2">
            Status can be new, contacted, follow-up, interested, or
            not-interested. Extra columns like company or budget are saved as
            custom fields.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onDownloadSample}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 font-medium"
          >
            <Download size={17} /> Download Sample
          </button>
          <button
            onClick={onChooseFile}
            disabled={importing}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Upload size={17} /> {importing ? "Importing..." : "Choose File"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LeadModal({
  lead,
  employees,
  showAssignment,
  onClose,
  onAssign,
}: {
  lead: LeadRequest;
  employees: Employee[];
  showAssignment: boolean;
  onClose: () => void;
  onAssign: (leadId: string, employeeId: string) => void;
}) {
  const timeline = [...(lead.activityLog || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[4px] text-[var(--primary)]">
              Lead Detail
            </p>
            <h2 className="font-serif text-3xl">{lead.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border)]"
          >
            <X size={20} />
          </button>
        </div>

        <div
          className={`grid gap-6 overflow-y-auto p-6 ${
            showAssignment ? "lg:grid-cols-[1fr_0.9fr]" : "lg:grid-cols-1"
          }`}
        >
          <div className="space-y-5">
            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h3 className="mb-4 font-semibold">Customer</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Name" value={lead.name} />

                <Info label="Email" value={lead.email} />
                <Info label="Phone" value={lead.phone} />
                <Info label="Source" value={lead.source || "Website"} />
                <Info label="Verified" value={lead.verified ? "Yes" : "No"} />

                <Info
                  label="Submitted"
                  value={formatDateTime(lead.createdAt)}
                />
                {showAssignment && (
                  <>
                    <Info label="Status" value={lead.leadStatus || "new"} />
                    <Info
                      label=" Follow Up"
                      value={formatDateTime(lead.followUpDate) || "-"}
                    />
                  </>
                )}
              </div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[var(--text-secondary)]">
                {lead.message || "No message provided."}
              </p>
            </section>

            <section className="rounded-2xl border border-[var(--border)] p-5">
              <h3 className="mb-4 font-semibold">Custom Fields</h3>
              {lead.customFields && Object.keys(lead.customFields).length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(lead.customFields).map(([key, value]) => (
                    <Info
                      key={key}
                      label={formatCustomFieldLabel(key)}
                      value={formatFieldValue(value)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  No custom fields captured.
                </p>
              )}
            </section>

            {showAssignment && (
              <section className="rounded-2xl border border-[var(--border)] p-5">
                <h3 className="mb-4 font-semibold">Employee Notes</h3>
                <div className="space-y-3">
                  {lead.notes?.length ? (
                    lead.notes.map((note, index) => (
                      <div
                        key={`${note.createdAt}-${index}`}
                        className="rounded-xl bg-[var(--background-secondary)] p-4"
                      >
                        <p className="text-sm">{note.text}</p>
                        <p className="mt-2 text-xs text-[var(--text-secondary)]">
                          {note.createdBy?.name || "Employee"} -{" "}
                          {formatDateTime(note.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">
                      No notes yet.
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          {showAssignment && (
            <aside className="space-y-5">
              <section className="rounded-2xl border border-[var(--border)] p-5">
                <h3 className="mb-4 font-semibold">Assignment</h3>
                <select
                  value={lead.assignedTo?._id || ""}
                  onChange={(e) => onAssign(lead._id, e.target.value)}
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none"
                >
                  <option value="">Unassigned</option>
                  {employees
                    .filter((employee) => employee.active !== false)
                    .map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
                </select>
              </section>

              <section className="rounded-2xl max-h-96 overflow-auto border border-[var(--border)] p-5">
                <h3 className="mb-4 font-semibold">Timeline</h3>
                <div className="space-y-4">
                  {timeline.length ? (
                    timeline.map((item, index) => (
                      <div
                        key={`${item.createdAt}-${index}`}
                        className="border-l-2 border-[var(--primary)]/40 pl-4"
                      >
                        <p className="text-sm font-medium">{item.message}</p>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {item.employee?.name || "Admin"} -{" "}
                          {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">
                      No timeline recorded.
                    </p>
                  )}
                </div>
              </section>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 capitalize outline-none focus:ring-2 focus:ring-[var(--primary)]"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replace("-", " ")}
        </option>
      ))}
    </select>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </p>
      <p className="mt-1 break-words font-medium">{value}</p>
    </div>
  );
}

function formatCustomFieldLabel(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function Stat({
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
        <span className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </span>
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
    interested: "bg-green-500/10 text-green-600",
    "not-interested": "bg-red-500/10 text-red-600",
  }[status];
}
