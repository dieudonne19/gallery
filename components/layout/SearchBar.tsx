"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MAX_SEARCH_LENGTH } from "@/features/photos/lib/search";

export const SEARCH_INPUT_ID = "recherche";

const field =
  "h-12 w-full rounded-full bg-secondary pr-12 pl-12 text-base text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring [&::-webkit-search-cancel-button]:hidden";

/**
 * Barre de recherche de l'en-tête. Sans JavaScript, c'est un simple formulaire vers /?q=.
 * Sur l'accueil, les résultats se mettent à jour pendant la frappe (après une courte pause) ; la catégorie choisie est gardée.
 * L'adresse est remplacée, pas empilée : « retour » ne repasse pas par chaque lettre tapée.
 */
export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("q") ?? "";
  const category = pathname === "/" ? params.get("categorie") : null;
  const [value, setValue] = useState(current);
  const input = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Recherche changée ailleurs (lien « Effacer la recherche », retour du navigateur) : le champ suit.
  useEffect(() => {
    if (document.activeElement !== input.current) setValue(current);
  }, [current]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function href(search: string) {
    const next = new URLSearchParams();
    if (category) next.set("categorie", category);
    if (search.trim()) next.set("q", search.trim());
    return next.size ? `/?${next}` : "/";
  }

  function onChange(text: string) {
    setValue(text);
    clearTimeout(timer.current);
    if (pathname !== "/") return;
    timer.current = setTimeout(() => router.replace(href(text), { scroll: false }), 300);
  }

  return (
    <form
      role="search"
      action="/"
      onSubmit={(event) => {
        event.preventDefault();
        clearTimeout(timer.current);
        if (pathname === "/") router.replace(href(value), { scroll: false });
        else router.push(href(value));
      }}
      className="relative w-full"
    >
      {category ? <input type="hidden" name="categorie" value={category} /> : null}
      <SearchIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={input}
        id={SEARCH_INPUT_ID}
        name="q"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        maxLength={MAX_SEARCH_LENGTH}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Rechercher"
        aria-label="Rechercher des photos (titre, lieu, année)"
        className={field}
      />
      {value ? (
        <button
          type="button"
          aria-label="Effacer la recherche"
          onClick={() => {
            onChange("");
            input.current?.focus();
          }}
          className="absolute top-1/2 right-1 flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <XIcon aria-hidden="true" className="size-5" />
        </button>
      ) : null}
    </form>
  );
}

/**
 * Même barre avant que l'adresse soit lue (rendu statique des pages) : un simple formulaire vers /?q=,
 * qui fonctionne aussi sans JavaScript.
 */
export function SearchBarFallback() {
  return (
    <form role="search" action="/" className="relative w-full">
      <SearchIcon aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
      <input
        id={SEARCH_INPUT_ID}
        name="q"
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        maxLength={MAX_SEARCH_LENGTH}
        placeholder="Rechercher"
        aria-label="Rechercher des photos (titre, lieu, année)"
        className={field}
      />
    </form>
  );
}
