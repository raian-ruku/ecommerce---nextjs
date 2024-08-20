import Link from "next/link";
import CustomTop from "../components/customTop";
import SideBar from "./_components/sideBar";
import StockBadge from "../components/stockBadge";
import Image from "next/image";
import { Footer } from "../components/footer";
import { Newsletter } from "../components/newsletter";

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  image: string;
}

const ProductPage = async ({ params }: { params: { id: number } }) => {
  const response = await fetch("https://fakestoreapi.com/products");
  const products: ProductDetails[] = await response.json();
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop text="Products" bread="Products" classname="bg-n100" />
      <div className="my-10 flex w-container justify-between">
        <SideBar />
        <div className="grid grid-cols-3 justify-between gap-4">
          {products.map((prod) => (
            <div key={prod.id}>
              <div className="flex flex-col gap-y-5 rounded-md border-[1px] border-n100 p-4 shadow-md">
                <Image
                  className="h-[256px] w-[256px] justify-self-center"
                  src={prod.image}
                  alt={prod.title}
                  unoptimized
                  height={256}
                  width={256}
                />
                <Link href={`/products/${prod.id}`}>
                  <div className="h-[100px] w-[256px] text-b900">
                    {prod.title}
                  </div>
                </Link>
                <div className="flex w-auto items-center gap-4">
                  <StockBadge />${prod.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Newsletter />
      <Footer />
    </main>
  );
};

export default ProductPage;
