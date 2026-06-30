const express = require("express");
const multer = require("multer");

const storage = require("../config/storage");
const galleryController = require("../controllers/gallery.controller");

const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.array("images", 20), galleryController.createGalleryAlbum);
router.get("/", galleryController.getGalleryAlbums);
router.put("/:id", upload.array("images", 20), galleryController.updateGalleryAlbum);
router.delete("/:id", galleryController.deleteGalleryAlbum);
router.delete(
  "/:albumId/images/:imageId",
  galleryController.deleteGalleryImage,
);

module.exports = router;
