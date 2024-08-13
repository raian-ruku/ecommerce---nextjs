import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import localFont from "next/font/local";

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
      <body className={`${myFont.variable} font-iosevka`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
