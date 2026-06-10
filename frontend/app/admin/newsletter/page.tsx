"use client";

import CreateNewsletterModal from "@/app/components/CreateNewsletter";
import {
  Download,
  Eye,
  FileText,
  Filter,
  ImageIcon,
  Mail,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface Attachment {
  name: string;
  url: string;
  type?: string;
  size?: number;
}

interface NewsletterListItem {
  _id: string;
  subject: string;
  totalRecipients: number;
  sentAt: string;
  createdAt: string;
}

interface NewsletterDetails extends NewsletterListItem {
  content: string;
  attachments: Attachment[];
}

const ITEMS_PER_PAGE = 10;

async function requestNewsletters(apiBase: string | undefined) {
  const res = await fetch(`${apiBase}/newsletter`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch newsletters");
  }

  return [...(json.data || [])].sort(
    (a: NewsletterListItem, b: NewsletterListItem) =>
      new Date(b.sentAt || b.createdAt).getTime() -
      new Date(a.sentAt || a.createdAt).getTime(),
  ) as NewsletterListItem[];
}

async function requestNewsletterDetails(
  apiBase: string | undefined,
  id: string,
) {
  const res = await fetch(`${apiBase}/newsletter/${id}`, { cache: "no-store" });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch newsletter details");
  }

  return json.data as NewsletterDetails;
}

