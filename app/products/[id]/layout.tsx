import { Metadata } from "next";

interface ProductDetails {
  product_id: number;
  product_title: string;
}

type Props = {
  params: { id: number };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const product: ProductDetails = await fetch(
    `${process.env.NEXT_PUBLIC_API}/products/${id}`,
  ).then((response) => response.json());

  return {
    title: product.product_title,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
