const express = require("express");
const {
  subscribeEmail,
  getAllSubscribers,
  unsubscribeEmail,
  deleteSubscriber,
  unsubscribeByToken,
} = require("../controllers/subscriber.controller");

const router = express.Router();

// Public
router.post("/", subscribeEmail);

// Admin
router.get("/", getAllSubscribers);
router.patch("/:id/unsubscribe", unsubscribeEmail); // soft delete
router.delete("/:id", deleteSubscriber); // hard delete
router.get("/unsubscribe/:token", unsubscribeByToken);

module.exports = router;
