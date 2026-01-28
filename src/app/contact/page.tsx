"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, ArrowUpRight, Circle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert("Thank you for reaching out! I will get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 relative overflow-hidden transition-colors duration-300">
      {/* Animated decorative elements */}
      {/* <div className="absolute top-20 right-20 w-px h-40 bg-neutral-900 opacity-10 animate-pulse"></div> */}
      {/* <div className="absolute bottom-40 left-40 w-px h-60 bg-neutral-900 opacity-10 animate-pulse delay-500"></div> */}
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-neutral-900 dark:bg-white rounded-full opacity-20 animate-ping"></div>

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

      {/* MODIFIED: Reduced py for mobile and ensured horizontal padding */}
      <div className="container mx-auto py-12 px-4 sm:px-6 md:py-24 relative z-10">
        <div className=" max-w-7xl mx-auto">
          {/* Header */}
          {/* MODIFIED: Reduced mb and text sizes for mobile */}
          <div className="mb-16 md:mb-24 relative">
            <div className="flex items-center gap-4 mb-4 md:mb-8">
              <div className="w-10 md:w-16 h-px bg-neutral-900 dark:bg-white"></div>
              <span className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500">
                Contact
              </span>
            </div>
            {/* MODIFIED: Changed text-6xl to text-4xl for mobile, 6xl for md screens */}
            <h1 className="text-3xl md:text-5xl font-extralight tracking-tight mb-4 md:mb-8 leading-tight italic">
              Get In Touch
            </h1>
            {/* MODIFIED: Changed text-2xl to text-xl for mobile */}
            <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl font-light leading-relaxed">
              Let&#39;s collaborate on something exceptional
            </p>
          </div>

          {/* Three Column Layout */}
          {/* MODIFIED: Changed grid-cols-3 to grid-cols-1 for mobile, 3 for md screens. Reduced mb. */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-900/10 dark:bg-neutral-100/10 mb-16 md:mb-24">
            {/* Email Card */}
            <div
              // MODIFIED: Reduced p-12 to p-8 for mobile
              className="relative bg-white dark:bg-black p-8 md:p-12 group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredCard("email")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 border-2 border-neutral-900 dark:border-white transition-all duration-500 ${hoveredCard === "email"
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
                  }`}
              ></div>
              <div className="relative z-10">
                {/* MODIFIED: Reduced mb-12 to mb-8 for mobile */}
                <div className="mb-8 md:mb-12">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-neutral-900 dark:border-white rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:rotate-90 transition-transform duration-500">
                    <Mail className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500">
                    Email
                  </div>
                  {/* MODIFIED: Changed text-xl to text-lg for mobile */}
                  <a
                    href="mailto:info@hansyfinearts.com"
                    className="text-lg md:text-xl font-light block hover:translate-x-2 transition-transform duration-300"
                  >
                    info@hansyfinearts.com
                  </a>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 w-full h-px bg-neutral-900 dark:bg-white origin-left transition-all duration-500"
                style={{
                  transform:
                    hoveredCard === "email" ? "scaleX(1)" : "scaleX(0)",
                }}
              ></div>
            </div>

            {/* Phone Card */}
            <div
              // MODIFIED: Reduced p-12 to p-8 for mobile
              className="relative bg-white dark:bg-black p-8 md:p-12 group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredCard("phone")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 border-2 border-neutral-900 dark:border-white transition-all duration-500 ${hoveredCard === "phone"
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
                  }`}
              ></div>
              <div className="relative z-10">
                {/* MODIFIED: Reduced mb-12 to mb-8 for mobile */}
                <div className="mb-8 md:mb-12">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-neutral-900 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:rotate-90 transition-transform duration-500">
                    <Phone className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500">
                    Phone
                  </div>
                  {/* MODIFIED: Changed text-xl to text-lg for mobile */}
                  <a
                    href="tel:+15551234567"
                    className="text-lg md:text-xl font-light block hover:translate-x-2 transition-transform duration-300"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 w-full h-px bg-neutral-900 dark:bg-white origin-left transition-all duration-500"
                style={{
                  transform:
                    hoveredCard === "phone" ? "scaleX(1)" : "scaleX(0)",
                }}
              ></div>
            </div>

            {/* Location Card */}
            <div
              // MODIFIED: Reduced p-12 to p-8 for mobile
              className="relative bg-white dark:bg-black p-8 md:p-12 group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredCard("location")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 border-2 border-neutral-900 dark:border-white transition-all duration-500 ${hoveredCard === "location"
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0"
                  }`}
              ></div>
              <div className="relative z-10">
                {/* MODIFIED: Reduced mb-12 to mb-8 for mobile */}
                <div className="mb-8 md:mb-12">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-neutral-900 dark:border-white rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:rotate-90 transition-transform duration-500">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500">
                    Studio
                  </div>
                  {/* MODIFIED: Changed text-xl to text-lg for mobile */}
                  <p className="text-lg md:text-xl font-light leading-relaxed">
                    123 Art Street
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 w-full h-px bg-neutral-900 dark:bg-white origin-left transition-all duration-500"
                style={{
                  transform:
                    hoveredCard === "location" ? "scaleX(1)" : "scaleX(0)",
                }}
              ></div>
            </div>
          </div>

          {/* Contact Form */}
          {/* MODIFIED: Changed p-20 to p-5 for mobile. Changed bg-neutral-50 to bg-white for better contrast on mobile if bg is subtle. Reverting back to original as per user request to not lose code/style. */}
          <div className="relative border-2 border-neutral-900/20 dark:border-white/20 p-5 md:p-20 bg-neutral-50 dark:bg-neutral-900">
            {/* MODIFIED: Reduced corner border size for mobile */}
            <div className="absolute top-0 left-0 w-10 h-10 md:w-20 md:h-20 border-t-2 border-l-2 md:border-t-4 md:border-l-4 border-neutral-900 dark:border-white"></div>
            <div className="absolute bottom-0 right-0 w-10 h-10 md:w-20 md:h-20 border-b-2 border-r-2 md:border-b-4 md:border-r-4 border-neutral-900 dark:border-white"></div>

            {/* MODIFIED: Reduced mb-16 to mb-10 and text-5xl to text-3xl for mobile */}
            <div className="mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-extralight mb-4 md:mb-6 tracking-tight">
                Send Message
              </h2>
              <div className="w-24 md:w-32 h-px bg-neutral-900 dark:bg-white"></div>
            </div>

            {/* MODIFIED: Reduced space-y-12 to space-y-8 for mobile */}
            <div className="space-y-8 md:space-y-12">
              {/* MODIFIED: Reduced gap-12 to gap-8 for mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="relative group">
                  <Label
                    htmlFor="name"
                    className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500 mb-2 md:mb-4 block"
                  >
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    // MODIFIED: Reduced h-14 to h-12 and text-xl to text-lg for mobile
                    className="bg-transparent border-0 border-b-2 border-neutral-900/20 dark:border-white/20 rounded-none h-12 md:h-14 text-sm md:text-xl font-light focus:border-neutral-900 dark:focus:border-white focus:ring-0 transition-all px-0 dark:placeholder:text-gray-500"
                    placeholder="Enter your name"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-900 dark:bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>

                <div className="relative group">
                  <Label
                    htmlFor="email"
                    className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500 mb-2 md:mb-4 block"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    // MODIFIED: Reduced h-14 to h-12 and text-xl to text-lg for mobile
                    className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-12 md:h-14 text-sm md:text-xl font-light focus:border-white focus:ring-0 transition-all px-0"
                    placeholder="Enter your email"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>

              <div className="relative group">
                <Label
                  htmlFor="subject"
                  className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500 mb-2 md:mb-4 block"
                >
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  // MODIFIED: Reduced h-14 to h-12 and text-xl to text-lg for mobile
                  className="bg-transparent border-0 border-b-2 border-white/20 rounded-none h-12 md:h-14 text-sm md:text-xl font-light focus:border-white focus:ring-0 transition-all px-0"
                  placeholder="Enter the subject"
                />
                <div className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>

              <div className="relative group">
                <Label
                  htmlFor="message"
                  className="text-xs tracking-[0.3em] font-light uppercase text-neutral-500 mb-2 md:mb-4 block"
                >
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  // MODIFIED: Changed text-xl to text-lg for mobile
                  className="bg-transparent border-0 border-b-2 border-neutral-900/20 dark:border-white/20 rounded-none text-sm md:text-xl font-light focus:border-neutral-900 dark:focus:border-white focus:ring-0 transition-all resize-none px-0 dark:placeholder:text-gray-500"
                  placeholder="Enter your message"
                />
                <div className="absolute bottom-0 left-0 w-full h-px bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
              <div className="pt-4 md:pt-8">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  // h-10 (small size) -> md:h-16 (desktop size)
                  // px-6 (small padding) -> md:px-16 (desktop padding)
                  // text-xxs (smaller text) -> md:text-xs (desktop text)
                  className="group relative bg-neutral-900 dark:bg-white text-white dark:text-black h-10 px-6 text-[0.6rem] tracking-[0.3em] font-light uppercase rounded-none border-0 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 overflow-hidden md:h-16 md:px-16 md:text-xs"
                >
                  <span className="relative z-10 flex items-center gap-2 md:gap-4">
                    {/* Reduced mobile gap to gap-2, kept md:gap-4 */}
                    {isSubmitting ? "SENDING..." : "SUBMIT"}
                    {/* Reduced icon size to h-3 w-3 for mobile, kept md:h-5 md:w-5 */}
                    <ArrowUpRight className="h-3 w-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform md:h-5 md:w-5" />
                  </span>
                  <div className="absolute inset-0 border-2 border-white scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Social */}
          {/* MODIFIED: Reduced mt and pt, changed to flex-col for mobile, and reduced gap-12 to gap-6 */}
          <div className="mt-16 md:mt-24 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 border-t border-neutral-900/10 dark:border-neutral-100/10 pt-8 md:pt-12">
            <p className="text-sm text-neutral-500 tracking-wider">
              FOLLOW THE JOURNEY
            </p>
            {/* MODIFIED: Reduced gap-12 to gap-6 for mobile social links */}
            <div className="flex gap-6 md:gap-12">
              <a
                href="#"
                className="group flex items-center gap-2 text-sm tracking-wider hover:text-neutral-600 transition-colors"
              >
                <Circle className="h-2 w-2 fill-current" />
                <span>INSTAGRAM</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 text-sm tracking-wider hover:text-neutral-600 transition-colors"
              >
                <Circle className="h-2 w-2 fill-current" />
                <span>TWITTER</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#"
                className="group flex items-center gap-2 text-sm tracking-wider hover:text-neutral-600 transition-colors"
              >
                <Circle className="h-2 w-2 fill-current" />
                <span>LINKEDIN</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
