"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  TextField,
  Skeleton,
} from "@heroui/react";
import toast from "react-hot-toast";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

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
  userId: string;
}

export default function UpdateVegetablePage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define a strictly controlled state for the form
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    price: "",
    unit: "",
    shortDescription: "",
    fullDescription: "",
    imageUrl: "",
  });

  // 1. Fetch the existing item data to pre-fill the state
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/vegetables/${itemId}`,
        );
        if (!response.ok) throw new Error("Failed to fetch item");

        const data = await response.json();

        if (session?.user?.id && data.userId !== session.user.id) {
          toast.error("You are not authorized to edit this listing.");
          router.push("/manageVeg");
          return;
        }

        // Populate our controlled React state with the fetched data
        setFormData({
          title: data.title || "",
          category: data.category || "",
          location: data.location || "",
          price: data.price?.toString() || "",
          unit: data.unit || "",
          shortDescription: data.shortDescription || "",
          fullDescription: data.fullDescription || "",
          imageUrl: data.imageUrl || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Could not load the item data.");
        router.push("/manageVeg");
      } finally {
        setLoading(false);
      }
    };

    if (itemId && session?.user?.id) {
      fetchItem();
    }
  }, [itemId, session, router]);

  // 2. Handle the Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert the price string back to a strict number for the database
    const updatedData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    try {
      const response = await fetch(
        `http://localhost:5000/api/vegetables/${itemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        },
      );

      if (!response.ok) throw new Error("Failed to update");

      toast.success("Listing updated successfully!");
      router.push("/manageVeg");
      router.refresh();
    } catch (error) {
      toast.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-1/3 rounded-lg" />
          <Skeleton className="h-125 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 pb-6 border-b border-stone-200">
          <button
            onClick={() => router.back()}
            className="flex items-center text-stone-500 hover:text-stone-800 transition-colors w-fit font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
              <FaEdit className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900">
                Edit Listing
              </h1>
              <p className="text-stone-500 mt-1">
                Update the details for &quot;{formData.title}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="w-full p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField
                isRequired
                className="md:col-span-2 flex flex-col gap-1"
              >
                <Label className="text-sm font-bold text-stone-700">
                  Produce Title
                </Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  type="text"
                  className="bg-stone-50 w-full"
                />
              </TextField>

              <TextField isRequired className="flex flex-col gap-1">
                <Label className="text-sm font-bold text-stone-700">
                  Category
                </Label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  type="text"
                  className="bg-stone-50 w-full"
                />
              </TextField>

              <TextField isRequired className="flex flex-col gap-1">
                <Label className="text-sm font-bold text-stone-700">
                  Farm / Location
                </Label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  type="text"
                  className="bg-stone-50 w-full"
                />
              </TextField>

              <TextField isRequired className="flex flex-col gap-1">
                <Label className="text-sm font-bold text-stone-700">
                  Price ($)
                </Label>
                <Input
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  type="number"
                  step="0.01"
                  min="0"
                  className="bg-stone-50 w-full"
                />
              </TextField>

              <TextField isRequired className="flex flex-col gap-1">
                <Label className="text-sm font-bold text-stone-700">Unit</Label>
                <Input
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  type="text"
                  className="bg-stone-50 w-full"
                />
              </TextField>
            </div>

            <div className="border-t border-stone-100 my-2"></div>

            <TextField isRequired className="flex flex-col gap-1">
              <Label className="text-sm font-bold text-stone-700">
                Short Description (for cards)
              </Label>
              <Input
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                type="text"
                className="bg-stone-50 w-full"
              />
            </TextField>

            <TextField isRequired className="flex flex-col gap-1">
              <Label className="text-sm font-bold text-stone-700">
                Full Description
              </Label>
              <Input
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                type="text"
                className="bg-stone-50 w-full h-24 items-start py-3"
              />
            </TextField>

            <TextField className="flex flex-col gap-1">
              <Label className="text-sm font-bold text-stone-700">
                Image URL{" "}
                <span className="text-stone-400 font-normal">(Optional)</span>
              </Label>
              <Input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                type="url"
                className="bg-stone-50 w-full"
              />
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
                className="font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-md px-8"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
