"use client";

import React, { useState } from "react";
import CustomTop from "../components/customTop";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@nextui-org/input";

import { Input } from "@/components/ui/input";
import { BsThreeDots } from "react-icons/bs";
import { LiaAngleDownSolid } from "react-icons/lia";
import { MdOutlineReviews } from "react-icons/md";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop text="My Account" bread="Profile" classname="bg-n100" />
      <div className="my-32 flex w-container items-center">
        <Tabs
          defaultValue="orders"
          orientation="vertical"
          className="flex w-full"
        >
          <TabsList className="flex w-[250px] flex-col">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="accountDetail">Account Detail</TabsTrigger>
            <TabsTrigger value="logout">Logout</TabsTrigger>
          </TabsList>
          {/* Vertical separator */}
          <div className="border-r border-gray-200"></div>
          <div className="flex-1 p-4">
            <TabsContent value="orders">
              <div className="p-4">
                <h2 className="text-xl font-bold">Orders</h2>
                <div className="mt-4 space-y-6">
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Raw Black T-Shirt Lineup
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ordered On: 27 July 2023
                        </p>
                        <p className="text-sm">$70.00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-yellow-500">
                        Processing
                      </span>
                      <Button variant="outline">View item</Button>
                    </div>
                  </div>
                  <hr className="my-6 border-t border-gray-200" />
                  {/* Order 2 */}
                  <div className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Monochromatic Wardrobe
                        </h3>
                        <p className="text-sm text-gray-500">
                          Ordered On: 9 March 2023
                        </p>
                        <p className="text-sm">$27.00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-green-500">Completed</span>
                      <Button variant="outline">View item</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="wishlist">
              <div className="p-4">Wishlist content here...</div>
            </TabsContent>
            <TabsContent value="address">
              <div className="p-4">Address content here...</div>
            </TabsContent>
            <TabsContent value="password">
              <div className="p-4">Password content here...</div>
            </TabsContent>
            <TabsContent value="accountDetail">
              <div className="p-4">Account Detail content here...</div>
            </TabsContent>
            <TabsContent value="logout">
              <div className="p-4">Logout content here...</div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
};

export default ProfilePage;
