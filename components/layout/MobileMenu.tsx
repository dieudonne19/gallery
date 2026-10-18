"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { PortfolioLink } from "./PortfolioLink";
import { NAV_LINKS } from "./nav";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="link"
            className="min-h-11 px-0 text-base text-foreground underline underline-offset-4 md:hidden"
          />
        }
      >
        Menu
      </SheetTrigger>
      <SheetContent side="right" className="bg-background">
        <SheetTitle className="px-6 pt-6">
          <Logo />
        </SheetTitle>
        <nav className="flex flex-col px-6 pt-4">
          {NAV_LINKS.map((link) => (
            <SheetClose
              key={link.href}
              nativeButton={false}
              render={<Link href={link.href} />}
              className="flex min-h-12 items-center text-xl"
            >
              {link.label}
            </SheetClose>
          ))}
          <PortfolioLink className="flex min-h-12 items-center text-xl" />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
