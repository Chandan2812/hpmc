const express = require("express");
const router = express.Router();
const employeeAuth = require("../middlewares/employeeAuth");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  employeeLogin,
  getMyLeads,
  getMyWorkDesk,
  updateLeadStatus,
  addLeadNote,
  recordLeadAction,
  getLeadById,
  updateFollowUp,
  getMyProfile,
} = require("../controllers/employee.controller");

router.post("/login", employeeLogin);

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get("/my-leads", employeeAuth, getMyLeads);

router.get("/me/work-desk", employeeAuth, getMyWorkDesk);

router.get("/me/profile", employeeAuth, getMyProfile);

router.get("/:id", getEmployeeById);

router.put("/:id", updateEmployee);

router.patch("/:id/status", updateEmployeeStatus);

router.delete("/:id", deleteEmployee);

router.patch("/:id/lead-status", employeeAuth, updateLeadStatus);

router.post("/:id/note", employeeAuth, addLeadNote);

router.post("/:id/action", employeeAuth, recordLeadAction);

router.patch("/:id/follow-up", employeeAuth, updateFollowUp);

router.get("/:id/details", employeeAuth, getLeadById);

module.exports = router;
