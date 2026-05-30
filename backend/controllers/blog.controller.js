const BlogPost = require("../models/blog.model");

/**
 * CREATE BLOG
 */
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      author,
      tags,
      coverImageAlt,
      faqs, // ✅ NEW
    } = req.body;

    // 🔒 Basic validation
    if (!title || !slug || !excerpt || !content || !author) {
      return res.status(400).json({
        error: "All required fields must be provided",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Cover image is required",
      });
    }

    // 🔒 Safe image extraction
    let coverImage;
    if (req.file.secure_url) {
      coverImage = req.file.secure_url;
    } else if (req.file.path) {
      coverImage = req.file.path;
    } else {
      return res.status(400).json({
        error: "Image upload failed (no path or URL)",
      });
    }

    const imageAltText =
      coverImageAlt?.trim()?.length > 0 ? coverImageAlt.trim() : title;

    // ✅ Handle FAQs safely
    let parsedFaqs = [];
    if (faqs) {
      try {
        parsedFaqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;

        // Optional validation
        parsedFaqs = parsedFaqs.filter((f) => f.question && f.answer);
      } catch (err) {
        return res.status(400).json({
          error: "Invalid FAQ format",
        });
      }
    }

    const blogPost = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      author,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      coverImage,
      coverImageAlt: imageAltText,
      faqs: parsedFaqs, // ✅ SAVE FAQs
    });

    await blogPost.save();

    return res.status(201).json({
      message: "Blog post created successfully",
      blogPost,
    });
  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

/**
 * GET ALL BLOGS
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find().sort({ datePublished: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * UPDATE BLOG
 */
exports.updateBlog = async (req, res) => {
  const { slug } = req.params;
  const {
    title,
    content,
    author,
    excerpt,
    tags,
    coverImageAlt,
    faqs, // ✅ NEW
  } = req.body;

  try {
    const updateFields = {
      ...(title && { title }),
      ...(content && { content }),
      ...(author && { author }),
      ...(excerpt && { excerpt }),
      ...(tags && { tags: tags.split(",").map((tag) => tag.trim()) }),
      ...(coverImageAlt && { coverImageAlt: coverImageAlt.trim() }),
      lastUpdated: new Date(),
    };

    // ✅ Handle FAQs
    if (faqs !== undefined) {
      try {
        let parsedFaqs = typeof faqs === "string" ? JSON.parse(faqs) : faqs;

        parsedFaqs = parsedFaqs.filter((f) => f.question && f.answer);

        updateFields.faqs = parsedFaqs;
      } catch (err) {
        return res.status(400).json({
          error: "Invalid FAQ format",
        });
      }
    }

    // ✅ Handle image update
    if (req.file && (req.file.secure_url || req.file.path)) {
      updateFields.coverImage = req.file.secure_url || req.file.path;
    }

    const updatedBlog = await BlogPost.findOneAndUpdate(
      { slug },
      updateFields,
      { new: true, runValidators: true },
    );

    if (!updatedBlog) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({
      msg: "Blog post updated successfully",
      blogPost: updatedBlog,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * DELETE BLOG
 */
exports.deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await BlogPost.findOneAndDelete({
      slug: req.params.slug,
    });

    if (!deletedBlog) {
      return res.status(404).json({ msg: "Blog post not found" });
    }

    res.status(200).json({ msg: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

/**
 * UPDATE COVER IMAGE ONLY
 */
exports.updateCoverImage = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imageUrl = req.file.secure_url || req.file.path;

    const updatedBlog = await BlogPost.findOneAndUpdate(
      { slug },
      {
        coverImage: imageUrl,
        lastUpdated: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Cover image updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating cover image:", error);
    res.status(500).json({ message: "Error updating cover image", error });
  }
};

/**
 * RELATED BLOGS
 */
exports.getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;

    const currentBlog = await BlogPost.findOne({ slug });

    if (!currentBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const tags = currentBlog.tags || [];
    let relatedBlogs = [];

    if (tags.length > 0) {
      relatedBlogs = await BlogPost.find({
        slug: { $ne: slug },
        tags: { $in: tags },
      })
        .sort({ datePublished: -1 })
        .limit(4);
    }

    if (relatedBlogs.length === 0) {
      relatedBlogs = await BlogPost.find({
        slug: { $ne: slug },
      })
        .sort({ datePublished: -1 })
        .limit(4);
    }

    res.status(200).json(relatedBlogs);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    res.status(500).json({ msg: "Server Error" });
  }
};
