"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
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

export function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    // Better Auth standard signup configuration with only the requested fields
    const { data, error } = await authClient.signUp.email({
      email: user.email as string,
      password: user.password as string,
      name: user.name as string,
      image: user.photoUrl as string,
    });

    if (data) {
      toast.success("Account created successfully!");
      router.push(redirectUrl);
    }

    if (error) {
      toast.error(error.message || "Error signing up");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 bg-white rounded-2xl border border-stone-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Create an Account
          </h1>
          <p className="text-sm text-stone-500">
            Enter your details below to get started
          </p>
        </div>

        {/* Form Fields */}
        <Form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* NAME FIELD */}
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (value.trim().length < 2) {
                return "Name must be at least 2 characters long";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-stone-700">
              Full Name
            </Label>
            <Input type="text" placeholder="John Doe" className="bg-stone-50" />
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          {/* EMAIL FIELD */}
          <TextField
            isRequired
            name="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-stone-700">
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="john@example.com"
              className="bg-stone-50"
            />
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          {/* PHOTO URL FIELD */}
          <TextField
            name="photoUrl"
            validate={(value) => {
              if (value && !/^https?:\/\/.+/i.test(value)) {
                return "Please enter a valid image URL (starting with http:// or https://)";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-stone-700">
              Photo URL{" "}
              <span className="text-stone-400 font-normal">(Optional)</span>
            </Label>
            <Input
              type="url"
              placeholder="https://example.com/profile.jpg"
              className="bg-stone-50"
            />
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          {/* PASSWORD FIELD */}
          <TextField
            isRequired
            name="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-stone-700">
              Password
            </Label>
            <Input
              type="password"
              placeholder="Minimum 8 characters"
              className="bg-stone-50"
            />
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
            >
              Sign Up
            </Button>
            <Button
              type="reset"
              variant="danger-soft"
              className="flex-1 font-medium bg-stone-100 text-stone-700 hover:bg-stone-200"
            >
              Reset
            </Button>
          </div>
        </Form>

        {/* Footer Link */}
        <div className="text-center text-sm text-stone-500 pt-4 border-t border-stone-100">
          Already have an account?{" "}
          <Link
            href={`/login?redirect=${redirectUrl}`}
            className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </Card>
    </div>
  );
}

// 2. Create a new default export that wraps it in Suspense
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-stone-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
