"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionReveal from "@/components/shared/SectionReveal";
import MagneticButton from "@/components/shared/MagneticButton";

// Category items structured exactly as on therameshwaramcafe.org/menu/
const defaultMenuSections = [
  {
    id: "morning-show",
    title: "Stars of the Morning\nShow",
    description:
      "Our full menu is bigger than your appetite — so head over to your nearest Rameshwaram Cafe and discover every bite of bliss!",
    items: [
      {
        id: "ghee-khali-dosa",
        title: "Ghee Khali Dosa",
        image: "/images/food-khali-dosa.jpg",
      },
      {
        id: "ghee-onion-dosa",
        title: "Ghee Onion Dosa",
        image: "/images/food-onion-dosa.jpg",
      },
      {
        id: "butter-idli",
        title: "Butter Idli",
        image: "/images/food-idli.jpg",
      },
      {
        id: "open-butter-masala",
        title: "Open Butter Masala",
        image: "/images/food-dosa.jpg",
      },
      {
        id: "butter-masala-dosa",
        title: "Butter Masala Dosa",
        image: "/images/menu-hero-dosa.jpg",
      },
    ],
  },
  {
    id: "bite-sized",
    title: "Bite-Sized\nBlockbusters",
    description:
      "Crispy, spicy, and utterly unforgettable — the supporting cast that steals the show.",
    items: [
      {
        id: "crispy-medu-vada",
        title: "Crispy Medu Vada",
        image: "/images/food-vada.jpg",
      },
      {
        id: "ambode",
        title: "Ambode",
        image: "/images/food-vada.jpg",
      },
      {
        id: "bhajji",
        title: "Bhajji",
        image: "/images/food-vada.jpg",
      },
      {
        id: "aloo-bonda",
        title: "Aloo Bonda",
        image: "/images/food-vada.jpg",
      },
      {
        id: "ghee-podi-mini-idli",
        title: "Ghee Podi Mini Idli",
        image: "/images/food-idli.jpg",
      },
      {
        id: "gulab-jamun",
        title: "Gulab Jamun",
        image: "/images/food-kesaribath.jpg",
      },
      {
        id: "pootharekulu",
        title: "Pootharekulu",
        image: "/images/food-kesaribath.jpg",
      },
    ],
  },
  {
    id: "grand-finale",
    title: "Grand Finale &\nComfort Classics",
    description:
      "Sweet, tangy, or wholesome — the dishes that leave you clapping for an encore.",
    items: [
      {
        id: "kesari-bath",
        title: "Kesari Bath",
        image: "/images/food-kesaribath.jpg",
      },
      {
        id: "coconut-rice",
        title: "Coconut Rice",
        image: "/images/food-kesaribath.jpg",
      },
      {
        id: "puliyogare-curd-rice",
        title: "Puliyogare & Curd Rice",
        image: "/images/food-kesaribath.jpg",
      },
      {
        id: "lemon-rice",
        title: "Lemon Rice",
        image: "/images/food-kesaribath.jpg",
      },
      {
        id: "tomato-rice",
        title: "Tomato Rice",
        image: "/images/food-kesaribath.jpg",
      },
      {
        id: "degree-filter-coffee",
        title: "Degree Filter Coffee",
        image: "/images/food-filtercoffee.jpg",
      },
    ],
  },
];

// Outlets for "Hungry for More?" section
const outletsList = [
  {
    city: "Pune",
    badge: "Launching Soon in 2026",
    desc: "The New Adda directions and location details coming soon — Get ready with an empty stomach for the launch!",
  },
  {
    city: "Mumbai",
    badge: "Launching Soon in 2026",
    desc: "The New Adda directions and location details coming soon — Get ready with an empty stomach for the launch!",
  },
  {
    city: "Dubai",
    badge: "Launching Soon in 2026",
    desc: "The New Adda directions and location details coming soon — Get ready with an empty stomach for the launch!",
  },
  {
    city: "Bangalore International Airport",
    badge: "Newly Launched 2025",
    desc: "Gate 34, Terminal 1, Bangalore, Gangamuthanahalli, Karnataka 560300",
  },
  {
    city: "Indiranagar 100ft Road",
    badge: "Newly Launched 2025",
    desc: "847/1 (Old No. 847/A), Binnamangala 1st Stage, 100 Feet Rd, Bengaluru, Karnataka 560038",
  },
  {
    city: "Madhapur",
    badge: "Launched in 2024",
    desc: "72, Capital Pk Rd, beside Jain Sadguru Capital Park, Cyber Hills Colony, VIP Hills, Madhapur, Hyderabad 500081",
  },
  {
    city: "Rajajinagar",
    badge: "Launched in 2023",
    desc: "27, Dr Rajkumar Rd, Milk Colony, Subramanyanagar, Rajajinagar, Bengaluru, Karnataka 560055",
  },
  {
    city: "JP Nagar",
    badge: "Launched in 2021",
    desc: "52, Outer Ring Rd, Jeewan Griha Colony, 2nd Phase, J. P. Nagar, Bengaluru, Karnataka 560078",
  },
];

