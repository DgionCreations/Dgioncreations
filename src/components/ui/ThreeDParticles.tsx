import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDParticlesProps {
  particleCount?: number;
  particleColor?: string;
  speed?: number;
  className?: string;
}

const ThreeDParticles: React.FC<ThreeDParticlesProps> = ({
  particleCount = 1500,
  particleColor = '#837FFB',
  speed = 0.5,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Particles Geometry
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: new THREE.Color(particleColor),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate particles slowly
      particlesMesh.rotation.y = elapsedTime * 0.05 * speed;
      particlesMesh.rotation.x = elapsedTime * 0.03 * speed;

      // Mouse effect
      if (mouseX !== 0) {
        particlesMesh.rotation.y += (mouseX * 0.00005);
        particlesMesh.rotation.x += (mouseY * 0.00005);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, [particleCount, particleColor, speed]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};

export default ThreeDParticles;
