"use client";

import React, { Suspense, useState } from "react";
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
import { FaLeaf } from "react-icons/fa";

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const [isLoading, setIsLoading] = useState(false);

  // Standard Login Handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (data) {
      toast.success("Welcome back!");
      router.push(redirectUrl);
      router.refresh(); // Refresh to update navbar state
    }

    if (error) {
      toast.error(error.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 bg-white rounded-2xl border border-stone-200 shadow-xl space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center flex flex-col items-center">
          <FaLeaf className="text-4xl text-green-600 mb-2" />
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Welcome Back
          </h1>
          <p className="text-sm text-stone-500">
            Log in to manage your fresh produce
          </p>
        </div>

        {/* Form Fields */}
        <Form onSubmit={handleLogin} className="flex flex-col gap-4">
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
              placeholder="you@example.com"
              className="bg-stone-50"
            />
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          {/* PASSWORD FIELD */}
          <TextField isRequired name="password">
            <Label className="text-sm font-medium text-stone-700">
              Password
            </Label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="bg-stone-50"
            />
            <FieldError className="text-red-500 text-xs mt-1" />
          </TextField>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm py-2.5"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </Form>

        {/* Footer Link */}
        <div className="text-center text-sm text-stone-500 pt-4 border-t border-stone-100">
          Do not have an account?{" "}
          <Link
            href={`/signup?redirect=${redirectUrl}`}
            className="font-bold text-green-700 hover:text-green-800 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
