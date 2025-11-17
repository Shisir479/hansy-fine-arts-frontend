export default function AboutUs() {
  return (
    <section className="bg-stone-50 md:py-20 py-12">
      <div className="md:container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-1 h-14 bg-stone-900"></div>
                <h2 className="md:text-5xl text-4xl font-thin text-stone-900 tracking-tighter">
                  About
                </h2>
              </div>
              <h3 className="md:text-3xl text-2xl font-extralight text-stone-800 tracking-wide leading-tight">
                Master Artist & Visionary
              </h3>
            </div>

            <div className="space-y-6 text-stone-700">
              <p className="text-lg font-light leading-7 tracking-wide">
                Hansy&apos;s artistic journey spans three decades...
              </p>

              <p className="text-base font-light leading-7 opacity-90">
                Working exclusively with premium materials...
              </p>

              <blockquote className="border-l-2 border-stone-300 pl-6 py-3">
                <p className="text-xl font-light italic text-stone-800 leading-8">
                  “True art transcends the canvas…”
                </p>
                <cite className="text-xs font-light text-stone-600 mt-3 block">
                  — Hansy, 2024
                </cite>
              </blockquote>
            </div>

            <div className="grid grid-cols-3 gap-10 pt-6 border-t border-stone-200">
              <div className="text-center">
                <div className="text-4xl font-thin text-stone-900 mb-1">30</div>
                <div className="text-xs uppercase tracking-widest text-stone-600">
                  Years Mastery
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-thin text-stone-900 mb-1">
                  800+
                </div>
                <div className="text-xs uppercase tracking-widest text-stone-600">
                  Collectors
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-thin text-stone-900 mb-1">75</div>
                <div className="text-xs uppercase tracking-widest text-stone-600">
                  Exhibitions
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 relative">
            <div className="relative">
              <div className="aspect-square bg-stone-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1000&fit=crop"
                  alt="Master Artist Hansy"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-5 shadow-2xl">
                <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">
                  Artist
                </div>
                <div className="text-2xl font-thin text-stone-900 tracking-wide">
                  Hansy
                </div>
                <div className="text-xs text-stone-600 mt-1">Est. 1994</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
