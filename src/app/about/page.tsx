"use client";

import { useState } from "react";
import { Award, Palette, Users, Globe, ArrowUpRight } from "lucide-react";

export default function AboutSection() {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const stats = [
    { id: "exhibitions", icon: Globe, number: "150+", label: "Exhibitions" },
    {
      id: "artworks",
      icon: Palette,
      number: "500+",
      label: "Artworks Created",
    },
    { id: "awards", icon: Award, number: "25+", label: "Awards Won" },
    {
      id: "collectors",
      icon: Users,
      number: "1000+",
      label: "Happy Collectors",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
      {/* Decorative elements */}

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      ></div>
      <div className="absolute inset-0 dark:opacity-5 pointer-events-none opacity-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "80px 80px"
        }}
      />

      {/* MODIFIED: Added responsiveness to padding for better mobile consumption */}
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          {/* MODIFIED: Reduced margins and text sizes for mobile */}
          <div className="mb-16 md:mb-24">
            <div className="flex items-center gap-4 mb-4 md:mb-8">
              <div className="w-10 md:w-16 h-px bg-neutral-900 dark:bg-white"></div>
              <span className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500">
                Captain Hans Yaeggy
              </span>
            </div>
            <h1 className="md:text-5xl text-3xl font-extralight tracking-tight leading-none italic">
              Watercolor Artist & Airline Captain
            </h1>
          </div>

          {/* Main Content Grid */}
          {/* MODIFIED: Reduced gap and margin for mobile. Set grid to 1 column on small screens. */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md: gap-32 mb-20 md:mb-40 items-center">
            {/* Left Side - Image */}
            <div className="relative mx-auto w-full max-w-md lg: max-w-lg">
              {/* Simple floating border */}
              <div className="absolute -top-3 -left-3 w-full h-full border border-neutral-300 dark:border-neutral-700 transition-all duration-500"></div>

              {/* Image container */}
              <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                <img
                  src="/hans-about-ThArMNlV.jpg"
                  alt="Artist Portrait"
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Simple badge */}
              <div className="absolute md:-bottom-6 -bottom-12 md:-right-6 -right-2 bg-neutral-900 dark:bg-white text-white dark:text-black p-4 md:p-8">
                <div className="text-3xl md:text-5xl font-light mb-1">15+</div>
                <div className="text-[10px] tracking-[0.3em] uppercase opacity-90">
                  Years Experience
                </div>
              </div>
            </div>

            {/* Right Side - Content - YOUR ORIGINAL CONTENT */}
            <div className="flex flex-col justify-center space-y-6 md:space-y-8">
              <div>
                {/* MODIFIED:  Reduced text-4xl to text-3xl for mobile */}
                <h2 className="text-3xl md:text-4xl font-extralight mb-4 md:mb-6 leading-tight">
                  Capturing Serenity and Awe from 30,000 Feet
                </h2>
                <div className="w-16 md:w-24 h-px bg-neutral-900 dark:bg-white mb-6 md:mb-8"></div>
              </div>

              {/* NEW SHORTENED BIOGRAPHY CONTENT */}
              <div className="space-y-6 text-base md:text-lg font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                <p>
                  Originally from **Guatemala**, Captain Hans Yaeggy found in
                  watercolor a way to capture more than just landscapes: he
                  captures moments and emotions. Since the age of 16, he has
                  refined his artistic technique at institutions like the
                  Universidad Popular de Guatemala, merging traditional art with
                  a deep understanding of emotional connection.
                </p>
                <p>
                  Over his aviation career, he has traveled the world, soaring
                  over landscapes that few have the privilege to see so clearly.
                  These experiences inspire his signature project:
                  **transforming photographs of the skies he flies over into
                  evocative watercolor paintings. ** This process immortalizes
                  the fleeting magic viewed from the cockpit.
                </p>
                <p>
                  A notable achievement includes winning **second place** at the
                  **&quot;SubastArte&quot;** silent auction (2006-2007), which raised
                  funds for the Pediatric Foundation of Maracaibo Hospital.
                  Today, his pieces are acquired by collectors worldwide, drawn
                  to his ability to transport viewers to a world suspended in
                  time.
                </p>
                <p>
                  Beyond the canvas and cockpit, Hans Yaeggy represents the
                  Houston Chapter of the **Latino Pilots Association**,
                  supporting and mentoring new generations while continuing to
                  capture the soul of every landscape he encounters.
                </p>
              </div>

              <div className="pt-4">
                <a
                  href="#"
                  className="group inline-flex items-center gap-3 text-sm tracking-[0.3em] uppercase font-light hover: translate-x-2 transition-transform duration-300"
                >
                  View Portfolio
                  <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-900/10 dark:bg-neutral-100/10 mb-16 md:mb-32">
            {stats.map((stat) => (
              <div
                key={stat.id}
                // MODIFIED: Reduced p-12 to p-6 for mobile
                className="relative bg-white dark:bg-black p-6 md:p-12 group cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredStat(stat.id)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div
                  className={`absolute inset-0 border-2 border-neutral-900 dark:border-white transition-all duration-500 ${hoveredStat === stat.id
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-0"
                    }`}
                ></div>
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-4 md:mb-6">
                    {/* MODIFIED: Reduced icon container size */}
                    <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-neutral-900 dark:border-white rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                      <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </div>
                  {/* MODIFIED: Reduced text-5xl to text-3xl for mobile */}
                  <div className="text-3xl md:text-5xl font-extralight mb-2 md:mb-3">
                    {stat.number}
                  </div>
                  <div className="text-xs tracking-[0.3em] uppercase text-neutral-500">
                    {stat.label}
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-0 w-full h-px bg-neutral-900 dark:bg-white origin-left transition-all duration-500"
                  style={{
                    transform:
                      hoveredStat === stat.id ? "scaleX(1)" : "scaleX(0)",
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Philosophy Section */}
          <div className="relative border-2 border-neutral-900/20 dark:border-white/20 p-8 md:p-16 lg:p-20 bg-neutral-50 dark:bg-neutral-900">
            {/* MODIFIED: Reduced corner border size for mobile */}
            <div className="absolute top-0 left-0 w-10 h-10 md:w-20 md:h-20 border-t-2 border-l-2 md:border-t-4 md:border-l-4 border-neutral-900 dark:border-white"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 md:w-20 md:h-20 border-b-2 border-r-2 md:border-b-4 md:border-r-4 border-neutral-900 dark:border-white"></div>

            <div className="max-w-4xl mx-auto text-center">
              {/* MODIFIED: Reduced text-7xl to text-5xl for mobile */}
              <div className="text-5xl md:text-7xl font-serif text-neutral-900 dark:text-white leading-none mb-4 md:mb-8">
                &ldquo;
              </div>
              {/* MODIFIED: Reduced text-3xl to text-xl for mobile */}
              <blockquote className="text-xl md:text-3xl font-extralight leading-relaxed mb-6 md:mb-8 text-neutral-700 dark:text-neutral-300">
                Art is not what you see, but what you make others see. Every
                canvas is a journey into the depths of human experience.
              </blockquote>
              <div className="w-24 h-px bg-neutral-900 dark:bg-white mx-auto mb-6"></div>
              <cite className="text-sm tracking-[0.3em] uppercase text-neutral-500 dark:text-neutral-400 not-italic">
                My Creative Philosophy
              </cite>
            </div>
          </div>

          {/* Approach Section */}
          <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-6">
              {/* MODIFIED: Reduced size of circle and text for mobile */}
              <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-neutral-900 dark:border-white rounded-full flex items-center justify-center text-xl md:text-2xl font-extralight">
                01
              </div>
              {/* MODIFIED: Reduced text-2xl to text-xl for mobile */}
              <h3 className="text-xl md:text-2xl font-extralight">Vision</h3>
              <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed text-sm md:text-base">
                Every project begins with understanding the deeper meaning and
                emotion we want to convey through the artwork.
              </p>
            </div>

            <div className="space-y-6">
              {/* MODIFIED: Reduced size of circle and text for mobile */}
              <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-neutral-900 dark:border-white rounded-full flex items-center justify-center text-xl md:text-2xl font-extralight">
                02
              </div>
              {/* MODIFIED: Reduced text-2xl to text-xl for mobile */}
              <h3 className="text-xl md:text-2xl font-extralight">Creation</h3>
              <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed text-sm md:text-base">
                Through meticulous technique and intuitive expression, I bring
                concepts to life with authenticity and precision.
              </p>
            </div>

            <div className="space-y-6">
              {/* MODIFIED: Reduced size of circle and text for mobile */}
              <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-neutral-900 dark:border-white rounded-full flex items-center justify-center text-xl md:text-2xl font-extralight">
                03
              </div>
              {/* MODIFIED: Reduced text-2xl to text-xl for mobile */}
              <h3 className="text-xl md:text-2xl font-extralight">
                Connection
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed text-sm md:text-base">
                The true completion of art happens when it resonates with the
                viewer, creating a lasting emotional impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