export default function AdminNewsletter() {
  const [newsletters, setNewsletters] = useState<NewsletterListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNewsletter, setSelectedNewsletter] =
    useState<NewsletterDetails | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

  const refreshNewsletters = useCallback(async () => {
    setNewsletters(await requestNewsletters(API_BASE));
  }, [API_BASE]);

  useEffect(() => {
    let cancelled = false;

    requestNewsletters(API_BASE)
      .then((data) => {
        if (!cancelled) setNewsletters(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  const filteredNewsletters = useMemo(() => {
    if (!searchQuery.trim()) return newsletters;

    const query = searchQuery.trim().toLowerCase();
    return newsletters.filter(
      (newsletter) =>
        newsletter.subject.toLowerCase().includes(query) ||
        String(newsletter.totalRecipients).includes(query) ||
        new Date(newsletter.sentAt || newsletter.createdAt)
          .toLocaleString()
          .toLowerCase()
          .includes(query),
    );
  }, [newsletters, searchQuery]);

  const stats = {
    total: newsletters.length,
    recipients: newsletters.reduce(
      (sum, newsletter) => sum + (newsletter.totalRecipients || 0),
      0,
    ),
    latest: newsletters[0]
      ? new Date(
          newsletters[0].sentAt || newsletters[0].createdAt,
        ).toLocaleDateString()
      : "None",
  };

  const hasActiveFilters = Boolean(searchQuery);
  const totalPages = Math.ceil(filteredNewsletters.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const currentNewsletters = filteredNewsletters.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  );

  const resetFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleRetry = async () => {
    try {
      setLoading(true);
      setError("");
      setNewsletters(await requestNewsletters(API_BASE));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id: string) => {
    try {
      setViewLoading(true);
      setSelectedNewsletter(null);
      setSelectedNewsletter(await requestNewsletterDetails(API_BASE, id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load newsletter");
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this newsletter?")) return;

    try {
      const res = await fetch(`${API_BASE}/newsletter/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.message || "Delete failed");
      }

      setNewsletters((prev) => prev.filter((item) => item._id !== id));
      if (selectedNewsletter?._id === id) setSelectedNewsletter(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleExport = () => {
    if (filteredNewsletters.length === 0) return;

    const escapeCell = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const csvContent = [
      ["Subject", "Recipients", "Sent At", "Created At"],
      ...filteredNewsletters.map((newsletter) => [
        newsletter.subject,
        newsletter.totalRecipients,
        new Date(newsletter.sentAt).toLocaleString(),
        new Date(newsletter.createdAt).toLocaleString(),
      ]),
    ]
      .map((row) => row.map(escapeCell).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletters-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
              Admin Panel
            </p>
            <h1 className="font-serif text-4xl text-[var(--text-primary)]">
              Newsletters
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              disabled={filteredNewsletters.length === 0}
              className="flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:opacity-50"
            >
              <Download size={17} />
              Export CSV
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)]"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white transition hover:opacity-90"
            >
              <Plus size={18} />
              Create Newsletter
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <StatCard
            label="Campaigns"
            value={stats.total}
            icon={<Mail size={18} />}
            color="blue"
          />
          <StatCard
            label="Recipients"
            value={stats.recipients}
            icon={<Users size={18} />}
            color="green"
          />
          <StatCard
            label="Latest Sent"
            value={stats.latest}
            icon={<Send size={18} />}
            color="violet"
          />
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[var(--primary)]" />
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Newsletter Search
              </p>
              {hasActiveFilters && (
                <span className="rounded-full bg-[var(--primary)]/15 px-2 py-1 text-xs font-semibold text-[var(--primary)]">
                  Active
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Showing{" "}
              <span className="font-semibold text-[var(--primary)]">
                {filteredNewsletters.length}
              </span>{" "}
              of <span className="font-semibold">{newsletters.length}</span>
            </p>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="search"
              placeholder="Search by subject, recipients, or sent date..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] pl-10 pr-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex h-[300px] flex-col items-center justify-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
          <p className="text-[var(--text-secondary)]">Loading newsletters...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <h3 className="mb-2 font-semibold text-red-600">
            Something went wrong
          </h3>
          <p className="mb-5 text-sm text-red-500">{error}</p>
          <button
            onClick={handleRetry}
            className="h-10 rounded-xl bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredNewsletters.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Mail size={25} />
          </div>
          <h3 className="mb-3 font-serif text-2xl text-[var(--text-primary)]">
            No Newsletters Found
          </h3>
          <p className="text-[var(--text-secondary)]">
            {hasActiveFilters
              ? "No newsletters match the current search."
              : "Create your first newsletter to reach subscribers."}
          </p>
        </div>
      )}

      {!loading && !error && filteredNewsletters.length > 0 && (
        <>
          <div className="mb-20 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed md:table-auto">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
                    <th className="w-[46%] px-3 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Subject
                    </th>
                    <th className="hidden px-5 py-4 text-left text-sm font-semibold text-[var(--text-primary)] md:table-cell">
                      Sent At
                    </th>
                    <th className="w-[28%] px-2 py-4 text-left text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Recipients
                    </th>
                    <th className="w-[26%] px-2 py-4 text-right text-xs font-semibold text-[var(--text-primary)] sm:px-4 sm:text-sm md:w-auto md:px-5">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentNewsletters.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-[var(--border)] transition last:border-b-0 hover:bg-[var(--background-secondary)]"
                    >
                      <td className="px-3 py-4 sm:px-4 md:px-5">
                        <p className="truncate text-sm font-medium text-[var(--text-primary)] md:text-base">
                          {item.subject}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-[var(--text-secondary)] sm:text-xs md:hidden">
                          {new Date(
                            item.sentAt || item.createdAt,
                          ).toLocaleString()}
                        </p>
                      </td>

                      <td className="hidden whitespace-nowrap px-5 py-4 text-sm text-[var(--text-primary)] md:table-cell">
                        {new Date(
                          item.sentAt || item.createdAt,
                        ).toLocaleString()}
                      </td>

                      <td className="px-2 py-4 sm:px-4 md:px-5">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--primary)]">
                          <Users size={13} />
                          {item.totalRecipients}
                        </span>
                      </td>

                      <td className="px-2 py-4 sm:px-4 md:px-5">
                        <div className="flex justify-end gap-1 md:gap-2">
                          <button
                            onClick={() => handleView(item._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 transition hover:bg-blue-500/10 md:h-9 md:w-9"
                            title="View newsletter"
                            aria-label={`View ${item.subject}`}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-500/10 md:h-9 md:w-9"
                            title="Delete"
                            aria-label={`Delete ${item.subject}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pb-20 md:justify-end">
              <button
                disabled={activePage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <div className="flex h-11 min-w-[52px] items-center justify-center rounded-xl bg-[var(--primary)] px-4 font-medium text-white">
                {activePage}
              </div>
              <button
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 font-medium text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {viewLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6 py-5 text-[var(--text-primary)] shadow-2xl">
            Loading newsletter...
          </div>
        </div>
      )}

      {selectedNewsletter && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-details-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedNewsletter(null);
            }
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-5xl overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--card)] shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:rounded-[32px]">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-5 py-5 md:px-8">
              <div className="min-w-0 pr-3">
                <p className="mb-2 text-[10px] uppercase tracking-[3px] text-[var(--primary)] sm:text-xs sm:tracking-[4px]">
                  Newsletter Preview
                </p>
                <h2
                  id="newsletter-details-title"
                  className="truncate font-serif text-2xl text-[var(--text-primary)] md:text-3xl"
                >
                  {selectedNewsletter.subject}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Sent to {selectedNewsletter.totalRecipients} recipients on{" "}
                  {new Date(
                    selectedNewsletter.sentAt || selectedNewsletter.createdAt,
                  ).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedNewsletter(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-primary)] transition hover:bg-[var(--background-secondary)] md:h-11 md:w-11"
                aria-label="Close newsletter preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[calc(94vh-110px)] overflow-y-auto p-5 md:p-8">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] p-5">
                <div
                  className="prose max-w-none text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--primary)]"
                  dangerouslySetInnerHTML={{
                    __html: selectedNewsletter.content,
                  }}
                />
              </div>

              {selectedNewsletter.attachments?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Paperclip size={18} className="text-[var(--primary)]" />
                    <p className="font-semibold text-[var(--text-primary)]">
                      Attachments
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedNewsletter.attachments.map((file, index) => (
                      <a
                        key={`${file.url}-${index}`}
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:bg-[var(--background-secondary)]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                            <AttachmentIcon type={file.type} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                              {file.name}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)]">
                              {formatFileSize(file.size) || "Attachment"}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--primary)]">
                          View
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateNewsletterModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={refreshNewsletters}
        />
      )}
    </div>
  );
}

function AttachmentIcon({ type }: { type?: string }) {
  if (type?.includes("image")) return <ImageIcon size={18} />;
  return <FileText size={18} />;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: "blue" | "violet" | "green";
}) {
  const styles = {
    blue: {
      card: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
      icon: "bg-blue-500/10 text-blue-600",
      value: "text-blue-600",
    },
    violet: {
      card: "from-violet-500/10 to-violet-600/5 border-violet-500/20",
      icon: "bg-violet-500/10 text-violet-600",
      value: "text-violet-600",
    },
    green: {
      card: "from-green-500/10 to-green-600/5 border-green-500/20",
      icon: "bg-green-500/10 text-green-600",
      value: "text-green-600",
    },
  }[color];

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${styles.card}`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">
          {label}
        </p>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-bold md:text-3xl ${styles.value}`}>
        {value}
      </p>
    </div>
  );
}
