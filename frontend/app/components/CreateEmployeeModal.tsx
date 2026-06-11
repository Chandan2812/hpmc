"use client";

import {
  BadgeCheck,
  BriefcaseBusiness,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useState,
} from "react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee | null;
}

type EmployeeFormData = {
  name: string;
  email: string;
  password: string;
};

function getInitialFormData(employee: Employee | null): EmployeeFormData {
  return {
    name: employee?.name || "",
    email: employee?.email || "",
    password: "",
  };
}

export default function EmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  employee,
}: EmployeeModalProps) {
  if (!isOpen) return null;

  return (
    <EmployeeModalContent
      key={employee?._id || "new-employee"}
      onClose={onClose}
      onSuccess={onSuccess}
      employee={employee}
    />
  );
}

function EmployeeModalContent({
  onClose,
  onSuccess,
  employee,
}: Omit<EmployeeModalProps, "isOpen">) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const isEdit = Boolean(employee);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(() => getInitialFormData(employee));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!isEdit && !formData.password.trim()) {
      setError("Password is required for a new employee.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const url = isEdit
        ? `${API_BASE}/employee/${employee?._id}`
        : `${API_BASE}/employee`;

      const payload = isEdit
        ? {
            name: formData.name.trim(),
            email: formData.email.trim(),
            active: employee?.active,
            ...(formData.password.trim()
              ? { password: formData.password.trim() }
              : {}),
          }
        : {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
          };

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="employee-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5 md:px-8">
          <div className="min-w-0 pr-3">
            <p className="mb-2 text-[10px] uppercase tracking-[4px] text-[var(--primary)]">
              Employee Access
            </p>

            <h2
              id="employee-modal-title"
              className="font-serif text-2xl text-[var(--text-primary)] md:text-3xl"
            >
              {isEdit ? "Edit Employee" : "Add Employee"}
            </h2>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {isEdit
                ? "Update account details and optionally reset the password."
                : "Create a secure employee login for the HPMC dashboard."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] transition hover:bg-[var(--background-secondary)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form
          id="employee-form"
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex-1 overflow-y-auto"
        >
          <div className="grid gap-6 p-6 md:grid-cols-[0.85fr_1.15fr] md:p-8">
            {/* Left Panel */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <BriefcaseBusiness size={24} />
              </div>

              <h3 className="font-serif text-xl text-[var(--text-primary)]">
                Account Profile
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Employee accounts can sign in to the employee panel and manage
                assigned work based on their active status.
              </p>

              {isEdit && employee && (
                <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                    Current Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      employee.active
                        ? "bg-green-500/10 text-green-600"
                        : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {employee.active ? "Active" : "Inactive"}
                  </span>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* Employee Details Panel */}

              {/* Login Security Panel */}
              <div className="space-y-5">
                <Panel
                  title="Employee Details"
                  icon={<BadgeCheck size={18} />}
                  eyebrow="Identity"
                >
                  {" "}
                  <div className="grid gap-4">
                    {" "}
                    <InputField
                      label="Employee Name"
                      icon={<UserRound size={17} />}
                      name="employee-name-field"
                      autoComplete="new-password"
                      value={formData.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      placeholder="Enter employee name"
                      required
                    />{" "}
                    <InputField
                      label="Email Address"
                      icon={<Mail size={17} />}
                      type="email"
                      name="employee-email-field"
                      autoComplete="new-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={formData.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="employee@example.com"
                      required
                    />{" "}
                  </div>{" "}
                </Panel>{" "}
                <Panel
                  title="Login Security"
                  icon={<ShieldCheck size={18} />}
                  eyebrow="Credentials"
                >
                  {" "}
                  <InputField
                    label={isEdit ? "New Password" : "Password"}
                    icon={<KeyRound size={17} />}
                    type="password"
                    name="employee-password-field"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder={
                      isEdit
                        ? "Leave empty to keep current password"
                        : "Set employee password"
                    }
                    required={!isEdit}
                  />{" "}
                  <p className="mt-3 text-xs leading-5 text-[var(--text-secondary)]">
                    {" "}
                    {isEdit
                      ? "Password changes only when this field has a value."
                      : "Share credentials privately after creating the account."}{" "}
                  </p>
                </Panel>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="border-t border-[var(--border)] bg-[var(--card)] px-6 py-4 md:px-8">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 rounded-xl border border-[var(--border)] px-6 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="employee-form"
              disabled={loading}
              className="flex h-11 min-w-[180px] items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 font-medium text-white transition hover:opacity-90"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}

              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Employee"
                  : "Create Employee"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  icon,
  children,
}: {
  title: string;
  eyebrow: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </div>
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[var(--primary)]">
            {eyebrow}
          </p>
          <h3 className="font-serif text-xl text-[var(--text-primary)]">
            {title}
          </h3>
        </div>
      </div>
      {children}
    </section>
  );
}

function InputField({
  label,
  icon,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
          {icon}
        </span>
        <input
          {...props}
          className={`h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] pl-10 pr-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)] ${className}`}
        />
      </div>
    </div>
  );
}
