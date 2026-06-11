const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const { EmailCampaignsApi } = require("sib-api-v3-sdk");

// Create Employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
    const employees = await Employee.find(
      { active: true },
      {
        password: 0,
      },
    ).sort({ createdAt: -1 });

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
    const { name, email, active, password } = req.body;

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
