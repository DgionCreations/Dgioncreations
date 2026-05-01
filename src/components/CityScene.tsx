import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Buildings (instanced for perf) ── */
function Buildings() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const COUNT = 220;
  const tmp = useMemo(() => new THREE.Object3D(), []);

  /* deterministic layout, denser near center, heights rise towards center */
  const data = useMemo(() => {
    const arr: { x: number; z: number; h: number; w: number; d: number; hue: number }[] = [];
    const rng = (i: number) => Math.abs(Math.sin(i * 137.508)) % 1;
    for (let i = 0; i < COUNT; i++) {
      const angle = rng(i) * Math.PI * 2;
      const rad   = 1 + rng(i + 99) * 18;
      const x = Math.cos(angle) * rad;
      const z = Math.sin(angle) * rad;
      const distToCenter = Math.sqrt(x * x + z * z);
      // taller near center
      const maxH = Math.max(0.5, 6 - distToCenter * 0.28);
      const h = 0.4 + rng(i + 11) * maxH;
      const w = 0.45 + rng(i + 23) * 0.55;
      const d = 0.45 + rng(i + 47) * 0.55;
      const hue = rng(i + 71);
      arr.push({ x, z, h, w, d, hue });
    }
    return arr;
  }, []);

  useMemo(() => {
    if (!ref.current) return;
    data.forEach((b, i) => {
      tmp.position.set(b.x, b.h / 2, b.z);
      tmp.scale.set(b.w, b.h, b.d);
      tmp.updateMatrix();
      ref.current!.setMatrixAt(i, tmp.matrix);
      const col = new THREE.Color().setHSL(0.52 + b.hue * 0.08, 0.6, 0.12 + b.hue * 0.1);
      ref.current!.setColorAt(i, col);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [data, tmp]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        metalness={0.6}
        roughness={0.35}
        emissive="#0a3a4a"
        emissiveIntensity={0.25}
      />
    </instancedMesh>
  );
}

/* ── Window lights: many tiny points that twinkle ── */
function WindowLights() {
  const COUNT = 600;
  const ref = useRef<THREE.Points>(null);
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const ph  = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r   = 1 + Math.random() * 17;
      pos[i * 3]     = Math.cos(ang) * r;
      pos[i * 3 + 1] = Math.random() * Math.max(0.5, 4.5 - r * 0.2);
      pos[i * 3 + 2] = Math.sin(ang) * r;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = 0.7 + Math.sin(t * 0.8) * 0.15;
    }
  });
  void phases;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#7ceaff"
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Central glowing tower (data core) ── */
function CoreTower() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 1.2) * 0.08;
      coreRef.current.scale.set(s, 1, s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group position={[0, 3, 0]}>
      {/* tall beacon column */}
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.35, 0.6, 6, 24, 1, true]} />
        <meshBasicMaterial
          color="#4de8ff"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* inner bright core */}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 5.6, 12]} />
        <meshBasicMaterial color="#e8ffff" />
      </mesh>

      {/* rotating top ring */}
      <mesh ref={ringRef} position={[0, 3, 0]}>
        <torusGeometry args={[0.9, 0.03, 10, 64]} />
        <meshBasicMaterial
          color="#4de8ff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* sky-beam up */}
      <mesh position={[0, 10, 0]}>
        <cylinderGeometry args={[0.05, 0.8, 20, 16, 1, true]} />
        <meshBasicMaterial
          color="#4de8ff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* base glow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.9, 0]}>
        <circleGeometry args={[3, 48]} />
        <meshBasicMaterial
          color="#4de8ff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ── Arc network — dotted curves + traveling particles ── */
