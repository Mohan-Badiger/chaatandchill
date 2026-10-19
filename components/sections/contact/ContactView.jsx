"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { contactPageContent } from "@/lib/content";
import SectionReveal from "@/components/shared/SectionReveal";
import MagneticButton from "@/components/shared/MagneticButton";

export default function ContactView() {
  const { hero, pillars, promise, outlets, mediaBuzz, faqs } = contactPageContent;

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "General Feedback & Experience",
    outlet: "Chaat and Chill, Jamakhandi",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your full name";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.message.trim()) newErrors.message = "Please enter your message";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Optimistic local storage update & broadcast for instant admin alert
      if (typeof window !== "undefined") {
        const notifStored = localStorage.getItem("chaat_admin_notifs");
        const currentNotifs = notifStored ? JSON.parse(notifStored) : [];
        const newNotif = {
          id: "notif-" + Date.now(),
          type: "review",
          priority: "normal",
          title: `💬 New Feedback from ${formData.name}`,
          message: `${formData.inquiryType}: "${formData.message.slice(0, 60)}..."`,
          time: "Just now",
          read: false,
        };
        localStorage.setItem("chaat_admin_notifs", JSON.stringify([newNotif, ...currentNotifs]));

        if ("BroadcastChannel" in window) {
          const channel = new BroadcastChannel("chaat_admin_bus");
          channel.postMessage({ type: "NOTIFICATION_ADDED", payload: newNotif, timestamp: Date.now() });
          channel.close();
        }
      }
    } catch (err) {
      console.warn("[ContactView] Submission error:", err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "General Feedback & Experience",
        outlet: "Chaat and Chill, Jamakhandi",
        message: "",
      });
      setTimeout(() => {
        setIsSuccess(false);
      }, 8000);
    }
  };

  return (
    <div className="bg-cream text-espresso overflow-hidden">
      {/* =====================================================================
          1. HERO SECTION — GOT QUESTIONS? WE'VE GOT CHUTNEY
          ===================================================================== */}
      <section className="relative pt-32 pb-20 md:pb-28 bg-espresso text-cream overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/outlet-ambiance.jpg"
            alt="The Rameshwaram Cafe welcoming atmosphere"
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-espresso/90 via-espresso/80 to-espresso" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/15 border border-gold/30 text-gold text-xs uppercase tracking-[0.25em] font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span>💬</span>
            <span>{hero.eyebrow}</span>
          </motion.div>

          <motion.h1
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-cream mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            className="text-muted text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-serif italic mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            &ldquo;{hero.subheadline}&rdquo;
          </motion.p>

          <motion.p
            className="text-cream/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {hero.description}
          </motion.p>
        </div>
      </section>

      {/* =====================================================================
          2. THREE INQUIRY PILLARS
          ===================================================================== */}
      <section className="py-16 md:py-24 px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <SectionReveal key={pillar.id} delay={0.1 + idx * 0.1}>
              <div className="h-full p-8 bg-white border border-espresso/5 shadow-lg hover:shadow-2xl hover:border-gold/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-amber font-semibold block mb-2">
                    {pillar.tag}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-espresso mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-espresso/70 text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-espresso/10 space-y-2">
                  <div className="text-sm font-semibold text-espresso">
                    {pillar.phone}
                  </div>
                  <div className="text-xs text-amber hover:underline font-mono">
                    {pillar.contact}
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* =====================================================================
          3. JUST DROP YOUR MESSAGE HERE (INTERACTIVE FORM & RUSH TAGLINE)
          ===================================================================== */}
      <section className="py-12 md:py-20 px-6 lg:px-10 max-w-5xl mx-auto">
        <div className="bg-white p-8 sm:p-14 shadow-2xl border border-espresso/5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow text-amber block mb-2 font-semibold">
              DROP A LINE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso mb-2">
              Just Drop Your Message Here
            </h2>
            <p className="text-espresso/70 text-sm">
              Whether you’re inquiring about a bulk morning breakfast or sharing your feedback, our concierge team is listening.
            </p>
          </div>

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-emerald-50 border border-emerald-200 text-emerald-800"
            >
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">🎉</span>
                <h4 className="font-serif font-bold text-lg text-emerald-900">
                  Message Dispatched!
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-emerald-700">
                Thank you! Our concierge team has received your note and will get back to you promptly.
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">
                  Full Name <span className="text-amber">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Ramesh Hegde"
                  className={`w-full px-4 py-3 bg-cream/40 border text-espresso text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-amber ${
                    errors.name ? "border-rose-500" : "border-espresso/15"
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-rose-500 mt-1 block">
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">
                  Email Address <span className="text-amber">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="ramesh@example.com"
                  className={`w-full px-4 py-3 bg-cream/40 border text-espresso text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-amber ${
                    errors.email ? "border-rose-500" : "border-espresso/15"
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-rose-500 mt-1 block">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">
                  Phone Number <span className="text-amber">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-3 bg-cream/40 border text-espresso text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-amber ${
                    errors.phone ? "border-rose-500" : "border-espresso/15"
                  }`}
                />
                {errors.phone && (
                  <span className="text-xs text-rose-500 mt-1 block">
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">
                  Inquiry Nature
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) =>
                    setFormData({ ...formData, inquiryType: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-cream/40 border border-espresso/15 text-espresso text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-amber"
                >
                  <option value="General Feedback & Experience">
                    General Feedback & Dining Experience
                  </option>
                  <option value="Franchise & Partner Inquiries">
                    Franchise & Expansion Opportunities
                  </option>
                  <option value="Live Event & Wedding Catering">
                    Live Event & Wedding Catering
                  </option>
                  <option value="Corporate Bulk Breakfast Orders">
                    Corporate Bulk Breakfast Orders
                  </option>
                  <option value="Careers & Joining Our Team">
                    Careers & Joining Our Team
                  </option>
                </select>
              </div>
            </div>

            {/* Outlet Preference */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">
                Nearest Adda
              </label>
              <select
                value={formData.outlet}
                onChange={(e) =>
                  setFormData({ ...formData, outlet: e.target.value })
                }
                className="w-full px-4 py-3 bg-cream/40 border border-espresso/15 text-espresso text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-amber"
              >
                {outlets.map((o) => (
                  <option key={o.id} value={o.name}>
                    {o.name} ({o.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Message Box */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-espresso/80 mb-2">
                Your Message <span className="text-amber">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Share your thoughts, catering date, or questions here..."
                className={`w-full px-4 py-3 bg-cream/40 border text-espresso text-sm transition-all focus:outline-hidden focus:ring-1 focus:ring-amber ${
                  errors.message ? "border-rose-500" : "border-espresso/15"
                }`}
              />
              {errors.message && (
                <span className="text-xs text-rose-500 mt-1 block">
                  {errors.message}
                </span>
              )}
            </div>

            {/* Submit Button & Rameshwaram Rush Tagline */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 bg-espresso text-cream hover:bg-gold hover:text-espresso font-bold text-sm transition-all duration-300 shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Transmitting..." : "Submit Message ↗"}
              </button>

              {/* The Iconic Rameshwaram Rush Tagline */}
              <p className="text-xs sm:text-sm text-espresso/70 font-serif italic mt-5 max-w-lg mx-auto leading-relaxed">
                &ldquo;{promise}&rdquo;
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* =====================================================================
          4. OUTLET ADDA DIRECTORY (FIND YOUR NEAREST ADDA)
          ===================================================================== */}
      <section className="py-20 md:py-32 bg-cream border-t border-espresso/10 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionReveal>
              <span className="eyebrow text-amber block mb-2 font-semibold">
                OUR SANCTUARIES OF TASTE
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso mb-4">
                Find Your Nearest Adda
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="text-espresso/70 text-base sm:text-lg">
                Step up to the live tawa, inhale the roasting ghee, and let our team serve you with warmth and devotion.
              </p>
            </SectionReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {outlets.map((outlet, idx) => (
              <SectionReveal key={outlet.id} delay={0.1 + idx * 0.1}>
                <div className="h-full p-8 bg-white border border-espresso/5 shadow-lg hover:shadow-2xl hover:border-gold/40 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-cream text-espresso/80 text-[11px] font-mono font-semibold border border-espresso/10">
                        {outlet.city}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                        <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
                        Open Daily
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-espresso mb-2">
                      {outlet.name}
                    </h3>

                    <p className="text-xs text-amber font-semibold mb-4">
                      {outlet.timingTag}
                    </p>

                    <p className="text-espresso/75 text-sm leading-relaxed mb-4">
                      {outlet.address}
                    </p>

                    <div className="p-3 bg-cream/60 border border-espresso/5 mb-6 space-y-1">
                      <div className="text-xs font-semibold text-espresso flex items-center gap-2">
                        <span>⏰</span> {outlet.hours}
                      </div>
                      <div className="text-xs text-espresso/70 flex items-center gap-2">
                        <span>📞</span> {outlet.phone}
                      </div>
                    </div>

                    <p className="text-xs font-mono text-espresso/60 mb-4">
                      {outlet.features}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-espresso/10">
                    <a
                      href={outlet.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber hover:text-espresso transition-colors"
                    >
                      <span>Get Directions</span>
                      <span>📍</span>
                    </a>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. MEDIA SPOTLIGHT — BECAUSE WORDS AREN'T ALWAYS ENOUGH
          ===================================================================== */}
      <section className="py-20 md:py-32 bg-espresso text-cream px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionReveal>
              <span className="eyebrow text-gold block mb-2 font-semibold">
                {mediaBuzz.eyebrow}
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-cream mb-4">
                {mediaBuzz.headline}
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="text-muted text-base sm:text-lg">
                {mediaBuzz.lead}
              </p>
            </SectionReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mediaBuzz.coverage.map((item, idx) => (
              <SectionReveal key={idx} delay={0.15 + idx * 0.1}>
                <div className="h-full p-8 bg-white/5 border border-white/10 hover:border-gold/40 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase font-mono text-gold font-semibold">
                        {item.source}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 bg-white/10 text-cream/70 font-mono">
                        {item.views}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-cream mb-1">
                      {item.title}
                    </h3>
                    <h4 className="text-xs text-amber font-semibold mb-4">
                      {item.subtitle}
                    </h4>

                    <p className="font-serif italic text-sm text-cream/80 leading-relaxed">
                      {item.highlight}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 text-xs text-gold flex items-center justify-between font-semibold">
                    <span>Watch Stories From Bharat</span>
                    <span>▶</span>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. FREQUENTLY ASKED QUESTIONS (RAMESHWARAM ACCORDION)
          ===================================================================== */}
      <section className="py-20 md:py-32 bg-cream px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionReveal>
              <span className="eyebrow text-amber block mb-2 font-semibold">
                QUICK ASSISTANCE
              </span>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso mb-4">
                Frequently Asked Questions
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="text-espresso/70 text-sm sm:text-base">
                Everything you need to know about our standing format, pure cow ghee standards, and timings.
              </p>
            </SectionReveal>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-espresso/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-lg text-espresso hover:text-amber transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`w-8 h-8 bg-cream flex items-center justify-center shrink-0 font-sans text-sm font-bold transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-gold text-espresso" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-espresso/75 text-sm sm:text-base leading-relaxed border-t border-espresso/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
