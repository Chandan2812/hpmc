"use client";

import {
  Eye,
  Trash2,
  X,
  MessageCircle,
  Download,
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Employee {
  _id: string;
  name: string;
  email: string;
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
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

const ITEMS_PER_PAGE = 20;

export default function AdminLead() {
  const [contacts, setContacts] = useState<LeadRequest[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<LeadRequest[]>([]);
  const [filterType, setFilterType] = useState<"all" | "today" | "range">(
    "all",
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending"
  >("all");
  const [assignmentFilter, setAssignmentFilter] = useState<
    "all" | "assigned" | "unassigned"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<LeadRequest | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  /* Fetch */
  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/lead`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: LeadRequest, b: LeadRequest) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

        setContacts(sorted);
        setFilteredContacts(sorted);
      })
      .catch((err) => console.error("Lead Error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/employee`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEmployees(data.employees);
        }
      })
      .catch((err) => console.error("Employee Error:", err));
  }, []);

  /* Filter */
  useEffect(() => {
    let filtered = contacts;

    // Date filters
    if (filterType === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((c) =>
        new Date(c.createdAt).toISOString().startsWith(today),
      );
    } else if (filterType === "range" && startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + 86400000;
      filtered = filtered.filter((c) => {
        const contactDate = new Date(c.createdAt).getTime();
        return contactDate >= start && contactDate <= end;
      });
    } else if (filterType === "all" && selectedDate) {
      filtered = filtered.filter((c) =>
        new Date(c.createdAt).toISOString().startsWith(selectedDate),
      );
    }

    // Status filter
    if (statusFilter === "completed") {
      filtered = filtered.filter((c) => c.marked === true);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((c) => c.marked !== true);
    }

    // Verification filter
    if (assignmentFilter === "assigned") {
      filtered = filtered.filter((c) => c.assignedTo);
    } else if (assignmentFilter === "unassigned") {
      filtered = filtered.filter((c) => !c.assignedTo);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          (c.companyName && c.companyName.toLowerCase().includes(query)),
      );
    }

    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [
    filterType,
    selectedDate,
    startDate,
    endDate,
    contacts,
    searchQuery,
    statusFilter,
    assignmentFilter,
  ]);

  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);

  const currentContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* Mark */
  const handleMark = async (id: string, marked: boolean) => {
    try {
      await fetch(`${API_BASE}/lead/${id}/mark`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marked,
        }),
      });

      setContacts((prev) =>
        prev.map((lead) =>
          lead._id === id
            ? {
                ...lead,
                marked,
              }
            : lead,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* Delete */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;

    try {
      await fetch(`${API_BASE}/lead/${id}`, {
        method: "DELETE",
      });

      setContacts((prev) => prev.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignLead = async (leadId: string, employeeId: string) => {
    try {
      const response = await fetch(`${API_BASE}/lead/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          employeeId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Failed to assign lead");
        return;
      }

      const assignedEmployee = employees.find((emp) => emp._id === employeeId);

      // Update Table
      setContacts((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                assignedTo: assignedEmployee
                  ? {
                      _id: assignedEmployee._id,
                      name: assignedEmployee.name,
                      email: assignedEmployee.email,
                    }
                  : null,
              }
            : lead,
        ),
      );

      // Update Open Modal
      if (selectedLead?._id === leadId) {
        setSelectedLead({
          ...selectedLead,
          assignedTo: assignedEmployee
            ? {
                _id: assignedEmployee._id,
                name: assignedEmployee.name,
                email: assignedEmployee.email,
              }
            : null,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* Export to CSV */
  const handleExport = () => {
    if (filteredContacts.length === 0) {
      alert("No leads to export");
      return;
    }

    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Products", "Status", "Date"],
      ...filteredContacts.map((lead) => [
        lead.name,
        lead.email,
        lead.phone,
        lead.companyName || "—",
        lead.products?.join(", ") || "—",
        lead.marked ? "Completed" : "Pending",
        new Date(lead.createdAt).toLocaleString(),
      ]),
    ]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  /* Calculate Stats */
  const stats = {
    total: contacts.length,
    completed: contacts.filter((c) => c.marked).length,
    pending: contacts.filter((c) => !c.marked).length,
    verified: contacts.filter((c) => c.verified).length,
    assigned: contacts.filter((c) => c.assignedTo).length,
    unassigned: contacts.filter((c) => !c.assignedTo).length,
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    assignmentFilter !== "all" ||
    filterType !== "all" ||
    selectedDate ||
    startDate ||
    endDate;

  const resetFilters = () => {
    setFilterType("all");
    setSelectedDate("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setStatusFilter("all");
    setAssignmentFilter("all");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="uppercase tracking-[4px] text-xs text-[var(--primary)] mb-2">
              Admin Panel
            </p>

            <h1 className="font-serif text-4xl text-[var(--text-primary)]">
              Leads
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="
                h-11 px-6
                rounded-xl
                bg-[var(--primary)]
                text-white
                font-medium
                flex items-center gap-2
                hover:opacity-90
                transition
                disabled:opacity-50
              "
              disabled={filteredContacts.length === 0}
            >
              <Download size={18} />
              Export CSV
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="
                  h-11 px-4
                  rounded-xl
                  border border-[var(--border)]
                  bg-[var(--card)]
                  text-[var(--text-primary)]
                  font-medium
                  flex items-center gap-2
                  hover:bg-[var(--background-secondary)]
                  transition
                "
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-6">
          {" "}
          {/* Total Leads */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Total Leads
            </p>
            <p className="text-3xl md:text-2xl font-bold text-blue-600">
              {stats.total}
            </p>
          </div>
          {/* Completed */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Completed
            </p>
            <p className="text-3xl md:text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
          {/* Pending */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Pending
            </p>
            <p className="text-3xl md:text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          {/* Verified */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Verified
            </p>
            <p className="text-3xl md:text-2xl font-bold text-purple-600">
              {stats.verified}
            </p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Assigned
            </p>

            <p className="text-3xl md:text-2xl font-bold text-cyan-600">
              {stats.assigned}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-4">
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Unassigned
            </p>

            <p className="text-3xl md:text-2xl font-bold text-orange-600">
              {stats.unassigned}
            </p>
          </div>
        </div>

        {/* Advanced Filter Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[var(--primary)]" />
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Advanced Filters
              </p>
              {hasActiveFilters && (
                <span className="px-2 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-semibold">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Showing{" "}
              <span className="font-semibold text-[var(--primary)]">
                {filteredContacts.length}
              </span>{" "}
              of <span className="font-semibold">{contacts.length}</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-5">
            <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
              Search
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
              />
              <input
                type="text"
                placeholder="Search by name, email, phone, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full h-11 pl-10 pr-4
                  border border-[var(--border)]
                  bg-[var(--background-secondary)]
                  text-[var(--text-primary)]
                  rounded-lg
                  outline-none
                  focus:ring-2 focus:ring-[var(--primary)]
                  placeholder:text-[var(--text-secondary)]
                "
              />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filter Type */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                Period
              </label>
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value as "all" | "today" | "range");
                  setStartDate("");
                  setEndDate("");
                  setSelectedDate("");
                }}
                className="
                  w-full h-10 px-3
                  border border-[var(--border)]
                  bg-[var(--background-secondary)]
                  text-[var(--text-primary)]
                  rounded-lg
                  outline-none
                  cursor-pointer
                  focus:ring-2 focus:ring-[var(--primary)]
                "
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="range">Date Range</option>
              </select>
            </div>

            {/* Single Date Filter */}
            {filterType === "all" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="
                    w-full h-10 px-3
                    border border-[var(--border)]
                    bg-[var(--background-secondary)]
                    text-[var(--text-primary)]
                    rounded-lg
                    outline-none
                    focus:ring-2 focus:ring-[var(--primary)]
                  "
                />
              </div>
            )}

            {/* Date Range */}
            {filterType === "range" && (
              <>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                    From
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="
                      w-full h-10 px-3
                      border border-[var(--border)]
                      bg-[var(--background-secondary)]
                      text-[var(--text-primary)]
                      rounded-lg
                      outline-none
                      focus:ring-2 focus:ring-[var(--primary)]
                    "
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                    To
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="
                      w-full h-10 px-3
                      border border-[var(--border)]
                      bg-[var(--background-secondary)]
                      text-[var(--text-primary)]
                      rounded-lg
                      outline-none
                      focus:ring-2 focus:ring-[var(--primary)]
                    "
                  />
                </div>
              </>
            )}

            {/* Status Filter */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "completed" | "pending",
                  )
                }
                className="
                  w-full h-10 px-3
                  border border-[var(--border)]
                  bg-[var(--background-secondary)]
                  text-[var(--text-primary)]
                  rounded-lg
                  outline-none
                  cursor-pointer
                  focus:ring-2 focus:ring-[var(--primary)]
                "
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Verification Filter */}
            <div>
              <label className="text-xs uppercase tracking-wider text-[var(--text-secondary)] block mb-2">
                Verified
              </label>
              <select
                value={assignmentFilter}
                onChange={(e) =>
                  setAssignmentFilter(
                    e.target.value as "all" | "assigned" | "unassigned",
                  )
                }
                className="
                  w-full h-10 px-3
                  border border-[var(--border)]
                  bg-[var(--background-secondary)]
                  text-[var(--text-primary)]
                  rounded-lg
                  outline-none
                  cursor-pointer
                  focus:ring-2 focus:ring-[var(--primary)]
                "
              >
                <option value="all">All</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <div className="w-10 h-10 border-4 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin mb-4" />

          <p className="text-[var(--text-secondary)]">Loading leads...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredContacts.length === 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-12 text-center">
          <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-3">
            No Leads Found
          </h3>

          <p className="text-[var(--text-secondary)]">
            New leads will appear here.
          </p>
        </div>
      )}

      {/* Leads */}
      {/* Leads */}
      {!loading && filteredContacts.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="w-full mb-20">
            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--background-secondary)] border-b border-[var(--border)]">
                      <th className="px-3 md:px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                        Name
                      </th>

                      <th className="hidden md:table-cell px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                        Phone
                      </th>

                      <th className="px-3 md:px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                        Assigned To
                      </th>

                      <th className="px-3 md:px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                        Status
                      </th>

                      <th className="hidden md:table-cell px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">
                        Date
                      </th>

                      <th className="px-3 md:px-5 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentContacts.map((contact) => (
                      <tr
                        key={contact._id}
                        className="border-b border-[var(--border)] hover:bg-[var(--background-secondary)] transition"
                      >
                        <td className="px-3 md:px-5 py-4">
                          <div>
                            <p className="font-medium text-[var(--text-primary)] text-sm md:text-base">
                              {contact.name}
                            </p>

                            <p
                              className={`text-xs mt-1 ${
                                contact.verified
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {contact.verified ? "Verified" : "Not Verified"}
                            </p>
                          </div>
                        </td>

                        <td className="hidden md:table-cell px-5 py-4">
                          <div>
                            <p className="text-[var(--text-primary)]">
                              {contact.phone}
                            </p>

                            <p className="text-sm text-[var(--text-secondary)]">
                              {contact.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          {contact.assignedTo ? (
                            <span className="text-green-600 font-medium">
                              {contact.assignedTo.name}
                            </span>
                          ) : (
                            <span className="text-yellow-600">Unassigned</span>
                          )}
                        </td>

                        <td className="px-3 md:px-5 py-4">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={contact.marked || false}
                              onChange={(e) =>
                                handleMark(contact._id, e.target.checked)
                              }
                              className="accent-[var(--primary)]"
                            />

                            <span
                              className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium ${
                                contact.marked
                                  ? "bg-green-500/10 text-green-600"
                                  : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {contact.marked ? "Completed" : "Pending"}
                            </span>
                          </div>
                        </td>

                        <td className="hidden md:table-cell px-5 py-4 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                          {" "}
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-3 md:px-5 py-4">
                          <div className="flex justify-end gap-1 md:gap-2">
                            <a
                              href={`https://wa.me/${contact.phone.replace(/[^\d+]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 w-8 md:h-9 md:w-9 rounded-lg flex items-center justify-center text-green-500 hover:bg-green-500/10 transition"
                              title="Send WhatsApp message"
                            >
                              <MessageCircle size={16} />
                            </a>

                            <button
                              onClick={() => setSelectedLead(contact)}
                              className="h-8 w-8 md:h-9 md:w-9 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500/10 transition"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => handleDelete(contact._id)}
                              className="h-8 w-8 md:h-9 md:w-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-500/10 transition"
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center md:justify-end gap-3 mt-8 pb-32">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="
            h-11 px-5
            rounded-xl
            border border-[var(--border)]
            bg-[var(--card)]
            text-[var(--text-primary)]
            disabled:opacity-40
          "
              >
                Prev
              </button>

              <div
                className="
            h-11 min-w-[50px]
            rounded-xl
            bg-[var(--primary)]
            text-white
            flex items-center justify-center
            font-medium
          "
              >
                {currentPage}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="
            h-11 px-5
            rounded-xl
            border border-[var(--border)]
            bg-[var(--card)]
            text-[var(--text-primary)]
            disabled:opacity-40
          "
              >
                Next
              </button>
            </div>
          )}

          {selectedLead && (
            <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
              <div
                className="
        relative
        w-full
        max-w-4xl
        max-h-[90vh]
        overflow-hidden
        rounded-[32px]
        bg-[var(--card)]
        border border-[var(--border)]
        shadow-[0_30px_100px_rgba(0,0,0,0.35)]
      "
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-[var(--card)] border-b border-[var(--border)] px-6 md:px-8 py-5 rounded-t-[32px]">
                  {" "}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="uppercase tracking-[4px] text-xs text-[var(--primary)] mb-2">
                        Lead Information
                      </p>

                      <h2 className="text-2xl md:text-3xl font-serif text-[var(--text-primary)]">
                        {selectedLead.name}
                      </h2>
                    </div>

                    <button
                      onClick={() => setSelectedLead(null)}
                      className="
              h-11 w-11
              rounded-xl
              border border-[var(--border)]
              flex items-center justify-center
              hover:bg-[var(--background-secondary)]
              transition
            "
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto max-h-[calc(90vh-240px)] p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Name */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                        Name
                      </p>

                      <p className="font-medium text-[var(--text-primary)]">
                        {selectedLead.name}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                        Phone
                      </p>

                      <p className="font-medium text-[var(--text-primary)]">
                        {selectedLead.phone}
                      </p>
                    </div>

                    {/* Email */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                        Email
                      </p>

                      <p className="font-medium text-[var(--text-primary)] break-all">
                        {selectedLead.email}
                      </p>
                    </div>

                    {/* Company */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                        Company
                      </p>

                      <p className="font-medium text-[var(--text-primary)]">
                        {selectedLead.companyName || "—"}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                        Status
                      </p>

                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedLead.marked
                            ? "bg-green-500/10 text-green-600"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        ● {selectedLead.marked ? "Completed" : "Pending"}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
                      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                        Created On
                      </p>

                      <p className="font-medium text-[var(--text-primary)]">
                        {new Date(selectedLead.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Products */}
                    <div className="md:col-span-3">
                      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
                        <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-4">
                          Interested Products
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {selectedLead.products?.length ? (
                            selectedLead.products.map((product, index) => (
                              <span
                                key={index}
                                className="
                        px-4 py-2
                        rounded-full
                        bg-[var(--primary)]/10
                        text-[var(--primary)]
                        text-sm
                        font-medium
                      "
                              >
                                {product}
                              </span>
                            ))
                          ) : (
                            <span className="text-[var(--text-secondary)]">
                              No Products Selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3">
                      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
                        <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-4">
                          Assign Employee
                        </p>

                        <select
                          value={selectedLead.assignedTo?._id || ""}
                          onChange={(e) =>
                            handleAssignLead(selectedLead._id, e.target.value)
                          }
                          className="
    w-full
    h-11
    rounded-xl
    border border-[var(--border)]
    bg-[var(--card)]
    px-4
  "
                        >
                          <option value="">Select Employee</option>

                          {employees.map((employee) => (
                            <option key={employee._id} value={employee._id}>
                              {employee.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="md:col-span-3">
                      <div className="rounded-3xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
                        <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-4">
                          Message
                        </p>

                        <p className="text-[var(--text-primary)] leading-7 whitespace-pre-wrap">
                          {selectedLead.message || "No Message Provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="
    sticky bottom-0
    bg-[var(--card)]
    border-t border-[var(--border)]
    px-6 md:px-8 py-4
    rounded-b-[32px]
  "
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                        Lead Status
                      </p>

                      <p className="text-sm text-[var(--text-primary)] mt-1">
                        {selectedLead.marked
                          ? "This lead is completed"
                          : "This lead is pending"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="
          h-11 px-5
          rounded-xl
          border border-[var(--border)]
          text-[var(--text-primary)]
          hover:bg-[var(--background-secondary)]
          transition
        "
                      >
                        Close
                      </button>

                      <button
                        onClick={() => {
                          handleMark(selectedLead._id, !selectedLead.marked);

                          setSelectedLead({
                            ...selectedLead,
                            marked: !selectedLead.marked,
                          });
                        }}
                        className={`
          h-11 px-6
          rounded-xl
          font-medium
          transition
          ${
            selectedLead.marked
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-green-600 text-white hover:bg-green-700"
          }
        `}
                      >
                        {selectedLead.marked
                          ? "Mark as Pending"
                          : "Mark as Completed"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
