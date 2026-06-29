const express = require("express");
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });
const {
  createAndSendNewsletter,
  generateNewsletterWithAI,
  getAllNewsletters,
  getNewsletterById,
  deleteNewsletter,
} = require("../controllers/newsletter.controller");

const router = express.Router();

router.post("/ai/generate", generateNewsletterWithAI);
router.post("/", upload.array("attachments", 5), createAndSendNewsletter);
router.get("/", getAllNewsletters);
router.get("/:id", getNewsletterById);
router.delete("/:id", deleteNewsletter);

module.exports = router;
