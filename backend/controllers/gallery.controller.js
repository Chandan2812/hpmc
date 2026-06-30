const GalleryAlbum = require("../models/gallery.model");
const cloudinary = require("../config/cloudinary");

const toSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);

const uniqueSlug = async (title, currentId) => {
  const baseSlug = toSlug(title) || `gallery-${Date.now()}`;
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await GalleryAlbum.findOne({ slug });
    if (!existing || String(existing._id) === String(currentId)) return slug;
    slug = `${baseSlug}-${count}`;
    count += 1;
  }
};

const mapUploadedImages = (files, captions = []) =>
  (files || []).map((file, index) => ({
    url: file.secure_url || file.path,
    publicId: file.public_id || file.filename || "",
    caption: captions[index] || "",
  }));

const parseCaptions = (captions) => {
  if (!captions) return [];
  if (Array.isArray(captions)) return captions;

  try {
    const parsed = JSON.parse(captions);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return String(captions)
      .split(",")
      .map((caption) => caption.trim());
  }
};

exports.createGalleryAlbum = async (req, res) => {
  try {
    const { title, location, year, description } = req.body;

    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Exhibition title is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    const album = await GalleryAlbum.create({
      title: title.trim(),
      slug: await uniqueSlug(title),
      location,
      year,
      description,
      images: mapUploadedImages(req.files, parseCaptions(req.body.captions)),
    });

    return res.status(201).json({
      message: "Gallery album created successfully",
      data: album,
    });
  } catch (error) {
    console.error("CREATE GALLERY ERROR:", error);
    return res.status(500).json({
      message: error.message || "Failed to create gallery album",
    });
  }
};

exports.getGalleryAlbums = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const albums = await GalleryAlbum.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(albums);
  } catch (error) {
    console.error("GET GALLERY ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch gallery albums" });
  }
};

exports.updateGalleryAlbum = async (req, res) => {
  try {
    const album = await GalleryAlbum.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ message: "Gallery album not found" });
    }

    const { title, location, year, description, isActive } = req.body;

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({ message: "Exhibition title is required" });
      }

      album.title = title.trim();
      album.slug = await uniqueSlug(title, album._id);
    }

    if (location !== undefined) album.location = location;
    if (year !== undefined) album.year = year;
    if (description !== undefined) album.description = description;
    if (isActive !== undefined) album.isActive = isActive === true || isActive === "true";

    if (req.files && req.files.length > 0) {
      album.images.push(...mapUploadedImages(req.files, parseCaptions(req.body.captions)));
    }

    await album.save();

    return res.status(200).json({
      message: "Gallery album updated successfully",
      data: album,
    });
  } catch (error) {
    console.error("UPDATE GALLERY ERROR:", error);
    return res.status(500).json({
      message: error.message || "Failed to update gallery album",
    });
  }
};

exports.deleteGalleryAlbum = async (req, res) => {
  try {
    const album = await GalleryAlbum.findByIdAndDelete(req.params.id);

    if (!album) {
      return res.status(404).json({ message: "Gallery album not found" });
    }

    await Promise.allSettled(
      album.images
        .filter((image) => image.publicId)
        .map((image) => cloudinary.uploader.destroy(image.publicId)),
    );

    return res.status(200).json({ message: "Gallery album deleted successfully" });
  } catch (error) {
    console.error("DELETE GALLERY ERROR:", error);
    return res.status(500).json({ message: "Failed to delete gallery album" });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const album = await GalleryAlbum.findById(req.params.albumId);

    if (!album) {
      return res.status(404).json({ message: "Gallery album not found" });
    }

    const image = album.images.id(req.params.imageId);

    if (!image) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    if (album.images.length === 1) {
      return res.status(400).json({
        message: "Album must have at least one image. Delete the album instead.",
      });
    }

    const publicId = image.publicId;
    image.deleteOne();
    await album.save();

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    return res.status(200).json({
      message: "Gallery image deleted successfully",
      data: album,
    });
  } catch (error) {
    console.error("DELETE GALLERY IMAGE ERROR:", error);
    return res.status(500).json({ message: "Failed to delete gallery image" });
  }
};
