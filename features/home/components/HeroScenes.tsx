"use client";

import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(DrawSVGPlugin);

const ink = "stroke-foreground";
const accent = "stroke-primary";
const line = { vectorEffect: "non-scaling-stroke" } as const;

/**
 * Colline, montagne, vague, puis lune : chaque scène se dessine au trait, s'efface, et la suivante la remplace.
 * La lune reste à la fin. Sans animation (préférence de mouvement réduit, ou avant le script), seule la lune est visible.
 * Décoratif : masqué aux lecteurs d'écran.
 */
export function HeroScenes({ className }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scenes = gsap.utils.toArray<SVGGElement>("[data-scene]", svg.current);
      const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, delay: 0.1 });

      scenes.forEach((scene, index) => {
        const strokes = scene.querySelectorAll("path, circle");
        const isLast = index === scenes.length - 1;
        timeline
          .set(scene, { autoAlpha: 1 })
          .fromTo(strokes, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.22 });
        if (!isLast) {
          timeline
            .to(strokes, { drawSVG: "100% 100%", duration: 0.6, stagger: 0.08 }, "+=0.6")
            .set(scene, { autoAlpha: 0 });
        }
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <svg
      ref={svg}
      viewBox="0 0 240 92"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* 1. Colline */}
      <g data-scene className="invisible">
        <circle cx="198" cy="16" r="9" className={accent} {...line} />
        <path d="M2 56 C 22 56, 36 24, 66 24 S 110 56, 136 56 S 170 40, 198 40 S 228 56, 238 56" className={ink} {...line} />
        <path d="M2 76 C 32 76, 54 52, 94 52 S 142 76, 172 76 S 206 64, 238 68" className={ink} {...line} />
        <path d="M2 88 C 52 88, 82 82, 132 86 S 202 90, 238 84" className={ink} {...line} />
      </g>

      {/* 2. Montagne */}
      <g data-scene className="invisible">
        <circle cx="206" cy="16" r="8" className={accent} {...line} />
        <path d="M2 80 L50 30 L74 54 L106 16 L150 80" className={ink} {...line} />
        <path d="M150 80 L186 46 L204 62 L220 48 L238 66" className={ink} {...line} />
        <path d="M2 88 C 60 84, 140 90, 238 86" className={ink} {...line} />
      </g>

      {/* 3. Vague */}
      <g data-scene className="invisible">
        <circle cx="120" cy="22" r="9" className={accent} {...line} />
        <path d="M2 52 C 20 42, 40 42, 60 52 S 100 62, 120 52 S 160 42, 180 52 S 220 62, 238 52" className={ink} {...line} />
        <path d="M2 66 C 20 56, 40 56, 60 66 S 100 76, 120 66 S 160 56, 180 66 S 220 76, 238 66" className={ink} {...line} />
        <path d="M2 80 C 20 70, 40 70, 60 80 S 100 90, 120 80 S 160 70, 180 80 S 220 90, 238 80" className={ink} {...line} />
      </g>

      {/* 4. Lune (reste à la fin) */}
      <g data-scene>
        <path d="M136 18 A 26 26 0 1 0 136 62 A 20 20 0 1 1 136 18 Z" className={accent} {...line} />
        <circle cx="178" cy="24" r="1.6" className={ink} {...line} />
        <circle cx="198" cy="46" r="1.6" className={ink} {...line} />
        <circle cx="76" cy="22" r="1.6" className={ink} {...line} />
        <circle cx="62" cy="48" r="1.6" className={ink} {...line} />
        <path d="M2 84 C 60 74, 130 82, 238 72" className={ink} {...line} />
      </g>
    </svg>
  );
}
