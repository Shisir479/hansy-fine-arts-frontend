// components/Navbar.tsx or wherever you have it
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleTheme } from "@/lib/redux/slices/themeSlice";
import dynamic from "next/dynamic";

// Dynamic imports (এগুলো শুধু ক্লায়েন্টে লোড হবে)
const MobileMenu = dynamic(() => import("@/components/layout/MobileMenu"), {
  ssr: false,
  loading: () => (
    <button className="lg:hidden h-10 px-2">
      <svg className="w-7 h-7 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  ),
});

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

import { Button } from "@/components/ui/button";

const borderColor = "border-gray-200 dark:border-gray-800";
const iconColor = "text-gray-600 dark:text-gray-300";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const cart = useAppSelector((state) => state.cart.items);
  const totalItems = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart.reduce((t, i) => t + i.quantity * i.price, 0).toFixed(2);

  return (
    <div className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b ${borderColor} shadow-sm`}>
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
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-96 bg-white dark:bg-gray-950 border rounded-lg shadow-xl">
                  {[
                    { href: "/contemporary", title: "Contemporary", desc: "Modern and contemporary art pieces" },
                    { href: "/abstract-designs", title: "Abstract & Designs", desc: "Unique abstract artwork and patterns" },
                    { href: "/custom-portrait", title: "Custom Portraits", desc: "Personalized portraits made just for you" },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="text-sm font-semibold">{item.title}</div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{item.desc}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {["ARTSY PRODUCTS", "ABOUT", "CONTACT", "FAQ"].map((label) => {
              const href =
                label === "ARTSY PRODUCTS"
                  ? "/artsy-products"
                  : label === "ABOUT"
                  ? "/bio"
                  : label === "CONTACT"
                  ? "/contact"
                  : "/faq";

              return (
                <NavigationMenuItem key={label}>
                  <Link href={href} legacyBehavior passHref>
                    <span className="text-base italic cursor-pointer hover:text-primary transition">
                      {label}
                    </span>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`transition ${iconColor} hover:text-foreground`}
          >
            {theme === "light" ? <MdDarkMode className="w-6 h-6" /> : <MdLightMode className="w-6 h-6" />}
          </button>

          {/* Favorites */}
          <button className={`relative transition ${iconColor} hover:text-foreground`}>
            <BsHeartFill className="w-6 h-6" />
            <span className="absolute -top-1 -right-2 bg-background text-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
              0
            </span>
          </button>

          {/* Cart */}
          <Popover>
            <PopoverTrigger className={`relative transition ${iconColor} hover:text-foreground`}>
              <HiOutlineShoppingBag className="w-7 h-7" />
              <span className="absolute -top-1 -right-2 bg-background text-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalItems}
              </span>
            </PopoverTrigger>
            <PopoverContent className={`w-64 border ${borderColor}`}>
              <p className="font-semibold">Items: {totalItems}</p>
              <p className="text-sm text-muted-foreground">Subtotal: ${totalPrice}</p>
              <Button asChild className="w-full mt-4">
                <Link href="/cart">View Cart</Link>
              </Button>
            </PopoverContent>
          </Popover>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`transition ${iconColor} hover:text-foreground`}>
                <BiUserCircle className="w-8 h-8" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`w-48 border ${borderColor}`}>
              <DropdownMenuItem asChild>
                <Link href="/login" className="w-full">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sign-up" className="w-full">Create Account</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;