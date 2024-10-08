"use client";

import React, { useState, useEffect } from "react";
import CustomTop from "../components/customTop";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "../components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (isSubmitting) {
      const loginUser = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();

          toast.success(`Login successful as ${data.data.user_name}`, {
            dismissible: true,
            closeButton: true,
          });

          // Dispatch custom event for successful login
          window.dispatchEvent(new Event("user-login"));

          router.push("/profile");
        } catch (error) {
          console.error(error);
          toast.error("Login failed", {
            dismissible: true,
            closeButton: true,
          });
        } finally {
          setIsSubmitting(false);
        }
      };

      loginUser();
    }
  }, [isSubmitting, formData, router]);

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop classname="bg-n100" />
      <div className="my-32 flex w-container flex-col items-center justify-center">
        <form className="flex w-[350px] flex-col gap-4" onSubmit={handleSubmit}>
          <Button
            variant="outline"
            className="flex flex-row items-center gap-3 font-bold"
          >
            <FaGoogle size={20} /> Continue with Google
          </Button>
          <div className="my-4 flex items-center justify-center">
            <div className="w-full border-[1px] border-neutral-200"></div>
            <span className="mx-4 text-n300">OR</span>
            <div className="w-full border-[1px] border-neutral-200"></div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="user_email"
              value={formData.user_email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              name="user_password"
              type="password"
              value={formData.user_password}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot">
              <Button variant="link" className="p-0 text-[12px] text-n300">
                Forgot Password?
              </Button>
            </Link>
          </div>
          <Button
            type="submit"
            className="rounded-sm bg-b900"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <div className="flex items-center justify-center gap-2 text-n300">
            Don&apos;t have an account?
            <Link href="/signup">
              <Button variant="link" className="p-0 text-neutral-600">
                Sign Up
              </Button>
            </Link>
          </div>
        </form>
      </div>
      <Footer className="bg-n100" />
    </main>
  );
};

export default LoginPage;
