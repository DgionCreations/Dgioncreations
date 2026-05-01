import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  /** Animation direction — translates on Y axis for enter */
  from?: "bottom" | "top" | "left" | "right" | "fade";
  /** Distance in px to translate from (default 40) */
  distance?: number;
  /** Stagger children with this selector (e.g. "[data-reveal-child]") */
  stagger?: string;
  /** Delay between staggered children in seconds (default 0.08) */
  staggerDelay?: number;
  /** When to start — passed to ScrollTrigger `start` (default "top 85%") */
  start?: string;
  /** Duration in seconds (default 0.8) */
  duration?: number;
  /** Play once or replay on scroll back */
  once?: boolean;
};

/**
 * useGsapReveal
 * GSAP + ScrollTrigger entrance animation — uses transform + opacity only.
 * IntersectionObserver-based trigger (no scroll listener), one-off tween per element.
 *
 * Usage:
 *   const ref = useGsapReveal<HTMLDivElement>({ from: "bottom", stagger: "[data-reveal-child]" });
 *   return <div ref={ref}>...<div data-reveal-child>child</div>...</div>
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {}
) {
  const ref = useRef<T>(null);

  const {
    from = "bottom",
    distance = 40,
    stagger,
    staggerDelay = 0.08,
    start = "top 85%",
    duration = 0.8,
    once = true,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Map direction → initial transform (no top/left — transform only for GPU)
    const fromVars: gsap.TweenVars = { opacity: 0 };
    if (from === "bottom") fromVars.y = distance;
    if (from === "top") fromVars.y = -distance;
    if (from === "left") fromVars.x = -distance;
    if (from === "right") fromVars.x = distance;

    const targets = stagger ? el.querySelectorAll(stagger) : el;

    // Hint browser that transform + opacity will change
    const applyWillChange = (add: boolean) => {
      const list: HTMLElement[] =
        targets instanceof NodeList
          ? Array.from(targets as NodeListOf<HTMLElement>)
          : [targets as HTMLElement];
      list.forEach((node) => {
        node.style.willChange = add ? "transform, opacity" : "";
      });
    };
    applyWillChange(true);

    const tween = gsap.fromTo(
      targets,
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        ease: "power3.out",
        stagger: stagger ? staggerDelay : 0,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
        onComplete: () => applyWillChange(false),
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      applyWillChange(false);
    };
  }, [from, distance, stagger, staggerDelay, start, duration, once]);

  return ref;
}