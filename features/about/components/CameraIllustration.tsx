const line = { vectorEffect: "non-scaling-stroke" } as const;

/** Petit appareil photo au trait (même style que les scènes de la hero). Décoratif : masqué aux lecteurs d'écran. */
export function CameraIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* Boîtier et bosse du viseur */}
      <rect x="2" y="12" width="60" height="32" rx="5" className="stroke-foreground" {...line} />
      <path d="M20 12 L24 6 H40 L44 12" className="stroke-foreground" {...line} />
      {/* Flash et déclencheur */}
      <path d="M8 8 H14" className="stroke-foreground" {...line} />
      <path d="M50 8 H56" className="stroke-foreground" {...line} />
      {/* Objectif */}
      <circle cx="32" cy="28" r="10" className="stroke-primary" {...line} />
      <circle cx="32" cy="28" r="4.5" className="stroke-foreground" {...line} />
      {/* Voyant */}
      <circle cx="54" cy="20" r="1.2" className="stroke-primary" {...line} />
    </svg>
  );
}
