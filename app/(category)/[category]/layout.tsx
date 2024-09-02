import { Metadata } from "next";

interface ProductDetails {
  category: string;
  title: string;
}

type Props = {
  params: { category: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = params.category;

  return {
    title: category.toLocaleUpperCase(),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
