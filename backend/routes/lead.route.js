const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getAllLeads,
  getAllLeadActivity,
  markLead,
  deleteLead,
  assignLead,
} = require("../controllers/lead.controller");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/activity", getAllLeadActivity);
router.get("/", getAllLeads);
router.patch("/:id/mark", markLead);
router.delete("/:id", deleteLead);
router.put("/assign", assignLead);

module.exports = router;
