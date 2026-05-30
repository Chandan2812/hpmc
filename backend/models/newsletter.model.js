const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    // Subject shown in email inbox
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    // HTML content of the newsletter
    content: {
      type: String,
      required: true,
    },

    // Optional attachment links (NOT email attachments)
    attachments: [
      {
        name: {
          type: String, // e.g. Oaklyn-Brochure.pdf
        },
        url: {
          type: String, // Cloudinary / S3 URL
        },
        type: {
          type: String, // pdf, image, doc
        },
        size: {
          type: Number, // in bytes (optional)
        },
      },
    ],

    // When it was sent
    sentAt: {
      type: Date,
      default: null,
    },

    // How many active subscribers received it
    totalRecipients: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
