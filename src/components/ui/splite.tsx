'use client'

import { Suspense, lazy, Component, useEffect, useState, type ReactNode } from 'react'

// Flip to `false` to disable Spline and force the CSS orb fallback.
const SPLINE_ENABLED = true

const Spline = lazy(() => import('@splinetool/react-spline'))

/** Returns true if the browser can create a WebGL context (HW accel + driver ok). */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

function FallbackOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      <div
        className="absolute w-[75%] aspect-square rounded-full animate-[pulse-glow_5s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, rgba(131,127,251,0.55), rgba(91,87,245,0.2) 45%, transparent 72%)',
          filter: 'blur(32px)',
        }}
      />
      <div
        className="relative w-[58%] aspect-square rounded-full animate-[spin_28s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 120deg, #837FFB 0%, #5B57F5 35%, #3330C9 60%, #837FFB 100%)',
          boxShadow: '0 0 80px rgba(131,127,251,0.45)',
        }}
      />
      <div
        className="absolute w-[50%] aspect-square rounded-full bg-[#0A0818]"
        style={{ boxShadow: 'inset 0 0 90px rgba(131,127,251,0.35)' }}
      />
      <div
        className="absolute w-[28%] aspect-square rounded-full animate-[pulse-glow_3.5s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(circle, rgba(131,127,251,0.9), rgba(131,127,251,0.1) 60%, transparent 80%)',
          filter: 'blur(8px)',
        }}
      />
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#837FFB] animate-[spin_14s_linear_infinite]"
          style={{
            boxShadow: '0 0 12px rgba(131,127,251,0.9)',
            transform: `rotate(${deg}deg) translateY(-42%)`,
            animationDelay: `${-i * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

class SplineBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return <FallbackOrb />
    return this.props.children
  }
}

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [webGL, setWebGL] = useState<boolean | null>(null)

  useEffect(() => { setWebGL(detectWebGL()) }, [])

  // Kill-switch: skip Spline entirely and render the lightweight fallback.
  if (!SPLINE_ENABLED) return <FallbackOrb className={className} />

  if (webGL === null) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className ?? ''}`}>
        <span className="loader" />
      </div>
    )
  }

  if (!webGL) return <FallbackOrb className={className} />

  return (
    <SplineBoundary>
      <Suspense
        fallback={
          <div className={`w-full h-full flex items-center justify-center ${className ?? ''}`}>
            <span className="loader" />
          </div>
        }
      >
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineBoundary>
  )
}