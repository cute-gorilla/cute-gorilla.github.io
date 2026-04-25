import * as THREE from "three";

function Mat({ color, emissive = "#000000", emissiveIntensity = 0, ...props }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      roughness={0.82}
      metalness={0.02}
      {...props}
    />
  );
}

export default function Room({ isDark }) {
  const wallColor = isDark ? "#463a48" : "#72525b";
  const sideWall = isDark ? "#302a36" : "#5a4853";
  const floorColor = isDark ? "#5b302c" : "#aa5936";
  const trimColor = isDark ? "#4c2d29" : "#7a3d27";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.6, 7.6]} />
        <Mat color={floorColor} />
      </mesh>

      {Array.from({ length: 9 }).map((_, i) => (
        <mesh
          key={i}
          position={[-4.2 + i * 1.05, 0.012, 0.16]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[0.025, 7.35]} />
          <Mat color={trimColor} />
        </mesh>
      ))}

      <BackWallWithWindow color={wallColor} trimColor={trimColor} />

      <mesh position={[-4.05, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7.6, 4]} />
        <Mat color={sideWall} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[4.05, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[7.6, 4]} />
        <Mat color={isDark ? "#3d313c" : "#67505a"} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 4, -0.2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[9.6, 7.6]} />
        <Mat color={isDark ? "#393140" : "#6e5660"} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BackWallWithWindow({ color, trimColor }) {
  const wallW = 9.6;
  const wallH = 4;
  const winW = 2.35;
  const winH = 1.75;
  const winCy = 2.05;
  const z = -3.05;

  const topH = wallH - (winCy + winH / 2);
  const bottomH = winCy - winH / 2;
  const sideW = (wallW - winW) / 2;

  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, wallH - topH / 2, 0]} receiveShadow>
        <planeGeometry args={[wallW, topH]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[0, bottomH / 2, 0]} receiveShadow>
        <planeGeometry args={[wallW, bottomH]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[-winW / 2 - sideW / 2, winCy, 0]} receiveShadow>
        <planeGeometry args={[sideW, winH]} />
        <Mat color={color} />
      </mesh>
      <mesh position={[winW / 2 + sideW / 2, winCy, 0]} receiveShadow>
        <planeGeometry args={[sideW, winH]} />
        <Mat color={color} />
      </mesh>

      <mesh position={[0, winCy - winH / 2 - 0.08, 0.04]} castShadow receiveShadow>
        <boxGeometry args={[winW + 0.62, 0.16, 0.18]} />
        <Mat color={trimColor} />
      </mesh>
    </group>
  );
}
