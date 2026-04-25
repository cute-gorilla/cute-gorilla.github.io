import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 62;

export default function Dust({ isDark }) {
  const mesh = useRef();

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = -1.4 + Math.random() * 2.8;
      positions[i * 3 + 1] = 0.75 + Math.random() * 2.4;
      positions[i * 3 + 2] = -2.55 + Math.random() * 2.7;
      velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.0014;
      velocities[i * 3 + 1] = 0.0016 + Math.random() * 0.0025;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0014;
    }
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    const arr = mesh.current.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 0] += velocities[i * 3 + 0];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];
      if (arr[i * 3 + 1] > 3.5) {
        arr[i * 3 + 0] = -1.4 + Math.random() * 2.8;
        arr[i * 3 + 1] = 0.75;
        arr[i * 3 + 2] = -2.55 + Math.random() * 2.7;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={isDark ? "#ffd79a" : "#ffe3a4"}
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.58}
        depthWrite={false}
      />
    </points>
  );
}
