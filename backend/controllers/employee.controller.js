const Employee = require("../models/employee.model");
const Lead = require("../models/lead.model");
const { LEAD_STATUSES, normalizeLeadStatus } = require("../models/lead.model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { EmailCampaignsApi } = require("sib-api-v3-sdk");

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfToday = () => {
  const date = startOfToday();
  date.setHours(23, 59, 59, 999);
  return date;
};

const daysSince = (date) => {
  if (!date) return null;
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / DAY_MS),
  );
};

const getAgingTone = (lead) => {
  if (!lead.followUpDate) return "green";

  const followUp = new Date(lead.followUpDate);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Overdue
  if (followUp < todayStart) {
    return "red";
  }

  // Today's followup
  if (followUp >= todayStart && followUp <= todayEnd) {
    return "yellow";
  }

  // Future followup
  return "green";
};

const getLeadStatus = (lead) => normalizeLeadStatus(lead.leadStatus);

const decorateLead = (lead) => {
  const plainLead =
    typeof lead.toObject === "function"
      ? lead.toObject({ flattenMaps: true })
      : lead;
  const lastActivityAt =
    plainLead.lastActivityAt || plainLead.assignedAt || plainLead.createdAt;
  const lastFollowUpActivity = [...(plainLead.activityLog || [])]
    .reverse()
    .find((item) => item.type === "follow-up");

  return {
    ...plainLead,
    leadStatus: normalizeLeadStatus(plainLead.leadStatus),
    aging: {
      leadAgeDays: daysSince(plainLead.createdAt) || 0,
      lastContactDays: daysSince(lastActivityAt) || 0,
      noFollowUpDays: lastFollowUpActivity
        ? daysSince(lastFollowUpActivity.createdAt) || 0
        : daysSince(plainLead.assignedAt || plainLead.createdAt) || 0,
      tone: getAgingTone(plainLead),
    },
  };
};

