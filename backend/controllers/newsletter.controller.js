const Newsletter = require("../models/newsletter.model");
const Subscriber = require("../models/subscriber.model");
const sendEmail = require("../utils/sendEmail");
const cloudinaryToBrevoAttachment = require("../utils/attachments");

const OPENAI_API_URL = "https://api.openai.com/v1";

const stripCodeFence = (value) =>
  String(value || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const callOpenAI = async (path, payload) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(`${OPENAI_API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || data.message || "OpenAI request failed",
    );
  }

  return data;
};

const generateNewsletterDraft = async ({
  topic,
  audience,
  tone,
  keyPoints,
  callToAction,
}) => {
  const model = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";

  const data = await callOpenAI("/chat/completions", {
    model,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You create concise, professional HTML email newsletters for HPMC. Return only valid JSON.",
      },
      {
        role: "user",
        content: `
Create a newsletter draft.

Topic: ${topic}
Audience: ${audience || "customers, prospects, industry partners"}
Tone: ${tone || "professional and helpful"}
Key points: ${keyPoints || "latest updates, useful insights, product/service value"}
Call to action: ${callToAction || "Contact HPMC for more information"}

Return JSON with this exact shape:
{
  "subject": "short email subject",
  "content": "HTML email body using h2, h3, p, ul, li, strong, a tags only"
}

The HTML should include:
- A clear opening
- 2-4 useful sections
- Bullet points where helpful
- A polite call-to-action
- No markdown, no html/head/body wrapper, no unsubscribe text.
        `.trim(),
      },
    ],
  });

  const content = data.choices?.[0]?.message?.content;
  const parsed = JSON.parse(stripCodeFence(content));

  return {
    subject: parsed.subject || topic,
    content: parsed.content || "",
  };
};

/* ============================
   GENERATE NEWSLETTER WITH AI
=============================== */
exports.generateNewsletterWithAI = async (req, res) => {
  try {
    const { topic, audience, tone, keyPoints, callToAction } = req.body;

    if (!topic || !String(topic).trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const newsletter = await generateNewsletterDraft({
      topic: String(topic).trim(),
      audience,
      tone,
      keyPoints,
      callToAction,
    });

    return res.status(200).json({
      success: true,
      newsletter,
    });
  } catch (error) {
    console.error("AI NEWSLETTER GENERATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate newsletter with AI",
    });
  }
};

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
