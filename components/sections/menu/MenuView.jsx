"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import SectionReveal from "@/components/shared/SectionReveal";
import MagneticButton from "@/components/shared/MagneticButton";

// Default Cafe Menu Sections with authentic cafe items
const defaultMenuSections = [
  {
    id: "pizzas",
    title: "Artisanal Wood-Fired\nPizzas",
    description:
      "Hand-stretched sourdough crusts baked to bubbly perfection, layered with rich San Marzano tomato sauce and molten mozzarella.",
    items: [
      {
        id: "item-pz-01",
        title: "Margherita Classica Pizza",
        price: 260,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-pz-02",
        title: "Farmhouse Gourmet Pizza",
        price: 320,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-pz-03",
        title: "Paneer Tikka Supreme Pizza",
        price: 340,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-pz-04",
        title: "Fiery Peri-Peri Veggie Pizza",
        price: 310,
        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-pz-05",
        title: "BBQ Paneer & Onion Pizza",
        price: 330,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "burgers",
    title: "Gourmet Burgers &\nGrilled Sandwiches",
    description:
      "Golden crispy patties, flame-grilled fillings, melted cheddar cheese, and signature house sauces in toasted brioche buns.",
    items: [
      {
        id: "item-bg-01",
        title: "Classic Crispy Veggie Burger",
        price: 180,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bg-02",
        title: "Smoky BBQ Paneer Burger",
        price: 220,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bg-03",
        title: "Double Cheese Jalapeño Crunch",
        price: 210,
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bg-04",
        title: "Grilled Pesto & Mozzarella Panini",
        price: 200,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bg-05",
        title: "Bombay Club Grilled Sandwich",
        price: 170,
        image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "finger-chips",
    title: "Crispy Finger Chips &\nLoaded Starters",
    description:
      "Golden-fried potato finger chips, fiery peri-peri dust, molten cheese sauce, and crunchy pull-apart mozzarella sticks.",
    items: [
      {
        id: "item-fc-01",
        title: "Classic Golden Finger Chips",
        price: 130,
        image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-fc-02",
        title: "Peri-Peri Masala Finger Chips",
        price: 150,
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-fc-03",
        title: "Cheesy Loaded Finger Chips",
        price: 190,
        image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-fc-04",
        title: "Cheesy Garlic Breadsticks",
        price: 170,
        image: "https://images.unsplash.com/photo-1619895092538-128341789043?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-fc-05",
        title: "Crispy Mozzarella Cheese Sticks",
        price: 210,
        image: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-fc-06",
        title: "Crispy Nachos Grande with Cheese",
        price: 180,
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "ice-creams",
    title: "Artisanal Ice Creams &\nDecadent Sundaes",
    description:
      "Rich Belgian chocolate, churned Ratnagiri mango gelato, retro banana splits, and legendary death by chocolate sundaes.",
    items: [
      {
        id: "item-ic-01",
        title: "Belgian Dark Chocolate Fudge Sundae",
        price: 195,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-ic-02",
        title: "Alphonso Mango Swirl Ice Cream",
        price: 160,
        image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-ic-03",
        title: "Classic American Banana Split",
        price: 220,
        image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-ic-04",
        title: "Death by Chocolate (DBC) Sundae",
        price: 230,
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-ic-05",
        title: "Wild Strawberry Swirl Waffle",
        price: 210,
        image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    id: "beverages",
    title: "Shakes, Coolers &\nCold Brews",
    description:
      "Thick brewed Arabica iced coffees, decadent Nutella hazelnut milkshakes, and refreshing hand-muddled virgin mint mojitos.",
    items: [
      {
        id: "item-bv-01",
        title: "Classic Cold Coffee with Ice Cream",
        price: 160,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bv-02",
        title: "Thick Nutella Hazelnut Shake",
        price: 210,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bv-03",
        title: "Iced Caramel Macchiato",
        price: 180,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bv-04",
        title: "Fresh Virgin Mint Mojito",
        price: 140,
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80",
      },
      {
        id: "item-bv-05",
        title: "Belgian Chocolate Thickshake",
        price: 190,
        image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
];

// Outlets for "Hungry for More?" section
const outletsList = [
  {
    city: "Jamakhandi Flagship",
    badge: "Open Everyday",
    desc: "Navanagar Main Road, Near KSRTC Bus Stand, Jamakhandi 587301",
  },
  {
    city: "Rabakavi Adda",
    badge: "Open Everyday",
    desc: "Main Market Road, Rabakavi Banhatti 587311",
  },
  {
    city: "Bangalore",
    badge: "Launching Soon in 2026",
    desc: "Indiranagar 100ft Road & Koramangala Hubs — Getting ready for the launch!",
  },
  {
    city: "Pune",
    badge: "Launching Soon in 2026",
    desc: "FC Road & Koregaon Park — Premium wood-fired pizza & burger lounge coming soon!",
  },
  {
    city: "Mumbai",
    badge: "Launching Soon in 2026",
    desc: "Bandra West & Juhu — Artisanal cafe experience coming soon!",
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
            {/* Square Food Image */}
            <div className="relative aspect-square w-full overflow-hidden bg-black shadow-md rounded-lg">
              <Image
                src={item.image}
                alt={item.title}
                fill
                quality={80}
                className="object-cover transition-transform duration-500 ease-out hover:scale-105"
                sizes="(max-width: 640px) 240px, (max-width: 1200px) 360px, 360px"
              />
            </div>

            {/* Clean Caption with live price tag */}
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

      {/* Right Navigation Arrow Button */}
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

      {/* Left Navigation Arrow Button */}
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

    // Filter out old legacy items if any lingered in storage
    const validItems = liveItems.filter(
      (item) => item.category !== "Stars of the Morning Show" && item.isAvailable
    );
    if (validItems.length === 0) return;

    const categoryDescriptions = {
      "Pizzas & Flatbreads":
        "Hand-stretched sourdough crusts baked to bubbly perfection, layered with rich San Marzano tomato sauce and molten mozzarella.",
      "Gourmet Burgers & Sandwiches":
        "Golden crispy patties, flame-grilled fillings, melted cheddar cheese, and signature house sauces in toasted brioche buns.",
      "Finger Chips & Starters":
        "Golden-fried potato finger chips, fiery peri-peri dust, molten cheese sauce, and crunchy pull-apart mozzarella sticks.",
      "Artisanal Ice Creams & Sundaes":
        "Rich Belgian chocolate, churned Ratnagiri mango gelato, retro banana splits, and legendary death by chocolate sundaes.",
      "Shakes, Coolers & Cold Brews":
        "Thick brewed Arabica iced coffees, decadent Nutella hazelnut milkshakes, and refreshing hand-muddled virgin mint mojitos.",
    };

    const grouped = new Map();
    validItems.forEach((item) => {
      const cat = item.category || "Cafe Specials";
      if (!grouped.has(cat)) {
        grouped.set(cat, []);
      }
      grouped.get(cat).push({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      });
    });

    const newSections = Array.from(grouped.entries()).map(([catName, items]) => ({
      id: catName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      title: catName.replace(" & ", " &\n"),
      description:
        categoryDescriptions[catName] ||
        "Freshly handcrafted with premium ingredients for the ultimate cafe experience.",
      items,
    }));

    if (newSections.length > 0) {
      setSections(newSections);
    }
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
          1. HERO SECTION: "Warning: Cravings Ahead" with Cafe Spread Image
          ===================================================================== */}
      <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 relative">
        {/* Subtle Decorative Line Art Motif */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-85 sm:w-115 h-85 sm:h-115 pointer-events-none opacity-20 z-0">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g stroke="#D4A853" strokeWidth="1.2" strokeOpacity="0.85">
              <circle cx="100" cy="100" r="45" />
              <circle cx="100" cy="100" r="75" strokeDasharray="3 3" />
              <path d="M100 10 C120 55 120 145 100 190 C80 145 80 55 100 10 Z" />
              <path d="M10 100 C55 120 145 120 190 100 C145 80 55 80 10 100 Z" />
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

        {/* Hero Cafe Pizza & Burger Banner */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div
            className="relative w-full aspect-video sm:aspect-21/9 overflow-hidden bg-black shadow-2xl rounded-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&auto=format&fit=crop&q=85"
              alt="Artisanal wood-fired pizza and gourmet cafe spread"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          2. MENU CATEGORY ROWS (PIZZAS, BURGERS, FINGER CHIPS, ICE CREAMS, SHAKES)
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

            {/* Horizontal Slider with Food Cards */}
            <SectionReveal delay={0.2}>
              <MenuRowCarousel items={section.items} />
            </SectionReveal>
          </section>
        ))}
      </div>

      {/* =====================================================================
          3. "HUNGRY FOR MORE?" & OUTLETS
          ===================================================================== */}
      <section className="py-24 md:py-32 bg-cream border-t border-espresso/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <SectionReveal>
              <h2 className="font-serif text-4xl sm:text-6xl font-normal text-espresso mb-4">
                Hungry for More?
              </h2>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <p className="text-[#665e55] text-base sm:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                Visit our nearest cafe outlet for piping-hot woodfired pizzas, crispy burgers, loaded finger chips, and rich sundaes.
              </p>
            </SectionReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outletsList.map((outlet, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl border border-espresso/10 bg-white/50 backdrop-blur-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-espresso font-normal">{outlet.city}</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark font-medium border border-gold/20">
                    {outlet.badge}
                  </span>
                </div>
                <p className="text-xs text-[#665e55] leading-relaxed">{outlet.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/contact">
              <MagneticButton variant="primary">Visit Our Cafe Outlets</MagneticButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
