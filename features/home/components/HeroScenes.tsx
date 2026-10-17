"use client";

import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(DrawSVGPlugin);

const ink = "stroke-foreground";
const accent = "stroke-primary";
const line = { vectorEffect: "non-scaling-stroke" } as const;

const HORIZON_Y = 66;
const SUN = { x: 120, y: 42, r: 16 };
// Le soleil descend de cette distance : assez pour passer entièrement sous l'horizon.
const SUN_DROP = SUN.r + HORIZON_Y - SUN.y + 2;

// Sept rayons répartis sur la moitié haute du soleil, un peu à l'écart du disque.
const RAYS = Array.from({ length: 7 }, (_, i) => {
  const angle = ((-170 + i * (160 / 6)) * Math.PI) / 180;
  const at = (distance: number) =>
    `${(SUN.x + distance * Math.cos(angle)).toFixed(1)} ${(SUN.y + distance * Math.sin(angle)).toFixed(1)}`;
  return `M${at(SUN.r + 6)} L${at(SUN.r + 13)}`;
});

/** Coucher de soleil : l'horizon s'ouvre, le soleil et ses rayons se dessinent, puis il s'enfonce derrière l'horizon. */
function playSunset(timeline: gsap.core.Timeline, scene: SVGGElement) {
  const part = (name: string) => scene.querySelectorAll(`[data-part="${name}"]`);
  const everything = scene.querySelectorAll("path, circle");

  timeline
    .set(scene, { autoAlpha: 1 })
    .fromTo(part("horizon"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.9 })
    .fromTo(part("sun-line"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, stagger: 0.07 }, "-=0.4")
    .fromTo(part("cloud"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1, stagger: 0.25 }, "-=0.7")
    // Le soleil descend lentement ; le clip de l'horizon cache ce qui passe dessous.
    .to(part("sun"), { y: SUN_DROP, duration: 2.6, ease: "power1.inOut" })
    // Reflets sur l'eau, qui s'ouvrent depuis le centre quand le soleil touche l'horizon.
    .fromTo(part("glint"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.7, stagger: 0.15 }, "-=1.4")
    .to(everything, { drawSVG: "100% 100%", duration: 0.7, stagger: 0.05, ease: "power2.inOut" }, "+=0.8")
    .set(scene, { autoAlpha: 0 });
}

/**
 * Montagne, coucher de soleil, puis lune : chaque scène se dessine au trait, s'efface, et la suivante la remplace.
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
        if (scene.dataset.scene === "sunset") return playSunset(timeline, scene);

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
      <defs>
        <clipPath id="hero-sunset-clip">
          <rect x="0" y="0" width="240" height={HORIZON_Y} />
        </clipPath>
      </defs>

      {/* 1. Montagne */}
      <g data-scene className="invisible">
        <circle cx="206" cy="16" r="8" className={accent} {...line} />
        <path d="M2 80 L50 30 L74 54 L106 16 L150 80" className={ink} {...line} />
        <path d="M150 80 L186 46 L204 62 L220 48 L238 66" className={ink} {...line} />
        <path d="M2 88 C 60 84, 140 90, 238 86" className={ink} {...line} />
      </g>

      {/* 2. Coucher de soleil : horizon, soleil + rayons qui s'enfoncent, nuages, reflets */}
      <g data-scene="sunset" className="invisible">
        <path data-part="horizon" d={`M2 ${HORIZON_Y} L238 ${HORIZON_Y}`} className={ink} {...line} />
        <g clipPath="url(#hero-sunset-clip)">
          <g data-part="sun">
            <circle data-part="sun-line" cx={SUN.x} cy={SUN.y} r={SUN.r} className={accent} {...line} />
            {RAYS.map((d) => (
              <path key={d} data-part="sun-line" d={d} className={accent} {...line} />
            ))}
          </g>
        </g>
        <path
          data-part="cloud"
          d="M24 36 C 24 30, 32 29, 35 32 C 37 27, 47 27, 49 33 C 55 32, 58 36, 55 38 L 26 38"
          className={ink}
          {...line}
        />
        <path
          data-part="cloud"
          d="M170 30 C 170 25, 177 24, 179 27 C 181 23, 190 23, 191 28 C 196 28, 198 32, 195 33 L 172 33"
          className={ink}
          {...line}
        />
        <path data-part="glint" d={`M104 ${HORIZON_Y + 6} L136 ${HORIZON_Y + 6}`} className={accent} {...line} />
        <path data-part="glint" d={`M110 ${HORIZON_Y + 12} L130 ${HORIZON_Y + 12}`} className={accent} {...line} />
        <path data-part="glint" d={`M115 ${HORIZON_Y + 18} L125 ${HORIZON_Y + 18}`} className={accent} {...line} />
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
