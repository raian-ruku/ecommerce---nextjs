import Image from "next/image";
import Logo from "@/public/images/logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiaAngleDownSolid } from "react-icons/lia";
import { Input } from "@nextui-org/input";
import { CiSearch } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import Link from "next/link";

const NavBar = async () => {
  return (
    <main className="flex flex-col">
      <div className="flex w-full flex-col">
        <div>
          <div className="flex h-[30px] place-content-center items-center bg-b800 text-white">
            Get 25% off on your first order.
            <span className="pl-2 font-medium">Order Now</span>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <div className="flex w-container justify-between pt-4 text-[16px] text-neutral-500">
            <Link href="/">
              <Image src={Logo} alt="e-commerce logo" />
            </Link>
            <div className="">
              <Link href="/">
                <Button variant="link" className="text-neutral-500">
                  Home
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="text-neutral-500">
                    Categories <LiaAngleDownSolid className="pl-2" size={20} />
                  </Button>
                </DropdownMenuTrigger>
              </DropdownMenu>

              <Button variant="link" className="text-neutral-500">
                About
              </Button>
              <Button variant="link" className="text-neutral-500">
                Contact
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-row items-center">
                <Input
                  placeholder="Search products"
                  variant="underlined"
                  startContent={<CiSearch size={30} className="pr-2" />}
                  className="rounded-md border-[1px] border-neutral-300 text-neutral-500 placeholder:text-neutral-100"
                />
              </div>
              <Link href="/profile">
                <RxAvatar size={25} className="text-neutral-500" />
              </Link>
              <Link href="/cart">
                <CiShoppingCart size={30} className="text-neutral-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NavBar;
