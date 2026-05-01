import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 800;

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const siz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const isBlue = Math.random() > 0.4;
      col[i * 3] = isBlue ? 0 : 0.6;
      col[i * 3 + 1] = isBlue ? 0.8 : 0.3;
      col[i * 3 + 2] = 1;

      siz[i] = Math.random() * 3 + 1;
    }
    return [pos, col, siz];
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!mesh.current) return;
    const geo = mesh.current.geometry;
    const posAttr = geo.attributes.position;
    const t = clock.elapsedTime;

    mousePos.current.x += (pointer.x * viewport.width * 0.5 - mousePos.current.x) * 0.02;
    mousePos.current.y += (pointer.y * viewport.height * 0.5 - mousePos.current.y) * 0.02;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);

      const dx = x - mousePos.current.x;
      const dy = y - mousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        posAttr.setX(i, x + dx * 0.02);
        posAttr.setY(i, y + dy * 0.02);
      }

      posAttr.setY(i, posAttr.getY(i) + Math.sin(t * 0.5 + i * 0.1) * 0.002);
      posAttr.setX(i, posAttr.getX(i) + Math.cos(t * 0.3 + i * 0.05) * 0.001);
    }
    posAttr.needsUpdate = true;
    mesh.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 2) * 2;
      child.position.x = Math.cos(t * 0.3 + i * 1.5) * 3;
    });
  });

  return (
    <group ref={group}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[i * 2 - 4, 0, -2]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#837FFB" : "#A78BFA"} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <Particles />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
