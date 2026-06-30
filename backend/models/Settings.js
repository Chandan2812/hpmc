const mongoose = require("mongoose");

const leadFormFieldSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "text",
        "textarea",
        "email",
        "number",
        "select",
        "checkbox",
        "date",
      ],
      default: "text",
    },

    required: {
      type: Boolean,
      default: false,
    },

    placeholder: {
      type: String,
      default: "",
      trim: true,
    },

    options: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const settingsSchema = new mongoose.Schema({
  branding: {
    companyName: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },
  },

  modules: {
    leads: {
      type: Boolean,
      default: true,
    },

    analytics: {
      type: Boolean,
      default: true,
    },

    blogs: {
      type: Boolean,
      default: true,
    },

    gallery: {
      type: Boolean,
      default: true,
    },

    agents: {
      type: Boolean,
      default: true,
    },

    employees: {
      type: Boolean,
      default: true,
    },

    newsletter: {
      type: Boolean,
      default: true,
    },

    subscribers: {
      type: Boolean,
      default: true,
    },

    clients: {
      type: Boolean,
      default: true,
    },

    testimonials: {
      type: Boolean,
      default: true,
    },

    vendors: {
      type: Boolean,
      default: true,
    },

    siteVisits: {
      type: Boolean,
      default: true,
    },

    openings: {
      type: Boolean,
      default: true,
    },

    jobApplications: {
      type: Boolean,
      default: true,
    },
  },

  leadForm: {
    customFields: {
      type: [leadFormFieldSchema],
      default: [],
    },
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
