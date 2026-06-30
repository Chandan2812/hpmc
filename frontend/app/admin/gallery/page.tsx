"use client";

import {
  CalendarDays,
  Edit,
  Eye,
  EyeOff,
  ImageIcon,
  Images,
  MapPin,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
}

interface GalleryAlbum {
  _id: string;
  title: string;
  slug: string;
  location?: string;
  year?: string;
  description?: string;
  images: GalleryImage[];
  isActive: boolean;
  createdAt: string;
}

const emptyForm = {
  title: "",
  location: "",
  year: "",
  description: "",
};

async function requestGallery(apiBase: string | undefined) {
  const res = await fetch(`${apiBase}/gallery?all=true`, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch gallery albums");
  }

  return data as GalleryAlbum[];
}

export default function AdminGalleryPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<File[]>([]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      setError("");
      setAlbums(await requestGallery(API_BASE));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      requestGallery(API_BASE)
        .then((data) => {
          if (!cancelled) setAlbums(data);
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            setError(
              err instanceof Error ? err.message : "Something went wrong",
            );
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [API_BASE]);

  const filteredAlbums = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return albums;

    return albums.filter((album) =>
      [album.title, album.location, album.year, album.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [albums, searchQuery]);

  const stats = {
    albums: albums.length,
    active: albums.filter((album) => album.isActive !== false).length,
    images: albums.reduce((sum, album) => sum + album.images.length, 0),
    latest: albums[0]
      ? new Date(albums[0].createdAt).toLocaleDateString()
      : "None",
  };

  const openCreate = () => {
    setEditingAlbum(null);
    setForm(emptyForm);
    setFiles([]);
    setShowModal(true);
  };

  const openEdit = (album: GalleryAlbum) => {
    setEditingAlbum(album);
    setForm({
      title: album.title || "",
      location: album.location || "",
      year: album.year || "",
      description: album.description || "",
    });
    setFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Exhibition title is required");
      return;
    }

    if (!editingAlbum && files.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("year", form.year);
    formData.append("description", form.description);
    files.forEach((file) => formData.append("images", file));

    try {
      setSaving(true);
      const res = await fetch(
        editingAlbum
          ? `${API_BASE}/gallery/${editingAlbum._id}`
          : `${API_BASE}/gallery`,
        {
          method: editingAlbum ? "PUT" : "POST",
          body: formData,
        },
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save gallery album");
      }

      setShowModal(false);
      setEditingAlbum(null);
      setForm(emptyForm);
      setFiles([]);
      await fetchAlbums();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save album");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (album: GalleryAlbum) => {
    const formData = new FormData();
    formData.append("isActive", String(!album.isActive));

    try {
      const res = await fetch(`${API_BASE}/gallery/${album._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Status update failed");

      setAlbums((prev) =>
        prev.map((item) => (item._id === album._id ? data.data : item)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Status update failed");
    }
  };

  const handleDeleteAlbum = async (album: GalleryAlbum) => {
    if (!confirm(`Delete "${album.title}" and all its images?`)) return;

    try {
      const res = await fetch(`${API_BASE}/gallery/${album._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setAlbums((prev) => prev.filter((item) => item._id !== album._id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleDeleteImage = async (albumId: string, imageId: string) => {
    if (!confirm("Delete this image from the album?")) return;

    try {
      const res = await fetch(`${API_BASE}/gallery/${albumId}/images/${imageId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      setAlbums((prev) =>
        prev.map((album) => (album._id === albumId ? data.data : album)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div className="pb-24">
      <div className="mb-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
              Admin Panel
            </p>
            <h1 className="font-serif text-4xl text-[var(--text-primary)]">
              Gallery
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Create exhibition albums and upload multiple images to Cloudinary.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 font-medium text-white transition hover:opacity-90"
          >
            <Plus size={18} />
            Add Exhibition
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 md:gap-4">
          <StatCard label="Albums" value={stats.albums} icon={<Images size={18} />} />
          <StatCard label="Active" value={stats.active} icon={<Eye size={18} />} />
          <StatCard label="Images" value={stats.images} icon={<ImageIcon size={18} />} />
          <StatCard label="Latest" value={stats.latest} icon={<CalendarDays size={18} />} />
        </div>

        <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <Search
            size={16}
            className="absolute left-8 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search exhibition title, location, year..."
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] pl-10 pr-4 text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </div>

      {loading && (
        <div className="flex h-[300px] flex-col items-center justify-center">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
          <p className="text-[var(--text-secondary)]">Loading gallery...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <h3 className="mb-2 font-semibold text-red-600">Something went wrong</h3>
          <p className="mb-5 text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={fetchAlbums}
            className="h-10 rounded-xl bg-red-600 px-5 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredAlbums.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
            <Images size={25} />
          </div>
          <h3 className="mb-3 font-serif text-2xl text-[var(--text-primary)]">
            No Gallery Albums
          </h3>
          <p className="text-[var(--text-secondary)]">
            Upload your first exhibition album to show it on the website.
          </p>
        </div>
      )}

      {!loading && !error && filteredAlbums.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredAlbums.map((album) => (
            <div
              key={album._id}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="grid grid-cols-3 gap-1 bg-[var(--background-secondary)] p-1">
                {album.images.slice(0, 3).map((image) => (
                  <div key={image._id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={image.url}
                      alt={image.caption || album.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(album._id, image._id)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-black/60 text-white"
                      aria-label="Delete image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold text-[var(--text-primary)]">
                      {album.title}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                      {album.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} />
                          {album.location}
                        </span>
                      )}
                      {album.year && <span>{album.year}</span>}
                      <span>{album.images.length} images</span>
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      album.isActive
                        ? "bg-green-500/10 text-green-600"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {album.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                {album.description && (
                  <p className="mb-5 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {album.description}
                  </p>
                )}

                <div className="flex flex-wrap justify-end gap-2">
                  <IconButton
                    label={album.isActive ? "Hide album" : "Show album"}
                    onClick={() => handleToggle(album)}
                    icon={album.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  />
                  <IconButton
                    label="Edit album"
                    onClick={() => openEdit(album)}
                    icon={<Edit size={16} />}
                  />
                  <IconButton
                    label="Delete album"
                    onClick={() => handleDeleteAlbum(album)}
                    icon={<Trash2 size={16} />}
                    tone="danger"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title={editingAlbum ? "Edit Exhibition" : "Add Exhibition"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="Exhibition Title"
                value={form.title}
                onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
                placeholder="PlastIndia 2025"
              />
              <TextInput
                label="Year"
                value={form.year}
                onChange={(value) => setForm((prev) => ({ ...prev, year: value }))}
                placeholder="2025"
              />
            </div>

            <TextInput
              label="Location"
              value={form.location}
              onChange={(value) => setForm((prev) => ({ ...prev, location: value }))}
              placeholder="New Delhi"
            />

            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                rows={4}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] p-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background-secondary)] p-6 text-center transition hover:border-[var(--primary)]">
              <UploadCloud size={26} className="mb-3 text-[var(--primary)]" />
              <p className="font-medium text-[var(--text-primary)]">
                {files.length ? `${files.length} image(s) selected` : "Upload exhibition images"}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                JPG, PNG, or WebP. You can add more images while editing.
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setFiles(Array.from(event.target.files || []))}
                className="hidden"
              />
            </label>

            <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-5">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-11 rounded-xl border border-[var(--border)] px-6"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-11 rounded-xl bg-[var(--primary)] px-6 font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : editingAlbum ? "Save Changes" : "Create Album"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--background-secondary)] px-3 outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-3xl overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--card)] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-5 md:px-8">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[4px] text-[var(--primary)]">
              Gallery Album
            </p>
            <h2 className="font-serif text-2xl text-[var(--text-primary)] md:text-3xl">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)]"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[calc(94vh-96px)] overflow-y-auto p-5 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  icon,
  onClick,
  tone = "default",
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] transition ${
        tone === "danger"
          ? "text-red-500 hover:bg-red-500/10"
          : "hover:bg-[var(--background-secondary)]"
      }`}
    >
      {icon}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <div className="text-[var(--primary)]">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold md:text-3xl">{value}</h3>
    </div>
  );
}
