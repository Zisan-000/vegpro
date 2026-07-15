"use client";

import React from "react";
import Link from "next/link";
import { Card, Button } from "@heroui/react";
import {
  FaLeaf,
  FaTractor,
  FaHeart,
  FaGlobeAmericas,
  FaHandsHelping,
} from "react-icons/fa";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-green-700 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            width={500}
            height={500}
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000&auto=format&fit=crop"
            alt="Farm field"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FaLeaf className="text-5xl mx-auto mb-6 text-green-300" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Cultivating a Better Food System
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
            VeggieMarket is on a mission to connect local farmers directly with
            their communities. We believe everyone deserves access to fresh,
            affordable, and sustainably grown produce.
          </p>
        </div>
      </div>

      {/* Our Story / Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-6">
              Bridging the Gap Between Farm and Table
            </h2>
            <div className="space-y-4 text-stone-600 text-lg leading-relaxed">
              <p>
                For too long, the journey of our food has been hidden behind
                long supply chains, supermarket shelves, and unnecessary
                transportation. We built this platform to change that.
              </p>
              <p>
                By cutting out the middlemen, we empower farmers to earn what
                they deserve for their hard work, while offering you the
                freshest ingredients at fair prices. Whether you are a local
                grower with extra tomatoes or a family looking for organic
                greens, you belong here.
              </p>
            </div>
          </div>
          <div className="h-100 rounded-3xl overflow-hidden shadow-lg border border-stone-200">
            <Image
              width={400}
              height={400}
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1000&auto=format&fit=crop"
              alt="Farmer holding fresh vegetables"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white border-y border-stone-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900">
              What Drives Us
            </h2>
            <p className="text-stone-500 mt-4 text-lg">
              The core values at the heart of our marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <Card className="p-8 text-center border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-2xl">
                <FaTractor />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Support Local
              </h3>
              <p className="text-stone-600">
                Every purchase directly supports independent farmers and
                strengthens your local agricultural economy.
              </p>
            </Card>

            {/* Value 2 */}
            <Card className="p-8 text-center border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-500 text-2xl">
                <FaHeart />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Peak Freshness
              </h3>
              <p className="text-stone-600">
                Because items do not sit in distribution centers for weeks, you
                get food that was often picked the very same day.
              </p>
            </Card>

            {/* Value 3 */}
            <Card className="p-8 text-center border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-2xl">
                <FaGlobeAmericas />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">
                Eco-Friendly
              </h3>
              <p className="text-stone-600">
                Shorter transit distances mean a massively reduced carbon
                footprint and far less packaging waste.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <FaHandsHelping className="text-6xl text-stone-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-stone-900 mb-6">
          Ready to join the community?
        </h2>
        <p className="text-stone-600 mb-8 text-lg">
          Start exploring fresh produce from farmers near you, or list your own
          harvest and start selling today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/explore">
            <Button
              size="lg"
              className="bg-green-600 text-white font-bold px-8 shadow-sm hover:bg-green-700"
            >
              Explore Marketplace
            </Button>
          </Link>
          <Link href="/addVeg">
            <Button
              size="lg"
              variant="primary"
              className="border-stone-300 text-stone-700 font-bold px-8 hover:bg-stone-100"
            >
              Start Selling
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
