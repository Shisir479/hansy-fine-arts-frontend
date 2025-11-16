"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleTheme } from "@/lib/redux/slices/themeSlice";

// Icons
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { BsHeartFill } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { MdDarkMode, MdLightMode } from "react-icons/md";

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

// Main border color for layout (e.g., navbar bottom)
const borderColor = "border-gray-200 dark:border-gray-800";
// Icon text color
const iconColor = "text-gray-600 dark:text-gray-300";


const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  const cart = useAppSelector((state) => state.cart.items);
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart
    .reduce((t, i) => t + i.quantity * i.price, 0)
    .toFixed(2);

  return (
    <div className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b ${borderColor} shadow-sm`}>
      <div className="container mx-auto py-3 px-4 flex items-center justify-between">
        {/* ONLY LOGO */}
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
                className={`w-6 h-6 ${iconColor}`}
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
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="font-semibold text-base hover:text-gray-900 dark:hover:text-white transition-colors bg-transparent border-0 p-0 h-auto [&>svg]:hidden data-[state=open]:bg-transparent"
              >
                SHOP ART
              </NavigationMenuTrigger>
              {/* DROPDOWN WITH ANIMATION ON HOVER */}
              <NavigationMenuContent>
                <ul
                  className={`grid gap-1 p-4 w-[250px] bg-white dark:bg-gray-950 border ${borderColor} shadow-xl rounded-lg
                    transition-all duration-300 ease-in-out
                    group-hover:w-[450px] hover:w-[450px] data-[state=open]:w-[450px]`}
                  style={{
                    width: "250px",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.width = "450px")}
                  onMouseLeave={e => (e.currentTarget.style.width = "250px")}
                >
                  <li>
                    <Link
                      href="/contemporary"
                      className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    >
                      <div className="text-sm font-semibold leading-none mb-1">
                        Contemporary
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Modern and contemporary art pieces
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/abstract-designs"
                      className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    >
                      <div className="text-sm font-semibold leading-none mb-1">
                        Abstract & Designs
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Unique abstract artwork and patterns
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/custom-portrait"
                      className="group block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    >
                      <div className="text-sm font-semibold leading-none mb-1">
                        Custom Portraits
                      </div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Personalized portraits made just for you
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/gallery"
                className="font-semibold text-base hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                GALLERY
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/bio"
                className="font-semibold text-base hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                ABOUT
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/contact"
                className="font-semibold text-base hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                CONTACT
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link
                href="/faq"
                className="font-semibold text-base hover:text-gray-900 dark:hover:text-white transition-colors"
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
            className={`transition ${iconColor} hover:text-gray-900 dark:hover:text-white`}
          >
            {theme === "light" ? (
              <MdDarkMode className="w-6 h-6" />
            ) : (
              <MdLightMode className="w-6 h-6" />
            )}
          </button>
          
          {/* FAVORITES -- BORDER REMOVED */}
          <button className={`relative transition ${iconColor} hover:text-gray-900 dark:hover:text-white`}>
            <BsHeartFill className="w-6 h-6" />
            <span className="absolute -top-1 -right-2 bg-background text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
              0
            </span>
          </button>
          
          {/* CART -- BORDER REMOVED */}
          <Popover>
            <PopoverTrigger className={`relative transition ${iconColor} hover:text-gray-900 dark:hover:text-white`}>
              <HiOutlineShoppingBag className="w-7 h-7" />
              <span className="absolute -top-1 -right-2 bg-background text-foreground text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                {totalItems}
              </span>
            </PopoverTrigger>
            <PopoverContent className={`w-60 rounded-lg border ${borderColor}`}>
              <p className="font-semibold text-lg">Items: {totalItems}</p>
              <p className="text-sm text-muted-foreground">
                Subtotal: ${totalPrice}
              </p>
              <Button className="w-full mt-3" asChild>
                <Link href="/cart">View Cart</Link>
              </Button>
            </PopoverContent>
          </Popover>
          
          {/* PROFILE -- BORDER AND BG REMOVED */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor} hover:text-gray-900 dark:hover:text-white transition`}
              >
                <BiUserCircle className="w-7 h-7" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`w-48 border ${borderColor}`}>
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