const buildWorkDesk = (leads) => {
  const todayStart = startOfToday().getTime();
  const todayEnd = endOfToday().getTime();
  const openLeads = leads.filter(
    (lead) => !["interested", "not-interested"].includes(getLeadStatus(lead)),
  );
  const followUps = openLeads.filter((lead) => lead.followUpDate);
  const dueToday = followUps.filter((lead) => {
    const time = new Date(lead.followUpDate).getTime();
    return time >= todayStart && time <= todayEnd;
  });
  const overdue = followUps.filter(
    (lead) => new Date(lead.followUpDate).getTime() < todayStart,
  );
  const newLeads = openLeads.filter((lead) => getLeadStatus(lead) === "new");
  const siteVisits = openLeads.filter(
    (lead) =>
      (lead.products || []).some((product) =>
        product.toLowerCase().includes("site visit"),
      ) || (lead.message || "").toLowerCase().includes("site visit"),
  );
  const quotationPending = openLeads.filter(
    (lead) =>
      ["interested", "contacted"].includes(getLeadStatus(lead)) &&
      !(lead.activityLog || []).some((item) => item.type === "quotation"),
  );

  const interestedLeads = leads.filter(
    (lead) => getLeadStatus(lead) === "interested",
  );

  const notInterestedLeads = leads.filter(
    (lead) => getLeadStatus(lead) === "not-interested",
  );

  const priorityLeads = [
    ...overdue,
    ...dueToday,
    ...newLeads,
    ...quotationPending,
    ...siteVisits,
  ]
    .filter(
      (lead, index, collection) =>
        collection.findIndex(
          (item) => String(item._id) === String(lead._id),
        ) === index,
    )
    .sort((a, b) => {
      const toneRank = { red: 0, yellow: 1, green: 2 };
      const aTone = getAgingTone(a);
      const bTone = getAgingTone(b);
      if (toneRank[aTone] !== toneRank[bTone])
        return toneRank[aTone] - toneRank[bTone];
      return (
        new Date(a.followUpDate || a.createdAt).getTime() -
        new Date(b.followUpDate || b.createdAt).getTime()
      );
    })
    .slice(0, 12)
    .map(decorateLead);

  return {
    summary: {
      followUpsDue: dueToday.length,
      overdue: overdue.length,
      newLeads: newLeads.length,
      siteVisits: siteVisits.length,
      quotationPending: quotationPending.length,
      openLeads: openLeads.length,
      interestedLeads: interestedLeads.length,
      notInterestedLeads: notInterestedLeads.length,
    },
    priorityLeads,
  };
};

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, phone, department, role, monthlyTarget } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      role,
      monthlyTarget,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, { password: 0 }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Get Employees Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Single Employee
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Employee
exports.updateEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      active,
      password,
      phone,
      department,
      role,
      monthlyTarget,
    } = req.body;

    const existingEmployee = await Employee.findOne({
      email,
      _id: { $ne: req.params.id },
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const updateData = {
      name,
      email,
      active,
      phone,
      department,
      role,
      monthlyTarget,
    };

    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      },
    ).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Active must be boolean",
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      id,
      { active },
      { new: true },
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Update Employee Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!employee.active) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: employee._id,
        email: employee.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      token,
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        role: employee.role,
        monthlyTarget: employee.monthlyTarget,
      },
    });
  } catch (error) {
    console.error("Employee Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAssignedLead = async (leadId, employeeId) => {
  return Lead.findOne({
    _id: leadId,
    assignedTo: employeeId,
  });
};

exports.getMyLeads = async (req, res) => {
  try {
    const leads = await Lead.find({
      assignedTo: req.employee.id,
    })
      .populate("assignedTo", "name email")
      .populate("notes.createdBy", "name email")
      .populate("activityLog.employee", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      leads: leads.map(decorateLead),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const leadStatus = normalizeLeadStatus(req.body.leadStatus);

    if (!LEAD_STATUSES.includes(leadStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead status",
      });
    }

    const lead = await getAssignedLead(req.params.id, req.employee.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or not assigned to you",
      });
    }

    const previousStatus = lead.leadStatus || "new";

    lead.leadStatus = leadStatus;

    // Clear follow-up when lead moves out of follow-up stage
    if (leadStatus !== "follow-up") {
      lead.followUpDate = null;
      lead.followUpRemark = "";
    }

    lead.lastActivityAt = new Date();

    lead.activityLog.push({
      type: "status",
      employee: req.employee.id,
      message: `Status changed: ${previousStatus} -> ${leadStatus}`,
    });

    await lead.save();

    res.status(200).json({
      success: true,
      lead: decorateLead(lead),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.addLeadNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note text is required",
      });
    }

    const lead = await getAssignedLead(req.params.id, req.employee.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or not assigned to you",
      });
    }

    lead.notes.push({
      text: text.trim(),
      createdBy: req.employee.id,
    });
    lead.lastActivityAt = new Date();
    lead.activityLog.push({
      type: "note",
      employee: req.employee.id,
      message: text.trim(),
    });

    await lead.save();

    await lead.populate("notes.createdBy", "name email");

    res.status(200).json({
      success: true,
      lead: decorateLead(lead),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.recordLeadAction = async (req, res) => {
  try {
    const { actionType, note, followUpDate, followUpRemark, leadStatus } =
      req.body;
    const allowedActions = [
      "call",
      "whatsapp",
      "email",
      "note",
      "follow-up",
      "site-visit",
      "quotation",
    ];

    if (!allowedActions.includes(actionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action type",
      });
    }

    const lead = await getAssignedLead(req.params.id, req.employee.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or not assigned to you",
      });
    }

    const cleanNote = note && note.trim();
    const previousStatus = lead.leadStatus || "new";
    let message = cleanNote || "";

    if (actionType === "note") {
      if (!cleanNote) {
        return res.status(400).json({
          success: false,
          message: "Note text is required",
        });
      }

      lead.notes.push({
        text: cleanNote,
        createdBy: req.employee.id,
      });
      message = cleanNote;
    }

    if (actionType === "follow-up") {
      if (!followUpDate) {
        return res.status(400).json({
          success: false,
          message: "Follow-up date is required",
        });
      }

      lead.followUpDate = followUpDate;
      lead.followUpRemark = followUpRemark || cleanNote || "";
      lead.leadStatus = "follow-up";
      message = `Follow-up scheduled: ${new Date(followUpDate).toLocaleString("en-IN")}`;
      if (lead.followUpRemark) message += ` - ${lead.followUpRemark}`;
    }

    if (["call", "whatsapp", "email"].includes(actionType)) {
      if (previousStatus === "new") {
        lead.leadStatus = "contacted";
      }
      const label = {
        call: "Call completed",
        whatsapp: "WhatsApp message sent",
        email: "Email sent",
      }[actionType];
      message = cleanNote ? `${label}: ${cleanNote}` : label;
    }

    if (actionType === "site-visit") {
      message = cleanNote || "Site visit coordination updated";
    }

    if (actionType === "quotation") {
      if (!["interested", "not-interested"].includes(getLeadStatus(lead))) {
        lead.leadStatus = leadStatus
          ? normalizeLeadStatus(leadStatus)
          : "interested";
      }
      message = cleanNote || "Quotation pending / sent update recorded";
    }

    lead.lastActivityAt = new Date();
    lead.activityLog.push({
      type: actionType,
      employee: req.employee.id,
      message,
    });

    if (previousStatus !== lead.leadStatus) {
      lead.activityLog.push({
        type: "status",
        employee: req.employee.id,
        message: `Status changed: ${previousStatus} -> ${lead.leadStatus}`,
      });
    }

    await lead.save();
    await lead.populate("assignedTo", "name email");
    await lead.populate("notes.createdBy", "name email");
    await lead.populate("activityLog.employee", "name email");

    res.status(200).json({
      success: true,
      lead: decorateLead(lead),
    });
  } catch (error) {
    console.error("Record Lead Action Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      assignedTo: req.employee.id,
    })
      .populate("assignedTo", "name email")
      .populate("notes.createdBy", "name email")
      .populate("activityLog.employee", "name email");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or not assigned to you",
      });
    }

    res.status(200).json({
      success: true,
      lead: decorateLead(lead),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.updateFollowUp = async (req, res) => {
  try {
    const { followUpDate, followUpRemark } = req.body;

    if (!followUpDate) {
      return res.status(400).json({
        success: false,
        message: "Follow-up date is required",
      });
    }

    const lead = await getAssignedLead(req.params.id, req.employee.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or not assigned to you",
      });
    }

    lead.followUpDate = followUpDate;
    lead.followUpRemark = followUpRemark || "";
    lead.leadStatus = "follow-up";
    lead.lastActivityAt = new Date();
    lead.activityLog.push({
      type: "follow-up",
      employee: req.employee.id,
      message: followUpRemark || "Follow-up scheduled",
    });

    await lead.save();

    res.json({
      success: true,
      lead: decorateLead(lead),
    });
  } catch (error) {
    console.error("Update Follow Up Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getMyWorkDesk = async (req, res) => {
  try {
    const leads = await Lead.find({
      assignedTo: req.employee.id,
    })
      .populate("assignedTo", "name email")
      .populate("notes.createdBy", "name email")
      .populate("activityLog.employee", "name email")
      .sort({ lastActivityAt: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      ...buildWorkDesk(leads),
      recentActivity: leads
        .flatMap((lead) =>
          (lead.activityLog || []).map((activity) => ({
            ...activity.toObject(),
            lead: {
              _id: lead._id,
              name: lead.name,
              companyName: lead.companyName,
            },
          })),
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 12),
    });
  } catch (error) {
    console.error("Get My Work Desk Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select(
      "-password",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const leads = await Lead.find({ assignedTo: req.employee.id });
    const interested = leads.filter(
      (lead) => getLeadStatus(lead) === "interested",
    ).length;

    res.status(200).json({
      success: true,
      employee,
      stats: {
        assigned: leads.length,
        contacted: leads.filter((lead) => getLeadStatus(lead) === "contacted")
          .length,
        followUps: leads.filter((lead) => getLeadStatus(lead) === "follow-up")
          .length,
        interested,
        notInterested: leads.filter(
          (lead) => getLeadStatus(lead) === "not-interested",
        ).length,
        conversion: leads.length
          ? Number(((interested / leads.length) * 100).toFixed(1))
          : 0,
      },
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
