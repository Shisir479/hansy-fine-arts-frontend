"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleTheme } from "@/lib/redux/slices/themeSlice";

// Icons
import { FaPhoneAlt } from "react-icons/fa";

// ShadCN
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

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  const cart = useAppSelector((state) => state.cart.items);
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart
    .reduce((t, i) => t + i.quantity * i.price, 0)
    .toFixed(2);

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto py-3 px-4 flex items-center justify-between">
        {/* LOGO LEFT */}
        <Link href="/" className="hidden lg:flex">
          <Image
            src="/hansyeaggy-logo.png"
            alt="Logo"
            width={140}
            height={140}
            className="object-contain"
          />
        </Link>

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger className="lg:hidden">
            <Button variant="ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fill="none"
                className="w-6 h-6"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64">
            <SheetTitle>Menu</SheetTitle>

            <div className="mt-6 flex flex-col space-y-4 text-lg">
              <Link href="/gallery">Gallery</Link>
              <Link href="/bio">Bio</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/shop">Artist Shop</Link>
              <Link href="/faq">FAQ</Link>

              <div>
                <p className="font-semibold mb-1">Shop Art</p>
                <div className="flex flex-col pl-3 space-y-2 text-base">
                  <Link href="/contemporary">Contemporary</Link>
                  <Link href="/abstract-designs">Abstract & Designs</Link>
                  <Link href="/custom-portrait">Custom Portraits</Link>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {/* DESKTOP MENU */}
        {/* DESKTOP MENU */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-semibold text-base hover:text-[#b09f7b] transition-colors bg-transparent border-0 p-0 h-auto [&>svg]:hidden data-[state=open]:bg-transparent data-[state=open]:text-[#b09f7b]">
                SHOP ART
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <ul className="grid gap-1 p-4 w-64 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl rounded-lg">
                  <li>
                    <Link
                      href="/contemporary"
                      className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#b09f7b]/10 hover:text-[#b09f7b] focus:bg-[#b09f7b]/10 focus:text-[#b09f7b]"
                    >
                      <div className="text-sm font-semibold leading-none mb-1">
                        Contemporary
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-[#b09f7b]/80">
                        Modern and contemporary art pieces
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/abstract-designs"
                      className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#b09f7b]/10 hover:text-[#b09f7b] focus:bg-[#b09f7b]/10 focus:text-[#b09f7b]"
                    >
                      <div className="text-sm font-semibold leading-none mb-1">
                        Abstract & Designs
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-[#b09f7b]/80">
                        Unique abstract artwork and patterns
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/custom-portrait"
                      className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#b09f7b]/10 hover:text-[#b09f7b] focus:bg-[#b09f7b]/10 focus:text-[#b09f7b]"
                    >
                      <div className="text-sm font-semibold leading-none mb-1">
                        Custom Portraits
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground group-hover:text-[#b09f7b]/80">
                        Personalized portraits made just for you
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/artsy-product"
                className="font-semibold text-base hover:text-[#b09f7b] transition-colors"
              >
                ARTSY PRODUCTS
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/bio"
                className="font-semibold text-base hover:text-[#b09f7b] transition-colors"
              >
                ABOUT
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/contact"
                className="font-semibold text-base hover:text-[#b09f7b] transition-colors"
              >
                CONTACT
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link
                href="/faq"
                className="font-semibold text-base hover:text-[#b09f7b] transition-colors"
              >
                FAQ
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-6">
          {/* THEME TOGGLE */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="text-muted-foreground hover:text-foreground transition"
          >
            {theme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42" />
              </svg>
            )}
          </button>

          {/* FAVORITES */}
          <button className="relative text-muted-foreground hover:text-foreground transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              fill="none"
              className="w-6 h-6"
            >
              <path d="M4.3 6.3a4.5 4.5 0 016.4 0L12 7.6l1.3-1.3a4.5 4.5 0 016.4 6.4L12 21.3 4.3 12.7a4.5 4.5 0 010-6.4z" />
            </svg>

            <span className="absolute -top-1 -right-2 bg-background text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              0
            </span>
          </button>

          {/* CART */}
          <Popover>
            <PopoverTrigger className="relative text-muted-foreground hover:text-foreground transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                fill="none"
                className="w-6 h-6"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>

              <span className="absolute -top-1 -right-2 bg-background text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                {totalItems}
              </span>
            </PopoverTrigger>

            <PopoverContent className="w-60">
              <p className="font-semibold text-lg">Items: {totalItems}</p>
              <p className="text-sm text-muted-foreground">
                Subtotal: ${totalPrice}
              </p>

              <Button className="w-full mt-3" asChild>
                <Link href="/cart">View Cart</Link>
              </Button>
            </PopoverContent>
          </Popover>

          {/* PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  fill="none"
                  className="w-5 h-5"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 20a6.5 6.5 0 0113 0" />
                </svg>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <Link href="/login" className="w-full block">
                  Login
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href="/sign-up" className="w-full block">
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
