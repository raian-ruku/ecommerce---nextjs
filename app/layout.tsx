import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavBar from "./components/conditionalNavbar";
import localFont from "next/font/local";
import { CartProvider } from "@/context/cartContext";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/context/themeContext";
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
          <ThemeProvider>
            <ConditionalNavBar />
            {children}
            <SpeedInsights />
            <Analytics />
            <Toaster richColors position="top-right" theme="light" />
          </ThemeProvider>
        </body>
      </CartProvider>
    </html>
  );
}
