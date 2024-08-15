import React from "react";
import CustomTop from "../components/customTop";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "../components/footer";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop text="Login" bread="Login" classname="bg-n100" />
      <div className="my-32 flex w-container flex-col items-center justify-center">
        <form className="flex w-[350px] flex-col gap-4">
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
            <Input name="email" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot">
              <Button variant="link" className="p-0 text-[12px] text-n300">
                Forgot Password?
              </Button>
            </Link>
          </div>
          <Button type="submit" className="rounded-sm bg-b900">
            Login
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
