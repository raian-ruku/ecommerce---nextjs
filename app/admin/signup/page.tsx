"use client";

import React, { useState, useEffect } from "react";
// import CustomTop from "../components/customTop";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Footer } from "../components/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { main } from "bun";
import Image from "next/image";
import Logo from "@/public/images/admin.png";

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    user_username: "",
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
            `${process.env.NEXT_PUBLIC_API}/admin/signup`,
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
            router.push("/admin/login");
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
    <main className="flex h-screen w-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex h-auto w-auto flex-col items-center rounded-xl border-[1px] border-n100 bg-white px-5 shadow-xl"
      >
        <Image
          src={Logo}
          alt="admin logo"
          height={50}
          width={50}
          className="mt-4 h-auto w-[100px]"
        />
        <div className="mt-5 flex w-72 flex-col justify-center gap-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            name="user_username"
            className="p-1"
            value={formData.user_username}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-5 flex w-72 flex-col justify-center gap-y-2">
          <Label htmlFor="Name">Name</Label>
          <Input
            name="user_name"
            className="p-1"
            value={formData.user_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-5 flex w-72 flex-col justify-center gap-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="user_email"
            className="p-1"
            value={formData.user_email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-5 flex w-72 flex-col justify-center gap-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="user_password"
            className="p-1"
            value={formData.user_password}
            onChange={handleInputChange}
          />
        </div>
        <Button className="my-10 mt-5 w-72 bg-black">Sign Up</Button>
      </form>
    </main>
  );
};

export default AdminSignup;
