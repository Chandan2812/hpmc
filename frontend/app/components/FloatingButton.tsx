"use client";

import { useState } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Calendar,
  Headphones,
  MonitorPlay,
} from "lucide-react";
import PopupForm from "./Popup";
import DemoPopup from "./PopupDemo";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);

  const whatsappMessage = encodeURIComponent(`Hello HPMC Team,

I recently visited your website and would like to know more about your manufacturing solutions and services.

Could you please share more information and guide me further?

Looking forward to your response.

Thank you.`);

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block">
        {open && (
          <div
            className="fixed bottom-24 right-6 z-[9999] w-[320px] overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-primary)",
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 text-center text-white"
              style={{
                background: "var(--primary)",
              }}
            >
              <h3 className="text-xl font-bold">Let's Connect</h3>

              <p className="mt-1 text-sm opacity-90">
                Choose your preferred way
              </p>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/919560596392?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 border-b px-6 py-4 transition-all duration-300 hover:bg-[var(--muted)]"
              style={{
                borderColor: "var(--border)",
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "rgba(132,204,22,0.12)",
                  color: "var(--primary)",
                }}
              >
                <MessageCircle size={20} />
              </div>

              <div>
                <p
                  className="font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  WhatsApp Us
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Quick support anytime
                </p>
              </div>
            </a>

            {/* Call */}
            <a
              href="tel:+919560596392"
              className="flex items-center gap-4 border-b px-6 py-4 transition-all duration-300 hover:bg-[var(--muted)]"
              style={{
                borderColor: "var(--border)",
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "rgba(132,204,22,0.12)",
                  color: "var(--primary)",
                }}
              >
                <Phone size={20} />
              </div>

              <div>
                <p
                  className="font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Call Us
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  +91 95605 96392
                </p>
              </div>
            </a>

            <button
              type="button"
              onClick={() => {
                setOpen(false); // close floating panel
                setOpenPopup(true); // open popup form
              }}
              className="border-b border-[var(--border)] flex w-full items-center gap-4 px-6 py-4 text-left transition-all duration-300 hover:bg-[var(--muted)]"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "rgba(132,204,22,0.12)",
                  color: "var(--primary)",
                }}
              >
                <Calendar size={20} />
              </div>

              <div>
                <p
                  className="font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Book Consultation
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  Plan your project with us
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false); // close floating panel
                setOpenPopup2(true); // open popup form
              }}
              className="flex w-full items-center gap-4 px-6 py-4 text-left transition-all duration-300 hover:bg-[var(--muted)]"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "rgba(132,204,22,0.12)",
                  color: "var(--primary)",
                }}
              >
                <MonitorPlay size={20} />
              </div>

              <div>
                <p
                  className="font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Book a Site Visit
                </p>

                <p
                  className="text-sm"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  See our machines in action
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setOpen(!open)}
          className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110"
          style={{
            background: "var(--primary)",
            boxShadow: "var(--shadow-primary)",
          }}
        >
          {open ? <X size={26} /> : <FaWhatsapp size={26} />}
        </button>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="fixed bottom-0 left-0 z-[9999] w-full md:hidden">
        <div
          className="flex border-t"
          style={{
            background: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          {/* WhatsApp */}
          <a
            href={`https://wa.me/919560596392?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 py-4 font-medium"
            style={{
              color: "var(--primary)",
            }}
          >
            <FaWhatsapp size={18} />
            WhatsApp
          </a>

          {/* Call */}
          <a
            href="tel:+919560596392"
            className="flex flex-1 items-center justify-center gap-2 py-4 font-medium text-white"
            style={{
              background: "var(--primary)",
            }}
          >
            <Phone size={18} />
            Call Now
          </a>
        </div>
      </div>
      <PopupForm open={openPopup} onClose={() => setOpenPopup(false)} />
      <DemoPopup open={openPopup2} onClose={() => setOpenPopup2(false)} />
    </>
  );
}
