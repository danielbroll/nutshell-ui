"use client";

import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <Navbar fluid>
      <NavbarBrand href="/">
        <img src="/favicon.png" className="mr-3 h-6 sm:h-9" alt="" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Nutshell</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <DarkThemeToggle />
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="/" active={pathname === "/"}>
          Dashboard
        </NavbarLink>
        <NavbarLink href="/activity" active={pathname === "/activity"}>
          Activity
        </NavbarLink>
        <NavbarLink href="/settings" active={pathname === "/settings"}>
          Settings
        </NavbarLink>
        <NavbarLink href="/about" active={pathname === '/about'}>
          About
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
