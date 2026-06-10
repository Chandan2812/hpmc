"use client";

import dynamic from "next/dynamic";
import {
  FileQuestion,
  ImageIcon,
  Link2,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags?: string | string[];
  coverImage?: string;
  coverImageAlt?: string;
  faqs?: { question: string; answer: string }[];
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  existingBlog?: BlogPost | null;
}

function getInitialFormData(existingBlog: BlogPost | null) {
  return {
    title: existingBlog?.title || "",
    slug: existingBlog?.slug || "",
    excerpt: existingBlog?.excerpt || "",
    content: existingBlog?.content || "",
    author: existingBlog?.author || "",
    tags: Array.isArray(existingBlog?.tags)
      ? existingBlog.tags.join(", ")
      : existingBlog?.tags || "",
    coverImageAlt: existingBlog?.coverImageAlt || "",
    coverImage: null as File | null,
  };
}

function getInitialFaqs(existingBlog: BlogPost | null) {
  return existingBlog?.faqs?.length
    ? existingBlog.faqs
    : [{ question: "", answer: "" }];
}

const AddBlog = ({ onClose, onSuccess, existingBlog = null }: Props) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(existingBlog),
  );
  const [faqs, setFaqs] = useState(() => getInitialFaqs(existingBlog));
  const [preview, setPreview] = useState<string | null>(
    existingBlog?.coverImage || null,
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    if (name === "title" && !existingBlog) {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, "-"),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setFaqs((prev) =>
      prev.map((faq, faqIndex) =>
        faqIndex === index ? { ...faq, [field]: value } : faq,
      ),
    );
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, coverImage: file }));
    setPreview((currentPreview) => {
      if (currentPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
      return URL.createObjectURL(file);
    });
  };

  const sanitizeHtml = (html: string) =>
    html.replace(/&nbsp;/g, " ").replace(/<wbr\s*\/?>/gi, "").trim();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      const blogData = new FormData();
      Object.entries({
        ...formData,
        content: sanitizeHtml(formData.content),
      }).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          blogData.append(key, value as string | Blob);
        }
      });
      blogData.append("faqs", JSON.stringify(faqs));

      const res = await fetch(
        existingBlog
          ? `${process.env.NEXT_PUBLIC_API_BASE}/blog/${existingBlog.slug}`
          : `${process.env.NEXT_PUBLIC_API_BASE}/blog/add`,
        {
          method: existingBlog ? "PUT" : "POST",
          body: blogData,
        },
      );

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || result.error || "Failed to save blog");
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote"],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "blockquote",
    "link",
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--card)] shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:rounded-[32px]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-5 md:px-8">
          <div className="min-w-0 pr-3">
            <p className="mb-2 text-[10px] uppercase tracking-[3px] text-[var(--primary)] sm:text-xs sm:tracking-[4px]">
              Publishing Studio
            </p>
            <h2
              id="blog-modal-title"
              className="truncate font-serif text-2xl text-[var(--text-primary)] md:text-3xl"
            >
              {existingBlog ? "Edit Blog" : "Create Blog"}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Shape the article, cover media, SEO details, and FAQs in one flow.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] md:h-11 md:w-11"
            aria-label="Close blog editor"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <Panel
                  eyebrow="Article"
                  title="Story Details"
                  icon={<Sparkles size={18} />}
                >
                  <div className="grid gap-4">
                    <InputField
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Blog title"
                      required
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField
                        label="Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="blog-url-slug"
                        required
                        icon={<Link2 size={15} />}
                      />
                      <InputField
                        label="Author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Author name"
                        required
                        icon={<UserRound size={15} />}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                        Meta Description
                      </label>
                      <textarea
                        rows={4}
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Short summary for blog cards and SEO..."
                        required
                        className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>
                </Panel>

                <Panel
                  eyebrow="Editor"
                  title="Blog Content"
                  icon={<FileQuestion size={18} />}
                >
                  <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]">
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, content: value }))
                      }
                      modules={quillModules}
                      formats={quillFormats}
                      className="newsletter-editor blog-editor"
                    />
                  </div>
                </Panel>
              </div>

              <div className="space-y-6">
                <Panel
                  eyebrow="Media"
                  title="Cover Image"
                  icon={<ImageIcon size={18} />}
                >
                  <label
                    htmlFor="cover-image"
                    className="group flex min-h-64 cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background-secondary)] transition hover:border-[var(--primary)]"
                  >
                    {preview ? (
                      <div className="relative h-64 w-full">
                        <img
                          src={preview}
                          alt={formData.coverImageAlt || formData.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-black/65 px-4 py-3 text-white backdrop-blur">
                          <p className="text-sm font-medium">
                            Click to replace cover image
                          </p>
                          <p className="mt-1 text-xs text-white/75">
                            Use a wide, sharp image for the best blog card.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                          <UploadCloud size={26} />
                        </div>
                        <p className="font-medium text-[var(--text-primary)]">
                          Upload cover image
                        </p>
                        <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--text-secondary)]">
                          Choose a polished image that represents the article.
                        </p>
                      </div>
                    )}
                    <input
                      id="cover-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!existingBlog}
                      className="hidden"
                    />
                  </label>

                  <div className="mt-4">
                    <InputField
                      label="Image Alt Text"
                      name="coverImageAlt"
                      value={formData.coverImageAlt}
                      onChange={handleChange}
                      placeholder="Describe the cover image"
                    />
                  </div>
                </Panel>

                <Panel eyebrow="SEO" title="Tags" icon={<Sparkles size={18} />}>
                  <InputField
                    label="Tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="extrusion, machinery, maintenance"
                  />
                </Panel>

                <Panel
                  eyebrow="Schema"
                  title="FAQs"
                  icon={<FileQuestion size={18} />}
                  action={
                    <button
                      type="button"
                      onClick={() =>
                        setFaqs((prev) => [
                          ...prev,
                          { question: "", answer: "" },
                        ])
                      }
                      className="flex h-9 items-center gap-2 rounded-xl border border-[var(--border)] px-3 text-sm font-medium text-[var(--primary)] transition hover:bg-[var(--background-secondary)]"
                    >
                      <Plus size={15} />
                      Add
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                            FAQ {index + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setFaqs((prev) => {
                                const next = prev.filter(
                                  (_, faqIndex) => faqIndex !== index,
                                );
                                return next.length
                                  ? next
                                  : [{ question: "", answer: "" }];
                              })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10"
                            aria-label={`Remove FAQ ${index + 1}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="Question"
                          value={faq.question}
                          onChange={(event) =>
                            handleFaqChange(
                              index,
                              "question",
                              event.target.value,
                            )
                          }
                          className="mb-3 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
                        />

                        <textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(event) =>
                            handleFaqChange(index, "answer", event.target.value)
                          }
                          className="min-h-24 w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] bg-[var(--card)] px-5 py-4 md:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl border border-[var(--border)] px-6 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting && <Loader2 size={17} className="animate-spin" />}
                {submitting
                  ? existingBlog
                    ? "Updating..."
                    : "Publishing..."
                  : existingBlog
                    ? "Update Blog"
                    : "Publish Blog"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

function Panel({
  eyebrow,
  title,
  icon,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
            {icon}
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[var(--primary)]">
              {eyebrow}
            </p>
            <h3 className="font-serif text-xl text-[var(--text-primary)]">
              {title}
            </h3>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function InputField({
  label,
  icon,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] ${
            icon ? "pl-10" : "pl-4"
          } pr-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]`}
        />
      </div>
    </div>
  );
}

export default AddBlog;
