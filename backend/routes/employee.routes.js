const express = require("express");
const router = express.Router();

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
  employeeLogin,
} = require("../controllers/employee.controller");

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

router.put("/:id", updateEmployee);

router.patch("/:id/status", updateEmployeeStatus);

router.delete("/:id", deleteEmployee);

router.post("/login", employeeLogin);

module.exports = router;
