const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

// CREATE (single or multiple)
router.post("/", upload.array("images", 20), clientController.createClient);

// GET ALL
router.get("/", clientController.getAllClients);

// UPDATE
router.put("/:id", clientController.updateClient);

// DELETE
router.delete("/:id", clientController.deleteClient);

module.exports = router;
