import React from "react";
import CustomTop from "../components/customTop";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Footer } from "../components/footer";

const ForgotPage = () => {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop classname="bg-n100" />
      <div className="my-32 flex w-container flex-col items-center justify-center">
        <form className="flex w-96 flex-col gap-7">
          <p className="text-justify text-neutral-700">
            Please enter the email address associated with your account.
            We&apos;ll promptly send you a link to reset your password.
          </p>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" />
          </div>
          <Button className="transition-colors duration-500 ease-in-out">
            Send reset link
          </Button>
        </form>
      </div>
      <Footer className="bg-n100" />
    </main>
  );
};

export default ForgotPage;
