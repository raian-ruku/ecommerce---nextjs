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

      const response = await fetch(
        `https://dummyjson.com/products/${productId}`,
      );
      const data = await response.json();
      setProductName(data.title);
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
          <a href={href}>{displayName}</a>
        </BreadcrumbItem>
      </React.Fragment>
    );
  });

  return (
    <div
      className={`mt-10 flex w-full items-center justify-center ${classname} capitalize`}
    >
      <div className="my-10 flex w-container flex-col gap-4">
        <h1 className="text-2xl capitalize">
          {productName || pathArray[pathArray.length - 1]}
        </h1>
        <Breadcrumb>
          <BreadcrumbList>
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
