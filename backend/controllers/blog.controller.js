const BlogPost = require("../models/blog.model");
const cloudinary = require("../config/cloudinary");

const OPENAI_API_URL = "https://api.openai.com/v1";

const stripCodeFence = (value) =>
  String(value || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

const toSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);

const uploadGeneratedImage = async (imageData, title) => {
  if (!imageData) return "";

  const uploadSource = imageData.startsWith("http")
    ? imageData
    : `data:image/png;base64,${imageData}`;

  const result = await cloudinary.uploader.upload(uploadSource, {
    folder: "hpmc/blog-ai",
    resource_type: "image",
    public_id: `${toSlug(title || "ai-blog")}-${Date.now()}`,
  });

  return result.secure_url || result.url || "";
};

const callOpenAI = async (path, payload) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(`${OPENAI_API_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || data.message || "OpenAI request failed",
    );
  }

  return data;
};

const generateBlogText = async ({ topic, keywords, tone, audience, length }) => {
  const model = process.env.OPENAI_TEXT_MODEL || "gpt-4o-mini";

  const data = await callOpenAI("/chat/completions", {
    model,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You create SEO-friendly industrial machinery blog drafts for HPMC. Return only valid JSON.",
      },
      {
        role: "user",
        content: `
Create a complete blog draft.

Topic: ${topic}
Keywords: ${keywords || "industrial machinery, extrusion, HPMC"}
Tone: ${tone || "professional and helpful"}
Audience: ${audience || "factory owners, purchase teams, plant managers"}
Length: ${length || "medium"}

Return JSON with this exact shape:
{
  "title": "string",
  "slug": "kebab-case-string",
  "excerpt": "140-180 character SEO summary",
  "content": "HTML blog body using h2, h3, p, ul, li tags. No markdown.",
  "author": "HPMC Team",
  "tags": ["tag1", "tag2", "tag3"],
  "coverImageAlt": "descriptive alt text",
  "imagePrompt": "photorealistic blog cover image prompt, no text in image",
  "faqs": [
    { "question": "string", "answer": "string" }
  ]
}
Include 4-6 FAQs. Keep claims practical and avoid fake statistics.
        `.trim(),
      },
    ],
  });

  const content = data.choices?.[0]?.message?.content;
  const parsed = JSON.parse(stripCodeFence(content));

  return {
    title: parsed.title || topic,
    slug: toSlug(parsed.slug || parsed.title || topic),
    excerpt: parsed.excerpt || "",
    content: parsed.content || "",
    author: parsed.author || "HPMC Team",
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    coverImageAlt: parsed.coverImageAlt || parsed.title || topic,
    imagePrompt:
      parsed.imagePrompt ||
      `Photorealistic industrial machinery blog cover for ${topic}, modern factory, no text`,
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
  };
};

const generateBlogImage = async (prompt, title) => {
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
  const payload = {
    model,
    prompt,
    size: process.env.OPENAI_IMAGE_SIZE || "1024x1024",
  };

  if (model.toLowerCase().startsWith("dall-e")) {
    payload.response_format = "b64_json";
  } else {
    payload.quality = process.env.OPENAI_IMAGE_QUALITY || "medium";
  }

  const data = await callOpenAI("/images/generations", payload);
  const image = data.data?.[0];
  const imageSource = image?.b64_json || image?.url;

  if (!imageSource) {
    throw new Error("OpenAI did not return an image");
  }

  return uploadGeneratedImage(imageSource, title);
};

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

    const coverImageUrl = req.body.coverImageUrl || req.body.coverImage;

    if (!req.file && !coverImageUrl) {
      return res.status(400).json({
        error: "Cover image is required",
      });
    }

    // 🔒 Safe image extraction
    let coverImage;
    if (coverImageUrl) {
      coverImage = coverImageUrl;
    } else if (req.file.secure_url) {
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
 * GENERATE BLOG DRAFT WITH AI
 */
exports.generateBlogWithAI = async (req, res) => {
  try {
    const { topic, keywords, tone, audience, length, generateImage = true } =
      req.body;

    if (!topic || !String(topic).trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const draft = await generateBlogText({
      topic: String(topic).trim(),
      keywords,
      tone,
      audience,
      length,
    });

    let coverImage = "";

    if (generateImage !== false) {
      coverImage = await generateBlogImage(draft.imagePrompt, draft.title);
    }

    return res.status(200).json({
      success: true,
      blog: {
        ...draft,
        tags: draft.tags.join(", "),
        coverImage,
      },
    });
  } catch (error) {
    console.error("AI BLOG GENERATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate blog with AI",
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