// Horizontal Carousel Component with sleek navigation arrows
function MenuRowCarousel({ items }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-8 pt-2 select-none -mx-6 px-6 lg:-mx-10 lg:px-10"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-60 sm:w-80 md:w-90 shrink-0 flex flex-col"
          >
            {/* Square Food Image with black background - strictly square with NO border or rounded corners */}
            <div className="relative aspect-square w-full overflow-hidden bg-black shadow-md">
              <Image
                src={item.image}
                alt={item.title}
                fill
                quality={75}
                className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                sizes="(max-width: 640px) 240px, (max-width: 1200px) 360px, 360px"
              />
            </div>

            {/* Clean Serif Caption below the image with live price tag */}
            <div className="flex items-center justify-between mt-2.5 sm:mt-3 gap-2">
              <h3 className="font-serif text-base sm:text-xl text-espresso font-normal tracking-wide">
                {item.title}
              </h3>
              {item.price && (
                <span className="font-mono text-xs sm:text-sm font-semibold text-espresso bg-espresso/5 border border-espresso/10 px-2.5 py-0.5 rounded-full shrink-0">
                  ₹{item.price}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Right Navigation Arrow Button (Desktop / Tablet) */}
      <button
        onClick={() => handleScroll("right")}
        aria-label="Scroll menu items right"
        className="hidden sm:flex absolute right-2 top-1/2 -translate-y-10 z-20 w-11 h-11 rounded-full bg-espresso-deep text-white items-center justify-center shadow-2xl hover:bg-gold hover:text-espresso transition-all duration-300 cursor-pointer opacity-90 hover:opacity-100"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Left Navigation Arrow Button (Desktop / Tablet) */}
      <button
        onClick={() => handleScroll("left")}
        aria-label="Scroll menu items left"
        className="hidden sm:flex absolute left-2 top-1/2 -translate-y-10 z-20 w-11 h-11 rounded-full bg-espresso-deep text-white items-center justify-center shadow-2xl hover:bg-gold hover:text-espresso transition-all duration-300 cursor-pointer opacity-90 hover:opacity-100"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
}

