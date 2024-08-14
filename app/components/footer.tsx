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
      className={`${className} flex w-full items-center justify-center py-16`}
    >
      <div className={`flex w-container items-center justify-between`}>
        <div className="flex flex-col gap-y-5">
          <Image src={image} alt="" />
          <p className="w-80 text-justify text-sm text-neutral-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In, earum.
          </p>
          <div className="flex items-center gap-6 text-2xl text-neutral-500">
            <FaGithub />
            <FaInstagram />
            <FaYoutube />
          </div>
        </div>
        <div className="flex flex-col gap-y-5 text-n300">
          SUPPORT
          <div className="flex flex-col gap-y-3 text-neutral-600">
            <p>FAQ</p>
            <p>Terms of use</p>
            <p>Privacy Policy</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 text-n300">
          COMPANY
          <div className="flex flex-col gap-y-3 text-neutral-600">
            <p>About us</p>
            <p>Contact us</p>
            <p>Careers</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 text-n300">
          SHOP
          <div className="flex flex-col gap-y-3 text-neutral-600">
            <p>My Account</p>
            <p>Checkout</p>
            <p>Cart</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-5 text-n300">
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
