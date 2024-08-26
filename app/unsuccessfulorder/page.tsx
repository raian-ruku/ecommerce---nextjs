import { Button } from "@/components/ui/button";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { LuPackageX } from "react-icons/lu";
import CustomTop from "../components/customTop";
import { Footer } from "../components/footer";
import Link from "next/link";

const UnsuccessfulOrderPage = () => {
  return (
    <main>
      <div className="flex flex-col items-center justify-center">
        {" "}
        <CustomTop classname="bg-r100" />
        <div className="my-32 flex w-container flex-col items-center justify-center gap-7">
          <LuPackageX size={120} />
          <h1 className="text-3xl font-bold text-b900">
            Oops! There was an issue
          </h1>
          <p className="w-96 text-center text-sm text-n300">
            Oops! There was a problem processing your order. Please review the
            details and try again.
          </p>
          <Link href="/cart">
            <Button className="w-[200px] bg-b800 font-light text-white">
              Reorder
              <FaArrowRight className="pl-3 font-normal" size={25} />
            </Button>
          </Link>
        </div>
        <Footer className="bg-n100" />
      </div>
    </main>
  );
};

export default UnsuccessfulOrderPage;
