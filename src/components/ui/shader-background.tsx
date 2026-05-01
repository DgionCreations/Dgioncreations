"use client";
import React from "react";
import { Warp } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
  color?: string;
  index?: number;
}

export const ShaderBackground: React.FC<ShaderBackgroundProps> = ({ color = "#837FFB", index = 0 }) => {
  const getShaderConfig = (idx: number) => {
    const configs = [
      {
        proportion: 0.3,
        softness: 0.8,
        distortion: 0.15,
        swirl: 0.6,
        swirlIterations: 8,
        shape: "checks" as const,
        shapeScale: 0.08,
      },
      {
        proportion: 0.4,
        softness: 1.2,
        distortion: 0.2,
        swirl: 0.9,
        swirlIterations: 12,
        shape: "dots" as const,
        shapeScale: 0.12,
      },
      {
        proportion: 0.35,
        softness: 0.9,
        distortion: 0.18,
        swirl: 0.7,
        swirlIterations: 10,
        shape: "checks" as const,
        shapeScale: 0.1,
      },
      {
        proportion: 0.45,
        softness: 1.1,
        distortion: 0.22,
        swirl: 0.8,
        swirlIterations: 15,
        shape: "dots" as const,
        shapeScale: 0.09,
      },
    ];
    return configs[idx % configs.length];
  };

  const config = getShaderConfig(index);
  
  // Website Brand Colors - ONLY use these for strict brand matching
  const brandPurple = "#837FFB";
  const brandBlue = "#5B57F5";

  // Create a palette that uses ONLY dgio colors
  const colors = [
    brandPurple,  // Signature Brand Purple
    brandBlue,    // Signature Brand Blue
    brandPurple,  // Repeating for vibrancy
    brandBlue     // Repeating for vibrancy
  ];

  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Warp
        style={{ height: "100%", width: "100%" }}
        proportion={config.proportion}
        softness={config.softness}
        distortion={config.distortion}
        swirl={config.swirl}
        swirlIterations={config.swirlIterations}
        shape={config.shape}
        shapeScale={config.shapeScale}
        scale={1}
        rotation={0}
        speed={0.4}
        colors={colors}
      />
    </div>
  );
};
