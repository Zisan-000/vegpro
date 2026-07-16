"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Input,
  Select,
  Label,
  ListBox,
  Card,
  Skeleton,
  TextField,
  Pagination,
} from "@heroui/react";
import { FaSearch, FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";

// Match this interface to your backend
interface Vegetable {
  _id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  unit: string;
  shortDescription: string;
  imageUrl: string;
  createdAt: string;
}

export default function ExplorePage() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch data on mount
  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        const response = await fetch("https://vegpro-server.vercel.app/api/vegetables");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setVegetables(data);
      } catch (error) {
        toast.error("Failed to fetch vegetables");
        toast.error((error as Error).message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchVegetables();
  }, []);

  // Dynamically extract unique categories for the filter dropdown
  const categories = useMemo(() => {
    const unique = new Set(vegetables.map((v) => v.category));
    return ["all", ...Array.from(unique)];
  }, [vegetables]);

  // Apply filters and sorting
  const filteredAndSortedVegetables = useMemo(() => {
    let result = [...vegetables];

    // 1. Search Filter
    if (searchQuery) {
      result = result.filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // 2. Category Filter
    if (categoryFilter !== "all") {
      result = result.filter((v) => v.category === categoryFilter);
    }

    // 3. Max Price Filter
    if (maxPrice && !isNaN(Number(maxPrice))) {
      result = result.filter((v) => v.price <= Number(maxPrice));
    }

    // 4. Sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
    }

    return result;
  }, [vegetables, searchQuery, categoryFilter, maxPrice, sortOption]);

  const totalPages = Math.ceil(
    filteredAndSortedVegetables.length / itemsPerPage,
  );

  const paginatedVegetables = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedVegetables.slice(startIndex, endIndex);
  }, [filteredAndSortedVegetables, currentPage]);

  return (
    <div className="min-h-screen bg-stone-50 py-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">
            Explore Fresh Produce
          </h1>
          <p className="text-stone-600 mt-2 text-lg">
            Discover local, organic vegetables and fruits directly from farmers.
          </p>
        </div>

        {/* Search, Filters, and Sorting Row */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Search Bar */}
          <TextField
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => {
              const val = typeof e === "string" ? e : e.target.value;
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            className="lg:col-span-1 flex flex-col gap-1"
          >
            <Label className="text-sm font-medium text-stone-700">Search</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaSearch className="text-stone-400" />
              </div>
              <Input
                type="text"
                placeholder="e.g., Tomatoes"
                className="bg-stone-50 pl-10 w-full"
              />
            </div>
          </TextField>

          {/* Filter 1: Category */}
          <Select
            selectedKey={categoryFilter}
            onSelectionChange={(key) => {
              setCategoryFilter((key as string) || "all");
              setCurrentPage(1); // Reset page on filter change
            }}
            className="flex flex-col gap-1"
          >
            <Label className="text-sm font-medium text-stone-700">
              Category
            </Label>
            <Select.Trigger className="bg-stone-50">
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {categories.map((cat) => (
                  <ListBox.Item
                    key={cat}
                    id={cat}
                    textValue={cat === "all" ? "All Categories" : cat}
                  >
                    <Label className="capitalize">
                      {cat === "all" ? "All Categories" : cat}
                    </Label>
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Filter 2: Max Price */}
          <TextField
            value={maxPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement> | string) => {
              const val = typeof e === "string" ? e : e.target.value;
              setMaxPrice(val);
              setCurrentPage(1);
            }}
            className="flex flex-col gap-1"
          >
            <Label className="text-sm font-medium text-stone-700">
              Max Price ($)
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <FaFilter className="text-stone-400" />
              </div>
              <Input
                type="number"
                placeholder="e.g., 10"
                className="bg-stone-50 pl-10 w-full"
              />
            </div>
          </TextField>

          {/* Sorting */}
          <Select
            selectedKey={sortOption}
            onSelectionChange={(key) => {
              setSortOption((key as string) || "newest");
              setCurrentPage(1); // Reset page on filter change
            }}
            className="flex flex-col gap-1"
          >
            <Label className="text-sm font-medium text-stone-700">
              Sort By
            </Label>
            <Select.Trigger className="bg-stone-50">
              <Select.Value />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item key="newest" id="newest" textValue="Newest First">
                  <Label>Newest First</Label>
                </ListBox.Item>
                <ListBox.Item key="oldest" id="oldest" textValue="Oldest First">
                  <Label>Oldest First</Label>
                </ListBox.Item>
                <ListBox.Item
                  key="price-asc"
                  id="price-asc"
                  textValue="Price: Low to High"
                >
                  <Label>Price: Low to High</Label>
                </ListBox.Item>
                <ListBox.Item
                  key="price-desc"
                  id="price-desc"
                  textValue="Price: High to Low"
                >
                  <Label>Price: High to Low</Label>
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Results Grid - Strict 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Skeleton Loaders */}
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="flex flex-col h-full border border-stone-100 shadow-sm p-0 overflow-hidden"
              >
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-5 flex flex-col grow space-y-3">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    <Skeleton className="h-6 w-1/3 rounded-lg" />
                    <Skeleton className="h-6 w-1/4 rounded-lg" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg mt-2" />
                </div>
              </Card>
            ))
          ) : paginatedVegetables.length > 0 ? (
            /* Actual Data Cards */
            paginatedVegetables.map((item) => (
              <div
                key={item._id}
                className="flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-120"
              >
                <div className="h-48 w-full overflow-hidden bg-stone-100 shrink-0">
                  <Image
                    width={400}
                    height={400}
                    src={
                      item.imageUrl ||
                      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col grow p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-stone-800 line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wider">
                    {item.category}
                  </span>

                  <p className="text-sm text-stone-600 mb-4 line-clamp-2 grow">
                    {item.shortDescription}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-green-700 text-lg">
                        ${item.price.toFixed(2)}{" "}
                        <span className="text-xs text-stone-500 font-normal">
                          {item.unit}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-stone-500 line-clamp-1">
                      <FaMapMarkerAlt className="mr-1 shrink-0" />{" "}
                      {item.location}
                    </div>
                  </div>

                  <Link
                    href={`/explore/${item._id}`}
                    className="mt-auto w-full text-center bg-green-50 text-green-700 font-semibold py-2.5 rounded-lg hover:bg-green-600 hover:text-white transition-colors border border-green-200 hover:border-green-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-3xl text-stone-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-800">
                No produce found
              </h3>
              <p className="text-stone-500 mt-2 max-w-md">
                We could not find any items matching your current filters. Try
                adjusting your search or clearing the filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setMaxPrice("");
                  setCurrentPage(1);
                }}
                className="mt-6 px-6 py-2 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* --- Pagination Component --- */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col items-center mt-16 mb-8">
            <Pagination>
              <Pagination.Summary className="text-stone-500 text-sm mb-4 block">
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredAndSortedVegetables.length,
                )}{" "}
                of {filteredAndSortedVegetables.length} results
              </Pagination.Summary>

              <Pagination.Content className="flex gap-2 items-center">
                <Pagination.Item>
                  <Pagination.Previous
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "hover:bg-stone-200 cursor-pointer text-stone-700"
                    }`}
                  >
                    <Pagination.PreviousIcon />
                    <span className="hidden sm:inline">Previous</span>
                  </Pagination.Previous>
                </Pagination.Item>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Pagination.Item key={pageNum}>
                      <Pagination.Link
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-md cursor-pointer transition-colors ${
                          currentPage === pageNum
                            ? "bg-green-600 text-white font-bold"
                            : "hover:bg-stone-200 text-stone-700 font-medium"
                        }`}
                      >
                        {pageNum}
                      </Pagination.Link>
                    </Pagination.Item>
                  ),
                )}

                <Pagination.Item>
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "hover:bg-stone-200 cursor-pointer text-stone-700"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
