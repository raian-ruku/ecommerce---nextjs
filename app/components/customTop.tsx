"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const CustomTop = ({ classname }: { classname: string }) => {
  const pathname = usePathname();
  const [productName, setProductName] = useState<string | null>(null);

  // Extract path segments and ID
  const pathArray = pathname.split("/").filter((path) => path);
  const productId = pathArray[pathArray.length - 1]; // Assuming the last segment is the product ID

  useEffect(() => {
    const fetchProductName = async () => {
      if (isNaN(Number(productId))) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/products/${productId}`,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (
          data.success &&
          data.data &&
          data.data.length > 0 &&
          data.data[0].product_title
        ) {
          setProductName(data.data[0].product_title);
        } else {
          console.error("Product title not found in response data");
        }
      } catch (error) {
        console.error("Failed to fetch product name:", error);
      }
    };

    fetchProductName();
  }, [productId]);

  const breadcrumbs = pathArray.map((path, index) => {
    // Create href by joining up to the current path
    const href = `/${pathArray.slice(0, index + 1).join("/")}`;
    const displayName =
      index === pathArray.length - 1 && productName ? productName : path;

    return (
      <React.Fragment key={index}>
        {index > 0 && <BreadcrumbSeparator />}
        <BreadcrumbItem>
          <a href={href} className="text-sm md:text-base">
            {displayName}
          </a>
        </BreadcrumbItem>
      </React.Fragment>
    );
  });

  return (
    <div
      className={`mt-10 flex w-full items-center justify-center ${classname} capitalize`}
    >
      <div className="my-10 flex w-container max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold capitalize sm:text-2xl md:text-3xl">
          {productName || pathArray[pathArray.length - 1]}
        </h1>
        <Breadcrumb>
          <BreadcrumbList className="text-xs sm:text-sm md:text-base">
            <BreadcrumbItem>
              <a href="/">Home</a>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbs}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default CustomTop;
