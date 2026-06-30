const mongoose = require("mongoose");

const galleryImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true },
);

const galleryAlbumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    images: {
      type: [galleryImageSchema],
      default: [],
      validate: {
        validator(images) {
          return images.length > 0;
        },
        message: "At least one gallery image is required",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("GalleryAlbum", galleryAlbumSchema);
