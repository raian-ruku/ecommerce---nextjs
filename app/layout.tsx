import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import localFont from "next/font/local";
import { CartProvider } from "@/context/cartContext";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata: Metadata = {
  title: "E-Commerce",
};

const myFont = localFont({
  src: "../public/fonts/Iosevka-Extended-04.ttf",
  display: "swap",
  variable: "--font-iosevka",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CartProvider>
        <body className={`${myFont.variable} font-iosevka`}>
          <SpeedInsights />
          <NavBar />
          {children}
          <Toaster richColors position="top-right" theme="light" />
        </body>
      </CartProvider>
    </html>
  );
}
