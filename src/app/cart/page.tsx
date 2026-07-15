"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Card, Skeleton } from "@heroui/react";
import toast from "react-hot-toast";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import Image from "next/image";

interface CartItem {
  _id: string;
  vegetableId: string;
  title: string;
  price: number;
  imageUrl: string;
  unit: string;
}

export default function CartPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cart/${session.user.id}`,
        );
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        toast.error("Failed to load cart.");
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [session, isPending, router]);

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item");
      toast.error((error as Error).message);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("http://localhost:5000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      if (response.ok) {
        toast.success("Bought done! Order confirmed.");
        router.push("/orders");
      } else {
        toast.error("Checkout failed.");
      }
    } catch (error) {
      toast.error("An error occurred during checkout.");
      toast.error((error as Error).message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading || isPending)
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <Skeleton className="max-w-4xl mx-auto h-64 rounded-xl" />
      </div>
    );

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-8 flex items-center gap-3">
          <FaShoppingCart className="text-green-600" /> My Cart
        </h1>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center flex items-center bg-white shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-700">
              Your cart is empty
            </h2>
            <Button
              onPress={() => router.push("/explore")}
              className="mt-4 bg-green-600 text-white font-bold"
            >
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item._id}
                  className="p-4 flex flex-row items-center gap-4 bg-white shadow-sm border border-stone-200"
                >
                  <Image
                    width={400}
                    height={400}
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg bg-stone-100"
                  />
                  <div className="grow">
                    <h3 className="font-bold text-lg text-stone-900">
                      {item.title}
                    </h3>
                    <p className="text-stone-500 text-sm">{item.unit}</p>
                    <p className="text-green-700 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    isIconOnly
                    variant="danger"
                    className="text-red-500 bg-red-50 hover:bg-red-100"
                    onPress={() => handleRemove(item._id)}
                  >
                    <FaTrash />
                  </Button>
                </Card>
              ))}
            </div>

            <Card className="p-6 h-fit bg-white shadow-sm border border-stone-200 sticky top-4">
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                Order Summary
              </h3>
              <div className="flex justify-between items-center py-3 border-b border-stone-100">
                <span className="text-stone-500">
                  Subtotal ({cartItems.length} items)
                </span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-4 text-xl font-black text-stone-900 mb-6">
                <span>Total</span>
                <span className="text-green-700">${total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full font-bold bg-green-600 text-white hover:bg-green-700 py-6"
                onPress={handleCheckout}
              >
                Confirm & Pay
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
