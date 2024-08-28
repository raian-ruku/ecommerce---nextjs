import React from "react";
import Image from "next/image";
import image from "@/public/images/footer.png";
import { FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import { LiaCcMastercard } from "react-icons/lia";
import { GrAmex } from "react-icons/gr";
import { RiVisaLine } from "react-icons/ri";

export const Footer = ({ className }: { className?: string }) => {
  return (
    <main
      className={`${className} flex w-full items-center justify-center py-10 sm:py-16`}
    >
      <div
        className={`flex w-container flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between`}
      >
        <div className="flex flex-col items-center gap-y-5 sm:items-start">
          <Image src={image} alt="Logo" />
          <p className="w-full max-w-xs text-center text-sm text-neutral-500 sm:text-left">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In, earum.
          </p>
          <div className="flex items-center gap-6 text-2xl text-neutral-500">
            <FaGithub />
            <FaInstagram />
            <FaYoutube />
          </div>
        </div>

        <div className="flex flex-col gap-y-5 text-center text-n300 sm:text-left">
          SUPPORT
          <div className="flex flex-col gap-y-3 text-neutral-600">
            <p>FAQ</p>
            <p>Terms of use</p>
            <p>Privacy Policy</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-5 text-center text-n300 sm:text-left">
          COMPANY
          <div className="flex flex-col gap-y-3 text-neutral-600">
            <p>About us</p>
            <p>Contact us</p>
            <p>Careers</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-5 text-center text-n300 sm:text-left">
          SHOP
          <div className="flex flex-col gap-y-3 text-neutral-600">
            <p>My Account</p>
            <p>Checkout</p>
            <p>Cart</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-y-5 text-center text-n300 sm:items-start sm:text-left">
          ACCEPTED PAYMENTS
          <div className="flex flex-row gap-6 text-3xl text-neutral-500">
            <LiaCcMastercard />
            <GrAmex />
            <RiVisaLine />
          </div>
        </div>
      </div>
    </main>
  );
};
