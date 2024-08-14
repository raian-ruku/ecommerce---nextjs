import React from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export const Newsletter = () => {
  return (
    <main className="bg-n100 flex w-full items-center justify-center py-20">
      <div className="flex w-container items-center justify-between">
        <div className="flex flex-col gap-y-5">
          <h1 className="text-[26px] font-bold text-b900">
            Join Our Newsletter
          </h1>
          <h3 className="text-[13px] text-neutral-500">
            We love to surprise our subscribers with occasional gifts.
          </h3>
        </div>
        <form className="flex gap-3">
          <Input
            placeholder="Your email address"
            className="placeholder:text-n300 w-96 border-[1px] border-neutral-200 bg-transparent"
            type="email"
          />
          <Button type="submit" className="bg-b900">
            Subscribe
          </Button>
        </form>
      </div>
    </main>
  );
};
