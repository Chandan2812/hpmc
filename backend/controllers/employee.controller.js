const Employee = require("../models/employee.model");
const Lead = require("../models/lead.model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { EmailCampaignsApi } = require("sib-api-v3-sdk");

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
      employees,
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
    const { name, email, active, password, phone, department, role, monthlyTarget } =
      req.body;

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
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      leads,
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
    const { leadStatus } = req.body;
    const allowedStatus = [
      "new",
      "contacted",
      "follow-up",
      "qualified",
      "won",
      "lost",
    ];

    if (!allowedStatus.includes(leadStatus)) {
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

    lead.leadStatus = leadStatus;
    lead.lastActivityAt = new Date();
    lead.activityLog.push({
      type: "status",
      employee: req.employee.id,
      message: `Status changed to ${leadStatus}`,
    });

    await lead.save();

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
      lead,
    });
  } catch (error) {
    console.error("Update Follow Up Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const leads = await Lead.find({ assignedTo: req.employee.id });
    const won = leads.filter((lead) => lead.leadStatus === "won").length;

    res.status(200).json({
      success: true,
      employee,
      stats: {
        assigned: leads.length,
        contacted: leads.filter((lead) => lead.leadStatus === "contacted").length,
        followUps: leads.filter((lead) => lead.leadStatus === "follow-up").length,
        won,
        lost: leads.filter((lead) => lead.leadStatus === "lost").length,
        conversion: leads.length ? Number(((won / leads.length) * 100).toFixed(1)) : 0,
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
