import React from "react";
import { IconType } from "react-icons";

interface HomeProps {
  icon: IconType;
  title: string;
  description: string;
}

const HomeDetails = ({ icon: Icon, title, description }: HomeProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-n100 flex h-10 w-10 items-center justify-center rounded-full">
        <Icon size={20} />
      </div>
      <h2 className="text-lg text-b800">{title}</h2>
      <p className="w-[300px] text-left text-[13px] text-neutral-500">
        {description}
      </p>
    </div>
  );
};

export default HomeDetails;
