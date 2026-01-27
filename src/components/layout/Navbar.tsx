// components/Navbar.tsx
import React from "react";
import NavbarClient from "./NavbarClient";

// This is a Server Component by default in Next.js 13+ (no "use client" directive)
const Navbar = () => {
  // Example: You could fetch session data here in the future
  // const user = await getCurrentUser(); 

  return <NavbarClient />;
};

export default Navbar;