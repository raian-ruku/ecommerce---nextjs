import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const CustomTop = ({
  text,
  classname,
  bread,
}: {
  text: string;
  classname: string;
  bread: string;
}) => {
  return (
    <div
      className={`mt-10 flex w-full items-center justify-center ${classname} `}
    >
      <div className="my-10 flex w-container flex-col gap-4">
        {" "}
        <h1 className="text-2xl">{text}</h1>{" "}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{bread}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>{" "}
      </div>
    </div>
  );
};

export default CustomTop;
