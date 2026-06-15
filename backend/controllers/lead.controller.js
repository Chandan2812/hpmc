const Lead = require("../models/lead.model");
const Employee = require("../models/employee.model");
const sendEmail = require("../utils/sendEmail");

const otpStore = new Map(); // temporary in-memory storage

/* ============================
   SEND OTP
=============================== */
exports.sendOTP = async (req, res) => {
  try {
    const { name, email, phone, companyName, products, message } = req.body;

    // Basic validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email and phone are required",
      });
    }

    // Check duplicate email
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(200).json({
        success: true,
        alreadyRegistered: true,
        message: "Email already registered.",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP with lead data
    otpStore.set(email, {
      otp,
      data: {
        name,
        email,
        phone,
        companyName,
        products,
        message,
      },
      createdAt: Date.now(),
    });

    // Send OTP Email
    await sendEmail({
      to: email,
      subject: "Your OTP - HPMC",
      html: `
        <h2>Hello ${name},</h2>
        <p>Your verification OTP is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({
      message: "Server error while sending OTP",
    });
  }
};

/* ============================
   VERIFY OTP & SAVE LEAD
=============================== */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = otpStore.get(email);

    if (!record) {
      return res.status(400).json({
        message: "OTP expired or not found",
      });
    }

    // Check expiry (5 minutes)
    const isExpired = Date.now() - record.createdAt > 5 * 60 * 1000;
    if (isExpired) {
      otpStore.delete(email);
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (parseInt(otp) !== record.otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Save Lead
    const newLead = new Lead({
      ...record.data,
      verified: true,
    });

    await newLead.save();
    otpStore.delete(email);

    /* ===== Confirmation Email ===== */
    await sendEmail({
      to: email,
      subject: "We Received Your Request - HPMC",
      html: `
        <h2>Hello ${record.data.name},</h2>
        <p>Thank you for contacting HPMC.</p>
        <p>Our team will connect with you shortly.</p>
      `,
    });

    /* ===== Internal Notification ===== */
    await sendEmail({
      to: "chandangomia2812@gmail.com",
      subject: "New Lead - HPMC",
      html: `
  <h2>New Product Inquiry</h2>

  <p><strong>Name:</strong> ${record.data.name}</p>

  <p><strong>Email:</strong> ${record.data.email}</p>

  <p><strong>Phone:</strong> ${record.data.phone}</p>

  <p><strong>Company:</strong> ${record.data.companyName}</p>

  <p>
    <strong>Products:</strong>
    ${
      Array.isArray(record.data.products)
        ? record.data.products.join(", ")
        : record.data.products || "-"
    }
  </p>

  <p>
    <strong>Message:</strong><br/>
    ${record.data.message || "-"}
  </p>
`,
    });

    res.status(200).json({
      success: true,
      message: "Lead verified and saved successfully.",
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({
      message: "Server error while verifying OTP",
    });
  }
};

/* ============================
   GET ALL LEADS
=============================== */
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email")
      .populate("notes.createdBy", "name email")
      .populate("activityLog.employee", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error while fetching leads." });
  }
};

/* ============================
   MARK LEAD AS TRUE
=============================== */
exports.markLead = async (req, res) => {
  const { id } = req.params;
  const { marked } = req.body;

  try {
    if (typeof marked !== "boolean") {
      return res.status(400).json({
        message: "Marked value must be boolean",
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    lead.marked = marked;
    lead.lastActivityAt = new Date();
    lead.activityLog.push({
      type: "marked",
      message: marked ? "Lead marked as completed" : "Lead marked as pending",
    });

    await lead.save();

    res.status(200).json({
      message: "Lead updated successfully.",
      lead,
    });
  } catch (err) {
    console.error("Error updating lead:", err);
    res.status(500).json({
      message: "Server error while updating lead.",
    });
  }
};

/* ============================
   DELETE LEAD
=============================== */
exports.deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.status(200).json({ message: "Lead deleted successfully." });
  } catch (err) {
    console.error("Error deleting lead:", err);
    res.status(500).json({ message: "Server error while deleting lead." });
  }
};

exports.assignLead = async (req, res) => {
  try {
    const { leadId, employeeId } = req.body;

    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "Lead id is required",
      });
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    let employee = null;

    if (employeeId) {
      employee = await Employee.findOne({ _id: employeeId, active: true });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Active employee not found",
        });
      }
    }

    lead.assignedTo = employee ? employee._id : null;
    lead.assignedAt = employee ? new Date() : null;
    lead.lastActivityAt = new Date();
    lead.activityLog.push({
      type: "assigned",
      employee: employee ? employee._id : null,
      message: employee
        ? `Lead assigned to ${employee.name}`
        : "Lead assignment removed",
    });

    await lead.save();
    await lead.populate("assignedTo", "name email");

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
