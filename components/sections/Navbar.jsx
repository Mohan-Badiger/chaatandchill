"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/content";
import { useBooking } from "@/lib/BookingContext";
import MagneticButton from "@/components/shared/MagneticButton";
import AnnouncementBanner from "@/components/shared/AnnouncementBanner";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastYRef = useRef(0);
  const pathname = usePathname();
  const { openBooking } = useBooking();

  useEffect(() => {
    const updateNavbar = () => {
      const y = window.scrollY;
      const lastY = lastYRef.current;
      setScrolled(y > 50);
      setHidden(y > 200 && y > lastY);
      lastYRef.current = y;

      const heroEl = document.getElementById("hero");
      if (heroEl) {
        const rect = heroEl.getBoundingClientRect();
        // While the hero component's bottom edge is below the navbar bottom, we are in the hero component
        setIsInHero(rect.bottom > 72);
      } else {
        setIsInHero(false);
      }
    };

    updateNavbar();
    const rafId = requestAnimationFrame(updateNavbar);

    window.addEventListener("scroll", updateNavbar, { passive: true });
    window.addEventListener("resize", updateNavbar, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateNavbar);
      window.removeEventListener("resize", updateNavbar);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        animate={{ y: hidden && !mobileOpen ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: isInHero
            ? "transparent"
            : scrolled
              ? "rgba(26, 23, 20, 0.95)"
              : "rgba(26, 23, 20, 0.45)",
          backdropFilter: isInHero ? "none" : "blur(12px)",
          WebkitBackdropFilter: isInHero ? "none" : "blur(12px)",
          borderBottom: isInHero
            ? "1px solid transparent"
            : scrolled
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        <AnnouncementBanner />
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 z-10 group">
            <span className="text-2xl font-serif font-bold tracking-tight text-cream transition-transform duration-300 group-hover:scale-102">
              Chaat
              <span className="text-gold">&nbsp;&&nbsp;</span>
              Chill
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors duration-200 py-1 inline-block ${
                      isActive
                        ? "text-gold font-semibold"
                        : "text-cream/80 hover:text-gold"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full shadow-[0_0_8px_rgba(212,168,83,0.8)]"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4 z-10">
            <MagneticButton
              onClick={() => openBooking()}
              className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 bg-gold text-espresso font-semibold text-sm rounded-full hover:bg-amber transition-colors duration-200 cursor-pointer shadow-md shadow-gold/10"
            >
              Reserve a Table
            </MagneticButton>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 cursor-pointer"
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-6 h-0.5 bg-cream rounded-full"
                animate={
                  mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }
                }
              />
              <motion.span
                className="block w-6 h-0.5 bg-cream rounded-full"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-cream rounded-full"
                animate={
                  mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }
                }
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-espresso flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="flex flex-col items-center gap-7 text-center">
              {navLinks.map((link, i) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-3xl font-serif transition-colors block py-1 ${
                        isActive
                          ? "text-gold font-bold drop-shadow-[0_0_12px_rgba(212,168,83,0.4)]"
                          : "text-cream hover:text-gold"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.button
                onClick={() => {
                  setMobileOpen(false);
                  openBooking();
                }}
                className="mt-6 px-8 py-3.5 bg-gold text-espresso font-semibold rounded-full cursor-pointer shadow-lg shadow-gold/20"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                Reserve a Table
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
