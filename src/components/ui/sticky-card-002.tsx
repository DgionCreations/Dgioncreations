"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const imageElements = imageRefs.current;
      const totalCards = imageElements.length;

      if (!imageElements[0] || !container.current || !stickyRef.current) return;

      // First card visible, rest stacked below
      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      // Use the outer container as the trigger (it has the explicit tall height).
      // Pin the inner sticky div against it — no pinSpacing needed because the
      // container's own height provides the scroll runway.
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom bottom",
          pin: stickyRef.current,
          scrub: 0.5,
          pinSpacing: false,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          { scale: 0.7, rotation: 5, duration: 1, ease: "none" },
          i,
        );

        scrollTimeline.to(
          nextImage,
          { y: "0%", duration: 1, ease: "none" },
          i,
        );
      }

      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      resizeObserver.observe(container.current);

      const st = scrollTimeline.scrollTrigger;
      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        st?.kill();
      };
    },
    { scope: container },
  );

  return (
    // Outer container: tall enough for all card transitions (passed via className)
    <div className={cn("relative w-full", className)} ref={container}>
      {/* Inner sticky panel — pinned by GSAP within the container's scroll range */}
      <div
        ref={stickyRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-6 md:px-8 lg:px-12 bg-[#0A0818]"
      >
        <div
          className={cn(
            "relative w-full h-[82vh] overflow-hidden rounded-3xl",
            containerClassName,
          )}
        >
          {cards.map((card, i) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || ""}
              className={cn(
                "absolute h-full w-full object-cover rounded-3xl",
                imageClassName,
              )}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { StickyCard002, type CardData };
