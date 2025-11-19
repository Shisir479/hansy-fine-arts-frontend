// src/components/ArtShowcase.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * ArtShowcase - a minimal, unique animated gallery vignette.
 * - Drop into any page: <ArtShowcase />
 * - Uses Next/Image (public/*), Framer Motion (for animation)
 *
 * Notes:
 * - Place static images in public/: art-1.jpg, art-2.jpg, art-3.jpg
 * - If images missing, component falls back to SVG placeholders.
 */

type Card = {
  id: string;
  title: string;
  artist?: string;
  src?: string; // public path e.g. /art-1.jpg
};

const CARDS: Card[] = [
  { id: "a1", title: "Quiet Geometry", artist: "A. Rivera", src: "/art-1.jpg" },
  { id: "a2", title: "Threaded Memory", artist: "H. Yaegy", src: "/art-2.jpg" },
  { id: "a3", title: "Light Studies", artist: "M. K.", src: "/art-3.jpg" },
];

export default function ArtShowcase() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // pointer move -> small tilt values for cards
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function onMove(e: PointerEvent) {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      setPointer({ x: px - 0.5, y: py - 0.5 }); // center-origin
    }
    function onLeave() {
      setPointer({ x: 0, y: 0 });
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  };

  const cardEntrance = {
    hidden: (i: number) => ({ opacity: 0, y: 12 * (i + 1) }),
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.06 },
    }),
  };

  return (
    <section
      aria-labelledby="artshowcase-heading"
      className="relative max-w-5xl mx-auto px-6 py-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2
          id="artshowcase-heading"
          className="text-2xl md:text-3xl font-serif font-semibold text-zinc-900"
        >
          Featured Study — Recent Curations
        </h2>
        <p className="mt-3 text-sm text-zinc-600 max-w-xl mx-auto">
          A small vignette from the Amar Gallery collection — tactile, minimal,
          and curated for presence.
        </p>
      </div>

      <motion.div
        ref={containerRef}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="mt-10 relative flex justify-center items-center"
        aria-hidden={false}
      >
        {/* layered card layout */}
        <div className="relative w-full max-w-[920px] h-[420px] md:h-[480px]">
          {CARDS.map((card, i) => {
            // layout offsets for layered feeling
            const offsetX = (i - 1) * 48; // -48,0,48
            const offsetY = Math.abs(i - 1) * 10; // 10,0,10
            const scale = 1 - Math.abs(i - 1) * 0.04; // 0.96..1.04
            // tilt from pointer (small)
            const tiltX = pointer.y * (6 - i); // varying sensitivity
            const tiltY = pointer.x * (8 - i);

            return (
              <motion.div
                key={card.id}
                custom={i}
                variants={cardEntrance}
                style={{ zIndex: 50 + i }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                // animate tilt & position dynamically (smaller movements if reduced motion)
                animate={{
                  x: offsetX,
                  y: offsetY,
                  scale: scale,
                  rotateX: reduced ? 0 : -tiltX,
                  rotateY: reduced ? 0 : tiltY,
                }}
                transition={{ type: "spring", stiffness: 80, damping: 14 }}
              >
                <figure
                  className="w-[260px] md:w-[320px] h-[360px] md:h-[420px] bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative w-full h-2/3 bg-zinc-100">
                    {card.src ? (
                      <Image
                        src={card.src}
                        alt={`${card.title} — ${card.artist ?? ""}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          width="120"
                          height="120"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="3"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M6 16l4-6 6 8"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <figcaption className="p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-zinc-900">
                          {card.title}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">
                          {card.artist}
                        </div>
                      </div>

                      <div className="text-xs text-zinc-400">•</div>
                    </div>
                  </figcaption>
                </figure>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* subtle footer caption */}
      <div className="mt-8 text-center">
        <p className="text-xs text-zinc-500">
          Each piece shown as a study — images are placeholders. Replace with
          high-res originals in{" "}
          <code className="bg-zinc-50 px-1 rounded">public/</code>.
        </p>
      </div>
    </section>
  );
}
