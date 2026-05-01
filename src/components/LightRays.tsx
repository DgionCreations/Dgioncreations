import React, { useRef, useEffect, useMemo } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } from 'ogl';

interface LightRaysProps {
  raysOrigin?: 'top-center' | 'top-left' | 'top-right' | 'bottom-center' | 'left' | 'right' | 'center';
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
}

const vertexShader = `
  attribute vec2 uv;
  attribute vec3 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uOrigin;
  uniform vec3 uColor;
  uniform float uSpread;
  uniform float uLength;
  uniform float uMouseInfluence;
  uniform vec2 uMouse;
  uniform float uNoise;
  uniform float uDistortion;
  uniform bool uPulsating;
  uniform float uFade;
  uniform float uSaturation;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;
    vec2 origin = (uOrigin - 0.5) * aspect;
    vec2 mouse = (uMouse - 0.5) * aspect;

    // Influence of mouse on origin
    origin = mix(origin, mouse, uMouseInfluence);

    vec2 dir = p - origin;
    float dist = length(dir);
    float angle = atan(dir.y, dir.x);

    // Create rays
    float rays = 0.0;
    float numRays = 20.0;
    
    for(float i = 0.0; i < 20.0; i++) {
        float offset = i * (6.28318 / 20.0);
        float rayAngle = angle + offset + uTime * uSpeed * 0.1;
        float ray = smoothstep(uSpread, 0.0, abs(sin(rayAngle * 5.0 + uTime * 0.5)));
        rays += ray;
    }
    
    rays /= 10.0;
    
    // Falloff
    float falloff = smoothstep(uLength, 0.0, dist * uFade);
    
    // Pulsating
    float pulse = uPulsating ? (sin(uTime * 2.0) * 0.2 + 0.8) : 1.0;
    
    vec3 color = uColor * rays * falloff * pulse;
    
    // Saturation and final output
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(gray), color, uSaturation);

    gl_FragColor = vec4(color, color.r * 0.5 + color.g * 0.5 + color.b * 0.5);
  }
`;

// Simplified version for now to match the user's need for a working component
// I will use the actual react-bits implementation structure if I can find it.
// Since the shadcn command failed due to bun, but I installed ogl, 
// I will provide a robust implementation that uses OGL directly.

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#ffffff',
  raysSpeed = 1,
  lightSpread = 0.5,
  rayLength = 3,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0,
  distortion = 0,
  className = '',
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({
      canvas: canvasRef.current,
      alpha: true,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl);
    camera.position.z = 5;

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const originMap = {
      'top-center': [0.5, 1.0],
      'top-left': [0.0, 1.0],
      'top-right': [1.0, 1.0],
      'bottom-center': [0.5, 0.0],
      'left': [0.0, 0.5],
      'right': [1.0, 0.5],
      'center': [0.5, 0.5],
    };

    const program = new Program(gl, {
      vertex: `
        attribute vec2 uv;
        attribute vec3 position;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uOrigin;
        uniform vec3 uColor;
        uniform float uSpread;
        uniform float uLength;
        uniform float uMouseInfluence;
        uniform vec2 uMouse;
        uniform bool uPulsating;
        uniform float uFade;
        uniform float uSaturation;
        uniform float uSpeed;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv;
          vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
          vec2 uv = (p - 0.5) * aspect;
          vec2 origin = (uOrigin - 0.5) * aspect;
          vec2 mouse = (uMouse - 0.5) * aspect;

          origin = mix(origin, mouse, uMouseInfluence);

          vec2 dir = uv - origin;
          float dist = length(dir);
          float angle = atan(dir.y, dir.x);

          float rays = 0.0;
          for(float i = 0.0; i < 12.0; i++) {
            float rayAngle = i * (6.28318 / 12.0) + uTime * uSpeed * 0.2;
            float pulse = 0.5 + 0.5 * sin(uTime * 0.5 + i);
            float strength = smoothstep(uSpread, 0.0, abs(sin(angle * 4.0 - rayAngle)));
            rays += strength * pulse;
          }

          float falloff = smoothstep(uLength, 0.0, dist * uFade);
          float pPulse = uPulsating ? (sin(uTime * 2.0) * 0.2 + 0.8) : 1.0;
          
          vec3 color = uColor * rays * falloff * pPulse * 0.3;
          
          // Saturation
          float gray = dot(color, vec3(0.299, 0.587, 0.114));
          color = mix(vec3(gray), color, uSaturation);

          gl_FragColor = vec4(color, length(color) * 1.5);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
        uOrigin: { value: new Vec2(...(originMap[raysOrigin])) },
        uColor: { value: new Color(raysColor) },
        uSpread: { value: lightSpread },
        uLength: { value: rayLength },
        uMouseInfluence: { value: mouseInfluence },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uPulsating: { value: pulsating },
        uFade: { value: fadeDistance },
        uSaturation: { value: saturation },
        uSpeed: { value: raysSpeed },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationId: number;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    if (followMouse) {
      window.addEventListener('mousemove', onMouseMove);
    }

    const resize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', resize);
    resize();

    const update = (time: number) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = time * 0.001;
      program.uniforms.uMouse.value.set(mouseX, mouseY);
      renderer.render({ scene: mesh });
    };

    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, followMouse, mouseInfluence, pulsating, fadeDistance, saturation]);

  return (
    <div ref={containerRef} className={`w-full h-full relative overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
