"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CiLogin, CiLogout } from "react-icons/ci";
import { FaBoxArchive } from "react-icons/fa6";
import { MdPeopleAlt } from "react-icons/md";
import { MdReviews } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa6";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { toast } from "sonner";
import Logo from "@/public/images/admin.png";
import Image from "next/image";
import ProductsPage from "./_components/products";
import DashboardPage from "./_components/dashboard";
import OrdersPage from "./_components/orders";
import CustomersPage from "./_components/customers";
import AdminSettings from "./_components/adminSettings";
import SalesPage from "./_components/sales";
import ReviewsPage from "./_components/reviews";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const checkLoginStatus = () => {
    fetch(`${process.env.NEXT_PUBLIC_API}/admin/check-auth`, {
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
          router.push("/admin/login");
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
    <main className="flex h-screen w-full items-center justify-center p-5">
      <Tabs
        defaultValue="dashboard"
        orientation="vertical"
        className="flex h-full w-full"
      >
        <TabsList className="flex h-full w-[250px] flex-col items-start justify-start gap-5 bg-transparent text-[20px]">
          <Image
            src={Logo}
            alt="admin logo"
            height={250}
            width={250}
            className="mx-16 mb-20 h-auto w-32 items-center"
          />
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <MdDashboard />
              Dashboard
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <FaBoxArchive />
              Products
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <BiSolidBadgeDollar />
              Sales
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <FaCartArrowDown />
              Orders
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <MdPeopleAlt />
              Customers
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <MdReviews />
              Reviews
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center gap-1 transition-all duration-300 ease-in-out data-[state=active]:w-[200px] data-[state=inactive]:w-[200px] data-[state=active]:items-start data-[state=inactive]:items-start data-[state=active]:justify-start data-[state=inactive]:justify-start data-[state=active]:bg-red-500 data-[state=active]:text-[20px] data-[state=inactive]:text-[15px] data-[state=active]:text-white data-[state=active]:drop-shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <IoSettingsSharp />
              Settings
            </div>
          </TabsTrigger>{" "}
          {isLoggedIn ? (
            <Dialog>
              <DialogTrigger className="flex w-fit flex-row items-center gap-2 rounded-xl bg-red-700 p-2 text-white drop-shadow-xl">
                <CiLogout size={15} />
                <p className="text-[15px]">Logout</p>
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
            <Button className="rounded-xl bg-green-500 p-2 text-white drop-shadow-xl hover:bg-green-600">
              <Link
                href="/admin/login"
                className="flex w-fit flex-row items-center gap-2"
              >
                <CiLogin size={15} />
                <p className="text-[15px]">Login</p>
              </Link>
            </Button>
          )}
        </TabsList>

        {/* Vertical separator */}
        <div className="mx-8 h-auto w-[1px] bg-neutral-200"></div>
        <div className="h-full flex-1 px-4">
          <TabsContent value="dashboard">
            <DashboardPage />
          </TabsContent>
          <TabsContent value="products">
            <ProductsPage />
          </TabsContent>
          <TabsContent value="sales">
            <SalesPage />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersPage />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersPage />
          </TabsContent>
          <TabsContent value="reviews">
            <ReviewsPage />
          </TabsContent>
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
};

export default AdminDashboard;
