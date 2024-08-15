import React from "react";
import CustomTop from "../components/customTop";
import { LuPackageCheck } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { Footer } from "../components/footer";
import UnsuccessfullOrder from "./unsuccessfullOrder";

const OrderPage = () => {
  try {
    return (
      <main>
        <div className="flex flex-col items-center justify-center">
          {" "}
          <CustomTop
            text="Successful Order"
            bread="Order Successful"
            classname="bg-g100"
          />
          <div className="my-32 flex w-container flex-col items-center justify-center gap-7">
            <LuPackageCheck size={120} />
            <h1 className="text-3xl font-bold text-b900">
              Thank you for shopping!
            </h1>
            <p className="w-96 text-center text-sm text-n300">
              Your order has been successfully placed and is now being
              processed.
            </p>
            <Button className="w-[200px] bg-b800 font-light text-white">
              Go to my account
              <FaArrowRight className="pl-3 font-normal" size={25} />
            </Button>
          </div>
          <Footer className="bg-n100" />
        </div>
      </main>
    );
  } catch (error) {
    return UnsuccessfullOrder();
  }
};

export default OrderPage;
