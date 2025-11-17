// components/MobileMenu.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden h-10 px-2">
          <Menu className="h-7 w-7 text-gray-900 dark:text-gray-300" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 pt-10">
        <SheetTitle className="text-2xl font-bold mb-8">Menu</SheetTitle>

        <div className="flex flex-col space-y-5 text-lg">
          <Link href="/artsy-products" className="hover:text-primary transition">
            ARTSY PRODUCTS
          </Link>
          <Link href="/bio" className="hover:text-primary transition">
            Bio
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>
          <Link href="/shop" className="hover:text-primary transition">
            Artist Shop
          </Link>
          <Link href="/faq" className="hover:text-primary transition">
            FAQ
          </Link>

          <div className="pt-4">
            <p className="font-semibold mb-3 text-primary">Shop Art</p>
            <div className="flex flex-col pl-4 space-y-3 text-base">
              <Link href="/contemporary" className="hover:text-primary transition">
                Contemporary
              </Link>
              <Link href="/abstract-designs" className="hover:text-primary transition">
                Abstract & Designs
              </Link>
              <Link href="/custom-portrait" className="hover:text-primary transition">
                Custom Portraits
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}