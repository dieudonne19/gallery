"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, SITE_NAME } from "./nav";

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
        <SheetTitle className="px-6 pt-6 font-serif text-xl font-normal">
          {SITE_NAME}
        </SheetTitle>
        <nav className="flex flex-col px-6 pt-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex min-h-12 items-center text-xl"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
