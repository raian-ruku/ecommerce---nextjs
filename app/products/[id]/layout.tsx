import { Metadata } from "next";

interface ProductDetails {
  id: number;
  title: string;
}

type Props = {
  params: { id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const product: ProductDetails = await fetch(
    `https://dummyjson.com/products/${id}`,
  ).then((response) => response.json());

  return {
    title: product.title,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
