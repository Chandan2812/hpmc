"use client";

import type { CSSProperties } from "react";
import type { LeadCustomField } from "../types/leadForm";

export type LeadCustomFieldValue = string | boolean | string[];
export type LeadCustomFieldValues = Record<string, LeadCustomFieldValue>;

interface LeadCustomFieldsProps {
  fields: LeadCustomField[];
  values: LeadCustomFieldValues;
  errors: Record<string, string>;
  inputStyle: CSSProperties;
  loading?: boolean;
  onChange: (fieldId: string, value: LeadCustomFieldValue) => void;
}

export default function LeadCustomFields({
  fields,
  values,
  errors,
  inputStyle,
  loading = false,
  onChange,
}: LeadCustomFieldsProps) {
  if (!fields.length && !loading) return null;

  return (
    <div className="mt-8">
      {loading ? (
        <div
          className="rounded-2xl border px-4 py-3 text-sm text-[var(--text-secondary)]"
          style={inputStyle}
        >
          Loading additional fields...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className={field.type === "textarea" ? "md:col-span-2" : ""}
            >
              {field.type === "checkbox" ? (
                <label
                  className="flex min-h-[50px] items-center justify-between gap-4 rounded-2xl border px-4 py-3"
                  style={inputStyle}
                >
                  <span className="font-medium text-[var(--text-primary)]">
                    {field.label}
                    {field.required ? " *" : ""}
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(values[field.id])}
                    onChange={(e) => onChange(field.id, e.target.checked)}
                    className="h-5 w-5 accent-[var(--primary)]"
                  />
                </label>
              ) : field.type === "textarea" ? (
                <textarea
                  rows={4}
                  value={String(values[field.id] || "")}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  placeholder={
                    field.placeholder ||
                    `${field.label}${field.required ? " *" : ""}`
                  }
                  className="w-full resize-none rounded-2xl border px-4 py-3 outline-none transition-all focus:border-[var(--primary)]"
                  style={inputStyle}
                />
              ) : field.type === "select" ? (
                <select
                  value={String(values[field.id] || "")}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="h-[50px] w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:border-[var(--primary)]"
                  style={inputStyle}
                >
                  <option value="">
                    {field.placeholder ||
                      `Select ${field.label}${field.required ? " *" : ""}`}
                  </option>
                  {(field.options || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={String(values[field.id] || "")}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  placeholder={
                    field.placeholder ||
                    `${field.label}${field.required ? " *" : ""}`
                  }
                  className="w-full rounded-2xl border px-4 py-3 outline-none transition-all focus:border-[var(--primary)]"
                  style={inputStyle}
                />
              )}

              {errors[field.id] && (
                <p className="mt-2 text-sm text-red-500">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
