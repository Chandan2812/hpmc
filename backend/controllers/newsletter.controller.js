const Newsletter = require("../models/newsletter.model");
const Subscriber = require("../models/subscriber.model");
const sendEmail = require("../utils/sendEmail");
const cloudinaryToBrevoAttachment = require("../utils/attachments");

/* ============================
   CREATE & SEND NEWSLETTER
=============================== */
exports.createAndSendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: "Subject and content are required",
      });
    }

    // 1️⃣ Get active subscribers
    const subscribers = await Subscriber.find({ isActive: true });

    if (!subscribers.length) {
      return res.status(400).json({
        success: false,
        message: "No active subscribers found",
      });
    }

    // 2️⃣ Handle uploaded attachments (Cloudinary metadata for DB)
    let attachments = [];

    if (req.files && req.files.length > 0) {
      attachments = req.files
        .map((file) => {
          const fileUrl = file.secure_url || file.path;
          if (!fileUrl) return null;

          return {
            name: file.originalname,
            url: fileUrl,
            type: file.mimetype,
            size: file.size,
          };
        })
        .filter(Boolean);
    }

    // 3️⃣ Create newsletter record (store URLs, not base64)
    const newsletter = await Newsletter.create({
      subject,
      content,
      attachments,
      sentAt: new Date(),
      totalRecipients: subscribers.length,
    });

    // 4️⃣ Convert Cloudinary files → Brevo attachments (BASE64)
    let brevoAttachments = [];

    if (attachments.length > 0) {
      brevoAttachments = await Promise.all(
        attachments.map((file) => cloudinaryToBrevoAttachment(file)),
      );
    }

    // 5️⃣ Send emails
    for (const sub of subscribers) {
      const unsubscribeUrl = `${process.env.BACKEND_URL}/subscribers/unsubscribe/${sub.unsubscribeToken}`;

      const emailHtml = `
        ${content}
        <hr />
       
        <p style="font-size:12px;color:#666">
          Don’t want these emails?
          <a href="${unsubscribeUrl}" target="_blank">Unsubscribe</a>
        </p>
      `;

      await sendEmail({
        to: sub.email,
        subject,
        html: emailHtml,
        attachments: brevoAttachments, // ✅ REAL attachments
      });
    }

    return res.status(201).json({
      success: true,
      message: "Newsletter sent successfully",
      totalRecipients: subscribers.length,
      data: newsletter,
    });
  } catch (error) {
    console.error("Create & Send Newsletter Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ============================
   GET ALL NEWSLETTERS (ADMIN)
=============================== */
exports.getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: newsletters.length,
      data: newsletters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ============================
   GET SINGLE NEWSLETTER
=============================== */
exports.getNewsletterById = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: newsletter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ============================
   DELETE NEWSLETTER (ADMIN)
=============================== */
exports.deleteNewsletter = async (req, res) => {
  try {
    const newsletter = await Newsletter.findById(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Newsletter not found",
      });
    }

    await newsletter.deleteOne();

    res.status(200).json({
      success: true,
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    console.error("Delete Newsletter Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
