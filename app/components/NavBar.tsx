import { Button } from "@/components/ui/button";
import Logo from "@/public/images/logo.png";
import { Input } from "@nextui-org/input";
import Image from "next/image";
import Link from "next/link";
import { CiLogin, CiSearch } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import CategoryDrop from "./categoryDrop";
import CartCount from "./cartCount";

const NavBar = () => {
  return (
    <main className="flex flex-col">
      <div className="flex w-full flex-col">
        <div className="flex h-[30px] place-content-center items-center bg-b800 text-xs text-white sm:text-sm md:text-base">
          Get 25% off on your first order.
          <span className="pl-2 font-medium">Order Now</span>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex w-container items-center justify-between px-4 py-4 md:px-8">
            <Link href="/">
              <Image src={Logo} alt="e-commerce logo" className="h-8 md:h-10" />
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="link" className="text-neutral-500">
                  Home
                </Button>
              </Link>
              <CategoryDrop />
              <Button
                variant="link"
                className="hidden text-neutral-500 md:inline"
              >
                About
              </Button>
              <Button
                variant="link"
                className="hidden text-neutral-500 md:inline"
              >
                Contact
              </Button>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden flex-row items-center sm:flex">
                <Input
                  placeholder="Search products"
                  variant="underlined"
                  startContent={<CiSearch size={20} className="pr-2" />}
                  className="w-full max-w-[150px] rounded-md border-[1px] border-neutral-300 text-neutral-500 placeholder:text-neutral-300 sm:max-w-[200px] md:max-w-[300px]"
                />
              </div>

              <Link href="/profile">
                <RxAvatar size={20} className="text-neutral-500" />
              </Link>

              <Link href="/cart">
                <CartCount />
              </Link>

              <Link href="/login">
                <CiLogin size={25} className="text-neutral-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NavBar;
