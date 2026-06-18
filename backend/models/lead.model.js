const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    // Customer Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    companyName: {
      type: String,
      trim: true,
      required: [true, "Company name is required"],
    },

    products: [
      {
        type: String,
        trim: true,
      },
    ],

    message: {
      type: String,
      trim: true,
    },

    // Lead Status
    verified: {
      type: Boolean,
      default: false,
    },

    marked: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      trim: true,
      default: "Website",
    },

    leadStatus: {
      type: String,
      enum: ["new", "contacted", "follow-up", "qualified", "won", "lost"],
      default: "new",
    },

    followUpDate: {
      type: Date,
      default: null,
    },

    followUpRemark: {
      type: String,
      trim: true,
      default: "",
    },

    assignedAt: {
      type: Date,
      default: null,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    notes: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },

        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    activityLog: [
      {
        type: {
          type: String,
          enum: [
            "created",
            "assigned",
            "status",
            "note",
            "follow-up",
            "marked",
            "call",
            "whatsapp",
            "email",
            "site-visit",
            "quotation",
          ],
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        employee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Employee",
          default: null,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

leadSchema.index({ assignedTo: 1, leadStatus: 1, followUpDate: 1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);
