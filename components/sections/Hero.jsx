"use client";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { heroContent } from "@/lib/content";

export default function Hero() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-espresso scroll-mt-24 px-4 sm:px-6"
    >
      {/* Background images — responsive mobile vs desktop */}
      <div className="absolute inset-0 z-0">
        {/* Small screens (mobile & portrait tablets) */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src="/images/hero-luxury-mobile.jpg"
            alt="Modern luxury interior of Chaat & Chill Café with artisanal chai and gourmet chaat"
            fill
            priority
            quality={85}
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1px"
          />
        </div>

        {/* Big screens (desktop & landscape tablets) */}
        <div className="hidden md:block absolute inset-0">
          <Image
            src="/images/hero-luxury.jpg"
            alt="Modern luxury interior of Chaat & Chill Café with artisanal chai and gourmet chaat"
            fill
            priority
            quality={85}
            className="object-cover object-center"
            sizes="(min-width: 768px) 100vw, 1px"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-b from-espresso/80 via-espresso/50 to-espresso/90" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-16 sm:pt-0"
        style={prefersReduced ? {} : { opacity }}
      >
        <motion.p
          className="eyebrow text-gold mb-3 sm:mb-4 tracking-[0.2em] sm:tracking-[0.25em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroContent.eyebrow}
        </motion.p>

        <motion.h1
          className="font-serif text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-cream leading-[1.02] sm:leading-[0.95] mb-4 sm:mb-6 tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {heroContent.headline}
        </motion.h1>

        <motion.p
          className="font-serif text-xl sm:text-3xl md:text-4xl text-gold/90 mb-6 italic"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {heroContent.subheadline}
        </motion.p>
      </motion.div>
    </section>
  );
}
