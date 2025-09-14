"use client";

import { DarkThemeToggle, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <Navbar fluid>
      <NavbarBrand href="/">
        <img src="/favicon.png" className="mr-1 sm:mr-2 h-9 sm:h-9" alt="Nutshell logo" />
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
        <NavbarLink href="/info" active={pathname === '/info'}>
          Info
        </NavbarLink>
        <NavbarLink href="/settings" active={pathname === "/settings"}>
          Settings
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
