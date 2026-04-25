import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ToneMapping,
  GodRays,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize, ToneMappingMode } from "postprocessing";

import Lighting from "./Lighting.jsx";
import Room from "./Room.jsx";
import Window from "./Window.jsx";
import Furniture from "./Furniture.jsx";
import Dust from "./Dust.jsx";
import CameraRig from "./CameraRig.jsx";

export default function Scene({ theme, scrollRef }) {
  const isDark = theme === "dark";
  const [sun, setSun] = useState(null);

  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ position: [0.15, 1.55, 5.15], fov: 42, near: 0.1, far: 60 }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={[isDark ? "#211820" : "#5e3a3a"]} />
      <fog attach="fog" args={[isDark ? "#2b1d22" : "#6b4038", 7, 18]} />

      <Suspense fallback={null}>
        <Lighting isDark={isDark} scrollRef={scrollRef} />
        <Room isDark={isDark} />
        <Window isDark={isDark} onSun={setSun} />
        <Furniture isDark={isDark} />
        <Dust isDark={isDark} />
        <CameraRig />

        <EffectComposer multisampling={0} disableNormalPass>
          {sun && (
            <GodRays
              sun={sun}
              blendFunction={BlendFunction.SCREEN}
              samples={54}
              density={0.9}
              decay={0.93}
              weight={0.36}
              exposure={0.22}
              clampMax={1}
              kernelSize={KernelSize.SMALL}
              blur={true}
            />
          )}
          <Bloom
            intensity={isDark ? 0.42 : 0.48}
            luminanceThreshold={0.82}
            luminanceSmoothing={0.35}
            mipmapBlur
            radius={0.44}
          />
          <ToneMapping
            mode={ToneMappingMode.ACES_FILMIC}
          />
          <Vignette
            offset={0.12}
            darkness={isDark ? 0.35 : 0.28}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
          <Noise
            opacity={0.025}
            blendFunction={BlendFunction.OVERLAY}
            premultiply
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
