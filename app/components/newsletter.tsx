import React from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export const Newsletter = () => {
  return (
    <main className="flex w-full items-center justify-center bg-n100 py-10 sm:py-20">
      <div className="flex w-container flex-col items-center justify-between gap-6 px-4 md:flex-row md:gap-0">
        <div className="flex flex-col gap-y-2 text-center md:gap-y-5 md:text-left">
          <h1 className="text-[20px] font-bold text-b900 md:text-[26px]">
            Join Our Newsletter
          </h1>
          <h3 className="text-[12px] text-neutral-500 md:text-[13px]">
            We love to surprise our subscribers with occasional gifts.
          </h3>
        </div>
        <form className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
          <Input
            placeholder="Your email address"
            className="w-full max-w-xs border-[1px] border-neutral-200 bg-transparent placeholder:text-n300 md:w-96"
            type="email"
          />
          <Button type="submit" className="w-full bg-b900 md:w-auto">
            Subscribe
          </Button>
        </form>
      </div>
    </main>
  );
};
