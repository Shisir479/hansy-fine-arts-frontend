// src/components/contact/ContactForm.tsx
"use client";

import React, { useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // honeypot
};

const initial: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null
  );

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ ok: false, message: "Please fill required fields." });
      return;
    }

    if (form.website && form.website.trim().length > 0) {
      setStatus({ ok: false, message: "Spam detected." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setStatus({
          ok: false,
          message: json?.message ?? "Failed to send message.",
        });
      } else {
        setStatus({ ok: true, message: "Message sent successfully." });
        setForm(initial);
      }
    } catch {
      setStatus({ ok: false, message: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm"
    >
      {/* hidden honeypot */}
      <div style={{ display: "none" }} aria-hidden>
        <input name="website" value={form.website} onChange={onChange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col">
          <span className="text-xs text-zinc-700 mb-1">Name</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="border border-zinc-200 rounded-md px-3 py-2"
            placeholder="Your full name"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-xs text-zinc-700 mb-1">Email</span>
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            className="border border-zinc-200 rounded-md px-3 py-2"
            placeholder="you@domain.com"
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="text-xs text-zinc-700 mb-1">Subject</span>
        <input
          name="subject"
          value={form.subject}
          onChange={onChange}
          className="border border-zinc-200 rounded-md px-3 py-2 w-full"
          placeholder="Subject (optional)"
        />
      </div>

      <div className="mt-4">
        <span className="text-xs text-zinc-700 mb-1">Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          rows={6}
          className="border border-zinc-200 rounded-md px-3 py-3 w-full"
          placeholder="Write your message..."
        ></textarea>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center bg-black text-white font-semibold px-5 py-2 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send message"}
        </button>

        <button
          type="button"
          onClick={() => {
            setForm(initial);
            setStatus(null);
          }}
          className="inline-flex items-center justify-center border border-zinc-300 px-4 py-2 text-sm"
        >
          Reset
        </button>

        {status && (
          <span
            className={`text-sm ${
              status.ok ? "text-green-700" : "text-red-600"
            }`}
          >
            {status.message}
          </span>
        )}
      </div>
    </form>
  );
}
