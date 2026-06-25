export const supportedLeadFieldTypes = [
  "text",
  "textarea",
  "email",
  "number",
  "select",
  "checkbox",
  "date",
] as const;

export type LeadFieldType = (typeof supportedLeadFieldTypes)[number];

export interface LeadCustomField {
  id: string;
  label: string;
  type: LeadFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface LeadFormSettings {
  customFields: LeadCustomField[];
}

export const systemLeadFields = [
  { id: "name", label: "Name", type: "text" },
  { id: "phone", label: "Phone", type: "text" },
  { id: "email", label: "Email", type: "email" },
  { id: "message", label: "Message", type: "textarea" },
] as const;
