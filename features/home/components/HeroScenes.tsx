"use client";

import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(DrawSVGPlugin);

const ink = "stroke-foreground";
const accent = "stroke-primary";
const line = { vectorEffect: "non-scaling-stroke" } as const;

// Part du tracé de la houle (74 %) où elle arrive contre la paroi du rocher ; le reste est la montée et le retournement.
const WAVE_CONTACT = "74%";

/**
 * Vague : la houle avance de gauche à droite, heurte la paroi du rocher, grimpe puis se recourbe
 * vers l'arrière (le salto), en lançant quelques gouttes.
 */
function playWave(timeline: gsap.core.Timeline, scene: SVGGElement) {
  const part = (name: string) => scene.querySelectorAll(`[data-part="${name}"]`);
  const everything = scene.querySelectorAll("path, circle");

  timeline
    .set(scene, { autoAlpha: 1 })
    .fromTo([part("sun"), part("sea")], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, stagger: 0.15 })
    .fromTo(part("rock"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, ease: "power2.out" }, "-=0.5")
    // 1. La houle arrive : elle accélère vers le rocher.
    .fromTo(part("wave"), { drawSVG: "0% 0%" }, { drawSVG: `0% ${WAVE_CONTACT}`, duration: 1.8, ease: "power1.in" })
    // 2. Impact : elle monte le long de la paroi puis se retourne vers l'arrière.
    .to(part("wave"), { drawSVG: "0% 100%", duration: 1.4, ease: "power2.out" })
    .fromTo(part("spray"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.4, stagger: 0.1 }, "-=0.6")
    .to(everything, { drawSVG: "100% 100%", duration: 0.7, stagger: 0.05, ease: "power2.inOut" }, "+=0.9")
    .set(scene, { autoAlpha: 0 });
}

/**
 * Montagne, vague, puis lune : chaque scène se dessine au trait, s'efface, et la suivante la remplace.
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
        if (scene.dataset.scene === "wave") return playWave(timeline, scene);

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
      {/* 1. Montagne */}
      <g data-scene className="invisible">
        <circle cx="206" cy="16" r="8" className={accent} {...line} />
        <path d="M2 80 L50 30 L74 54 L106 16 L150 80" className={ink} {...line} />
        <path d="M150 80 L186 46 L204 62 L220 48 L238 66" className={ink} {...line} />
        <path d="M2 88 C 60 84, 140 90, 238 86" className={ink} {...line} />
      </g>

      {/* 2. Vague : tracé repris du croquis wave.svg (houle, creux, paroi du rocher, retournement) */}
      <g data-scene="wave" className="invisible">
        <circle data-part="sun" cx="50" cy="18" r="8" className={accent} {...line} />
        <path data-part="sea" d="M2 86 C 70 84, 150 87, 238 85" className={ink} {...line} />
        <path
          data-part="wave"
          d="M3.2 78.1 C4.2 77.3, 6.3 75.0, 8.9 73.6 C11.5 72.2, 14.7 70.8, 18.5 69.6 C22.3 68.3, 26.9 66.9, 31.8 66.1 C36.7 65.3, 42.2 64.7, 48 64.6 C53.8 64.5, 60.4 64.9, 66.7 65.7 C73.0 66.5, 78.9 67.9, 85.9 69.2 C92.9 70.5, 102.4 72.5, 108.8 73.7 C115.2 74.9, 119.7 75.9, 124.5 76.5 C129.3 77.1, 133.8 77.4, 137.4 77.4 C141.0 77.4, 143.7 77.2, 146.3 76.6 C149.0 76.0, 151.2 74.8, 153.3 73.6 C155.4 72.4, 157.5 71.1, 159.1 69.6 C160.7 68.1, 161.7 66.5, 162.7 64.8 C163.7 63.1, 164.4 61.1, 165.1 59.3 C165.8 57.5, 166.3 55.8, 166.6 54.2 C166.9 52.6, 167.2 51.0, 167.2 49.5 C167.2 48.0, 167.0 46.6, 166.5 45.1 C166.0 43.6, 165.3 42.0, 164.1 40.3 C162.9 38.6, 161.2 36.9, 159.4 35.1 C157.6 33.4, 155.9 31.5, 153.4 29.8 C150.9 28.1, 147.3 26.2, 144.6 24.7 C141.9 23.2, 138.3 21.6, 137.1 21"
          className={accent}
          {...line}
        />
        <path
          data-part="rock"
          d="M157.3 78.1 C157.7 77.5, 158.9 76.0, 159.8 74.8 C160.7 73.6, 161.9 72.1, 162.7 70.7 C163.5 69.3, 164.1 67.8, 164.6 66.5 C165.1 65.2, 165.4 64.1, 165.8 63 C166.2 61.9, 166.5 61.2, 166.8 60.1 C167.1 59.0, 167.4 57.5, 167.7 56.5 C167.9 55.5, 168.1 55.2, 168.3 54.4 C168.5 53.6, 168.7 52.8, 169.1 51.9 C169.5 51.0, 169.7 50.0, 170.6 49.1 C171.5 48.3, 173.1 47.6, 174.5 46.8 C175.9 46.0, 177.2 44.8, 178.9 44.1 C180.6 43.4, 182.9 42.8, 184.6 42.5 C186.3 42.3, 187.8 42.5, 189.2 42.6 C190.6 42.7, 191.7 42.8, 192.9 43.2 C194.1 43.7, 195.4 44.6, 196.6 45.3 C197.8 45.9, 198.8 46.4, 200 47.1 C201.2 47.8, 202.6 48.7, 203.7 49.7 C204.8 50.7, 205.4 51.9, 206.3 53.2 C207.2 54.5, 208.1 55.9, 209 57.4 C209.9 58.9, 210.9 61.0, 211.7 62.4 C212.5 63.8, 213.3 64.4, 214 65.5 C214.7 66.6, 215.1 67.8, 216.1 68.9 C217.1 70.1, 218.3 71.2, 219.9 72.4 C221.5 73.6, 223.9 75.3, 225.5 76.3 C227.1 77.3, 227.7 77.6, 229.4 78.5 C231.1 79.4, 234.8 81.3, 235.9 81.9"
          className={ink}
          {...line}
        />
        {/* Gouttes projetées vers l'arrière par le retournement */}
        <circle data-part="spray" cx="131" cy="24" r="1.3" className={accent} {...line} />
        <circle data-part="spray" cx="125" cy="18" r="1.1" className={accent} {...line} />
        <circle data-part="spray" cx="134" cy="13" r="1.2" className={accent} {...line} />
      </g>

      {/* 3. Lune (reste à la fin) */}
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
