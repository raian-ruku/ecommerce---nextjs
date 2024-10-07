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
import Image from "next/image";
import Logo from "@/public/images/admin.png";

const AdminLogIn = () => {
  const [formData, setFormData] = useState({
    user_login: "",
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
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/admin/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
              credentials: "include",
            },
          );

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();

          toast.success(
            `Login successful as ${data.data.admin_username} (${data.data.role})`,
            {
              dismissible: true,
              closeButton: true,
            },
          );

          // Dispatch custom event for successful login
          window.dispatchEvent(new Event("user-login"));

          router.push("/admin/dashboard");
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
    <main className="flex h-screen w-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        action=""
        className="flex h-auto w-auto flex-col items-center rounded-xl border-[1px] border-n100 bg-white p-5 shadow-xl"
      >
        <Image
          src={Logo}
          alt="admin logo"
          height={50}
          width={50}
          className="mt-4 h-auto w-[100px]"
        />
        <div className="mt-5 flex w-72 flex-col justify-center gap-y-2">
          <Label htmlFor="emailorusername">Email or Username</Label>
          <Input
            name="user_login"
            className="p-1"
            value={formData.user_login}
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
        <Button className="my-5 w-72 bg-black">Log In</Button>
      </form>
    </main>
  );
};

export default AdminLogIn;
