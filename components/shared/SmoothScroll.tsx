"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Défilement adouci (Lenis), à placer dans les pages qui le veulent : il démarre à l'arrivée sur la page
 * et s'arrête quand on la quitte. Le clavier, le tactile et les ancres restent natifs.
 * Désactivé si le visiteur demande moins de mouvement.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // lerp bas = glisse plus longtemps, plus doux ; wheelMultiplier < 1 = un cran de molette avance moins vite.
    const lenis = new Lenis({ autoRaf: true, lerp: 0.08, wheelMultiplier: 0.9 });
    return () => lenis.destroy();
  }, []);

  return null;
}
