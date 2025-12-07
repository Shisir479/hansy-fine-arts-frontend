// components/MobileMenu.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose, // Import SheetClose to enable closing the menu on link click
} from "@/components/ui/sheet";
import { Menu, ChevronDown, ChevronUp, Home } from "lucide-react"; // Added Home icon

export default function MobileMenu() {
  const pathname = usePathname();
  const [isShopArtOpen, setIsShopArtOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control the Sheet open/close

  // Function to determine if a link is active
  const isActive = (href: string) => pathname === href;

  // --- Styling Classes ---
  // Base class for all main navigation items
  const baseLinkClass = "py-2 px-3 rounded-lg transition-all duration-200 block";
  // Default (inactive) style
  const defaultLinkStyle = "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800";
  // Active style: black underline, primary color text, and highlighted background
  const activeLinkStyle =
    "text-primary font-bold bg-primary-foreground dark:bg-gray-900 border-l-4 border-primary";
    
  // Active style for text/underline only
  const activeTextStyle = "text-black dark:text-white underline decoration-black dark:decoration-white font-bold";

  // Sub-links for the 'Shop Art' section
  const shopArtLinks = [
    { href: "/contemporary", label: "Contemporary" },
    { href: "/abstract-designs", label: "Abstract & Designs" },
    { href: "/custom-portrait", label: "Custom Portraits" },
  ];

  // Determine if any Shop Art sub-link is currently active
  const isAnyShopArtActive = shopArtLinks.some((link) => isActive(link.href));

  // Function to get the combined class name for a link
  const getLinkClassName = (href: string, isSubLink = false) => {
    if (isActive(href)) {
        // Sub-links get the underline/bold style
        if (isSubLink) {
            return `${baseLinkClass} ${activeTextStyle}`;
        }
        // Main links get the highlighted block style
        return `${baseLinkClass} ${activeLinkStyle}`;
    }
    return `${baseLinkClass} ${defaultLinkStyle}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden h-10 px-2">
          <Menu className="h-7 w-7 text-gray-900 dark:text-gray-300" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 pt-10 overflow-y-auto">
        <SheetTitle className="text-2xl font-extrabold mb-8 text-primary">
          Artify Menu
        </SheetTitle>

        <nav className="flex flex-col space-y-2 text-lg">
          {/* 🏠 Home Link */}
          <SheetClose asChild>
            <Link 
              href="/" 
              className={getLinkClassName("/")}
            >
                <div className="flex items-center gap-3">
                    <Home className="h-5 w-5" />
                    Home
                </div>
            </Link>
          </SheetClose>

          {/* Main Navigation Links */}
          <SheetClose asChild>
            <Link
              href="/artsy-products"
              className={getLinkClassName("/artsy-products")}
            >
              ARTSY PRODUCTS
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/about"
              className={getLinkClassName("/about")}
            >
              About
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/contact"
              className={getLinkClassName("/contact")}
            >
              Contact
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/shop"
              className={getLinkClassName("/shop")}
            >
              Artist Shop
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link
              href="/faq"
              className={getLinkClassName("/faq")}
            >
              FAQ
            </Link>
          </SheetClose>

          {/* Shop Art Section with Toggle */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <button
              onClick={() => setIsShopArtOpen(!isShopArtOpen)}
              className={`flex items-center justify-between w-full font-bold text-xl py-2 px-3 transition-colors duration-200 ${
                isAnyShopArtActive ? "text-primary" : "text-gray-900 dark:text-gray-100"
              }`}
            >
              Shop Art
              {isShopArtOpen ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </button>

            {/* Collapsible Content */}
            {(isShopArtOpen || isAnyShopArtActive) && (
              <div className="flex flex-col space-y-1 text-base ml-2 border-l border-dashed border-gray-300 dark:border-gray-600 pl-4 py-2">
                {shopArtLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      // Pass true for isSubLink to apply the underline style for active state
                      className={getLinkClassName(link.href, true)}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}