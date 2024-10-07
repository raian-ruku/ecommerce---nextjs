"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // List of routes where we don't want to show the navbar
  const shouldHideNavbar = (pathname: string) => {
    return pathname.startsWith("/admin");
  };

  // Then in your component:
  if (shouldHideNavbar(pathname)) {
    return null;
  }

  return <NavBar />;
}
