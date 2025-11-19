// src/app/about/page.tsx


export const metadata = {
  title: "About — Amar Gallery",
  description:
    "Amar Gallery — Curated artworks, exhibitions and the story behind our collection.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 antialiased">
      

      <section className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold">
              Our Philosophy
            </h2>
            <p className="mt-4 text-zinc-700 text-base leading-relaxed">
              Hansy's Gallery dedicated to celebrating contemporary and classical
              art — a place where artists' stories meet audiences who cherish
              the craft. We focus on limited editions, curated exhibitions and
              sustainable partnerships with local and international artists.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-700">
              <li className="flex items-start gap-3">
                <span className="inline-block w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                  1
                </span>
                <div>
                  <div className="font-medium">Curated Collections</div>
                  <div className="text-zinc-500">
                    Each piece is selected by our curatorial team.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="inline-block w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                  2
                </span>
                <div>
                  <div className="font-medium">Sustainable choices</div>
                  <div className="text-zinc-500">
                    Eco-friendly framing & packaging.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="inline-block w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                  3
                </span>
                <div>
                  <div className="font-medium">Artist support</div>
                  <div className="text-zinc-500">
                    Fair royalties & collaborative exhibits.
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <span className="inline-block w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                  4
                </span>
                <div>
                  <div className="font-medium">Global shipping</div>
                  <div className="text-zinc-500">
                    Secure packaging and tracked delivery.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/Hansy-banner.jpg"
                alt="Curated exhibition"
                className="w-full h-[340px] md:h-[420px] object-cover"
              />
            </div>

            <div className="rounded-2xl p-6 bg-zinc-50">
              <h4 className="font-medium">Visit & Experience</h4>
              <p className="mt-3 text-zinc-600 text-sm">
                Our gallery is open by appointment and during exhibitions. We
                offer guided tours and private viewings for collectors and
                institutions.
              </p>
              <div className="mt-4">
                <a
                  href="/contact"
                  className="inline-block px-5 py-3 bg-white text-black font-semibold shadow"
                >
                  Book a visit
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      

     

      <section className="bg-indigo-50">
        <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
          <h4 className="text-2xl font-semibold">
            Want to collaborate or exhibit?
          </h4>
          <p className="mt-3 text-zinc-700">
            We partner with artists, curators and institutions to bring
            meaningful exhibitions to life.
          </p>
         
        </div>
      </section>
    </main>
  );
}
