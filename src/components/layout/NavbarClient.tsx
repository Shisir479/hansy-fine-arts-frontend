// components/NavbarClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { toggleTheme } from "@/lib/redux/slices/themeSlice";
import { logoutUser } from "@/lib/redux/slices/authSlice";
import { useLogoutUserMutation } from "@/lib/redux/api/authApi";

import { Moon, Sun, Heart, User } from "lucide-react";

// Icons & Components
import CartButton from "@/components/cart/CartButton";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Dynamic imports
import MobileMenu from "@/components/layout/MobileMenu";

const borderColor = "border-gray-200 dark:border-gray-800";
const iconColor = "text-gray-600 dark:text-gray-300";

const NavbarClient = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const user = useAppSelector((state) => state.auth.user);
  const currentPath = usePathname();
  const [logoutApi] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      if (user?._id) await logoutApi(user._id).unwrap();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      dispatch(logoutUser());
      window.location.href = "/";
    }
  };

  // Helper: Check if path is active
  const isActive = (href: string) => {
    if (currentPath === href) return true;
    if (href === "/") return currentPath === "/";
    return false;
  };

  // 1. Define Shop Art sub-routes to check for active state
  const shopArtRoutes = [
    "/contemporary",
    "/abstract-designs",
    "/custom-portrait",
  ];

  // 2. Check if we are currently inside any Shop Art route
  const isShopArtActive = shopArtRoutes.some((route) =>
    currentPath.startsWith(route),
  );

  const menuItems = [
    { label: "ARTSY", href: "/artsy-products" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <div
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b ${borderColor} shadow-sm`}
    >
      <div className="container mx-auto py-2 md:px-4 px-1 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="hidden lg:flex">
          <Image
            src="/hansyeaggy-logo.png"
            alt="Hans Yeaggy"
            width={140}
            height={140}
            className="object-contain dark:invert"
          />
        </Link>

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Desktop Menu */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="space-x-8">

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`text-base font-normal italic bg-transparent data-[state=open]:bg-transparent hover:bg-transparent focus:bg-transparent
                  ${isShopArtActive
                    ? "text-black dark:text-white font-bold underline decoration-2 decoration-black dark:decoration-white"
                    : "text-gray-800 dark:text-gray-200"
                  }
                `}
              >
                PAINTINGS
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-96 bg-white dark:bg-gray-950 border shadow-xl">
                  {shopArtRoutes.map((route, index) => {
                    // Mapping titles manually since array above is just strings
                    const titles = ["Contemporary", "Abstract & Designs", "Custom Portraits"];
                    return (
                      <li key={route}>
                        <Link href={route} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={`block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground rounded-md
                              ${currentPath === route ? "bg-accent/50" : ""}
                            `}
                          >
                            <div className="text-sm font-semibold leading-none">
                              {titles[index]}
                            </div>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Other Menu Items */}
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <NavigationMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <span
                      className={`text-base italic cursor-pointer transition 
                        ${active
                          ? "text-black dark:text-white font-bold underline decoration-2 decoration-black dark:decoration-white"
                          : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
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
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </button>

          {/* Favorites */}
          <button
            className={`relative inline-flex items-center transition ${iconColor} hover:text-foreground/90`}
          >
            <Heart className="w-6 h-6" />
            <span className="absolute -top-1 -right-3 text-[10px] leading-none px-[4px] py-[2px] bg-background text-foreground/80 border rounded-[2px]">
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
                <User className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-48 border ${borderColor} rounded-none bg-white dark:bg-black p-2`}
              align="end"
            >
              {user ? (
                <>
                  <DropdownMenuItem className="font-bold pointer-events-none opacity-50 px-2 py-1.5 text-sm">
                    Hello, {user.firstName || "User"}
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/stats" className="w-full cursor-pointer px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 block rounded-sm">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/checkout/success" className="w-full cursor-pointer px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 block rounded-sm">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600 px-2 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 block rounded-sm">
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full cursor-pointer px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 block rounded-sm">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="w-full cursor-pointer px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900 block rounded-sm">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default NavbarClient;
