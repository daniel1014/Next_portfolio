"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X, Mail, User, MessageSquare } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function ContactFormDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);

  // Prevent background scroll when dialog is open (mobile-first usability)
  useEffect(() => {
    if (open) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [open]);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (form.message.trim().length < 10) newErrors.message = "Please enter at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Functional minimal behavior: open mail client with prefilled content
      const subject = encodeURIComponent("Portfolio Contact");
      const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`);
      window.location.href = `mailto:chuenlik@hotmail.com?subject=${subject}&body=${body}`;
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-auto cursor-pointer overflow-hidden rounded-full px-6 py-2 text-center text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition-all duration-300 bg-white/10 hover:bg-white/15 hover:shadow-[0_8px_24px_rgba(59,130,246,0.25)]"
      >
        {/* Glass highlight layer */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/10 to-transparent opacity-70" />
        {/* Moving sheen */}
        <div className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[300%] group-hover:opacity-100" />
        <div className="flex items-center gap-2">
          <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
            Get In Touch
          </span>
        </div>
        <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-1 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
          <span>Get In Touch</span>
          <ArrowRight className="mt-0.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </div>
      </button>

      {/* Dialog */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-dialog-title"
          className="fixed inset-0 z-50 grid min-h-[100svh] place-items-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-auto rounded-xl border border-white/10 bg-gray-900 p-6 shadow-2xl max-h-[85svh] overflow-y-auto">
            <button
              aria-label="Close"
              className="absolute right-3 top-3 rounded p-1 text-gray-400 hover:text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 id="contact-dialog-title" className="mb-1 text-2xl font-bold text-white">Contact Me</h2>
            <p className="mb-6 text-sm text-gray-400">
              I typically respond quickly, so feel free to reach out anytime!
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300" htmlFor="name">Name</label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus-within:border-cyan-500">
                  <User className="h-4 w-4 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent text-gray-200 outline-none placeholder:text-gray-500"
                    placeholder="Name"
                    autoFocus
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300" htmlFor="email">Email</label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus-within:border-cyan-500">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-transparent text-gray-200 outline-none placeholder:text-gray-500"
                    placeholder="Email"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300" htmlFor="message">Message</label>
                <div className="flex items-start gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus-within:border-cyan-500">
                  <MessageSquare className="mt-1 h-4 w-4 text-gray-400" />
                  <textarea
                    id="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none bg-transparent text-gray-200 outline-none placeholder:text-gray-500"
                    placeholder="Type your message"
                  />
                </div>
                {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


