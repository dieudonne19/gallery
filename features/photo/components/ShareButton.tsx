"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ShareButton({ title }: { title: string }) {
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* partage annulé */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Lien copié");
  }

  return (
    <Button
      type="button"
      variant="link"
      onClick={share}
      className="min-h-11 px-0 text-base text-foreground underline underline-offset-4"
    >
      Partager
    </Button>
  );
}
