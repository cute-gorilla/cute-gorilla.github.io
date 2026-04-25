import { useMemo } from "react";
import * as THREE from "three";

export default function Window({ isDark, onSun }) {
  const outsideTex = useMemo(() => buildSunsetTexture(isDark), [isDark]);
  const wood = isDark ? "#3a211d" : "#74402a";
  const curtain = isDark ? "#bf6a4c" : "#ff9a50";
  const curtainShade = isDark ? "#7b3b35" : "#c85f37";

  return (
    <group position={[0, 0, -3.08]}>
      <mesh position={[0, 2.05, -0.02]}>
        <planeGeometry args={[3.35, 2.55]} />
        <meshBasicMaterial map={outsideTex} toneMapped={false} />
      </mesh>

      <mesh ref={onSun} position={[-0.26, 2.2, 0.02]}>
        <circleGeometry args={[0.24, 48]} />
        <meshBasicMaterial color={isDark ? "#ffc677" : "#fff4bf"} transparent opacity={0.82} toneMapped={false} />
      </mesh>

      <group position={[0, 2.05, 0.12]}>
        <Frame color={wood} />
        <Curtain x={-1.63} color={curtainShade} edgeColor={curtain} />
        <Curtain x={1.63} color={curtain} edgeColor={curtainShade} flip />

        {[-0.48, -0.23, 0.02, 0.27, 0.52].map((y, i) => (
          <mesh key={i} position={[0, y + 0.34, 0.03]} castShadow>
            <boxGeometry args={[2.3, 0.035, 0.06]} />
            <meshStandardMaterial color={isDark ? "#724022" : "#c07131"} roughness={0.65} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Frame({ color }) {
  const mat = <meshStandardMaterial color={color} roughness={0.6} />;

  return (
    <group>
      <mesh position={[0, 1.03, 0]} castShadow>
        <boxGeometry args={[2.55, 0.09, 0.12]} />
        {mat}
      </mesh>
      <mesh position={[0, -1.03, 0]} castShadow>
        <boxGeometry args={[2.55, 0.09, 0.12]} />
        {mat}
      </mesh>
      <mesh position={[-1.27, 0, 0]} castShadow>
        <boxGeometry args={[0.09, 2.15, 0.12]} />
        {mat}
      </mesh>
      <mesh position={[1.27, 0, 0]} castShadow>
        <boxGeometry args={[0.09, 2.15, 0.12]} />
        {mat}
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.075, 2.08, 0.12]} />
        {mat}
      </mesh>
      <mesh position={[0, 0.25, 0.01]} castShadow>
        <boxGeometry args={[2.46, 0.07, 0.12]} />
        {mat}
      </mesh>
    </group>
  );
}

function Curtain({ x, color, edgeColor, flip = false }) {
  return (
    <group position={[x, 0, 0.04]} scale={[flip ? -1 : 1, 1, 1]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <planeGeometry args={[0.54, 2.34]} />
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.92} />
      </mesh>
      <mesh position={[-0.18, 0.02, 0.015]} castShadow>
        <planeGeometry args={[0.08, 2.22]} />
        <meshStandardMaterial color={edgeColor} roughness={0.9} side={THREE.DoubleSide} transparent opacity={0.86} />
      </mesh>
    </group>
  );
}

function buildSunsetTexture(isDark) {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = 576;
  const ctx = c.getContext("2d");

  const sky = ctx.createLinearGradient(0, 0, 0, c.height);
  sky.addColorStop(0, isDark ? "#3a3554" : "#62bde8");
  sky.addColorStop(0.42, isDark ? "#5b3c4f" : "#9eddf5");
  sky.addColorStop(0.72, isDark ? "#8e4e45" : "#f4d28e");
  sky.addColorStop(1, isDark ? "#2c1a24" : "#f0984f");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, c.width, c.height);

  const glow = ctx.createRadialGradient(350, 235, 6, 350, 235, isDark ? 190 : 145);
  glow.addColorStop(0, isDark ? "rgba(255,245,183,0.88)" : "rgba(255,248,202,0.62)");
  glow.addColorStop(0.24, isDark ? "rgba(255,187,86,0.62)" : "rgba(255,224,130,0.34)");
  glow.addColorStop(1, "rgba(255,121,54,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.fillStyle = isDark ? "rgba(58, 40, 54, 0.42)" : "rgba(255, 255, 255, 0.58)";
  [
    [120, 170, 130, 28],
    [245, 126, 165, 26],
    [600, 190, 150, 30],
    [510, 285, 210, 34],
  ].forEach(([x, y, rx, ry]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = isDark ? "#38202a" : "#5f6670";
  ctx.beginPath();
  ctx.moveTo(0, 455);
  ctx.lineTo(130, 392);
  ctx.lineTo(250, 442);
  ctx.lineTo(380, 386);
  ctx.lineTo(535, 440);
  ctx.lineTo(690, 400);
  ctx.lineTo(768, 430);
  ctx.lineTo(768, 576);
  ctx.lineTo(0, 576);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}
