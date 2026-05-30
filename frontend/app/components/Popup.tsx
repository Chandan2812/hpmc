"use client";

import { useEffect } from "react";
import Image from "next/image";
import LeadForm from "./LeadForm";

interface PopupFormProps {
  open: boolean;
  onClose: () => void;
}

export default function PopupForm({ open, onClose }: PopupFormProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border shadow-2xl animate-in fade-in zoom-in-95 duration-300"
        style={{
          background: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-primary)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
          style={{
            background: "var(--card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          ✕
        </button>

        <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto lg:grid-cols-2">
          {/* Left Side */}
          <div className="relative hidden min-h-[650px] lg:flex">
            <Image
              src="/product.jpg"
              alt="Event Management"
              fill
              className="object-cover"
              priority
            />

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(2,8,23,.85) 0%, rgba(2,8,23,.45) 100%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center p-12 text-white">
              <span
                className="mb-4 w-fit rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.2)",
                }}
              >
                Free Consultation
              </span>

              <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                Let's Create
                <br />
                Something Extraordinary
              </h2>

              <p className="mt-5 max-w-md text-lg text-white/90">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellendus, eius!
              </p>

              <div className="mt-10 flex gap-10">
                <div>
                  <h3 className="text-3xl font-bold text-[var(--primary)]">
                    240+
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    Special Expert Teams
                  </p>
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-[var(--primary)]">
                    12000+
                  </h3>
                  <p className="mt-1 text-sm text-white/80">Happy Clients</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div
            className="p-3 md:p-5"
            style={{
              background: "var(--card)",
              color: "var(--card-foreground)",
            }}
          >
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
