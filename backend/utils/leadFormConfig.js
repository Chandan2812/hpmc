const SUPPORTED_FIELD_TYPES = [
  "text",
  "textarea",
  "email",
  "number",
  "select",
  "checkbox",
  "date",
];

const SYSTEM_FIELD_IDS = ["name", "phone", "email", "message"];
const MAX_CUSTOM_FIELDS = 50;

const sanitizeText = (value, maxLength = 160) =>
  String(value || "")
    .trim()
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, maxLength);

const toFieldId = (value) => {
  const words = sanitizeText(value)
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .split(" ")
    .filter(Boolean);

  if (!words.length) return "";

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0
        ? lower
        : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
};

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return [];

  const seen = new Set();

  return options
    .map((option) => sanitizeText(option, 80))
    .filter((option) => {
      const key = option.toLowerCase();
      if (!option || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const normalizeLeadFormFields = (fields = []) => {
  if (!Array.isArray(fields)) {
    return {
      valid: false,
      message: "Custom fields must be an array",
    };
  }

  if (fields.length > MAX_CUSTOM_FIELDS) {
    return {
      valid: false,
      message: `A maximum of ${MAX_CUSTOM_FIELDS} custom fields is allowed`,
    };
  }

  const ids = new Set();
  const labels = new Set();
  const normalizedFields = [];

  for (const field of fields) {
    const label = sanitizeText(field?.label);
    const type = sanitizeText(field?.type || "text").toLowerCase();
    const id = toFieldId(field?.id || label);
    const labelKey = label.toLowerCase();

    if (!label) {
      return {
        valid: false,
        message: "Every custom field needs a label",
      };
    }

    if (!id) {
      return {
        valid: false,
        message: `Unable to generate a safe id for "${label}"`,
      };
    }

    if (SYSTEM_FIELD_IDS.includes(id)) {
      return {
        valid: false,
        message: `"${label}" conflicts with a required system field`,
      };
    }

    if (!SUPPORTED_FIELD_TYPES.includes(type)) {
      return {
        valid: false,
        message: `"${label}" has an unsupported field type`,
      };
    }

    if (ids.has(id)) {
      return {
        valid: false,
        message: `Duplicate field id "${id}" is not allowed`,
      };
    }

    if (labels.has(labelKey)) {
      return {
        valid: false,
        message: `Duplicate field label "${label}" is not allowed`,
      };
    }

    const options = normalizeOptions(field?.options);

    if (type === "select" && options.length === 0) {
      return {
        valid: false,
        message: `"${label}" needs at least one select option`,
      };
    }

    ids.add(id);
    labels.add(labelKey);

    normalizedFields.push({
      id,
      label,
      type,
      required: Boolean(field?.required),
      placeholder: sanitizeText(field?.placeholder, 160),
      options: type === "select" ? options : [],
    });
  }

  return {
    valid: true,
    fields: normalizedFields,
  };
};

const normalizeLeadCustomFieldValues = (fields = [], values = {}) => {
  const source = values && typeof values === "object" ? values : {};
  const normalized = {};
  const configuredFieldIds = new Set(
    fields.flatMap((field) => [field.id, toFieldId(field.id)]),
  );

  for (const field of fields) {
    const rawValue = source[field.id];

    if (field.type === "checkbox") {
      if (field.required && !rawValue) {
        return {
          valid: false,
          message: `${field.label} is required`,
        };
      }

      normalized[field.id] = Boolean(rawValue);
      continue;
    }

    if (rawValue === undefined || rawValue === null) {
      normalized[field.id] = "";
      continue;
    }

    const value = String(rawValue).trim();

    if (field.required && !value) {
      return {
        valid: false,
        message: `${field.label} is required`,
      };
    }

    if (field.type === "select" && value && !field.options.includes(value)) {
      return {
        valid: false,
        message: `${field.label} has an invalid option`,
      };
    }

    if (field.type === "number" && value && Number.isNaN(Number(value))) {
      return {
        valid: false,
        message: `${field.label} must be a number`,
      };
    }

    if (
      field.type === "email" &&
      value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      return {
        valid: false,
        message: `${field.label} must be a valid email`,
      };
    }

    normalized[field.id] = sanitizeText(value, field.type === "textarea" ? 2000 : 300);
  }

  Object.entries(source).forEach(([key, rawValue]) => {
    const id = /^[a-zA-Z][a-zA-Z0-9]*$/.test(key) ? key : toFieldId(key);

    if (
      !id ||
      configuredFieldIds.has(id) ||
      configuredFieldIds.has(toFieldId(id)) ||
      SYSTEM_FIELD_IDS.includes(id)
    ) {
      return;
    }

    if (rawValue === undefined || rawValue === null || rawValue === "") {
      return;
    }

    if (Array.isArray(rawValue)) {
      const values = rawValue
        .map((item) => sanitizeText(item, 300))
        .filter(Boolean);

      if (values.length) {
        normalized[id] = values;
      }

      return;
    }

    if (typeof rawValue === "boolean") {
      normalized[id] = rawValue;
      return;
    }

    const value = sanitizeText(rawValue, 2000);

    if (value) {
      normalized[id] = value;
    }
  });

  return {
    valid: true,
    values: normalized,
  };
};

module.exports = {
  SUPPORTED_FIELD_TYPES,
  SYSTEM_FIELD_IDS,
  normalizeLeadCustomFieldValues,
  normalizeLeadFormFields,
};
