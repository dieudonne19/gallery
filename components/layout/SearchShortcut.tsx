"use client";

import { SearchIcon } from "lucide-react";

import { SEARCH_INPUT_ID } from "./SearchBar";

/** Bouton « Rechercher » de la barre du bas : place le curseur dans la barre de recherche de l'en-tête. */
export function SearchShortcut({ className }: { className: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        const input = document.getElementById(SEARCH_INPUT_ID);
        input?.focus();
        input?.scrollIntoView({ block: "nearest" });
      }}
    >
      <SearchIcon aria-hidden="true" className="size-6" />
      Rechercher
    </button>
  );
}
