const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getAllLeads,
  markLead,
  deleteLead,
} = require("../controllers/lead.controller");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/", getAllLeads);
router.patch("/:id/mark", markLead);
router.delete("/:id", deleteLead);

module.exports = router;