function ArcNetwork() {
  const ARC_COUNT = 18;

  const { arcs, points } = useMemo(() => {
    const arcs: { curve: THREE.QuadraticBezierCurve3; geo: THREE.BufferGeometry }[] = [];
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < ARC_COUNT; i++) {
      // random start (outer) and end (also outer), arc over the city
      const a1 = Math.random() * Math.PI * 2;
      const a2 = a1 + (Math.PI / 2 + Math.random() * Math.PI);
      const r1 = 5 + Math.random() * 12;
      const r2 = 5 + Math.random() * 12;
      const s  = new THREE.Vector3(Math.cos(a1) * r1, 0.3, Math.sin(a1) * r1);
      const e  = new THREE.Vector3(Math.cos(a2) * r2, 0.3, Math.sin(a2) * r2);
      const mid = s.clone().add(e).multiplyScalar(0.5);
      const arcHeight = 3.5 + Math.random() * 3;
      mid.y += arcHeight;
      const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
      const pts = curve.getPoints(60);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      arcs.push({ curve, geo });
      points.push(s, e);
    }
    return { arcs, points };
  }, []);

  // traveling particle refs
  const travRefs = useRef<(THREE.Mesh | null)[]>([]);
  const progress = useRef<number[]>(arcs.map(() => Math.random()));

  useFrame((_, delta) => {
    progress.current.forEach((p, i) => {
      const np = (p + delta * (0.15 + (i % 3) * 0.05)) % 1;
      progress.current[i] = np;
      const m = travRefs.current[i];
      if (m) m.position.copy(arcs[i].curve.getPoint(np));
    });
  });

  return (
    <>
      {/* dotted arcs */}
      {arcs.map((a, i) => (
        <line key={`arc-${i}`}>
          <primitive object={a.geo} attach="geometry" />
          <lineDashedMaterial
            color="#4de8ff"
            dashSize={0.2}
            gapSize={0.15}
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}

      {/* we need computeLineDistances for dashed lines — set after mount via key trick */}
      {arcs.map((_, i) => (
        <mesh
          key={`tr-${i}`}
          ref={(el) => { travRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshBasicMaterial
            color="#e8ffff"
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* endpoint markers */}
      {points.map((p, i) => (
        <mesh key={`pt-${i}`} position={p}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial
            color="#4de8ff"
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

/* ── Floating particles for depth ── */
function FloatingDust() {
  const COUNT = 400;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 45;
      p[i * 3 + 1] =  Math.random() * 14 + 0.5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 45;
    }
    return p;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += delta * 0.15;
      if (arr[i * 3 + 1] > 14) arr[i * 3 + 1] = 0.5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#9ee8ff"
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Slow cinematic camera pan ── */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cam = state.camera;
    const rx = Math.sin(t * 0.08) * 2;
    const rz = 18 + Math.cos(t * 0.06) * 1.5;
    cam.position.x = rx;
    cam.position.z = rz;
    cam.position.y = 7.5 + Math.sin(t * 0.12) * 0.4;
    cam.lookAt(0, 2, 0);
  });
  return null;
}

/* ── Ground plane ── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[80, 80, 1, 1]} />
      <meshStandardMaterial
        color="#061828"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  );
}

/* ── Ground grid lines ── */
function GroundGrid() {
  return (
    <gridHelper
      args={[80, 40, "#0a4a5c", "#072a38"]}
      position={[0, 0.01, 0]}
    />
  );
}

/* ── Main scene ── */
export default function CityScene() {
  return (
    <Canvas
      camera={{ position: [0, 7.5, 18], fov: 42 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 1.6]}
      shadows={false}
      style={{ width: "100%", height: "100%" }}
    >
      {/* volumetric fog for cinematic depth */}
      <fog attach="fog" args={["#03131e", 12, 36]} />
      <color attach="background" args={["#020a16"]} />

      {/* lighting */}
      <ambientLight intensity={0.25} color="#3a9fc8" />
      <pointLight position={[0, 8, 0]}   intensity={4.5} color="#4de8ff" distance={30} decay={1.5} />
      <pointLight position={[10, 6, 8]}  intensity={1.8} color="#1e90ff" distance={25} decay={2} />
      <pointLight position={[-12, 5, -10]} intensity={1.2} color="#00bfff" distance={22} decay={2} />
      <directionalLight position={[5, 10, 8]} intensity={0.6} color="#80d8ff" />

      <Suspense fallback={null}>
        <Ground />
        <GroundGrid />
        <Buildings />
        <WindowLights />
        <CoreTower />
        <ArcNetwork />
        <FloatingDust />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}