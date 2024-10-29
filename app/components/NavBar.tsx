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
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface User {
  user_name: string;
  user_image: string;
}

interface Product {
  product_id: number;
  product_title: string;
  product_thumbnail: string;
  product_price: number;
}

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
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

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user-info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const handleUserLogin = () => {
      checkLoginStatus();
      fetchUserInfo();
    };

    window.addEventListener("user-login", handleUserLogin);
    window.addEventListener("user-logout", () => setIsLoggedIn(false));

    return () => {
      window.removeEventListener("user-login", handleUserLogin);
      window.removeEventListener("user-logout", () => setIsLoggedIn(false));
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserInfo();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);

    if (value.trim()) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/search?q=${encodeURIComponent(value.trim())}&limit=5`,
        );
        if (!response.ok) {
          throw new Error("Search failed");
        }
        const data = await response.json();
        setSearchResults(data.data);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to perform search");
      }
    } else {
      setSearchResults([]);
    }
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
              <div
                ref={searchRef}
                className="relative hidden flex-row items-center sm:flex"
              >
                <Input
                  placeholder="Search products"
                  startContent={<CiSearch size={30} className="pr-2" />}
                  className="rounded-mdtext-neutral-500 w-full max-w-[150px] placeholder:text-neutral-300 sm:max-w-[200px] md:max-w-[300px]"
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setIsSearching(true)}
                />
                {isSearching && searchResults.length > 0 && (
                  <div className="absolute left-0 top-full z-50 mt-1 h-[100px] w-full overflow-y-scroll rounded-b-md bg-white shadow-lg">
                    {searchResults.map((product) => (
                      <Link
                        key={product.product_id}
                        href={`/products/${product.product_id}`}
                      >
                        <div className="flex items-center p-2 hover:bg-gray-100">
                          <Image
                            src={product.product_thumbnail}
                            alt={product.product_title}
                            width={40}
                            height={40}
                            className="mr-2 rounded-md"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {product.product_title}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${Number(product.product_price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/profile">
                {isLoggedIn && user ? (
                  user.user_image ? (
                    <Image
                      src={user.user_image}
                      alt={user.user_name}
                      width={25}
                      height={25}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_name)}`}
                      alt={user.user_name}
                      width={25}
                      height={25}
                      className="rounded-full"
                    />
                  )
                ) : (
                  <RxAvatar size={25} className="text-neutral-500" />
                )}
              </Link>

              <Link href="/cart">
                <CartCount />
              </Link>

              {isLoggedIn ? (
                <Dialog>
                  <DialogTrigger>
                    <CiLogout size={25} className="text-neutral-500" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure to log out?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="bg-red-500 text-white hover:bg-red-600 hover:text-white"
                        >
                          Log out
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
