import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Lighting({ isDark, scrollRef }) {
  const sun = useRef();
  const target = useRef();

  useEffect(() => {
    if (sun.current && target.current) {
      sun.current.target = target.current;
      sun.current.target.updateMatrixWorld();
    }
  }, []);

  useFrame(() => {
    if (!sun.current) return;
    const progress = scrollRef.current ?? 0;
    sun.current.position.set(-0.3 + progress * 0.12, 3.45 - progress * 0.16, -5.4);
    sun.current.intensity = (isDark ? 3.35 : 3.9) - progress * 0.25;
  });

  return (
    <>
      <hemisphereLight
        color={isDark ? "#9c7b89" : "#ffc98d"}
        groundColor={isDark ? "#7a342d" : "#cf5d35"}
        intensity={isDark ? 1.05 : 1.2}
      />

      <ambientLight color={isDark ? "#5b3342" : "#7d4032"} intensity={isDark ? 0.24 : 0.28} />

      <pointLight color="#ffb35d" intensity={isDark ? 1.55 : 1.65} distance={5.8} decay={2} position={[-0.3, 2.2, -2.25]} />
      <pointLight color="#ff7442" intensity={isDark ? 1.4 : 1.55} distance={6.5} decay={2} position={[-1.7, 0.85, 1.4]} />
      <pointLight color="#566b82" intensity={0.32} distance={5.8} decay={2} position={[-3.2, 2.2, 1.9]} />

      <object3D ref={target} position={[0.2, 0.55, 1.15]} />

      <directionalLight
        ref={sun}
        castShadow
        color={isDark ? "#ffc174" : "#ffd48a"}
        intensity={isDark ? 3.35 : 3.9}
        position={[-0.3, 3.45, -5.4]}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.4}
        shadow-camera-far={14}
        shadow-camera-left={-4.6}
        shadow-camera-right={4.6}
        shadow-camera-top={4.2}
        shadow-camera-bottom={-1.6}
        shadow-bias={-0.00045}
        shadow-normalBias={0.035}
      />
    </>
  );
}
