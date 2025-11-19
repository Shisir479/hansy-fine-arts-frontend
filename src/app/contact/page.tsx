

// import ArtShowcase from "@/components/contact/ArtShowcase";
import ContactForm from "@/components/contact/ContactForm";
import TrustedBadges from "@/components/contact/TrustedBadges";

export const metadata = {
  title: "Contact Us",
  description:
    "Contact Us — visits, press, collaborations, and enquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-900 antialiased">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">
            Contact Hansy's Gallery
          </h1>
          <p className="mt-2 text-sm text-zinc-600 max-w-2xl">
            For visits, press, collaborations and enquiries. We usually respond
            within 48 hours.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <ContactForm />
          <TrustedBadges />
          {/* <ArtShowcase /> */}
        </section>
      </div>
    </main>
  );
}
