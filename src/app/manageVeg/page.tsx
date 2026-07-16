"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Table, Skeleton } from "@heroui/react";
import toast from "react-hot-toast";
import { FaEye, FaEdit, FaTrash, FaLeaf } from "react-icons/fa";

interface Vegetable {
  _id: string;
  title: string;
  category: string;
  price: number;
  unit: string;
  createdAt: string;
}

export default function ManageItemsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's specific items
  useEffect(() => {
    // If auth is still loading, do nothing yet
    if (isPending) return;

    // Rule: Redirect to login if not authenticated
    if (!session?.user?.id) {
      router.push("/login?redirect=/manageVeg");
      return;
    }

    const fetchMyItems = async () => {
      try {
        const response = await fetch(
          `https://vegpro-server.vercel.app/api/vegetables/user/${session.user.id}`,
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setVegetables(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load your listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [session, isPending, router]);

  // Handle Item Deletion
  const handleDelete = async (id: string) => {
    // Simple confirmation before deleting
    if (
      !window.confirm(
        "Are you sure you want to delete this listing? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `https://vegpro-server.vercel.app/api/vegetables/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Listing deleted successfully");
      // Remove the deleted item from the UI instantly
      setVegetables((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting the item.");
    }
  };

  // Loading State
  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <Skeleton className="h-12 w-1/3 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 flex items-center gap-3">
              <FaLeaf className="text-green-600" /> My Listings
            </h1>
            <p className="text-stone-600 mt-1">
              Manage and update your farm produce.
            </p>
            <p className="text-stone-600 mt-1">
              Total Items: {vegetables.length}
            </p>
          </div>
          <Link
            href="/addVeg"
            className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            + Add New Produce
          </Link>
        </div>

        {/* Hero UI v3 Table Implementation */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          {vegetables.length > 0 ? (
            <Table className="w-full text-left">
              <Table.ScrollContainer className="w-full overflow-x-auto">
                <Table.Content
                  aria-label="Manage your vegetables table"
                  className="min-w-full"
                >
                  <Table.Header className="bg-stone-100 border-b border-stone-200 text-stone-700">
                    <Table.Column isRowHeader className="px-6 py-4 font-bold">
                      Produce Name
                    </Table.Column>
                    <Table.Column className="px-6 py-4 font-bold">
                      Category
                    </Table.Column>
                    <Table.Column className="px-6 py-4 font-bold">
                      Price
                    </Table.Column>
                    <Table.Column className="px-6 py-4 font-bold">
                      Date Added
                    </Table.Column>
                    <Table.Column className="px-6 py-4 font-bold text-center">
                      Actions
                    </Table.Column>
                  </Table.Header>

                  <Table.Body className="divide-y divide-stone-100">
                    {vegetables.map((item) => (
                      <Table.Row
                        key={item._id}
                        className="hover:bg-stone-50 transition-colors"
                      >
                        <Table.Cell className="px-6 py-4 font-medium text-stone-900">
                          {item.title}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 text-stone-600 capitalize">
                          {item.category}
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 text-green-700 font-bold">
                          ${item.price.toFixed(2)}{" "}
                          <span className="text-xs text-stone-500 font-normal">
                            / {item.unit}
                          </span>
                        </Table.Cell>
                        <Table.Cell className="px-6 py-4 text-stone-500 text-sm">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Table.Cell>

                        {/* Action Buttons */}
                        <Table.Cell className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Details */}
                            <Link href={`/explore/${item._id}`}>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="danger-soft"
                                className="bg-stone-100 text-stone-600 hover:bg-stone-200"
                                aria-label="View Details"
                              >
                                <FaEye />
                              </Button>
                            </Link>

                            {/* Update/Edit */}
                            <Link href={`/explore/update/${item._id}`}>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="danger-soft"
                                className="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200"
                                aria-label="Edit Item"
                              >
                                <FaEdit />
                              </Button>
                            </Link>

                            {/* Delete */}
                            <Button
                              isIconOnly
                              size="sm"
                              variant="danger-soft"
                              className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                              onPress={() => handleDelete(item._id)}
                              aria-label="Delete Item"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          ) : (
            /* Empty State */
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                <FaLeaf className="text-3xl text-stone-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-800">
                No listings yet
              </h3>
              <p className="text-stone-500 mt-2 max-w-sm mb-6">
                You have not added any produce to the marketplace yet. Start
                listing to reach local buyers!
              </p>
              <Link
                href="/addVeg"
                className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Create Your First Listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
