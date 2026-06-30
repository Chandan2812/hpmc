"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Edit3,
  LayoutGrid,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import {
  supportedLeadFieldTypes,
  systemLeadFields,
  type LeadCustomField,
  type LeadFieldType,
} from "../../types/leadForm";

const moduleCategories = [
  {
    title: "Overview",
    description:
      "Get a complete snapshot of your business with key metrics, performance insights, and recent activity in one place.",
    modules: [{ key: "analytics", label: "Analytics" }],
  },
  {
    title: "Lead Generation",
    description: "Capture, qualify, and follow up with incoming prospects.",
    modules: [
      { key: "leads", label: "Leads" },
      { key: "siteVisits", label: "Site Visits" },
    ],
  },
  {
    title: "Content & Audience",
    description: "Manage communication, subscribers, and published content.",
    modules: [
      { key: "subscribers", label: "Subscribers" },
      { key: "newsletter", label: "Newsletter" },
      { key: "blogs", label: "Blogs" },
      { key: "gallery", label: "Gallery" },
    ],
  },
  {
    title: "Hiring",
    description: "Publish openings and review candidate applications.",
    modules: [
      { key: "openings", label: "Job Openings" },
      { key: "jobApplications", label: "Job Applications" },
    ],
  },
  {
    title: "Brand Trust",
    description: "Showcase customers and social proof across the website.",
    modules: [
      { key: "clients", label: "Clients" },
      { key: "testimonials", label: "Testimonials" },
    ],
  },
  {
    title: "Network",
    description: "Organize external business relationships.",
    modules: [
      { key: "agents", label: "Agents" },
      { key: "vendors", label: "Vendors" },
    ],
  },
  {
    title: "Team",
    description: "Manage employees and lead ownership.",
    modules: [{ key: "employees", label: "Employees" }],
  },
];
const moduleList = moduleCategories.flatMap((category) => category.modules);

