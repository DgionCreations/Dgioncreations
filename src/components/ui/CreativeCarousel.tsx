"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCreative, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/navigation";

import { cn } from "@/lib/utils";

interface CreativeCarouselProps {
  images: string[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}

export const CreativeCarousel = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}: CreativeCarouselProps) => {
  const css = `
  .CreativeCarousel {
    width: 100%;
    height: 380px;
    padding-bottom: 40px !important;
  }
  
  .CreativeCarousel .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 100%;
    max-width: 320px;
    border-radius: 25px;
    overflow: hidden;
  }
  
  .CreativeCarousel .swiper-pagination-bullet {
    background: #837FFB !important;
  }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1500,
                disableOnInteraction: true,
              }
            : false
        }
        effect="creative"
        grabCursor={true}
        slidesPerView="auto"
        centeredSlides={true}
        loop={loop}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="CreativeCarousel"
        creativeEffect={{
          prev: {
            shadow: true,
            origin: "left center",
            translate: ["-5%", 0, -200],
            rotate: [0, 100, 0],
          },
          next: {
            origin: "right center",
            translate: ["5%", 0, -200],
            rotate: [0, -100, 0],
          },
        }}
        modules={[EffectCreative, Pagination, Autoplay, Navigation]}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="overflow-hidden border border-white/10 shadow-2xl">
            <img
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              src={img}
              alt={`Slide ${index}`}
            />
          </SwiperSlide>
        ))}
        {showNavigation && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="swiper-button-next after:hidden pointer-events-auto">
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="swiper-button-prev after:hidden pointer-events-auto">
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};
