const SiteVisit = require("../models/sitevisit.model");
const sendEmail = require("../utils/sendEmail");

// Create Site Visit Request
exports.createSiteVisit = async (req, res) => {
  try {
    const { name, phone, email, companyName, visitDateTime, message } =
      req.body;

    const siteVisit = await SiteVisit.create({
      name,
      phone,
      email,
      companyName,
      visitDateTime,
      message,
    });

    await sendEmail({
      to: "social_media@hindustanplastics.com",
      subject: "📅 New Site Visit Request - HPMC",
      html: `
  <div style="margin:0;padding:40px 20px;background:#f4f7f9;font-family:Arial,Helvetica,sans-serif;">
    <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

      <!-- Header -->
      <tr>
        <td align="center" style="padding:30px 20px;background:#ffffff;">
          <img
            src="https://res.cloudinary.com/fkvbncim/image/upload/v1782899294/hpmc/images/hp-logo.png"
            alt="HPMC"
            width="170"
            style="display:block;"
          />
        </td>
      </tr>

      <tr>
        <td style="height:5px;background:#65BC4F;"></td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="padding:35px 35px 15px;">
          <h2 style="margin:0;color:#111827;font-size:28px;">
            📅 New Site Visit Request
          </h2>
          <p style="margin:10px 0 0;color:#6b7280;font-size:15px;">
            A customer has requested a site visit through the HPMC website.
          </p>
        </td>
      </tr>

      <!-- Visit Schedule -->
      <tr>
        <td style="padding:0 35px 25px;">
          <div style="
            background:#f3fdf1;
            border-left:5px solid #65BC4F;
            padding:18px 22px;
            border-radius:8px;
          ">
            <div style="font-size:14px;color:#6b7280;margin-bottom:6px;">
              Requested Visit Schedule
            </div>

            <div style="font-size:20px;font-weight:bold;color:#111827;">
              ${new Date(siteVisit.visitDateTime).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })} IST
            </div>
          </div>
        </td>
      </tr>

      <!-- Customer Details -->
      <tr>
        <td style="padding:0 35px 30px;">
          <table width="100%" cellpadding="12" cellspacing="0" style="border-collapse:collapse;font-size:15px;">

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;width:180px;border:1px solid #e5e7eb;">Name</td>
              <td style="border:1px solid #e5e7eb;">${siteVisit.name}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Company</td>
              <td style="border:1px solid #e5e7eb;">${siteVisit.companyName || "-"}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Email</td>
              <td style="border:1px solid #e5e7eb;">${siteVisit.email}</td>
            </tr>

            <tr>
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Phone</td>
              <td style="border:1px solid #e5e7eb;">${siteVisit.phone}</td>
            </tr>

            <tr style="background:#f9fafb;">
              <td style="font-weight:bold;border:1px solid #e5e7eb;">Message</td>
              <td style="border:1px solid #e5e7eb;">
                ${siteVisit.message || "-"}
              </td>
            </tr>

          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#111827;padding:20px;text-align:center;color:#ffffff;font-size:13px;">
          <strong>Hindustan Plastics & Machine Corporation (HPMC)</strong><br>
          Website Site Visit Notification<br><br>
          Received on: ${new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </td>
      </tr>

    </table>
  </div>
  `,
    });
    res.status(201).json({
      success: true,
      message: "Site visit request submitted successfully",
      data: siteVisit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Site Visits
exports.getAllSiteVisits = async (req, res) => {
  try {
    const siteVisits = await SiteVisit.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: siteVisits.length,
      data: siteVisits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Site Visit
exports.getSiteVisitById = async (req, res) => {
  try {
    const siteVisit = await SiteVisit.findById(req.params.id);

    if (!siteVisit) {
      return res.status(404).json({
        success: false,
        message: "Site visit request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: siteVisit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Status
exports.updateSiteVisitStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const siteVisit = await SiteVisit.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!siteVisit) {
      return res.status(404).json({
        success: false,
        message: "Site visit request not found",
      });
    }

    // Send status email to customer
    await sendEmail({
      to: siteVisit.email,
      subject: "Site Visit Request Update - HPMC",
      html: `
        <h2>Hello ${siteVisit.name},</h2>

        <p>Your site visit request status has been updated.</p>

        <p>
          <strong>Status:</strong>
          ${status.toUpperCase()}
        </p>

        <p>
          <strong>Visit Date & Time:</strong>
          ${new Date(siteVisit.visitDateTime).toLocaleString("en-IN")}
        </p>

        <p>
          Thank you for your interest in HPMC.
          Our team will contact you if any further coordination is required.
        </p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: siteVisit,
    });
  } catch (error) {
    console.error("Update Site Visit Status Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Marked
exports.toggleMarked = async (req, res) => {
  try {
    const siteVisit = await SiteVisit.findById(req.params.id);

    if (!siteVisit) {
      return res.status(404).json({
        success: false,
        message: "Site visit request not found",
      });
    }

    siteVisit.marked = !siteVisit.marked;
    await siteVisit.save();

    res.status(200).json({
      success: true,
      message: "Marked status updated",
      data: siteVisit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Site Visit
exports.deleteSiteVisit = async (req, res) => {
  try {
    const siteVisit = await SiteVisit.findByIdAndDelete(req.params.id);

    if (!siteVisit) {
      return res.status(404).json({
        success: false,
        message: "Site visit request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Site visit request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