export default function MenuView() {
  const [sections, setSections] = useState(defaultMenuSections);

  const syncLiveItems = useCallback((liveItems) => {
    if (!Array.isArray(liveItems) || liveItems.length === 0) return;

    setSections((prev) => {
      return prev.map((sec) => {
        const secId = sec.id;
        const matchingLive = liveItems.filter((item) => {
          if (!item.isAvailable) return false;
          const cat = (item.category || "").toLowerCase();
          if (secId === "morning-show") {
            return cat.includes("morning") || cat.includes("dosa") || cat.includes("idli");
          }
          if (secId === "bite-sized") {
            return cat.includes("bite") || cat.includes("vada") || cat.includes("snack");
          }
          if (secId === "grand-finale") {
            return cat.includes("finale") || cat.includes("comfort") || cat.includes("coffee") || cat.includes("rice") || cat.includes("dessert");
          }
          return false;
        });

        // Merge: update default items with live price & title
        const map = new Map();
        sec.items.forEach((item) => {
          const match = liveItems.find(
            (li) => li.title?.toLowerCase().trim() === item.title?.toLowerCase().trim()
          );
          if (match) {
            if (match.isAvailable) {
              map.set(item.id, {
                ...item,
                title: match.title,
                price: match.price,
                image: match.image || item.image,
              });
            }
          } else {
            map.set(item.id, item);
          }
        });

        // Append any new dishes created by admin in this category
        matchingLive.forEach((li) => {
          const exists = Array.from(map.values()).some(
            (m) => m.title?.toLowerCase().trim() === li.title?.toLowerCase().trim()
          );
          if (!exists) {
            map.set(li.id, {
              id: li.id,
              title: li.title,
              price: li.price,
              image: li.image || "/images/food-dosa.jpg",
            });
          }
        });

        return { ...sec, items: Array.from(map.values()) };
      });
    });
  }, []);

  useEffect(() => {
    // 1. Instant check from localStorage
    try {
      const stored = localStorage.getItem("chaat_admin_menu");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          syncLiveItems(parsed);
        }
      }
    } catch {}

    // 2. Fetch live data from /api/menu
    fetch("/api/menu")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.items)) {
          syncLiveItems(json.items);
        }
      })
      .catch(() => {});

    // 3. Listen to live broadcast channel from Admin panel
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("chaat_admin_bus");
      channel.onmessage = (e) => {
        if (e.data?.type?.startsWith("MENU_")) {
          fetch("/api/menu")
            .then((r) => r.json())
            .then((j) => j.success && syncLiveItems(j.items))
            .catch(() => {});
        }
      };
      return () => channel.close();
    }
  }, [syncLiveItems]);
  return (
    <div className="bg-cream text-espresso min-h-screen overflow-hidden">
      {/* =====================================================================
          1. HERO SECTION: "Warning: Cravings Ahead" with Sacred Watermark & Wide Dosa Image
          ===================================================================== */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 relative">
        {/* Subtle Mandala / Floral Line Art Watermark Motif */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-85 sm:w-115 h-85 sm:h-115 pointer-events-none opacity-20 z-0">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g stroke="#D4A853" strokeWidth="1.2" strokeOpacity="0.85">
              <circle cx="100" cy="100" r="45" />
              <circle cx="100" cy="100" r="75" strokeDasharray="3 3" />
              <path d="M100 10 C120 55 120 145 100 190 C80 145 80 55 100 10 Z" />
              <path d="M10 100 C55 120 145 120 190 100 C145 80 55 80 10 100 Z" />
              <path d="M36 36 C80 55 145 120 164 164 C120 145 55 80 36 36 Z" />
              <path d="M164 36 C120 55 55 120 36 164 C80 145 145 80 164 36 Z" />
              <circle cx="100" cy="100" r="18" fill="#D4A853" fillOpacity="0.1" />
            </g>
          </svg>
        </div>

        {/* Centered Heading */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mb-12 sm:mb-16">
          <motion.h1
            className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal text-espresso leading-[1.08] tracking-tight"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Warning:
            <br />
            Cravings Ahead
          </motion.h1>
        </div>

        {/* Massive Wide Hero Dosa Image Container */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div
            className="relative w-full aspect-video sm:aspect-21/9 overflow-hidden bg-black shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <Image
              src="/images/menu-hero-dosa.jpg"
              alt="Crisp Ghee Masala Dosa with butter, chutneys and sambhar on black plate"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          2. MENU CATEGORY ROWS (STARS OF THE MORNING SHOW, BITE-SIZED, GRAND FINALE)
          ===================================================================== */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 space-y-24 sm:space-y-32 py-12 sm:py-20">
        {sections.map((section) => (
          <section key={section.id} className="relative">
            {/* Header Layout: Left Title, Right Subtitle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
              <SectionReveal>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-espresso leading-[1.15] font-normal whitespace-pre-line">
                  {section.title}
                </h2>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <p className="text-[#665e55] text-xs sm:text-sm md:text-[14px] leading-relaxed max-w-md font-sans">
                  {section.description}
                </p>
              </SectionReveal>
            </div>

            {/* Horizontal Slider with Square Images and Clean Serif Titles */}
            <SectionReveal delay={0.2}>
              <MenuRowCarousel items={section.items} />
            </SectionReveal>
          </section>
        ))}
      </div>

      {/* =====================================================================
          3. "HUNGRY FOR MORE?" & OUTLET FOOTPRINT
          ===================================================================== */}
      <section className="py-24 md:py-32 bg-cream border-t border-espresso/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionReveal>
              <h2 className="font-serif text-4xl sm:text-6xl font-normal text-espresso mb-4">
                Hungry for More?
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <p className="text-[#665e55] text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                We are constantly growing and our menus are evolving. Experience more at your nearest outlet.
              </p>
            </SectionReveal>
          </div>

          {/* 3 Metric Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-20 text-center">
            <SectionReveal delay={0.15}>
              <div>
                <div className="font-serif text-5xl sm:text-6xl font-normal text-espresso mb-1">
                  9 Outlets
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.25}>
              <div>
                <div className="font-serif text-5xl sm:text-6xl font-normal text-espresso mb-1">
                  2 Cities
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.35}>
              <div>
                <div className="font-serif text-5xl sm:text-6xl font-normal text-espresso mb-1">
                  120+ Menu Items
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Outlets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {outletsList.map((outlet, idx) => (
              <SectionReveal key={idx} delay={0.1 + idx * 0.05}>
                <div className="p-8 bg-white border border-[#E8DED1] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber block mb-2 font-semibold">
                      {outlet.badge}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-espresso mb-3">
                      {outlet.city}
                    </h3>
                    <p className="text-[#665e55] text-sm leading-relaxed mb-6">
                      {outlet.desc}
                    </p>
                  </div>

                  <div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-amber hover:text-espresso transition-colors"
                    >
                      <span>Get Direction</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          {/* Bottom CTA Button */}
          <div className="mt-16 text-center">
            <SectionReveal>
              <MagneticButton
                as={Link}
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-espresso-deep text-white font-semibold text-sm rounded-full hover:bg-gold hover:text-espresso transition-all duration-300 shadow-xl cursor-pointer"
              >
                <span>Find Your Nearest Adda</span>
                <span>↗</span>
              </MagneticButton>
            </SectionReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
