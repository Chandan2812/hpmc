"use client";

import {
  AlertCircle,
  Check,
  FileText,
  ImageIcon,
  Mail,
  Paperclip,
  Send,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Props {
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

const editorModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

export default function CreateNewsletterModal({ onClose, onSuccess }: Props) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("manual");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiPrompt, setAiPrompt] = useState({
    topic: "",
    audience: "customers, prospects, industry partners",
    tone: "professional and helpful",
    keyPoints: "",
    callToAction: "Contact HPMC for more information",
  });

  const plainContent = useMemo(
    () =>
      content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, "")
        .trim(),
    [content],
  );

  const completion = useMemo(() => {
    const checks = [subject.trim(), plainContent];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [plainContent, subject]);

  const totalAttachmentSize = files.reduce((sum, file) => sum + file.size, 0);

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.topic.trim() || aiGenerating) return;

    try {
      setAiGenerating(true);
      setAiError("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/newsletter/ai/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(aiPrompt),
        },
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to generate newsletter");
      }

      setSubject(json.newsletter?.subject || "");
      setContent(json.newsletter?.content || "");
      setCreationMode("manual");
    } catch (err) {
      setAiError(
        err instanceof Error ? err.message : "Failed to generate newsletter",
      );
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!subject.trim()) {
        throw new Error("Newsletter subject is required");
      }

      if (!plainContent) {
        throw new Error("Newsletter content is required");
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("subject", subject.trim());
      formData.append("content", content);
      files.forEach((file) => formData.append("attachments", file));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/newsletter`,
        {
          method: "POST",
          body: formData,
        },
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to send newsletter");
      }

      await onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send newsletter",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const incoming = Array.from(fileList);
    setFiles((prev) => {
      const existing = new Set(prev.map((file) => `${file.name}-${file.size}`));
      const next = incoming.filter(
        (file) => !existing.has(`${file.name}-${file.size}`),
      );
      return [...prev, ...next];
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-md sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-newsletter-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--card)] shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:rounded-[32px]">
        <div className="border-b border-[var(--border)] bg-[var(--card)] px-5 py-5 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="mb-2 text-[10px] uppercase tracking-[3px] text-[var(--primary)] sm:text-xs sm:tracking-[4px]">
                Newsletter Campaign
              </p>
              <h2
                id="create-newsletter-title"
                className="truncate font-serif text-2xl text-[var(--text-primary)] md:text-3xl"
              >
                {subject || "Create Newsletter"}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Compose, attach files, and send to all subscribers.
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:opacity-50 md:h-11 md:w-11"
              aria-label="Close newsletter modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniStat
              icon={<Mail size={16} />}
              label="Subject"
              value={subject.trim() ? "Ready" : "Missing"}
            />
            <MiniStat
              icon={<Users size={16} />}
              label="Recipients"
              value="All subscribers"
            />
            <MiniStat
              icon={<Paperclip size={16} />}
              label="Attachments"
              value={`${files.length} files`}
            />
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
                Campaign Readiness
              </span>
              <span className="font-semibold text-[var(--primary)]">
                {completion}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--background-secondary)]">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[3px] text-[var(--primary)]">
                  Creation Mode
                </p>
                <h3 className="font-serif text-xl text-[var(--text-primary)]">
                  Manual or AI Assisted
                </h3>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2">
              <button
                type="button"
                onClick={() => setCreationMode("manual")}
                className={`h-11 rounded-xl font-medium transition ${
                  creationMode === "manual"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--text-primary)] hover:bg-[var(--background-secondary)]"
                }`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setCreationMode("ai")}
                className={`h-11 rounded-xl font-medium transition ${
                  creationMode === "ai"
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--text-primary)] hover:bg-[var(--background-secondary)]"
                }`}
              >
                Generate with AI
              </button>
            </div>

            {creationMode === "ai" && (
              <div className="grid gap-4">
                {aiError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
                    {aiError}
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                    Newsletter Topic
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt.topic}
                    onChange={(event) =>
                      setAiPrompt((prev) => ({
                        ...prev,
                        topic: event.target.value,
                      }))
                    }
                    placeholder="Example: Announce new extrusion machinery updates and service support"
                    className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <AiInput
                    label="Audience"
                    value={aiPrompt.audience}
                    onChange={(value) =>
                      setAiPrompt((prev) => ({ ...prev, audience: value }))
                    }
                    placeholder="Customers, prospects, partners"
                  />
                  <AiInput
                    label="Tone"
                    value={aiPrompt.tone}
                    onChange={(value) =>
                      setAiPrompt((prev) => ({ ...prev, tone: value }))
                    }
                    placeholder="Professional and helpful"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <AiInput
                    label="Key Points"
                    value={aiPrompt.keyPoints}
                    onChange={(value) =>
                      setAiPrompt((prev) => ({ ...prev, keyPoints: value }))
                    }
                    placeholder="New machines, support, maintenance tips"
                  />
                  <AiInput
                    label="Call To Action"
                    value={aiPrompt.callToAction}
                    onChange={(value) =>
                      setAiPrompt((prev) => ({
                        ...prev,
                        callToAction: value,
                      }))
                    }
                    placeholder="Contact HPMC for a consultation"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={aiGenerating || !aiPrompt.topic.trim()}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aiGenerating ? "Generating draft..." : "Generate Draft"}
                </button>
              </div>
            )}
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <section>
                <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Monthly updates, new launches, service news..."
                  className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
                />
              </section>

              <section>
                <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
                  Newsletter Content <span className="text-red-500">*</span>
                </label>
                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Write newsletter content here..."
                    className="newsletter-editor"
                    modules={editorModules}
                  />
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      Attachments
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      Add PDFs, images, or documents.
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--primary)]/10 px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                    {formatFileSize(totalAttachmentSize) || "0 KB"}
                  </span>
                </div>

                <label
                  htmlFor="newsletter-files"
                  className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--card)] p-5 text-center transition hover:border-[var(--primary)] hover:bg-[var(--background-secondary)]"
                >
                  <UploadCloud
                    size={28}
                    className="mb-3 text-[var(--primary)]"
                  />
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Upload files
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    Select multiple attachments
                  </p>
                  <input
                    id="newsletter-files"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => handleFiles(event.target.files)}
                  />
                </label>

                {files.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${file.size}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                          {file.type.includes("image") ? (
                            <ImageIcon size={16} />
                          ) : (
                            <FileText size={16} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                            {file.name}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10"
                          aria-label={`Remove ${file.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
                <p className="mb-3 font-semibold text-[var(--text-primary)]">
                  Send Checklist
                </p>
                <ChecklistItem
                  done={Boolean(subject.trim())}
                  label="Subject added"
                />
                <ChecklistItem
                  done={Boolean(plainContent)}
                  label="Content added"
                />
                <ChecklistItem done label="Audience selected" />
              </section>
            </aside>
          </div>
        </div>

        <div className="border-t border-[var(--border)] bg-[var(--card)] px-5 py-4 md:px-8">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--text-secondary)]">
              This will send immediately to all newsletter subscribers.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="h-11 flex-1 rounded-xl border border-[var(--border)] px-5 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:opacity-50 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 font-medium text-white transition hover:opacity-90 disabled:opacity-70 sm:flex-none"
              >
                <Send size={17} />
                {loading ? "Sending..." : "Send Newsletter"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </p>
        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-3 last:mb-0">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          done
            ? "bg-green-500/10 text-green-600"
            : "bg-[var(--card)] text-[var(--text-secondary)]"
        }`}
      >
        {done && <Check size={13} />}
      </span>
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
    </div>
  );
}

function AiInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
      />
    </div>
  );
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}
