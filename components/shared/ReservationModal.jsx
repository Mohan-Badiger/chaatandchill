"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/lib/BookingContext";
import { locations } from "@/lib/content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ReservationModal() {
  const { isOpen, selectedLocation, closeBooking, setSelectedLocation } = useBooking();
  const [step, setStep] = useState("form"); // "form", "loading", "success"
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    time: "",
  });
  const [bookingCode, setBookingCode] = useState("");

  // Pre-fill location when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedLocation) {
        setFormData((prev) => ({ ...prev, location: selectedLocation }));
      } else {
        setFormData((prev) => ({ ...prev, location: locations[0]?.name || "" }));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedLocation, isOpen]);

  // Reset modal states when opened/closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep("form");
        setFormData({
          name: "",
          phone: "",
          guests: "2",
          date: "",
          time: "",
          location: selectedLocation || locations[0]?.name || "",
        });
      }, 300);
    }
  }, [isOpen, selectedLocation]);

  const timeSlots = [
    "8:30 AM", "9:30 AM", "11:00 AM", "12:30 PM",
    "4:00 PM", "6:00 PM", "7:30 PM", "9:00 PM", "10:00 PM"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.time) {
      alert("Please select a time slot!");
      return;
    }

    setStep("loading");

    // Generate booking reference code
    const randomCode =
      "CC-" +
      String(
        Math.abs(
          ((formData.name.length * 811 + formData.phone.length * 97 + 1000) % 9000) + 1000
        )
      );
    setBookingCode(randomCode);

    // Synchronize directly with backend server API & admin panel
    const newBooking = {
      id: "RES-" + Date.now().toString().slice(-4),
      bookingCode: randomCode,
      outlet: formData.location?.includes("Rabakavi") ? "Rabakavi" : "Jamakhandi",
      name: formData.name,
      phone: formData.phone,
      email: formData.email || "",
      guests: Number(formData.guests) || 2,
      date: formData.date || todayStr,
      time: formData.time,
      tableAssigned: "T-02",
      status: "confirmed",
      notes: "Booked online via Website Concierge",
      source: "Website Concierge",
      createdAt: new Date().toISOString(),
    };

    fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking),
    })
      .catch((err) => console.warn("[ReservationModal] Server sync error:", err))
      .finally(() => {
        // Also save to local storage for instant feedback
        try {
          const stored = localStorage.getItem("chaat_admin_reservations");
          const currentReservations = stored ? JSON.parse(stored) : [];
          localStorage.setItem("chaat_admin_reservations", JSON.stringify([newBooking, ...currentReservations]));

          const notifStored = localStorage.getItem("chaat_admin_notifs");
          const currentNotifs = notifStored ? JSON.parse(notifStored) : [];
          const newNotif = {
            id: "notif-" + Date.now(),
            type: "reservation",
            priority: "urgent",
            title: `New Online Reservation: ${randomCode}`,
            message: `${formData.name} booked a table for ${formData.guests} guests at ${formData.time} (${newBooking.outlet}).`,
            time: "Just now",
            read: false,
          };
          localStorage.setItem("chaat_admin_notifs", JSON.stringify([newNotif, ...currentNotifs]));

          // Broadcast to admin dashboard if open
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const channel = new BroadcastChannel("chaat_admin_bus");
            channel.postMessage({ type: "RESERVATION_ADDED", payload: newBooking, timestamp: Date.now() });
            channel.close();
          }
        } catch {
          // ignore
        }
        setStep("success");
      });
  };

  // Get current date in YYYY-MM-DD for min-date attribute
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeBooking()}>
      <DialogContent className="bg-espresso-deep border border-gold/20 text-cream max-w-lg p-0 rounded-2xl overflow-hidden shadow-2xl max-h-[90dvh] flex flex-col">
        <DialogHeader className="p-5 sm:p-6 md:p-8 pb-4 border-b border-white/5 shrink-0">
          <DialogTitle className="font-serif text-2xl md:text-3xl font-bold text-cream">
            {step === "success" ? "Booking Confirmed" : "Table Reservation"}
          </DialogTitle>
          <DialogDescription className="text-muted text-xs sm:text-sm mt-1">
            {step === "success"
              ? "Your spot has been successfully secured."
              : "Sip, snack, and smile. Let us prepare your table."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 sm:p-6 md:p-8 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait">
            {step === "form" && (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Location Selection */}
                <div className="space-y-2">
                  <label htmlFor="location" className="text-xs font-semibold text-gold tracking-wider uppercase">
                    Select Outlet
                  </label>
                  <select
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none transition-colors"
                  >
                    {locations.map((loc) => (
                      <option key={loc.name} value={loc.name} className="bg-espresso text-cream">
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label htmlFor="date" className="text-xs font-semibold text-gold tracking-wider uppercase">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      required
                      min={todayStr}
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none transition-colors scheme-dark"
                    />
                  </div>

                  {/* Guests Select */}
                  <div className="space-y-2">
                    <label htmlFor="guests" className="text-xs font-semibold text-gold tracking-wider uppercase">
                      Guests
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      required
                      value={formData.guests}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => (
                        <option key={num} value={num} className="bg-espresso text-cream">
                          {num} {num === 1 ? "Person" : "People"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Slots grid */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-gold tracking-wider uppercase mb-3">
                    Available Time Slots
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`py-2 text-xs font-semibold rounded-lg border transition-all duration-300 ${formData.time === time
                            ? "bg-gold border-gold text-espresso shadow-[0_0_15px_rgba(212,168,83,0.3)]"
                            : "bg-white/5 border-white/10 text-muted hover:border-gold/50 hover:text-cream"
                          }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-semibold text-gold tracking-wider uppercase">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      required
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-semibold text-gold tracking-wider uppercase">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-cream focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gold text-espresso py-3.5 rounded-xl font-bold tracking-wide uppercase hover:bg-amber transition-colors duration-200 mt-4 shadow-lg"
                >
                  Confirm Table Reservation
                </button>
              </motion.form>
            )}

            {step === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-16 text-center space-y-6"
              >
                {/* Premium spinner representing a boiling chai cup/pot */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-gold animate-spin" />
                  <div className="absolute inset-2.5 rounded-full border-4 border-white/5 border-b-amber animate-spin [animation-duration:1.5s]" />
                  <span className="absolute inset-0 flex items-center justify-center text-gold text-xl">☕</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-semibold text-cream">Brewing Your Reservation...</h3>
                  <p className="text-muted text-sm max-w-xs mx-auto">
                    We are securing your table at our {formData.location} café. Just a moment!
                  </p>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 pb-4"
              >
                {/* Success Checkmark Ring */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold border border-gold/30">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-gold">See You Soon!</h3>
                  <p className="text-muted text-sm">We are thrilled to serve you soon.</p>
                </div>

                {/* Ticket style details */}
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 overflow-hidden">
                  {/* Decorative side cutouts to look like a ticket */}
                  <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-6 bg-espresso-deep border-r border-white/10 rounded-r-full" />
                  <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-6 bg-espresso-deep border-l border-white/10 rounded-l-full" />

                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <span className="block text-[10px] text-gold font-semibold uppercase tracking-wider">Outlet</span>
                      <span className="font-medium text-cream">{formData.location}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] text-gold font-semibold uppercase tracking-wider">Booking Code</span>
                      <span className="font-mono font-bold text-cream text-base">{bookingCode}</span>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <span className="block text-[10px] text-gold font-semibold uppercase tracking-wider">Date & Time</span>
                      <span className="font-medium text-cream">{formData.date} at {formData.time}</span>
                    </div>
                    <div className="text-right border-t border-white/5 pt-3">
                      <span className="block text-[10px] text-gold font-semibold uppercase tracking-wider">Party Size</span>
                      <span className="font-medium text-cream">{formData.guests} {formData.guests === "1" ? "Guest" : "Guests"}</span>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <span className="block text-[10px] text-gold font-semibold uppercase tracking-wider">Reserved For</span>
                      <span className="font-medium text-cream">{formData.name}</span>
                    </div>
                    <div className="text-right border-t border-white/5 pt-3">
                      <span className="block text-[10px] text-gold font-semibold uppercase tracking-wider">Phone</span>
                      <span className="font-medium text-cream">{formData.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      alert("Successfully added to Calendar! 📅");
                    }}
                    className="flex-1 bg-white/5 border border-white/10 text-cream py-3 rounded-xl font-semibold text-sm hover:bg-white/10 hover:border-gold/30 transition-all"
                  >
                    Add to Calendar
                  </button>
                  <button
                    onClick={closeBooking}
                    className="flex-1 bg-gold text-espresso py-3 rounded-xl font-bold text-sm hover:bg-amber transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
