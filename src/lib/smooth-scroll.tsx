import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScrollProvider
 *
 * One rAF loop, one scroll source. Lenis drives momentum; GSAP's ticker drives
 * Lenis; ScrollTrigger listens to Lenis. No duplicate frame loops, no scroll
 * handlers fighting each other.
 *
 * - Lenis is the single source of scroll truth
 * - gsap.ticker.lagSmoothing(0) → GSAP owns the frame delta
 * - ScrollTrigger.update fires only when Lenis says scroll changed
 * - prefers-reduced-motion → skip Lenis, leave native scroll in place
 * - ScrollTrigger defaults make scroll-in animations play-once by default
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect user accessibility setting — no smooth scroll, no GSAP animations
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Uniform play-once behaviour for every ScrollTrigger in the app
    ScrollTrigger.defaults({ toggleActions: "play none none none" });

    if (reduced) {
      // Even without Lenis, keep ScrollTrigger ticking on native scroll
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    // Every Lenis frame → tell ScrollTrigger to re-evaluate triggers
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so the whole app runs on one rAF loop
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Once the DOM settles after first paint (images / fonts), recompute
    // all ScrollTrigger start/end positions so they land where the eye expects.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      window.clearTimeout(refreshId);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}