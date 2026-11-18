"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SectionReveal from "@/components/shared/SectionReveal";

const showcaseDishes = [
  {
    id: 1,
    title: "Margherita Classica Pizza",
    description:
      "Hand-stretched sourdough crust with San Marzano tomato sauce, fresh buffalo mozzarella, aromatic basil, and a drizzle of extra virgin olive oil. Classic, bubbly, and baked to perfection.",
    leftTag: "Sourdough Crust,\nWood-Fired",
    rightTag: "Fresh Buffalo\nMozzarella",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Classic Crispy Veggie Burger",
    description:
      "Golden crumb-coated potato and herb patty, crisp iceberg lettuce, ripe farm tomatoes, pickled gherkins, and our secret burger sauce in a toasted brioche bun.",
    leftTag: "Brioche Bun,\nCrunchy Patty",
    rightTag: "Melted Cheddar &\nSecret Aioli",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Peri-Peri Masala Finger Chips",
    description:
      "Golden crisp-fried potato finger chips generously dusted with our fiery African bird's eye peri-peri spice blend and lemon zest. Served hot with garlic dip.",
    leftTag: "Golden, Crisp,\nPiping-Hot",
    rightTag: "Fiery African\nPeri-Peri Dust",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Belgian Dark Chocolate Fudge Sundae",
    description:
      "Two scoops of 70% dark Belgian chocolate ice cream layered over warm fudge brownie chunks, hot chocolate fudge sauce, and roasted almonds.",
    leftTag: "Rich 70% Cocoa,\nWarm Brownie",
    rightTag: "Hot Fudge &\nRoasted Almonds",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    title: "Classic Cold Coffee with Ice Cream",
    description:
      "Double shot of fresh Arabica espresso blended thick with chilled whole milk, topped with a velvety scoop of vanilla bean ice cream and cocoa dusting.",
    leftTag: "Arabica Roast,\nThick & Creamy",
    rightTag: "Vanilla Ice Cream\nTopping",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
  },
];

export default function MenuShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);

  const activeDish = showcaseDishes[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? showcaseDishes.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === showcaseDishes.length - 1 ? 0 : prev + 1
    );
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="menu"
      className="relative py-16 sm:py-28 md:py-36 bg-cream overflow-hidden scroll-mt-24 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
          <SectionReveal>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-espresso tracking-tight">
              A Taste of <span className="text-amber">Tradition</span>
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <p className="text-espresso/60 text-xs sm:text-sm md:text-base leading-relaxed mt-3 sm:mt-4 max-w-2xl mx-auto font-sans">
              From steaming idlis and crispy dosas to filter coffee that warms
              your soul, our menu celebrates the best of South Indian cuisine.
              Every dish is crafted with fresh ingredients, traditional methods,
              and a dash of innovation.
            </p>
          </SectionReveal>
        </div>

        {/* Main Showcase: Left Tag (Desktop), Center Plate with touch swipe, Right Tag (Desktop) */}
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-4 my-4 sm:my-10">
          {/* Left Callout Text (Desktop magazine style) */}
          <div className="hidden lg:flex w-1/4 text-right items-center justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDish.id + "-left"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-espresso/80 whitespace-pre-line leading-[1.18]"
              >
                {activeDish.leftTag}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Center Stage: Dish Image + Touch Swipe + Nav Arrows */}
          <div
            className="relative flex items-center justify-center shrink-0"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Nav Arrow Button */}
            <button
              onClick={handlePrev}
              aria-label="Previous dish"
              className="absolute -left-3 sm:-left-8 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-espresso/15 shadow-md flex items-center justify-center text-espresso/70 hover:text-espresso hover:border-gold hover:scale-105 active:scale-95 transition-all duration-300 z-30 cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Nav Arrow Button */}
            <button
              onClick={handleNext}
              aria-label="Next dish"
              className="absolute -right-3 sm:-right-8 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 border border-espresso/15 shadow-md flex items-center justify-center text-espresso/70 hover:text-espresso hover:border-gold hover:scale-105 active:scale-95 transition-all duration-300 z-30 cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* Center Dish Container: Sharp Square, Responsive Fit */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 shadow-2xl bg-espresso overflow-hidden touch-pan-y">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeDish.id}
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeDish.image}
                    alt={activeDish.title}
                    fill
                    quality={80}
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, 384px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Callout Text (Desktop magazine style) */}
          <div className="hidden lg:flex w-1/4 text-left items-center justify-start lg:pt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDish.id + "-right"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-espresso/80 whitespace-pre-line leading-[1.18]"
              >
                {activeDish.rightTag}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dish Dots Navigation for mobile & all screens */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {showcaseDishes.map((dish, idx) => (
            <button
              key={dish.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to dish ${dish.title}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? "w-8 bg-amber"
                  : "w-2 bg-espresso/20 hover:bg-espresso/40"
              }`}
            />
          ))}
        </div>

        {/* Bottom Area: Dish Title, Description, and View All Menu CTA */}
        <div className="text-center max-w-2xl mx-auto mt-6 sm:mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDish.id + "-info"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-espresso mb-3">
                {activeDish.title}
              </h3>
              <p className="text-espresso/70 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-8 font-sans">
                {activeDish.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* View All Menu CTA Pill Button */}
          <div className="inline-block">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-espresso/20 bg-white/70 hover:bg-gold hover:border-gold hover:text-espresso text-espresso font-medium text-xs sm:text-sm tracking-wide transition-all shadow-xs group cursor-pointer"
            >
              <span className="text-sm font-semibold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
              <span>View All Menu</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
