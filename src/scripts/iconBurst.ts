import gsap from "gsap";

/** Colors a particle can take, paired with the opacity range that keeps it subtle. */
const PALETTE = [
  { color: "var(--color-ink)", opacity: [0.1, 0.18] },
  { color: "var(--color-primary)", opacity: [0.18, 0.3] },
  { color: "var(--color-tomato)", opacity: [0.2, 0.32] },
] as const;

/** Keeps particles inside the viewport so the burst never causes horizontal scroll. */
const VIEWPORT_MARGIN = 12;

function canHover(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function burst(card: HTMLElement, particles: HTMLElement[]): void {
  const rect = card.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const count = particles.length;

  gsap.killTweensOf(particles);

  particles.forEach((particle, index) => {
    // Evenly spread angles plus jitter so the explosion covers every direction.
    const angle = (index / count) * Math.PI * 2 + gsap.utils.random(-0.35, 0.35);
    const distance = gsap.utils.random(170, 420);
    const size = particle.offsetWidth;

    const x = gsap.utils.clamp(
      // Full size (not half) leaves room for the up-to-1.6× scale.
      VIEWPORT_MARGIN - originX + size,
      document.documentElement.clientWidth - VIEWPORT_MARGIN - originX - size,
      Math.cos(angle) * distance * 1.4,
    );
    const y = Math.sin(angle) * distance * 0.9;

    const tone = PALETTE[gsap.utils.random(0, PALETTE.length - 1, 1)];
    particle.style.color = tone.color;

    gsap.fromTo(
      particle,
      { x: 0, y: 0, scale: 0, rotation: 0, opacity: 0 },
      {
        x,
        y,
        scale: gsap.utils.random(0.7, 1.6),
        rotation: gsap.utils.random(-45, 45),
        opacity: gsap.utils.random(tone.opacity[0], tone.opacity[1]),
        duration: gsap.utils.random(0.6, 0.9),
        delay: index * 0.012,
        ease: "expo.out",
      },
    );
  });
}

function settle(particles: HTMLElement[]): void {
  gsap.killTweensOf(particles);
  gsap.to(particles, {
    scale: 0,
    opacity: 0,
    y: "+=14",
    rotation: "+=20",
    duration: 0.4,
    ease: "power2.in",
    stagger: { each: 0.01, from: "random" },
  });
}

/**
 * Hover-driven icon explosion: each `[data-burst]` card scatters its
 * `[data-burst-particle]` children outward and holds them in place until the
 * pointer leaves. Skipped on touch devices and under reduced motion.
 */
export function iconBurst(selector: string): void {
  if (!canHover() || prefersReducedMotion()) return;

  gsap.utils.toArray<HTMLElement>(selector).forEach((card) => {
    const particles = gsap.utils.toArray<HTMLElement>(
      card.querySelectorAll("[data-burst-particle]"),
    );
    if (particles.length === 0) return;

    gsap.set(particles, { scale: 0, opacity: 0 });

    card.addEventListener("pointerenter", () => burst(card, particles));
    card.addEventListener("pointerleave", () => settle(particles));
  });
}
