// src/components/contact/ContactForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { init, send } from "@emailjs/browser";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
};

const INITIAL: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  // read env vars (client-exposed ones)
  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

  // initialize EmailJS once if PUBLIC_KEY provided
  useEffect(() => {
    if (PUBLIC_KEY) {
      try {
        init(PUBLIC_KEY);
      } catch (err) {
        // ignore init errors
        // console.warn("EmailJS init failed:", err);
      }
    }
  }, [PUBLIC_KEY]);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function submitToApi(payload: FormState) {
    // fallback server API (if you have /api/contact)
    return fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    // basic client validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        ok: false,
        message: "Please complete name, email and message.",
      });
      return;
    }
    // honeypot check
    if (form.website && form.website.trim().length > 0) {
      setStatus({ ok: false, message: "Spam detected." });
      return;
    }

    setLoading(true);

    try {
      const templateParams = {
        from_name: form.name,
        from_email: form.email,
        subject: form.subject || "(no subject)",
        message: form.message,
        admin_email: ADMIN_EMAIL || "owner@example.com",
      };

      // if EmailJS config available, prefer it
      if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
        try {
          const resp = await send(SERVICE_ID, TEMPLATE_ID, templateParams);
          // EmailJS returns an object with status 200 on success
          if (
            resp &&
            (resp.status === 200 || resp.text === "OK" || resp.status === 0)
          ) {
            setStatus({ ok: true, message: "Thanks — your message was sent." });
            setForm(INITIAL);
          } else {
            // fallback to server
            const fallback = await submitToApi(form);
            const j = await fallback.json().catch(() => null);
            if (fallback.ok) {
              setStatus({ ok: true, message: "Sent via server fallback." });
              setForm(INITIAL);
            } else {
              setStatus({
                ok: false,
                message: j?.message ?? "Failed to send message.",
              });
            }
          }
        } catch (err) {
          // EmailJS failed — fallback to server
          const fallback = await submitToApi(form);
          const j = await fallback.json().catch(() => null);
          if (fallback.ok) {
            setStatus({ ok: true, message: "Sent via server fallback." });
            setForm(INITIAL);
          } else {
            setStatus({
              ok: false,
              message: j?.message ?? "Failed to send message.",
            });
          }
        }
      } else {
        // EmailJS not configured, use server API directly
        const res = await submitToApi(form);
        const j = await res.json().catch(() => null);
        if (res.ok) {
          setStatus({ ok: true, message: "Thanks — your message was sent." });
          setForm(INITIAL);
        } else {
          setStatus({
            ok: false,
            message: j?.message ?? "Failed to send message.",
          });
        }
      }
    } catch (err) {
      setStatus({ ok: false, message: "Unexpected error. Try again later." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm"
    >
      {/* honeypot */}
      <div style={{ display: "none" }} aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          value={form.website}
          onChange={onChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col">
          <span className="text-xs text-zinc-700 mb-1">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            placeholder="Your full name"
            required
          />
        </label>

        <label className="flex flex-col">
          <span className="text-xs text-zinc-700 mb-1">Email</span>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            className="border border-zinc-200 rounded-md px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            placeholder="you@domain.com"
            required
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="flex flex-col">
          <span className="text-xs text-zinc-700 mb-1">Subject</span>
          <input
            name="subject"
            value={form.subject}
            onChange={onChange}
            className="border border-zinc-200 rounded-md px-3 py-2 w-full"
            placeholder="Subject (optional)"
          />
        </label>
      </div>

      <div className="mt-4">
        <label className="flex flex-col">
          <span className="text-xs text-zinc-700 mb-1">Message</span>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            rows={6}
            className="border border-zinc-200 rounded-md px-3 py-3 w-full"
            placeholder="Write your message..."
            required
          />
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          className="inline-flex items-center justify-center  bg-black text-white font-semibold px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {!loading ? (
            "Send message"
          ) : (
            // minimal loading dots animation
            <span className="flex items-center gap-2">
              <span className="sr-only">Sending</span>
              <span className="dots" aria-hidden>
                <i className="dot dot-1" />
                <i className="dot dot-2" />
                <i className="dot dot-3" />
              </span>
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setForm(INITIAL);
            setStatus(null);
          }}
          className="inline-flex items-center justify-center  border border-zinc-200 px-4 py-2 text-sm"
        >
          Reset
        </button>

        {status && (
          <div
            className={`ml-2 text-sm ${
              status.ok ? "text-green-700" : "text-red-600"
            }`}
            role="status"
            aria-live="polite"
          >
            {status.message}
          </div>
        )}
      </div>

      {/* styled-jsx for the dots animation (local to component) */}
      <style jsx>{`
        .dots {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          height: 16px;
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 99px;
          background: white;
          opacity: 0.95;
          transform: translateY(0);
          animation: dotPulse 1s infinite ease-in-out;
        }
        .dot-1 {
          animation-delay: 0s;
        }
        .dot-2 {
          animation-delay: 0.12s;
        }
        .dot-3 {
          animation-delay: 0.24s;
        }
        @keyframes dotPulse {
          0% {
            transform: translateY(0);
            opacity: 0.35;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
          60% {
            transform: translateY(0);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0);
            opacity: 0.35;
          }
        }
      `}</style>
    </form>
  );
}
