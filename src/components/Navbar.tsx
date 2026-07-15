"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLeaf, FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-16 bg-stone-50 border-b border-stone-200">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Rule: Minimum 3 routes when logged out
  const loggedOutRoutes = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "About", path: "/about" },
  ];

  // Rule: Minimum 5 routes when logged in
  const loggedInRoutes = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Bought Items", path: "/orders" }, // <-- Added Orders link here
    { name: "Add Vegetable", path: "/addVeg" },
    { name: "Manage Items", path: "/manageVeg" },
    { name: "About", path: "/about" },
  ];

  const currentRoutes = user ? loggedInRoutes : loggedOutRoutes;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-stone-50 border-b border-stone-200 shadow-sm opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-green-700 hover:opacity-80 transition-opacity"
            >
              <FaLeaf className="text-2xl" />
              <span className="font-bold text-xl tracking-tight">
                VeggieMarket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            {currentRoutes.map((route) => {
              const isActive = pathname === route.path;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={`transition-colors font-medium text-sm lg:text-base ${
                    isActive
                      ? "text-green-700"
                      : "text-stone-600 hover:text-green-600"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {route.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth & Cart Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Cart Icon for Desktop */}
                <Link
                  href="/cart"
                  className="p-2 text-stone-600 hover:text-green-700 transition-colors flex items-center"
                  aria-label="View Cart"
                >
                  <FaShoppingCart className="text-xl" />
                </Link>

                <div className="border-2 border-green-500 rounded-full">
                  <Image
                    src={user?.image || "/fallback-avatar.png"}
                    width={30}
                    height={30}
                    alt="userimage"
                    className="rounded-full object-cover w-auto h-auto"
                  />
                </div>
                <button
                  onClick={async () => {
                    await authClient.signOut();
                    window.location.href = "/";
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-green-700 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-stone-600 hover:text-green-700 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentRoutes.map((route) => {
              const isActive = pathname === route.path;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={closeMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-green-700 bg-green-50"
                      : "text-stone-700 hover:text-green-700 hover:bg-stone-100"
                  }`}
                >
                  {route.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 pb-4 border-t border-stone-200 px-5 space-y-2">
            {user ? (
              <>
                {/* Cart Link for Mobile */}
                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-green-700 hover:bg-stone-100"
                >
                  <FaShoppingCart /> My Cart
                </Link>

                <button
                  onClick={async () => {
                    closeMenu();
                    await authClient.signOut();
                    window.location.href = "/";
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-green-700 hover:bg-stone-100"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="block w-full text-center mt-2 px-4 py-2 rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
