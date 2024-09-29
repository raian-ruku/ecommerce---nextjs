"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/public/images/logo.png";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import Link from "next/link";
import { CiLogin, CiSearch, CiLogout } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import CategoryDrop from "./categoryDrop";
import CartCount from "./cartCount";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkLoginStatus = () => {
    fetch(`${process.env.NEXT_PUBLIC_API}/check-auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoggedIn(data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      });
  };

  useEffect(() => {
    checkLoginStatus();

    // Listen for login events
    window.addEventListener("user-login", checkLoginStatus);

    // Listen for logout events
    window.addEventListener("user-logout", () => setIsLoggedIn(false));

    return () => {
      window.removeEventListener("user-login", checkLoginStatus);
      window.removeEventListener("user-logout", () => setIsLoggedIn(false));
    };
  }, []);

  const handleLogout = () => {
    fetch(`${process.env.NEXT_PUBLIC_API}/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false);
          toast.success("Logged out successfully", {
            dismissible: true,
            closeButton: true,
          });
          router.push("/login");
          window.dispatchEvent(new Event("user-logout"));
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed");
      });
  };

  return (
    <main className="flex flex-col">
      <div className="flex w-full flex-col">
        <div className="flex h-[30px] place-content-center items-center bg-b800 text-xs text-white sm:text-sm md:text-base">
          Get 25% off on your first order.
          <Link
            href="/products"
            className="pl-2 font-medium hover:underline hover:underline-offset-2"
          >
            Order Now
          </Link>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex w-container items-center justify-between px-4 py-4 md:px-8">
            <Link href="/">
              <Image src={Logo} alt="e-commerce logo" className="h-8 md:h-10" />
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="link" className="text-neutral-500">
                  Home
                </Button>
              </Link>
              <CategoryDrop />
              <Button
                variant="link"
                className="hidden text-neutral-500 md:inline"
              >
                About
              </Button>
              <Link href="/custom">
                <Button
                  variant="link"
                  className="hidden text-neutral-500 md:inline"
                >
                  Contact
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden flex-row items-center sm:flex">
                <Input
                  placeholder="Search products"
                  variant="underlined"
                  startContent={<CiSearch size={30} className="pr-2" />}
                  className="w-full max-w-[150px] rounded-md border-[1px] border-neutral-300 text-neutral-500 placeholder:text-neutral-300 sm:max-w-[200px] md:max-w-[300px]"
                />
              </div>

              <Link href="/profile">
                <RxAvatar size={20} className="text-neutral-500" />
              </Link>

              <Link href="/cart">
                <CartCount />
              </Link>

              {isLoggedIn ? (
                <Button variant="ghost" onClick={handleLogout} className="p-0">
                  <CiLogout size={25} className="text-neutral-500" />
                </Button>
              ) : (
                <Link href="/login">
                  <CiLogin size={25} className="text-neutral-500" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NavBar;
