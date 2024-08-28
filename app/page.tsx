import Image from "next/image";
import heroImage from "@/public/images/hero_image.png";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import { BsTruck } from "react-icons/bs";
import HomeDetails from "@/app/components/homeDetails";
import { GiAchievement } from "react-icons/gi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import BestSeller from "@/app/components/bestSeller";
import dress from "@/public/images/dress.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LatestHome from "@/app/components/latestHome";
import FeaturedHome from "@/app/components/featuredHome";
import { Newsletter } from "@/app/components/newsletter";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center pt-5">
      <div className="flex w-full items-center justify-center bg-n100">
        <div className="flex w-container flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col gap-y-4 text-center md:text-left">
            <h1 className="text-2xl text-b800 md:text-[32px]">
              Fresh Arrivals Online
            </h1>
            <h3 className="pb-10 text-neutral-600">
              Discover Our Newest Collection Today.
            </h3>
            <Button className="mx-auto w-[200px] bg-b800 font-light text-white md:mx-0">
              View Collection
              <FaArrowRight className="pl-3 font-normal" size={25} />
            </Button>
          </div>
          <Image
            src={heroImage}
            alt="Hero Image"
            className="mt-10 max-w-full md:mt-20"
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-center py-20">
        <div className="flex w-container flex-col items-center justify-between gap-y-10 md:flex-row">
          <HomeDetails
            icon={BsTruck}
            title="Free Shipping"
            description="Upgrade your style today and get FREE shipping on all orders! Don't miss out."
          />
          <HomeDetails
            icon={GiAchievement}
            title="Satisfaction Guarantee"
            description="Shop confidently with our Satisfaction Guarantee: Love it or get a refund."
          />
          <HomeDetails
            icon={IoShieldCheckmarkOutline}
            title="Secure Payment"
            description="Your security is our priority. Your payments are secure with us."
          />
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="flex w-container flex-col items-center justify-between pt-5">
          <div className="flex flex-col gap-y-3 text-center">
            <h2 className="text-neutral-400">SHOP NOW</h2>
            <h1 className="text-xl text-b900 md:text-2xl">Best Selling</h1>
          </div>
          <BestSeller className="py-20" />
        </div>
      </div>

      <div className="mt-10 flex w-full items-center justify-center bg-gradient-to-r from-[#F6F6F6] to-white">
        <div className="flex w-container flex-col items-center justify-between md:flex-row">
          <div className="flex flex-col gap-y-6 text-center md:text-left">
            <h1 className="text-xl text-b800 md:text-[24px]">
              Browse Our Fashion Paradise!
            </h1>
            <h3 className="mx-auto w-full pb-10 text-[14px] text-neutral-600 md:mx-0 md:w-[450px]">
              Step into a world of style and explore our diverse collection of
              clothing categories.
            </h3>
            <Link href="/products">
              <Button className="mx-auto w-[200px] bg-b800 font-light text-white md:mx-0">
                Start Browsing
                <FaArrowRight className="pl-3 font-normal" size={25} />
              </Button>
            </Link>
          </div>
          <Image src={dress} alt="" className="mb-20 max-w-full" />
        </div>
      </div>

      <div className="flex w-full items-center justify-center pt-32">
        <div className="flex w-container flex-col items-center justify-center">
          <Tabs defaultValue="featured" className="mb-36">
            <TabsList className="mb-16 flex gap-4 bg-transparent">
              <TabsTrigger
                value="featured"
                className="data-[state=active]:rounded-full data-[state=active]:bg-b900 data-[state=active]:text-n100 data-[state=active]:shadow-none"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="latest"
                className="data-[state=active]:rounded-full data-[state=active]:bg-b900 data-[state=active]:text-n100 data-[state=active]:shadow-none"
              >
                Latest
              </TabsTrigger>
            </TabsList>
            <TabsContent value="featured">
              <FeaturedHome />
            </TabsContent>
            <TabsContent value="latest">
              <LatestHome />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </main>
  );
}
