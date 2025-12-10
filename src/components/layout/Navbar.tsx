// components/Navbar.tsx or wherever you have it
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
// Import usePathname from next/navigation
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleTheme } from "@/lib/redux/slices/themeSlice";
import dynamic from "next/dynamic";
import { Moon, Sun, Heart, ShoppingCart, User } from "lucide-react";
// Dynamic imports (এগুলো শুধু ক্লায়েন্টে লোড হবে)
const MobileMenu = dynamic(() => import("@/components/layout/MobileMenu"), {
  ssr: false,
  loading: () => (
    <button className="lg:hidden h-10 px-2">
      <svg
        className="w-7 h-7 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="square"    // no rounded edges
          strokeLinejoin="miter"    // sharp corners
          strokeWidth={1.3}         // thin, flat style
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  ),
});


// Icons
import CartButton from "@/components/cart/CartButton";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


const borderColor = "border-gray-200 dark:border-gray-800";
const iconColor = "text-gray-600 dark:text-gray-300";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const cart = useAppSelector((state) => state.cart.items);
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart
    .reduce((t, i) => t + i.quantity * i.price, 0)
    .toFixed(2);

  // 1. Initialize usePathname
  const currentPath = usePathname();

  // Helper function to check if a path is active, handling the root path case
  const isActive = (href: string) => {
    // Check for exact match (e.g., /about == /about)
    if (currentPath === href) return true;
    // Handle the root path "/" special case: only true if exactly "/"
    if (href === "/") return currentPath === "/";
    return false;
  };

  const menuItems = [
    { label: "ARTSY PRODUCTS", href: "/artsy-products" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <div
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b ${borderColor} shadow-sm`}
    >
      <div className="container mx-auto py-3 md:px-4 px-1 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="hidden lg:flex">
          <Image
            src="/hansyeaggy-logo.png"
            alt="Hans Yeaggy"
            width={140}
            height={140}
            className="object-contain"
          />
        </Link>

        {/* Mobile Menu - এটা এখন ফ্লিকার করবে না */}
        <MobileMenu />

        {/* Desktop Menu */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-8">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-normal italic bg-transparent data-[state=open]:bg-transparent">
                SHOP ART
              </NavigationMenuTrigger>
              <NavigationMenuContent >
                <ul className="grid gap-3 p-6 w-96 bg-white dark:bg-gray-950 border shadow-xl ">
                  {[
                    { href: "/contemporary", title: "Contemporary" },
                    { href: "/abstract-designs", title: "Abstract & Designs" },
                    { href: "/custom-portrait", title: "Custom Portraits" },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-semibold">
                          {item.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Re-mapping the menu items for clarity and using the helper function */}
            {menuItems.map((item) => {
              const active = isActive(item.href);

              return (
                <NavigationMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <span
                      className={`text-base italic cursor-pointer transition 
                        ${
                          active
                            ? "text-black font-bold underline decoration-2 decoration-black"
                            : "hover:text-primary"
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`transition ${iconColor} hover:text-foreground/90`}
          >
            {theme === "light" ? (
              <Moon className="md:w-7 md:h-7 w-6 h-6" />
            ) : (
              <Sun className="md:w-7 md:h-7 w-6 h-6" />
            )}
          </button>

          {/* Favorites */}
          <button
            className={`relative inline-flex items-center transition ${iconColor} hover:text-foreground/90`}
          >
            <Heart className="md:w-7 md:h-7 w-6 h-6" />
            <span
              className="
        absolute -top-1 -right-3 
        text-[10px] leading-none 
        px-[4px] py-[2px]
        bg-background 
        text-foreground/80 
        border 
        rounded-[2px]     /* no rounded-full */
      "
            >
              0
            </span>
          </button>

          {/* Cart */}
          <CartButton />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`transition ${iconColor} hover:text-foreground/90 inline-flex items-center`}
              >
                <User className="md:w-7 md:h-7 w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-48 border ${borderColor} rounded-none`} // jodi pura no-rounded chai
            >
              <DropdownMenuItem asChild>
                <Link href="/login" className="w-full">
                  Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sign-up" className="w-full">
                  Create Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
