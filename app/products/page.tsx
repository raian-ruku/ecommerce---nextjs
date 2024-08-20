import CustomTop from "../components/customTop";
import SideBar from "./_components/sideBar";

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

const ProductPage = async ({ params }: { params: { id: number } }) => {
  return (
    <main className="flex w-full flex-col items-center justify-center">
      <CustomTop text="Products" bread="Products" classname="bg-n100" />
      <div className="flex w-container items-center">
        <SideBar />
      </div>
    </main>
  );
};

export default ProductPage;
