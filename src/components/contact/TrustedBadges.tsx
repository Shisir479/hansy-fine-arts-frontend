// src/components/contact/TrustedBadges.tsx
"use client";

import { motion } from "framer-motion";

const BADGES = [
  { id: 1, label: "Curated Editions" },
  { id: 2, label: "Museum Standard" },
  { id: 3, label: "Artist Support" },
  { id: 4, label: "Global Shipping" },
];

export default function TrustedBadges() {
  return (
    <div className=" overflow-hidden">
      <div className="bg-black text-white p-6 rounded-2xl">
        <h4 className="text-lg font-medium">Trusted & Recognized</h4>
        <p className="mt-2 text-sm text-white/70">
          Selected partnerships, curated programs & international
          collaborations.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-4"
        >
          {BADGES.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-white/05 backdrop-blur-sm rounded-xl p-3"
            >
              <div className="w-10 h-10  bg-white/10 flex items-center justify-center text-white">
                ●
              </div>
              <div className="text-white text-sm font-medium">{b.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
