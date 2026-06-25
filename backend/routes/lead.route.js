const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getAllLeads,
  getAllLeadActivity,
  importLeads,
  deleteLead,
  assignLead,
} = require("../controllers/lead.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const allowedExtensions = /\.(csv|xls|xlsx)$/i;

    if (
      allowedTypes.includes(file.mimetype) ||
      allowedExtensions.test(file.originalname)
    ) {
      cb(null, true);
      return;
    }

    cb(new Error("Only CSV, XLS and XLSX files are allowed"));
  },
});

const uploadLeadFile = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "File size must be 5MB or less"
          : error.message,
    });
  });
};

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/import", uploadLeadFile, importLeads);
router.get("/activity", getAllLeadActivity);
router.get("/", getAllLeads);
router.delete("/:id", deleteLead);
router.put("/assign", assignLead);

module.exports = router;
