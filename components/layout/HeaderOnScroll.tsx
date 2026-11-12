"use client";

import { useEffect } from "react";

/**
 * L'en-tête se masque quand on descend et revient dès qu'on remonte : la mosaïque garde toute la hauteur de l'écran.
 * Pose data-header-hidden sur <html> ; le CSS (globals.css) déplace l'en-tête et la barre des filtres.
 */
export function HeaderOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    let last = window.scrollY;
    let frame = 0;

    function update() {
      frame = 0;
      const y = window.scrollY;
      // Petit seuil : un léger mouvement du doigt ne fait pas clignoter l'en-tête.
      if (Math.abs(y - last) < 8) return;
      if (y > last && y > 160) root.dataset.headerHidden = "";
      else delete root.dataset.headerHidden;
      last = y;
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Le focus clavier dans l'en-tête le fait toujours revenir.
    const onFocus = (event: FocusEvent) => {
      if ((event.target as Element | null)?.closest?.(".site-header")) delete root.dataset.headerHidden;
    };
    document.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocus);
      if (frame) cancelAnimationFrame(frame);
      delete root.dataset.headerHidden;
    };
  }, []);

  return null;
}
