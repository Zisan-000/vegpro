import React from "react";
import Link from "next/link";
import {
  FaLeaf,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-900 text-stone-300 w-full pt-16 pb-8 border-t-4 border-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & About */}
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors w-fit"
            >
              <FaLeaf className="text-3xl" />
              <span className="font-bold text-2xl tracking-tight text-white">
                VeggieMarket
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Connecting local farmers directly to your kitchen. We ensure the
              freshest, 100% organic seasonal produce is delivered straight to
              your doorstep.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-green-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="hover:text-green-400 transition-colors"
                >
                  Shop Vegetables
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-green-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-green-400 transition-colors"
                >
                  Farming Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-orange-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-orange-400 transition-colors"
                >
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-orange-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-orange-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-500 text-lg shrink-0 mt-0.5" />
                <span>
                  123 Organic Lane, Farmville
                  <br />
                  Agriculture State, 98765
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-500 text-lg shrink-0" />
                <a
                  href="tel:+18005550199"
                  className="hover:text-green-400 transition-colors"
                >
                  +1 (800) 555-0199
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-green-500 text-lg shrink-0" />
                <a
                  href="mailto:support@veggiemarket.com"
                  className="hover:text-green-400 transition-colors"
                >
                  support@veggiemarket.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Footer Bottom */}
        <div className="pt-8 border-t border-stone-800 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-stone-500">
          <p>&copy; {currentYear} VeggieMarket. All rights reserved.</p>
          <p>Designed for local farmers.</p>
        </div>
      </div>
    </footer>
  );
}
