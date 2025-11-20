

export const metadata = {
  title: "About — Hansy Yaeggy's Art Gallery",
  description:
    "Hansy Yaeggy's Art Gallery — Curated artworks, exhibitions and the story behind our collection.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 antialiased">
      {/* Hero — keep your existing AboutHero component */}
    

      {/* Philosophy & Visit */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-zinc-900">
              Our Philosophy
            </h2>

            <p className="mt-4 text-zinc-700 text-base leading-relaxed max-w-prose">
              Hansy Yaeggy's Art Gallery is dedicated to celebrating both
              contemporary and classical work. We emphasize careful curatorial
              selection, museum-quality presentation, and long-term partnerships
              that support artists' careers.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-700">
              <li className="flex items-start gap-4">
                <span className="inline-flex w-9 h-9  bg-black text-white items-center justify-center font-semibold text-sm">
                  1
                </span>
                <div>
                  <div className="font-medium text-zinc-900">
                    Curated Collections
                  </div>
                  <div className="text-zinc-500">
                    Each piece selected for narrative depth and craft.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="inline-flex w-9 h-9  bg-black text-white items-center justify-center font-semibold text-sm">
                  2
                </span>
                <div>
                  <div className="font-medium text-zinc-900">
                    Sustainable Practice
                  </div>
                  <div className="text-zinc-500">
                    Eco-conscious framing, packing and shipping.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="inline-flex w-9 h-9  bg-black text-white items-center justify-center font-semibold text-sm">
                  3
                </span>
                <div>
                  <div className="font-medium text-zinc-900">
                    Artist Support
                  </div>
                  <div className="text-zinc-500">
                    Fair royalties and exhibition programs.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="inline-flex w-9 h-9 bg-black text-white items-center justify-center font-semibold text-sm">
                  4
                </span>
                <div>
                  <div className="font-medium text-zinc-900">Global Reach</div>
                  <div className="text-zinc-500">
                    Secure shipping and institutional collaborations.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/Hansy-banner.jpg"
                alt="Hansy Yaeggy — Amar Gallery"
                className="w-full h-[340px] md:h-[420px] object-cover"
                loading="eager"
              />
            </div>

            <div className="rounded-2xl p-6 bg-zinc-50 border border-zinc-100">
              <h4 className="font-medium text-zinc-900">Visit & Experience</h4>
              <p className="mt-3 text-zinc-600 text-sm">
                Gallery visits are by appointment and during exhibitions. We
                offer private viewings and guided tours for collectors and
                institutions.
              </p>
              <div className="mt-4">
                <a
                  href="/contact"
                  role="button"
                  className="inline-block px-5 py-3 bg-black text-white font-semibold shadow-sm"
                >
                  Book a visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      

      {/* CTA */}
      <section className="bg-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h4 className="text-2xl font-semibold text-zinc-900">
            Collaborate or Exhibit
          </h4>
          <p className="mt-3 text-zinc-700 max-w-2xl mx-auto">
            We partner with artists, curators and institutions to develop
            thoughtful exhibitions.
          </p>
          <div className="mt-6">
            <a
              href="/contact"
              role="button"
              className="inline-block px-6 py-3  bg-black text-white font-medium shadow"
            >
              Contact
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
