"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logoutUser } from "@/lib/redux/slices/authSlice";
import { useLogoutUserMutation } from "@/lib/redux/api/authApi";

export default function MobileMenu() {
  const pathname = usePathname();
  const [isShopArtOpen, setIsShopArtOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
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

  const isActive = (href: string) => pathname === href;

  const shopArtLinks = [
    { href: "/contemporary", label: "CONTEMPORARY" },
    { href: "/abstract-designs", label: "ABSTRACT & DESIGNS" },
    { href: "/custom-portrait", label: "CUSTOM PORTRAITS" },
  ];

  const isAnyShopArtActive = shopArtLinks.some((link) => isActive(link.href));

  const mainMenuItems = [
    { href: "/", label: "HOME" },
    { href: "/artsy-products", label: "SHOP" },
    { href: "/about", label: "ABOUT" },
    { href: "/contact", label: "CONTACT" },
    { href: "/faq", label: "FAQ" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden flex items-center gap-2 flex-1">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-transparent"
          >
            <Menu
              className="h-6 w-6 text-gray-800 dark:text-gray-200"
              strokeWidth={1.2}
            />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[280px] p-0 border-r-0 bg-white dark:bg-gray-950 [&>button]:hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" onClick={handleLinkClick}>
              <Image
                src="/hansyeaggy-logo.png"
                alt="Hans Yeaggy"
                width={130}
                height={45}
                className="object-contain dark:invert"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="py-4 px-4 overflow-y-auto max-h-[calc(100vh-180px)]">
            {/* HOME */}
            {mainMenuItems
              .filter((item) => item.label === "HOME")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="block py-3 px-2 border-b border-gray-100 dark:border-gray-800"
                  style={{
                    color: isActive(item.href) ? "#000000" : "#374151",
                    fontWeight: isActive(item.href) ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              ))}

            {/* PAINTINGS (after HOME) */}
            <div className="mt-1 border-b border-gray-100 dark:border-gray-800">
              <button
                onClick={() => setIsShopArtOpen(!isShopArtOpen)}
                className="flex items-center justify-between w-full py-3 px-2"
                style={{
                  color: isAnyShopArtActive ? "#000000" : "#374151",
                  fontWeight: isAnyShopArtActive ? 600 : 400,
                }}
              >
                <span>PAINTINGS</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isShopArtOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isShopArtOpen && (
                <div className="pl-4 pb-2 ml-2 border-l-2 border-gray-200 dark:border-gray-700">
                  {shopArtLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleLinkClick}
                      className="block py-2 px-2"
                      style={{
                        color: isActive(link.href) ? "#000000" : "#4B5563",
                        fontWeight: isActive(link.href) ? 600 : 400,
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* REST MENU */}
            {mainMenuItems
              .filter((item) => item.label !== "HOME")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="block py-3 px-2 border-b border-gray-100 dark:border-gray-800"
                  style={{
                    color: isActive(item.href) ? "#000000" : "#374151",
                    fontWeight: isActive(item.href) ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              ))}

            {/* AUTH LINKS */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              {user ? (
                <>
                  <Link
                    href="/checkout/success"
                    onClick={handleLinkClick}
                    className="block py-3 px-2 text-gray-700 dark:text-gray-300 font-medium"
                  >
                    MY ACCOUNT
                  </Link>
                  <button
                    onClick={() => {
                      handleLinkClick();
                      handleLogout();
                    }}
                    className="block w-full text-left py-3 px-2 text-red-500 font-medium"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={handleLinkClick}
                    className="block py-3 px-2 text-gray-700 dark:text-gray-300 font-medium"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/register"
                    onClick={handleLinkClick}
                    className="block py-3 px-2 text-gray-700 dark:text-gray-300 font-medium"
                  >
                    REGISTER
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <p className="text-center text-xs" style={{ color: "#9CA3AF" }}>
              © 2024 Hans Yeaggy. All rights reserved.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Centered Logo */}
      <div className="flex-1 flex justify-center">
        <Link href="/">
          <Image
            src="/hansyeaggy-logo.png"
            alt="Hans Yeaggy"
            width={110}
            height={36}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Spacer */}
      <div className="w-9" />
    </div>
  );
}
