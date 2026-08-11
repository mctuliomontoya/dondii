import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Marker attribute so a target is only ever animated once. */
const REVEALED_ATTR = "data-revealed";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Targets that have not been revealed yet, marked as revealed in the process. */
function claimTargets(selector: string): HTMLElement[] {
  const targets = gsap.utils
    .toArray<HTMLElement>(selector)
    .filter((el) => !el.hasAttribute(REVEALED_ATTR));

  targets.forEach((el) => el.setAttribute(REVEALED_ATTR, ""));

  return targets;
}

/**
 * Scroll-triggered reveal. Idempotent: an element is only ever given one
 * tween/ScrollTrigger, so calling this repeatedly with overlapping selectors
 * does not stack animations. Respects `prefers-reduced-motion`.
 */
export function revealOnScroll(selector: string): void {
  const targets = claimTargets(selector);
  if (targets.length === 0) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  targets.forEach((el, index) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
        },
      },
    );
  });
}

/**
 * Immediate reveal for click-driven transitions (tab switches, etc.).
 * No ScrollTrigger involved, so it always plays regardless of where the
 * element sits in the viewport and never accumulates stale triggers.
 * Respects `prefers-reduced-motion`.
 */
export function revealNow(selector: string): void {
  const targets = gsap.utils.toArray<HTMLElement>(selector);
  if (targets.length === 0) return;

  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    targets,
    { opacity: 0, y: 16 },
    {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    },
  );
}
