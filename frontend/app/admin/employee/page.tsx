"use client";

import EmployeeModal from "@/app/components/CreateEmployeeModal";
import {
  BriefcaseBusiness,
  Filter,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type FilterType = "all" | "today" | "range";

interface Employee {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

const ITEMS_PER_PAGE = 20;

async function requestEmployee(apiBase: string | undefined) {
  const res = await fetch(`${apiBase}/employee`, { cache: "no-store" });
  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch agent applications");
  }

  return [...(result.employees || [])].sort(
    (a: Employee, b: Employee) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export default function AdminEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    let cancelled = false;

    requestEmployee(API_BASE)
      .then((data) => {
        if (!cancelled) setEmployees(data);
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
      setEmployees(await requestEmployee(API_BASE));
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
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

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
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
                    <th className="w-[20%] px-2 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Created
                    </th>
                    <th className="w-[20%] px-2 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentEmployees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--background-secondary)]"
                    >
                      <td className="px-3 py-4 sm:px-4 md:px-5">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)] md:text-base">
                          {employee.name}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-[var(--text-secondary)] sm:text-xs">
                          {employee.email}
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
                            className={`text-xs font-medium ${
                              employee.active
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {employee.active ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>

                      <td className="hidden whitespace-nowrap px-5 py-4 text-xs text-[var(--text-secondary)] xl:table-cell">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-2 py-4 sm:px-4 md:px-5">
                        <div className="flex justify-start gap-2">
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
                  ))}
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