const emptyField: LeadCustomField = {
  id: "",
  label: "",
  type: "text",
  required: false,
  placeholder: "",
  options: [],
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function SettingsPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const { refreshSettings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [savingBranding, setSavingBranding] = useState(false);
  const [savingModules, setSavingModules] = useState(false);
  const [savingLeadForm, setSavingLeadForm] = useState(false);
  const [leadFormError, setLeadFormError] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [modules, setModules] = useState<Record<string, boolean>>({});
  const [customFields, setCustomFields] = useState<LeadCustomField[]>([]);
  const [draftField, setDraftField] = useState<LeadCustomField>(emptyField);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/settings`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (data.success) {
        setCompanyName(data.data.branding?.companyName || "");
        setLogoPreview(data.data.branding?.logo || "");
        setModules(data.data.modules || {});
        setCustomFields(data.data.leadForm?.customFields || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchSettings();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const enabledModules = useMemo(
    () => Object.values(modules).filter(Boolean).length,
    [modules],
  );
  const disabledModules = useMemo(
    () => Object.values(modules).filter((module) => !module).length,
    [modules],
  );

  const handleBrandingSave = async () => {
    try {
      setSavingBranding(true);
      const formData = new FormData();

      formData.append("companyName", companyName);
      if (logo) formData.append("logo", logo);

      const res = await fetch(`${API_BASE}/api/settings/branding`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        await refreshSettings();
        await fetchSettings();
        alert("Branding updated successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update branding");
    } finally {
      setSavingBranding(false);
    }
  };

  const handleModulesSave = async () => {
    try {
      setSavingModules(true);
      const res = await fetch(`${API_BASE}/api/settings/modules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modules),
      });
      const data = await res.json();

      if (data.success) {
        await refreshSettings();
        await fetchSettings();
        alert("Modules updated successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update modules");
    } finally {
      setSavingModules(false);
    }
  };

  const handleLeadFormSave = async () => {
    try {
      setSavingLeadForm(true);
      setLeadFormError("");

      const res = await fetch(`${API_BASE}/api/settings/lead-form`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customFields }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update lead settings");
      }

      setCustomFields(data.data?.customFields || []);
      await refreshSettings();
      await fetchSettings();
      alert("Lead settings updated successfully");
    } catch (error) {
      setLeadFormError(
        getErrorMessage(error, "Failed to update lead settings"),
      );
    } finally {
      setSavingLeadForm(false);
    }
  };

  const toggleModule = (key: string) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetDraft = () => {
    setDraftField(emptyField);
    setEditingIndex(null);
    setLeadFormError("");
  };

  const upsertDraftField = () => {
    if (!draftField.label.trim()) {
      setLeadFormError("Field label is required");
      return;
    }

    if (draftField.type === "select" && !draftField.options?.length) {
      setLeadFormError("Select fields need at least one option");
      return;
    }

    setLeadFormError("");
    setCustomFields((prev) => {
      if (editingIndex === null) return [...prev, draftField];
      return prev.map((field, index) =>
        index === editingIndex ? draftField : field,
      );
    });
    resetDraft();
  };

  const editField = (index: number) => {
    setDraftField(customFields[index]);
    setEditingIndex(index);
    setLeadFormError("");
  };

  const deleteField = (index: number) => {
    setCustomFields((prev) =>
      prev.filter((_, fieldIndex) => fieldIndex !== index),
    );
    if (editingIndex === index) resetDraft();
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= customFields.length) return;

    setCustomFields((prev) => {
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
            Admin Panel
          </p>
          <h1 className="font-serif text-4xl text-[var(--text-primary)]">
            Settings
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Manage branding, modules, and lead intake for this CRM.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          title="Total Modules"
          value={moduleList.length}
          icon={<LayoutGrid size={18} />}
        />
        <StatCard
          title="Enabled"
          value={enabledModules}
          icon={<SettingsIcon size={18} />}
        />
        <StatCard
          title="Disabled"
          value={disabledModules}
          icon={<SettingsIcon size={18} />}
        />
        <StatCard
          title="Lead Fields"
          value={systemLeadFields.length + customFields.length}
          icon={<Edit3 size={18} />}
        />
      </div>

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-6 flex items-center gap-3">
          <Building2 size={22} />
          <h2 className="text-xl font-semibold">Branding Settings</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Company Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setLogo(file);
                setLogoPreview(URL.createObjectURL(file));
              }}
              className="w-full rounded-xl border border-[var(--border)] p-3"
            />
          </div>
        </div>

        {logoPreview && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Logo Preview</p>
            <div className="flex h-32 w-48 items-center justify-center rounded-xl border border-[var(--border)] bg-white">
              <img
                src={logoPreview}
                alt="logo"
                className="max-h-24 max-w-40 object-contain"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleBrandingSave}
          disabled={savingBranding}
          className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-white disabled:opacity-60"
        >
          <Save size={16} />
          {savingBranding ? "Saving..." : "Save Branding"}
        </button>
      </section>

      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-6 flex items-center gap-3">
          <LayoutGrid size={22} />
          <h2 className="text-xl font-semibold">Module Management</h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {moduleCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border border-[var(--border)] p-5"
            >
              <div className="mb-4">
                <h3 className="font-semibold">{category.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {category.description}
                </p>
              </div>

              <div className="space-y-3">
                {category.modules.map((module) => (
                  <div
                    key={module.key}
                    className="flex items-center justify-between gap-4 rounded-xl bg-[var(--background-secondary)] p-4"
                  >
                    <div>
                      <span className="font-medium">{module.label}</span>
                    </div>
                    <button
                      onClick={() => toggleModule(module.key)}
                      className={`relative h-7 w-14 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        modules[module.key] ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
                          modules[module.key] ? "left-7" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleModulesSave}
          disabled={savingModules}
          className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-white disabled:opacity-60"
        >
          <Save size={16} />
          {savingModules ? "Saving..." : "Save Modules"}
        </button>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Edit3 size={22} />
            <h2 className="text-xl font-semibold">Lead Settings</h2>
          </div>
          <button
            onClick={handleLeadFormSave}
            disabled={savingLeadForm}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-white disabled:opacity-60"
          >
            <Save size={16} />
            {savingLeadForm ? "Saving..." : "Save Lead Settings"}
          </button>
        </div>

        {leadFormError && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
            {leadFormError}
          </div>
        )}

        <div className="mb-6">
          <h3 className="mb-3 font-semibold">Permanent Fields</h3>
          <div className="grid gap-3 md:grid-cols-4">
            {systemLeadFields.map((field) => (
              <div
                key={field.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-4"
              >
                <p className="font-medium">{field.label}</p>
                <p className="mt-1 text-xs uppercase text-[var(--text-secondary)]">
                  System field
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div>
            <h3 className="mb-3 font-semibold">Custom Fields</h3>
            <div className="space-y-3">
              {customFields.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
                  No custom lead fields configured.
                </div>
              ) : (
                customFields.map((field, index) => (
                  <div
                    key={`${field.id}-${index}`}
                    className="flex flex-col gap-4 rounded-xl border border-[var(--border)] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{field.label}</p>
                        {field.required && (
                          <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-500">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {field.id || "Generated on save"} · {field.type}
                        {field.type === "select" && field.options?.length
                          ? ` · ${field.options.join(", ")}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <IconButton
                        label="Move up"
                        onClick={() => moveField(index, -1)}
                        disabled={index === 0}
                        icon={<ArrowUp size={15} />}
                      />
                      <IconButton
                        label="Move down"
                        onClick={() => moveField(index, 1)}
                        disabled={index === customFields.length - 1}
                        icon={<ArrowDown size={15} />}
                      />
                      <IconButton
                        label="Edit"
                        onClick={() => editField(index)}
                        icon={<Edit3 size={15} />}
                      />
                      <IconButton
                        label="Delete"
                        onClick={() => deleteField(index)}
                        icon={<Trash2 size={15} />}
                        tone="danger"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
            <h3 className="mb-4 font-semibold">
              {editingIndex === null ? "Add Custom Field" : "Edit Custom Field"}
            </h3>

            <div className="space-y-4">
              <TextInput
                label="Field Label"
                value={draftField.label}
                onChange={(value) =>
                  setDraftField((prev) => ({ ...prev, label: value }))
                }
                placeholder="Property Type"
              />

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Field Type
                </label>
                <select
                  value={draftField.type}
                  onChange={(e) =>
                    setDraftField((prev) => ({
                      ...prev,
                      type: e.target.value as LeadFieldType,
                      options:
                        e.target.value === "select" ? prev.options || [] : [],
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 outline-none"
                >
                  {supportedLeadFieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <TextInput
                label="Placeholder"
                value={draftField.placeholder || ""}
                onChange={(value) =>
                  setDraftField((prev) => ({ ...prev, placeholder: value }))
                }
                placeholder="Enter property type"
              />

              {draftField.type === "select" && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Options
                  </label>
                  <textarea
                    rows={4}
                    value={(draftField.options || []).join("\n")}
                    onChange={(e) =>
                      setDraftField((prev) => ({
                        ...prev,
                        options: e.target.value
                          .split("\n")
                          .map((option) => option.trim())
                          .filter(Boolean),
                      }))
                    }
                    placeholder={"Flat\nVilla\nPlot"}
                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 outline-none"
                  />
                </div>
              )}

              <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <span className="font-medium">Required field</span>
                <input
                  type="checkbox"
                  checked={draftField.required}
                  onChange={(e) =>
                    setDraftField((prev) => ({
                      ...prev,
                      required: e.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-[var(--primary)]"
                />
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={upsertDraftField}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 text-white"
                >
                  <Plus size={16} />
                  {editingIndex === null ? "Add Field" : "Update Field"}
                </button>
                {editingIndex !== null && (
                  <button
                    type="button"
                    onClick={resetDraft}
                    className="h-11 rounded-xl border border-[var(--border)] px-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 outline-none"
      />
    </div>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  disabled,
  tone = "default",
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-9 w-9 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-40 ${
        tone === "danger"
          ? "text-red-500 hover:bg-red-500/10"
          : "hover:bg-[var(--background-secondary)]"
      }`}
    >
      {icon}
    </button>
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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">{title}</span>
        {icon}
      </div>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}
