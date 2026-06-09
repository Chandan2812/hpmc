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
      to: "chandangomia2812@gmail.com",
      subject: "New Site Visit Request - HPMC",
      html: `
    <h2>New Site Visit Request</h2>

    <p><strong>Name:</strong> ${siteVisit.name}</p>

    <p><strong>Email:</strong> ${siteVisit.email}</p>

    <p><strong>Phone:</strong> ${siteVisit.phone}</p>

    <p><strong>Company:</strong> ${siteVisit.companyName}</p>

    <p>
  <strong>Visit Date & Time:</strong>
  ${new Date(siteVisit.visitDateTime).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })} IST
</p>

    <p>
      <strong>Message:</strong><br/>
      ${siteVisit.message || "-"}
    </p>
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
