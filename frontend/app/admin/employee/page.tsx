"use client";

import EmployeeModal from "@/app/components/CreateEmployeeModal";
import {
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Eye,
  Filter,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  RotateCcw,
  Search,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type FilterType = "all" | "today" | "range";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  monthlyTarget?: number;
  active: boolean;
  createdAt: string;
}

interface LeadRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  leadStatus?: "new" | "contacted" | "follow-up" | "qualified" | "won" | "lost";
  marked?: boolean;
  followUpDate?: string | null;
  followUpRemark?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
  lastActivityAt?: string;
}

const ITEMS_PER_PAGE = 20;

async function requestEmployeeCrm(apiBase: string | undefined) {
  const [employeeRes, leadRes] = await Promise.all([
    fetch(`${apiBase}/employee`, { cache: "no-store" }),
    fetch(`${apiBase}/lead`, { cache: "no-store" }),
  ]);
  const employeeResult = await employeeRes.json();
  const leadResult = await leadRes.json();

  if (!employeeRes.ok) {
    throw new Error(employeeResult.message || "Failed to fetch employees");
  }

  if (!leadRes.ok) {
    throw new Error(leadResult.message || "Failed to fetch leads");
  }

  return {
    employees: [...(employeeResult.employees || [])].sort(
      (a: Employee, b: Employee) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    leads: [...(Array.isArray(leadResult) ? leadResult : [])],
  };
}

export default function AdminEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leads, setLeads] = useState<LeadRequest[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    let cancelled = false;

    requestEmployeeCrm(API_BASE)
      .then((data) => {
        if (!cancelled) {
          setEmployees(data.employees);
          setLeads(data.leads);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (filterType === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((agent) =>
        new Date(agent.createdAt).toISOString().startsWith(today),
      );
    } else if (filterType === "range" && startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00`).getTime();
      const end = new Date(`${endDate}T23:59:59.999`).getTime();
      filtered = filtered.filter((agent) => {
        const createdAt = new Date(agent.createdAt).getTime();
        return createdAt >= start && createdAt <= end;
      });
    } else if (filterType === "all" && selectedDate) {
      filtered = filtered.filter((agent) =>
        new Date(agent.createdAt).toISOString().startsWith(selectedDate),
      );
    }

    if (statusFilter === "active") {
      filtered = filtered.filter((employee) => employee.active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((employee) => !employee.active);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query) ||
          employee.email.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [
    employees,
    filterType,
    selectedDate,
    startDate,
    endDate,
    searchQuery,
    statusFilter,
  ]);

  const handleToggleStatus = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/employee/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });

      if (!res.ok) return;

      setEmployees((prev) =>
        prev.map((emp) => (emp._id === id ? { ...emp, active } : emp)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.active).length,
    inactive: employees.filter((e) => !e.active).length,
    assignedLeads: leads.filter((lead) => lead.assignedTo).length,
    followUps: leads.filter((lead) => lead.leadStatus === "follow-up").length,
    won: leads.filter((lead) => lead.leadStatus === "won").length,
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    statusFilter !== "all" ||
    filterType !== "all" ||
    Boolean(selectedDate || startDate || endDate);

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentEmployees = filteredEmployees.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  );

  const resetFilters = () => {
    setFilterType("all");
    setSelectedDate("");
    setStartDate("");
    setEndDate("");
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await requestEmployeeCrm(API_BASE);
      setEmployees(data.employees);
      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this employee ?")) return;

    try {
      const res = await fetch(`${API_BASE}/employee/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Delete failed");
      }

      setEmployees((prev) => prev.filter((employee) => employee._id !== id));
      if (selectedEmployee?._id === id) setSelectedEmployee(null);
      if (viewEmployee?._id === id) setViewEmployee(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const getEmployeeLeads = (employeeId: string) =>
    leads
      .filter((lead) => lead.assignedTo?._id === employeeId)
      .sort(
        (a, b) =>
          new Date(b.lastActivityAt || b.createdAt).getTime() -
          new Date(a.lastActivityAt || a.createdAt).getTime(),
      );

  const getEmployeePipeline = (employeeId: string) => {
    const assigned = getEmployeeLeads(employeeId);
    return {
      total: assigned.length,
      followUps: assigned.filter((lead) => lead.leadStatus === "follow-up")
        .length,
      won: assigned.filter((lead) => lead.leadStatus === "won").length,
      open: assigned.filter((lead) => !lead.marked && lead.leadStatus !== "won")
        .length,
    };
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
              Admin Panel
            </p>
            <h1 className="font-serif text-4xl text-[var(--text-primary)]">
              HPMC Employees
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedEmployee(null);
                setEmployeeModalOpen(true);
              }}
              className="
    flex h-11 items-center gap-2
    rounded-xl
    bg-[var(--primary)]
    px-5
    font-medium
    text-white
    transition
    hover:opacity-90
  "
            >
              <Users size={16} />
              Add Employee
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)]"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6 md:gap-4">
          <StatCard
            label="Total"
            value={stats.total}
            icon={<Users size={18} />}
            color="blue"
          />
          <StatCard
            label="Active"
            value={stats.active}
            icon={<BriefcaseBusiness size={18} />}
            color="yellow"
          />
          <StatCard
            label="Inactive"
            value={stats.inactive}
            icon={<UserCheck size={18} />}
            color="violet"
          />
          <StatCard
            label="Assigned Leads"
            value={stats.assignedLeads}
            icon={<BriefcaseBusiness size={18} />}
            color="green"
          />
          <StatCard
            label="Follow Ups"
            value={stats.followUps}
            icon={<CalendarClock size={18} />}
            color="yellow"
          />
          <StatCard
            label="Won"
            value={stats.won}
            icon={<CheckCircle2 size={18} />}
            color="red"
          />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[var(--primary)]" />
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Advanced Filters
              </p>
              {hasActiveFilters && (
                <span className="rounded-full bg-[var(--primary)]/15 px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Showing{" "}
              <span className="font-semibold text-[var(--primary)]">
                {filteredEmployees.length}
              </span>{" "}
              of <span className="font-semibold">{employees.length}</span>
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
              Search
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              />
              <input
                type="search"
                id="employee-directory-search"
                name="employee-directory-search"
                placeholder="Search by name, email..."
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] pl-10 pr-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FilterField label="Period">
              <select
                value={filterType}
                onChange={(event) => {
                  setFilterType(event.target.value as FilterType);
                  setSelectedDate("");
                  setStartDate("");
                  setEndDate("");
                  setCurrentPage(1);
                }}
                className="h-10 w-full cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="range">Date Range</option>
              </select>
            </FilterField>

            {filterType === "all" && (
              <FilterField label="Date">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => {
                    setSelectedDate(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </FilterField>
            )}

            {filterType === "range" && (
              <>
                <FilterField label="From">
                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(event) => {
                      setStartDate(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </FilterField>
                <FilterField label="To">
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(event) => {
                      setEndDate(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </FilterField>
              </>
            )}

            <FilterField label="Status">
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value as "all" | "active" | "inactive",
                  );
                  setCurrentPage(1);
                }}
                className="h-10 w-full cursor-pointer rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="all">All Employees</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FilterField>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex h-[300px] flex-col items-center justify-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
          <p className="text-[var(--text-secondary)]">Loading Employees ...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <h3 className="mb-2 font-semibold text-red-600">
            Something went wrong
          </h3>
          <p className="mb-5 text-sm text-red-500">{error}</p>
          <button
            onClick={handleRetry}
            className="h-10 rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredEmployees.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <BriefcaseBusiness size={25} />
          </div>
          <h3 className="mb-3 font-serif text-2xl text-[var(--text-primary)]">
            No Employees Found
          </h3>
          <p className="text-[var(--text-secondary)]">
            {hasActiveFilters
              ? "No applications match the selected filters."
              : "New employee applications will appear here."}
          </p>
        </div>
      )}

      {!loading && !error && filteredEmployees.length > 0 && (
        <>
          <div className="mb-20 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed md:table-auto">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                    <th className="w-[40%] px-3 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Employee
                    </th>
                    <th className="w-[20%] px-2 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Status
                    </th>
                    <th className="hidden w-[20%] px-2 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm lg:table-cell md:w-auto md:px-5">
                      Leads
                    </th>
                    <th className="hidden xl:table-cell w-[20%] px-2 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Created
                    </th>
                    <th className="w-[20%] px-2 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.map((employee) => {
                    const pipeline = getEmployeePipeline(employee._id);

                    return (
                    <tr
                      key={employee._id}
                      className="border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--background-secondary)]"
                    >
                      <td className="px-3 py-4 sm:px-4 md:px-5">
                        <button
                          onClick={() => setViewEmployee(employee)}
                          className="block max-w-full truncate text-left text-sm font-medium text-[var(--text-primary)] transition hover:text-[var(--primary)] md:text-base"
                        >
                          {employee.name}
                        </button>
                        <p className="mt-1 truncate text-[11px] text-[var(--text-secondary)] sm:text-xs">
                          {employee.email}
                        </p>
                        <p className="mt-1 text-[11px] text-[var(--text-secondary)] lg:hidden">
                          {pipeline.total} leads, {pipeline.followUps} follow-ups
                        </p>
                      </td>

                      <td className="px-2 py-4 sm:px-4 md:px-5">
                        <button
                          onClick={() =>
                            handleToggleStatus(employee._id, !employee.active)
                          }
                          className="flex items-center gap-3"
                          title={`Click to ${
                            employee.active ? "Deactivate" : "Activate"
                          } employee`}
                        >
                          <div
                            className={`
        relative h-6 w-12 rounded-full transition-all duration-300
        ${employee.active ? "bg-green-500" : "bg-gray-400"}
      `}
                          >
                            <div
                              className={`
          absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md
          transition-all duration-300
          ${employee.active ? "translate-x-6" : "translate-x-0.5"}
        `}
                            />
                          </div>

                          <span
                            className={`hidden xl:block text-xs font-medium ${
                              employee.active
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {employee.active ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>

                      <td className="hidden px-2 py-4 sm:px-4 lg:table-cell md:px-5">
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-blue-500/10 px-2 py-1 font-semibold text-blue-600">
                            {pipeline.total} assigned
                          </span>
                          <span className="rounded-full bg-amber-500/10 px-2 py-1 font-semibold text-amber-600">
                            {pipeline.followUps} follow-ups
                          </span>
                          <span className="rounded-full bg-green-500/10 px-2 py-1 font-semibold text-green-600">
                            {pipeline.won} won
                          </span>
                        </div>
                      </td>

                      <td className="hidden whitespace-nowrap px-5 py-4 text-xs text-[var(--text-secondary)] xl:table-cell">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-2 py-4 sm:px-4 md:px-5">
                        <div className="flex justify-start gap-2">
                          <button
                            onClick={() => setViewEmployee(employee)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--primary)] transition hover:bg-[var(--primary)]/10"
                            title="View Assigned Leads"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setEmployeeModalOpen(true);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-500/10"
                            title="Edit Employee"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(employee._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10"
                            title="Delete Employee"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pb-20 md:justify-end">
              <button
                disabled={activePage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <div className="flex h-11 min-w-[52px] items-center justify-center rounded-xl bg-[var(--primary)] px-4 font-medium text-white">
                {activePage}
              </div>
              <button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <EmployeeModal
        isOpen={employeeModalOpen}
        onClose={() => {
          setEmployeeModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onSuccess={handleRetry}
      />

      {viewEmployee && (
        <EmployeeLeadsModal
          employee={viewEmployee}
          leads={getEmployeeLeads(viewEmployee._id)}
          pipeline={getEmployeePipeline(viewEmployee._id)}
          onClose={() => setViewEmployee(null)}
        />
      )}
    </div>
  );
}

function EmployeeLeadsModal({
  employee,
  leads,
  pipeline,
  onClose,
}: {
  employee: Employee;
  leads: LeadRequest[];
  pipeline: { total: number; followUps: number; won: number; open: number };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 md:px-6">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[4px] text-[var(--primary)]">
              Employee CRM
            </p>
            <h2 className="font-serif text-2xl text-[var(--text-primary)] md:text-3xl">
              {employee.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {employee.role || "Sales Executive"} - {employee.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)]"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 md:p-6">
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MiniStat label="Assigned" value={pipeline.total} />
            <MiniStat label="Open" value={pipeline.open} />
            <MiniStat label="Follow Ups" value={pipeline.followUps} />
            <MiniStat label="Won" value={pipeline.won} />
          </div>

          {leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-[var(--text-secondary)]">
              No leads assigned to this employee yet.
            </div>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div
                  key={lead._id}
                  className="rounded-2xl border border-[var(--border)] p-4 transition hover:bg-[var(--background-secondary)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {lead.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusClass(lead.leadStatus || "new")}`}
                        >
                          {(lead.leadStatus || "new").replace("-", " ")}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            lead.marked
                              ? "bg-green-500/10 text-green-600"
                              : "bg-yellow-500/10 text-yellow-600"
                          }`}
                        >
                          {lead.marked ? "Completed" : "Open"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {lead.companyName || "No company"}
                      </p>
                      {lead.followUpDate && (
                        <p className="mt-3 text-sm text-[var(--text-primary)]">
                          Next follow-up:{" "}
                          {new Date(lead.followUpDate).toLocaleString()}
                        </p>
                      )}
                      {lead.followUpRemark && (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {lead.followUpRemark}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4">
      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color: "blue" | "yellow" | "violet" | "green" | "red";
}) {
  const styles = {
    blue: {
      card: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
      icon: "bg-blue-500/10 text-blue-600",
      value: "text-blue-600",
    },
    yellow: {
      card: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
      icon: "bg-yellow-500/10 text-yellow-600",
      value: "text-yellow-600",
    },
    violet: {
      card: "from-violet-500/10 to-violet-600/5 border-violet-500/20",
      icon: "bg-violet-500/10 text-violet-600",
      value: "text-violet-600",
    },
    green: {
      card: "from-green-500/10 to-green-600/5 border-green-500/20",
      icon: "bg-green-500/10 text-green-600",
      value: "text-green-600",
    },
    red: {
      card: "from-red-500/10 to-red-600/5 border-red-500/20",
      icon: "bg-red-500/10 text-red-600",
      value: "text-red-600",
    },
  }[color];

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${styles.card}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold md:text-3xl ${styles.value}`}>
        {value}
      </p>
    </div>
  );
}

function statusClass(status: NonNullable<LeadRequest["leadStatus"]>) {
  return {
    new: "bg-slate-500/10 text-slate-600",
    contacted: "bg-blue-500/10 text-blue-600",
    "follow-up": "bg-amber-500/10 text-amber-600",
    qualified: "bg-violet-500/10 text-violet-600",
    won: "bg-green-500/10 text-green-600",
    lost: "bg-red-500/10 text-red-600",
  }[status];
}
