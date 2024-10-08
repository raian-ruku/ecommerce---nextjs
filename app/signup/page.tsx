"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Footer } from "../components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import CustomTop from "../components/customTop";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    user_name: "",
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
    setIsSubmitting(true); // Set the flag to true when the form is submitted
  };

  useEffect(() => {
    const submitForm = async () => {
      if (isSubmitting) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/signup`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            },
          );

          if (!response.ok) {
            if (response.status === 409) {
              // Handle email already exists
              toast.error(
                "Email already exists. Please use a different email.",
                {
                  dismissible: true,
                  closeButton: true,
                },
              );
            } else {
              throw new Error("Signup failed");
            }
          } else {
            toast.success("Signup successful", {
              dismissible: true,
              closeButton: true,
            });
            router.push("/login");
          }
        } catch (error) {
          console.error(error);
          toast.error("Signup failed. Please try again.", {
            dismissible: true,
            closeButton: true,
          });
        } finally {
          setIsSubmitting(false); // Reset the flag after submission
        }
      }
    };

    submitForm();
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
            <Label htmlFor="name">Name</Label>
            <Input
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
            />
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
              value={formData.user_password}
              onChange={handleInputChange}
            />
          </div>
          <p className="text-justify text-[10px] text-neutral-400">
            By creating an account you agree with our Terms of Service, Privacy
            Policy.
          </p>
          <Button type="submit" className="rounded-sm bg-b900">
            Create Account
          </Button>
          <div className="flex items-center justify-center gap-2 text-n300">
            Already have an account?
            <Link href="/signin">
              <Button variant="link" className="p-0 text-neutral-600">
                Sign In
              </Button>
            </Link>
          </div>
        </form>
      </div>
      <Footer className="bg-n100" />
    </main>
  );
}
