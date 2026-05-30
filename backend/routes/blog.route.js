const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = require("../config/storage");
const upload = multer({ storage });

const blogController = require("../controllers/blog.controller");

// Create blog
router.post("/add", upload.single("coverImage"), blogController.createBlog);

// View all blogs
router.get("/viewblog", blogController.getAllBlogs);

// Update blog by slug
router.put("/:slug", upload.single("coverImage"), blogController.updateBlog);

// Delete blog
router.delete("/:slug", blogController.deleteBlog);

// Update only cover image
router.patch(
  "/:slug/image",
  upload.single("coverImage"),
  blogController.updateCoverImage,
);

// Get related blogs
router.get("/related/:slug", blogController.getRelatedBlogs);

module.exports = router;
