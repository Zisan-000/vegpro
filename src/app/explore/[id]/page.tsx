"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Skeleton, Button } from "@heroui/react";
import {
  FaMapMarkerAlt,
  FaStar,
  FaArrowLeft,
  FaTruck,
  FaShieldAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

interface Vegetable {
  _id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  unit: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  createdAt: string;
}

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const { data: session } = authClient.useSession();

  const [item, setItem] = useState<Vegetable | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `https://vegpro-server.vercel.app/api/vegetables/${itemId}`,
        );
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Item not found");
            router.push("/explore");
            return;
          }
          throw new Error("Failed to fetch item details");
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while loading the item.");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-125 w-full rounded-2xl" />
          <div className="space-y-6 pt-4">
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-6 w-1/4 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-stone-500 hover:text-green-700 font-medium transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" /> Back to Explore
        </button>

        {/* Top Section: Image and Buy Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Section */}
          <div className="h-100 md:h-125 w-full bg-stone-200 rounded-3xl overflow-hidden shadow-sm border border-stone-200">
            <Image
              width={500}
              height={500}
              src={
                item.imageUrl ||
                "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"
              }
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Buy Box & Core Info */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-full">
                {item.category}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-stone-900 mb-2 leading-tight">
              {item.title}
            </h1>

            <div className="flex items-center text-stone-500 mb-6 gap-4">
              <span className="flex items-center">
                <FaMapMarkerAlt className="mr-1.5 text-stone-400" />{" "}
                {item.location}
              </span>
              <span className="flex items-center text-orange-500 font-medium">
                <FaStar className="mr-1" /> 4.8 (124 Reviews)
              </span>
            </div>

            <p className="text-lg text-stone-600 mb-8 border-b border-stone-200 pb-8">
              {item.shortDescription}
            </p>

            <div className="mb-8">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-black text-green-700">
                  ${item.price.toFixed(2)}
                </span>
                <span className="text-lg text-stone-500 font-medium mb-1">
                  / {item.unit}
                </span>
              </div>
              <p className="text-sm text-stone-400">
                Taxes included. Delivery calculated at checkout.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button
                size="lg"
                className="flex-1 font-bold text-lg bg-green-600 text-white hover:bg-green-700 py-6"
                onPress={async () => {
                  if (!session?.user?.id) {
                    toast.error("Please log in to add items to your cart.");
                    return;
                  }

                  const cartPayload = {
                    userId: session.user.id,
                    vegetableId: item._id,
                    title: item.title,
                    price: item.price,
                    imageUrl: item.imageUrl,
                    unit: item.unit,
                    addedAt: new Date(),
                  };

                  try {
                    const res = await fetch(
                      "https://vegpro-server.vercel.app/api/cart",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(cartPayload),
                      },
                    );
                    if (res.ok) toast.success("Added to cart!");
                  } catch (e) {
                    toast.error("Failed to add item to cart.");
                    toast.error((e as Error).message);
                  }
                }}
              >
                Add to Cart
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <FaTruck className="text-green-600 text-xl" />
                <span>Next-day farm delivery</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <FaShieldAlt className="text-green-600 text-xl" />
                <span>100% Freshness Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Details & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Description */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 bg-white border border-stone-200 shadow-sm rounded-2xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">
                Overview
              </h2>
              <div className="prose text-stone-600 max-w-none leading-relaxed">
                <p>{item.fullDescription}</p>
              </div>
            </Card>

            {/* Mock Reviews Section */}
            <Card className="p-8 bg-white border border-stone-200 shadow-sm rounded-2xl">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">
                Customer Reviews
              </h2>
              <div className="space-y-6">
                {/* Review 1 */}
                <div className="border-b border-stone-100 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-800">
                      Sarah Jenkins
                    </span>
                    <div className="flex text-orange-500 text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm">
                    Absolutely perfect. The quality of this produce is miles
                    better than the local grocery store.
                  </p>
                </div>

                {/* Review 2 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-800">Mark T.</span>
                    <div className="flex text-orange-500 text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar className="text-stone-300" />
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm">
                    Very fresh and delivered quickly. Highly recommend this
                    farm.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Specifications Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-stone-100 border border-stone-200 shadow-sm rounded-2xl">
              <h3 className="text-lg font-bold text-stone-900 mb-4">
                Specifications
              </h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center py-2 border-b border-stone-200">
                  <span className="text-stone-500">Category</span>
                  <span className="font-semibold text-stone-800 capitalize">
                    {item.category}
                  </span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-stone-200">
                  <span className="text-stone-500">Pricing Unit</span>
                  <span className="font-semibold text-stone-800">
                    {item.unit}
                  </span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-stone-200">
                  <span className="text-stone-500">Listed On</span>
                  <span className="font-semibold text-stone-800">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </li>
                <li className="flex justify-between items-center py-2">
                  <span className="text-stone-500">Item ID</span>
                  <span className="font-mono text-xs text-stone-400">
                    {item._id.slice(-6)}
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
