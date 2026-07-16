"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import toast from "react-hot-toast";
import { FaLeaf, FaPlus } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function AddVegetablePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("You must be logged in to add a vegetable.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const vegetableData = {
      ...Object.fromEntries(formData.entries()),
      userId: session.user.id,
    };

    try {
      const response = await fetch(
        "https://vegpro-server.vercel.app/api/vegetables",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vegetableData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      console.log("Submitting vegetable data:", vegetableData);

      // Simulating a network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Vegetable listed successfully!");
      router.push("/");
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-stone-200">
          <div className="p-3 bg-green-100 rounded-lg text-green-700">
            <FaLeaf className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-stone-900">
              List New Produce
            </h1>
            <p className="text-stone-500 mt-1">
              Add a new vegetable or fruit to the marketplace.
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="w-full p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TITLE */}
              <TextField
                isRequired
                name="title"
                validate={(value) => (!value ? "Title is required" : null)}
                className="md:col-span-2"
              >
                <Label className="text-sm font-bold text-stone-700">
                  Produce Title
                </Label>
                <Input
                  type="text"
                  placeholder="e.g., Organic Heirloom Tomatoes"
                  className="bg-stone-50"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              {/* CATEGORY */}
              <TextField
                isRequired
                name="category"
                validate={(value) => (!value ? "Category is required" : null)}
              >
                <Label className="text-sm font-bold text-stone-700">
                  Category
                </Label>
                <Input
                  type="text"
                  placeholder="e.g., Leafy Greens, Root, Fruits"
                  className="bg-stone-50"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              {/* LOCATION / FARM NAME */}
              <TextField
                isRequired
                name="location"
                validate={(value) => (!value ? "Location is required" : null)}
              >
                <Label className="text-sm font-bold text-stone-700">
                  Farm / Location
                </Label>
                <Input
                  type="text"
                  placeholder="e.g., Sunrise Farms, CA"
                  className="bg-stone-50"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              {/* PRICE */}
              <TextField
                isRequired
                name="price"
                validate={(value) => {
                  if (!value) return "Price is required";
                  if (isNaN(Number(value)) || Number(value) <= 0)
                    return "Must be a valid positive number";
                  return null;
                }}
              >
                <Label className="text-sm font-bold text-stone-700">
                  Price ($)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="bg-stone-50"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>

              {/* UNIT */}
              <TextField
                isRequired
                name="unit"
                validate={(value) => (!value ? "Unit is required" : null)}
              >
                <Label className="text-sm font-bold text-stone-700">Unit</Label>
                <Input
                  type="text"
                  placeholder="e.g., per lb, each, per bunch"
                  className="bg-stone-50"
                />
                <FieldError className="text-red-500 text-xs mt-1" />
              </TextField>
            </div>

            <div className="border-t border-stone-100 my-2"></div>

            {/* SHORT DESCRIPTION */}
            <TextField
              isRequired
              name="shortDescription"
              validate={(value) => {
                if (!value) return "Short description is required";
                if (value.length > 100) return "Keep it under 100 characters";
                return null;
              }}
            >
              <Label className="text-sm font-bold text-stone-700">
                Short Description (for cards)
              </Label>
              <Input
                type="text"
                placeholder="A brief catchphrase for this item..."
                className="bg-stone-50"
              />
              <FieldError className="text-red-500 text-xs mt-1" />
            </TextField>

            {/* FULL DESCRIPTION */}
            <TextField
              isRequired
              name="fullDescription"
              validate={(value) =>
                !value ? "Full description is required" : null
              }
            >
              <Label className="text-sm font-bold text-stone-700">
                Full Description
              </Label>
              {/* Note: Using standard Input here based on previous Hero UI patterns, but can be replaced with Textarea if your Hero UI setup supports it inside TextField */}
              <Input
                type="text"
                placeholder="Provide detailed information about growing methods, taste, etc."
                className="bg-stone-50 h-24 items-start py-3"
              />
              <FieldError className="text-red-500 text-xs mt-1" />
            </TextField>

            {/* IMAGE URL */}
            <TextField
              name="imageUrl"
              validate={(value) => {
                if (value && !/^https?:\/\/.+/i.test(value)) {
                  return "Please enter a valid image URL (starting with http:// or https://)";
                }
                return null;
              }}
            >
              <Label className="text-sm font-bold text-stone-700">
                Image URL{" "}
                <span className="text-stone-400 font-normal">(Optional)</span>
              </Label>
              <Input
                type="url"
                placeholder="https://images.unsplash.com/..."
                className="bg-stone-50"
              />
              <FieldError className="text-red-500 text-xs mt-1" />
            </TextField>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-stone-100">
              <Button
                type="button"
                variant="danger-soft"
                onPress={() => router.back()}
                className="font-medium bg-stone-100 text-stone-700 hover:bg-stone-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-bold bg-green-600 text-white hover:bg-green-700 shadow-md px-8"
              >
                <FaPlus className={isLoading ? "hidden" : "mr-2"} />
                {isLoading ? "Publishing..." : "Publish Listing"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
