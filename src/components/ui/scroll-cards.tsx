"use client";
import { FC } from "react";

// Types
interface iCardItem {
  title: string;
  description: string;
  tag: string;
  src: string;
  link: string;
  color: string;
  textColor: string;
}

interface iCardProps extends Omit<iCardItem, "link"> {
  i: number;
}

// Card component — sticky full-screen card
const Card: FC<iCardProps> = ({ title, description, tag, color, textColor, src }) => {
  return (
    <div className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
      <div
        className="relative flex flex-col h-[360px] w-full max-w-[700px] md:h-[440px]
                   items-start justify-end mx-auto overflow-hidden rounded-3xl shadow-2xl"
        style={{ backgroundColor: color }}
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            src={src}
            alt={title}
            loading="lazy"
          />
        </div>

        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-20 p-8 md:p-10 w-full">
          <span
            className="inline-block text-xs font-bold uppercase tracking-[0.25em] px-3 py-1
                       rounded-full border mb-4"
            style={{ color: textColor, borderColor: `${textColor}40`, backgroundColor: `${textColor}15` }}
          >
            {tag}
          </span>
          <h3
            className="font-black text-4xl md:text-6xl tracking-tight leading-none mb-3"
            style={{ color: textColor }}
          >
            {title}
          </h3>
          <p
            className="text-base md:text-lg font-medium leading-relaxed max-w-md"
            style={{ color: `${textColor}cc` }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// CardsParallax — vertical sticky scroll layout
interface iCardSlideProps {
  items: iCardItem[];
}

const CardsParallax: FC<iCardSlideProps> = ({ items }) => {
  return (
    <div className="min-h-screen">
      {items.map((project, i) => (
        <Card key={`p_${i}`} {...project} i={i} />
      ))}
    </div>
  );
};

export { CardsParallax, type iCardItem };
