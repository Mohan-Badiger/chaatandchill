"use client";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { heroContent as defaultHeroContent } from "@/lib/content";
import { useCms } from "@/lib/useCms";

export default function Hero() {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const { cmsContent } = useCms();

  const eyebrowText = cmsContent?.heroBanner?.badge || defaultHeroContent.eyebrow;
  const headlineText = cmsContent?.heroBanner?.headline || defaultHeroContent.headline;
  const rawSubheadline = cmsContent?.heroBanner?.subheadline || defaultHeroContent.subheadline;
  const subheadlineText = rawSubheadline
    ?.replace(/\s*Where street food heritage meets luxury café soul\.?/gi, "")
    ?.trim();

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
        className="relative z-10 text-center px-4 sm:px-6 max-w-4xl lg:max-w-5xl mx-auto pt-24 sm:pt-20 pb-12 sm:pb-16 flex flex-col items-center"
        style={prefersReduced ? {} : { opacity }}
      >
        {/* Ambient warm glow behind headline */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-125 h-55 sm:h-75 bg-gold/10 blur-[90px] sm:blur-[130px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />

        {eyebrowText && (
          <motion.div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/25 backdrop-blur-md mb-4 sm:mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="eyebrow text-gold text-[10px] sm:text-xs tracking-[0.22em] font-medium uppercase">
              {eyebrowText}
            </span>
          </motion.div>
        )}

        <motion.h1
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold text-cream leading-[1.14] sm:leading-[1.08] lg:leading-[1.04] tracking-tight sm:tracking-[-0.015em] max-w-4xl lg:max-w-5xl mx-auto mb-4 sm:mb-6 text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        >
          {headlineText}
        </motion.h1>

        {subheadlineText && (
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="w-6 sm:w-12 h-px bg-linear-to-r from-transparent to-gold/60" />
            <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-gold/95 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
              {subheadlineText}
            </p>
            <span className="w-6 sm:w-12 h-px bg-linear-to-l from-transparent to-gold/60" />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
