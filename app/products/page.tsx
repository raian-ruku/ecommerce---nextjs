// import getProductbyID from "@/app/backend/getProductbyID";

interface ProductDetails {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

const ProductPage = async ({ params }: { params: number }) => {
  //   const product: ProductDetails[] = await getProductbyID(params);
  //   console.log(product);
  return <div>ProductPage</div>;
};

export default ProductPage;
