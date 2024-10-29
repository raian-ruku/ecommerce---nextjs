"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
const PasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisibleCurrent, setIsVisibleCurrent] = React.useState(false);
  const [isVisibleNew, setIsVisibleNew] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ currentPassword, newPassword }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing the password");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibilityCurrent = () => setIsVisibleCurrent(!isVisibleCurrent);
  const toggleVisibilityNew = () => setIsVisibleNew(!isVisibleNew);

  return (
    <main>
      <h2 className="text-2xl font-bold">Password</h2>
      <div className="mt-10 h-fit">
        <form
          onSubmit={handleSubmit}
          className="flex w-[300px] flex-col gap-3 bg-transparent"
        >
          <Input
            name="current_password"
            type={isVisibleCurrent ? "text" : "password"}
            placeholder=""
            required
            labelPlacement="outside"
            label="Current Password"
            variant="flat"
            className="w-auto border-none p-0"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibilityCurrent}
                aria-label="toggle password visibility"
              >
                {isVisibleCurrent ? (
                  <FaEye className="pointer-events-none text-xl text-default-400" />
                ) : (
                  <FaEyeSlash className="pointer-events-none text-xl text-default-400" />
                )}
              </button>
            }
          />
          <Input
            name="new_password"
            type={isVisibleNew ? "text" : "password"}
            placeholder=""
            required
            labelPlacement="outside"
            label="New Password"
            variant="flat"
            className="w-auto border-none p-0"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibilityNew}
                aria-label="toggle password visibility"
              >
                {isVisibleNew ? (
                  <FaEye className="pointer-events-none text-xl text-default-400" />
                ) : (
                  <FaEyeSlash className="pointer-events-none text-xl text-default-400" />
                )}
              </button>
            }
          />
          <Button
            type="submit"
            className="mt-10 w-auto bg-green-500 transition-all duration-300 ease-in-out hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default PasswordPage;
