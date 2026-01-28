"use client"
import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUpRight, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Instagram', url: '#', handle: '@hansyfinearts' },
    { name: 'Facebook', url: '#', handle: '/hansyfinearts' },
    { name: 'Twitter', url: '#', handle: '@hansyarts' },
    { name: 'LinkedIn', url: '#', handle: '/hansyfinearts' },
  ];

  const navSections = [
    {
      title: 'Explore',
      links: ['Shop', 'Gallery', 'Custom Portraits', 'About', 'Process']
    },
    {
      title: 'Support',
      links: ['Contact', 'FAQ', 'Shipping', 'Returns', 'Care Guide']
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookies', 'Licenses']
    }
  ];

  return (
    <footer className="bg-white dark:bg-black text-black dark:text-gray-100 relative overflow-hidden transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Left Section - Brand & Newsletter */}
          <div className="lg:col-span-5">
            {/* Brand */}
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tighter mb-3">
                Hansy
              </h2>
              <h2 className="text-4xl md:text-5xl font-light tracking-tighter italic">
                Fine Arts
              </h2>
              <div className="w-20 h-[1px] bg-black dark:bg-white mt-6 mb-8"></div>
              <p className="text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-md">
                Creating timeless art that transforms spaces and captures emotions.
                Every piece tells a story, every stroke holds meaning.
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 mb-4">
                Stay Inspired
              </p>
              <div className="flex border-b border-zinc-300 dark:border-zinc-700 pb-2 group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent flex-1 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none text-sm"
                />
                <button
                  className="ml-4 text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-zinc-500 dark:text-zinc-500 text-xs mt-3 font-light">
                Subscribe for exclusive previews and art insights
              </p>
            </div>
          </div>

          {/* Middle Section - Navigation */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-8">
              {navSections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href="#"
                          className="text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors text-sm font-light group inline-flex items-center gap-2"
                        >
                          {link}
                          <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Contact & Social */}
          <div className="lg:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 mb-6">
              Connect
            </h3>

            {/* Contact Info */}
            <div className="space-y-4 mb-10">
              <a
                href="mailto:info@hansyfinearts.com"
                className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors group"
              >
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-light">info@hansyfinearts.com</span>
              </a>
              <a
                href="tel:+15551234567"
                className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors group"
              >
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-light">+1 (555) 123-4567</span>
              </a>
              <div className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-light">123 Art Street<br />New York, NY 10001</span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <div className="space-y-2">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    onMouseEnter={() => setIsHovered(social.name)}
                    onMouseLeave={() => setIsHovered(null)}
                    className="flex items-center justify-between py-2 border-b border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group"
                  >
                    <span className="text-sm font-light text-zinc-600 dark:text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {social.name}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {social.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-500 font-light tracking-wider">
              © {currentYear} Hansy Fine Arts. All Rights Reserved.
            </p>

            <div className="flex items-center gap-8">
              <a href="#" className="text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors tracking-wider">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors tracking-wider">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-zinc-500 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors tracking-wider">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-zinc-200 dark:bg-zinc-800 opacity-50"></div>
      <div className="absolute top-0 right-[26%] w-px h-full bg-zinc-200 dark:bg-zinc-800 opacity-50"></div>
    </footer>
  );
}