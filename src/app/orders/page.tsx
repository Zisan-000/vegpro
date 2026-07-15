"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Card, Skeleton } from "@heroui/react";
import { FaBoxOpen, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

// Interfaces to match your backend data structure
interface OrderItem {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
  unit: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  purchaseDate: string;
  status: string;
}

export default function BoughtItemsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's orders from the database
  useEffect(() => {
    // Wait until we know if the user is logged in
    if (isPending) return;
    if (!session?.user?.id) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/${session.user.id}`,
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        toast.error("Failed to load orders");
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, isPending]);

  // Loading Skeleton State
  if (loading || isPending) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-1/3 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Not Logged In State (Just in case they bypassed the navbar)
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">
          Please log in to view your orders.
        </h2>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-stone-900 flex items-center gap-3">
            <FaBoxOpen className="text-green-600" /> Bought Items
          </h1>
          <Link
            href="/explore"
            className="flex items-center text-stone-500 hover:text-green-700 font-medium transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center bg-white shadow-sm border border-stone-200">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBoxOpen className="text-3xl text-stone-400" />
            </div>
            <h2 className="text-xl font-bold text-stone-700">
              You have not bought anything yet.
            </h2>
            <p className="text-stone-500 mt-2 mb-6">
              Explore the marketplace to find fresh local produce.
            </p>
            <Link
              href="/explore"
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors w-fit mx-auto"
            >
              Browse Produce
            </Link>
          </Card>
        ) : (
          /* List of Orders */
          <div className="space-y-6">
            {orders.map((order) => (
              <Card
                key={order._id}
                className="p-6 bg-white shadow-sm border border-stone-200 rounded-2xl"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div>
                    <p className="text-xs text-stone-400 font-mono tracking-wider">
                      ORDER ID: {order._id.toUpperCase()}
                    </p>
                    <p className="text-sm text-stone-600 mt-1 font-medium">
                      Purchased on{" "}
                      {new Date(order.purchaseDate).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-2xl font-black text-green-700">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs font-bold text-green-600 flex items-center md:justify-end gap-1 mt-1 uppercase tracking-wide">
                      <FaCheckCircle /> {order.status}
                    </p>
                  </div>
                </div>

                <hr className="my-4 bg-stone-100" />

                {/* Items in the Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100"
                    >
                      <Image
                        width={400}
                        height={400}
                        src={
                          item.imageUrl ||
                          "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"
                        }
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg bg-stone-200 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <p
                          className="font-bold text-sm text-stone-800 truncate"
                          title={item.title}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Qty: 1 {item.unit}
                        </p>
                        <p className="text-sm font-semibold text-green-700 mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
