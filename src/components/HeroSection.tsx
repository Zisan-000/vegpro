"use client";

import React, { useState, useEffect } from "react";
import {
  FaTruck,
  FaLeaf,
  FaShieldAlt,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaChevronDown,
  FaShoppingBasket,
  FaQuoteLeft,
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Home Chef",
    quote:
      "The quality of the heirloom tomatoes I received was outstanding. It's so much better than what you find in regular supermarkets. Delivery was incredibly fast.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Mark Thompson",
    role: "Restaurant Owner",
    quote:
      "We source 80% of our daily vegetables through VeggieMarket now. Connecting directly with the farmers allows us to plan our seasonal menus perfectly.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

const data = [
  { name: "Jan", orders: 1200 },
  { name: "Feb", orders: 1900 },
  { name: "Mar", orders: 2400 },
  { name: "Apr", orders: 2100 },
  { name: "May", orders: 3200 },
  { name: "Jun", orders: 4800 },
];

const trendingItems = [
  {
    id: "1",
    title: "Organic Heirloom Tomatoes",
    desc: "Rich, sweet, and perfectly ripe tomatoes.",
    price: "$4.50",
    unit: "per lb",
    rating: 4.8,
    location: "Sunrise Farms",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Crisp Romaine Lettuce",
    desc: "Freshly picked, vibrant green lettuce heads.",
    price: "$2.99",
    unit: "per head",
    rating: 4.9,
    location: "Green Valley",
    image:
      "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Farm Fresh Carrots",
    desc: "Crunchy, sweet root vegetables with tops.",
    price: "$3.20",
    unit: "per bunch",
    rating: 4.7,
    location: "Root Basics",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Organic Red Bell Peppers",
    desc: "Sweet and crunchy hand-picked bell peppers.",
    price: "$1.50",
    unit: "each",
    rating: 4.6,
    location: "Sunny Acres",
    image:
      "https://images.unsplash.com/photo-1572721794563-b799a41226ac?q=80&w=1500&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const categories = [
  {
    id: 1,
    name: "Leafy Greens",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800&auto=format&fit=crop",
    items: "24 Items",
  },
  {
    id: 2,
    name: "Root Vegetables",
    image:
      "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=800&auto=format&fit=crop",
    items: "18 Items",
  },
  {
    id: 3,
    name: "Fresh Fruits",
    image:
      "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=800&auto=format&fit=crop",
    items: "32 Items",
  },
];

const features = [
  {
    id: 1,
    icon: <FaLeaf className="text-4xl text-green-600" />,
    title: "100% Organic Produce",
    description:
      "Sourced directly from certified local farms that strictly avoid synthetic pesticides and fertilizers.",
  },
  {
    id: 2,
    icon: <FaTruck className="text-4xl text-green-600" />,
    title: "Same-Day Farm Delivery",
    description:
      "Order by noon and receive your fresh harvest at your doorstep before dinner time.",
  },
  {
    id: 3,
    icon: <FaShieldAlt className="text-4xl text-green-600" />,
    title: "Freshness Guarantee",
    description:
      "If your vegetables aren't perfectly fresh upon arrival, we will refund your order immediately.",
  },
];
const SLIDER_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop",
    alt: "Freshly harvested organic vegetables in a basket",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?q=80&w=1200&auto=format&fit=crop",
    alt: "Assortment of fresh farm tomatoes and leafy greens",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=1200&auto=format&fit=crop",
    alt: "Vibrant assorted vegetables on a wooden table",
  },
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide functionality for the interactive image carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === SLIDER_IMAGES.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000); // Changes image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <section className="relative w-full min-h-[60vh] md:min-h-[70vh] bg-stone-50 flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-0 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm w-fit">
                <FaShoppingBasket />
                <span>100% Organic & Locally Sourced</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-800 leading-tight tracking-tight">
                Fresh Produce, <br />
                Delivered from <br />
                <span className="text-green-600">Farm to Door.</span>
              </h1>

              <p className="text-lg text-stone-600 max-w-md">
                Discover and buy the freshest seasonal vegetables directly from
                local growers. Join our community to buy, sell, and share the
                harvest.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
                >
                  Shop Fresh Deals
                  <FaArrowRight className="text-sm" />
                </Link>
                <Link
                  href="/addVeg"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-orange-600 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 hover:border-orange-300 transition-colors"
                >
                  List Your Produce
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Interactive Image Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-75 sm:h-100 lg:h-125 w-full rounded-2xl overflow-hidden shadow-2xl"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={SLIDER_IMAGES[currentImageIndex].url}
                  alt={SLIDER_IMAGES[currentImageIndex].alt}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Slider Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {SLIDER_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Subtle Gradient Overlay for contrast */}
              <div className="absolute inset-0 bg-linear-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>

        {/* Visual Flow: Downward indicator pointing to the next section */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-stone-400 cursor-pointer hover:text-green-600 transition-colors"
        >
          <span className="text-xs font-semibold tracking-widest uppercase mb-1">
            Scroll
          </span>
          <FaChevronDown />
        </motion.div>
      </section>
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-stone-50 border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-4 bg-green-50 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-stone-50 w-full border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">
                Shop by Category
              </h2>
              <p className="text-stone-600 mt-2">
                Explore our wide variety of seasonal harvests.
              </p>
            </div>
            <Link
              href="/explore"
              className="hidden sm:flex items-center gap-2 text-green-700 font-semibold hover:text-green-800"
            >
              View All <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                href={`/explore?category=${cat.name.toLowerCase()}`}
                key={cat.id}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-sm"
              >
                <Image
                  width={400}
                  height={100}
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {cat.name}
                  </h3>
                  <span className="text-stone-200 text-sm font-medium">
                    {cat.items}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            Fresh Picks of the Week
          </h2>

          {/* Strict Rule: 4 cards per row on desktop (lg:grid-cols-4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full"
              >
                <div className="h-48 overflow-hidden">
                  <Image
                    width={400}
                    height={400}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col grow p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-stone-800 line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 mb-4 line-clamp-2 grow">
                    {item.desc}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-green-700 text-lg">
                        {item.price}{" "}
                        <span className="text-xs text-stone-500 font-normal">
                          {item.unit}
                        </span>
                      </span>
                      <div className="flex items-center text-orange-500 text-sm">
                        <FaStar className="mr-1" /> {item.rating}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-stone-500">
                      <FaMapMarkerAlt className="mr-1" /> {item.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-stone-800 w-full text-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Growing Together</h2>
              <p className="text-stone-300 text-lg mb-8">
                Every month, more local farmers and conscious buyers are joining
                VeggieMarket to cut out the middleman and ensure fresher, fairer
                food distribution.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-4xl font-extrabold text-green-500">
                    50+
                  </h4>
                  <p className="text-stone-400 font-medium mt-1">Local Farms</p>
                </div>
                <div>
                  <h4 className="text-4xl font-extrabold text-orange-500">
                    15k+
                  </h4>
                  <p className="text-stone-400 font-medium mt-1">
                    Orders Delivered
                  </p>
                </div>
              </div>
            </div>

            <div className="h-80 w-full bg-stone-900 p-4 rounded-2xl border border-stone-700">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#444"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#a8a29e"
                    tick={{ fill: "#a8a29e" }}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#a8a29e"
                    tick={{ fill: "#a8a29e" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1917",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#16a34a", fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-stone-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">
              What Our Community Says
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 relative"
              >
                <FaQuoteLeft className="text-3xl text-orange-200 absolute top-8 left-8" />
                <p className="text-stone-600 relative z-10 pl-10 italic mb-6">
                  &quot;{review.quote}&quot;
                </p>
                <div className="flex items-center gap-4 border-t border-stone-100 pt-6">
                  <Image
                    width={100}
                    height={100}
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-stone-800">{review.name}</h4>
                    <p className="text-sm text-stone-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-green-700 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Never Miss a Fresh Harvest
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get weekly updates on seasonal
            produce, farming tips, and exclusive discounts from local growers.
          </p>
        </div>
      </section>
    </div>
  );
}
