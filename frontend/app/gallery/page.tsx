"use client";

import { CalendarDays, Images, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CTA from "../components/CTA";
import FloatingContact from "../components/FloatingButton";
import PopupForm from "../components/Popup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
}

interface GalleryAlbum {
  _id: string;
  title: string;
  location?: string;
  year?: string;
  description?: string;
  images: GalleryImage[];
}

async function requestGallery(apiBase: string | undefined) {
  const res = await fetch(`${apiBase}/gallery`, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch gallery");
  }

  return data as GalleryAlbum[];
}

export default function Gallery() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const [openPopup, setOpenPopup] = useState(false);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [activeAlbumId, setActiveAlbumId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    requestGallery(API_BASE)
      .then((data) => {
        if (!cancelled) setAlbums(data);
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

  const visibleAlbums = useMemo(() => {
    if (activeAlbumId === "all") return albums;
    return albums.filter((album) => album._id === activeAlbumId);
  }, [activeAlbumId, albums]);

  return (
    <div>
      <Navbar />

      <section className="relative w-full min-h-[650px] lg:h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/herosection/gallery.png')",
          }}
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 flex items-center">
          <div className="max-w-[520px] pt-24 lg:pt-0">
            <p className="text-[#65BC4F] text-xs md:text-sm font-semibold uppercase tracking-wider mb-4">
              Home &gt; Gallery
            </p>

            <h1 className="text-[32px] sm:text-[42px] md:text-[54px] lg:text-[64px] leading-[1.05] font-bold text-[#0B1220]">
              Our
              <span className="text-[#65BC4F]"> Gallery</span>
            </h1>

            <p className="mt-6 text-gray-600 text-sm md:text-base leading-7 max-w-[500px]">
              Explore our machinery, manufacturing facilities, installations,
              exhibitions, and project highlights through our visual showcase.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setOpenPopup(true)}
                className="flex items-center gap-3 bg-[#65BC4F] hover:bg-[#54a63f] transition-all px-6 py-3 rounded-lg"
              >
                <span className="text-white font-semibold uppercase text-sm">
                  Talk to Our Experts
                </span>

                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">-&gt;</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-[var(--primary)] uppercase tracking-[4px] text-sm font-semibold">
                Visual Showcase
              </span>

              <h2 className="text-4xl lg:text-6xl font-bold mt-4 text-[var(--text-primary)]">
                Exhibition
                <span className="text-[var(--primary)]"> Gallery</span>
              </h2>

              <p className="max-w-2xl mt-6 text-[var(--text-secondary)] leading-8">
                Browse highlights from our exhibitions, product showcases, and
                customer interaction moments.
              </p>
            </div>

            {albums.length > 0 && (
              <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setActiveAlbumId("all")}
                  className={`h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
                    activeAlbumId === "all"
                      ? "bg-[var(--primary)] text-white"
                      : "border border-[var(--border)] text-[var(--text-primary)]"
                  }`}
                >
                  All
                </button>
                {albums.map((album) => (
                  <button
                    key={album._id}
                    type="button"
                    onClick={() => setActiveAlbumId(album._id)}
                    className={`h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
                      activeAlbumId === album._id
                        ? "bg-[var(--primary)] text-white"
                        : "border border-[var(--border)] text-[var(--text-primary)]"
                    }`}
                  >
                    {album.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && (
            <div className="flex h-[320px] flex-col items-center justify-center">
              <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
              <p className="text-[var(--text-secondary)]">Loading gallery...</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-8 text-center">
              <h3 className="mb-2 text-xl font-semibold text-red-600">
                Gallery could not be loaded
              </h3>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && albums.length === 0 && (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                <Images size={28} />
              </div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">
                Images Will Be Available Soon
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-[var(--text-secondary)] leading-8">
                Our gallery is currently being updated with high-quality images
                of exhibitions, products, facilities, and customer success
                stories.
              </p>
            </div>
          )}

          {!loading && !error && visibleAlbums.length > 0 && (
            <div className="space-y-10">
              {visibleAlbums.map((album) => (
                <div
                  key={album._id}
                  className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6"
                >
                  {/* Album Header */}
                  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                        {album.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                        {album.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={15} />
                            {album.location}
                          </span>
                        )}

                        {album.year && (
                          <span className="flex items-center gap-1">
                            <CalendarDays size={15} />
                            {album.year}
                          </span>
                        )}

                        <span>{album.images.length} Photos</span>
                      </div>

                      {album.description && (
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                          {album.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Images */}
                  {album.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {album.images.map((image) => (
                        <div
                          key={image._id}
                          className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)]"
                        >
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={image.url}
                              alt={image.caption || album.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                          </div>

                          {image.caption && (
                            <div className="border-t border-[var(--border)] p-3">
                              <p className="line-clamp-2 text-sm text-[var(--text-secondary)]">
                                {image.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background-secondary)]">
                      <Images
                        size={36}
                        className="mb-3 text-[var(--text-secondary)]"
                      />
                      <p className="font-medium text-[var(--text-primary)]">
                        No Images Available
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Images will be added soon.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTA />
      <ScrollToTop />
      <FloatingContact />
      <Footer />
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
    </div>
  );
}
