import * as THREE from "three";

function Mat({ color, roughness = 0.78, ...props }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} {...props} />;
}

export default function Furniture({ isDark }) {
  const palette = isDark
    ? {
        wood: "#3f241c",
        darkWood: "#271715",
        blanket: "#b9583b",
        blanketDeep: "#7b3432",
        sheet: "#e8b46c",
        pillow: "#ffd18f",
        leaf: "#496943",
        leafDeep: "#263f32",
        pot: "#8a4531",
        bookA: "#ca7842",
        bookB: "#dfb56c",
        bookC: "#516064",
      }
    : {
        wood: "#704026",
        darkWood: "#452719",
        blanket: "#e66f3d",
        blanketDeep: "#a94d38",
        sheet: "#f5bd75",
        pillow: "#ffdba3",
        leaf: "#4c7b43",
        leafDeep: "#2f5737",
        pot: "#a94f2f",
        bookA: "#db6f3c",
        bookB: "#f2b75a",
        bookC: "#507277",
      };

  return (
    <group>
      <Bed palette={palette} />
      <Bookshelf palette={palette} />
      <WindowPlants palette={palette} />
      <WallFrames palette={palette} />
      <FloorPlants palette={palette} />
    </group>
  );
}

function Bed({ palette }) {
  return (
    <group position={[0.88, 0, 1.25]} rotation={[0, -0.05, 0]}>
      <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 0.48, 1.95]} />
        <Mat color={palette.darkWood} />
      </mesh>
      <mesh position={[0, 0.55, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[3.72, 0.28, 1.82]} />
        <Mat color={palette.sheet} />
      </mesh>
      <mesh position={[0.12, 0.74, 0.25]} castShadow receiveShadow>
        <boxGeometry args={[3.55, 0.24, 1.55]} />
        <Mat color={palette.blanket} />
      </mesh>
      {[-1.16, -0.42, 0.38, 1.14].map((x, i) => (
        <mesh key={i} position={[x, 0.89 + (i % 2) * 0.035, 0.24]} rotation={[0.04, 0, 0.05]} castShadow>
          <boxGeometry args={[0.64, 0.12, 1.62]} />
          <Mat color={i % 2 ? palette.blanketDeep : palette.blanket} />
        </mesh>
      ))}
      <mesh position={[1.25, 0.87, -0.56]} rotation={[0, 0.03, -0.04]} castShadow>
        <boxGeometry args={[0.78, 0.16, 0.52]} />
        <Mat color={palette.pillow} />
      </mesh>
      <mesh position={[0.42, 0.88, -0.6]} rotation={[0, -0.04, 0.05]} castShadow>
        <boxGeometry args={[0.78, 0.15, 0.48]} />
        <Mat color="#f4b36f" />
      </mesh>
      <mesh position={[1.78, 0.57, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.78, 1.96]} />
        <Mat color={palette.darkWood} />
      </mesh>
      <Cat />
    </group>
  );
}

function Cat() {
  return (
    <group position={[-0.55, 1.0, 0.1]} rotation={[0.02, -0.35, 0]}>
      <mesh position={[0, 0, 0]} scale={[0.58, 0.18, 0.3]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <Mat color="#e9a45e" />
      </mesh>
      <mesh position={[0.48, 0.05, 0.02]} scale={[0.25, 0.2, 0.22]} castShadow>
        <sphereGeometry args={[1, 18, 12]} />
        <Mat color="#edb06f" />
      </mesh>
      <mesh position={[0.53, 0.24, -0.1]} rotation={[0.18, 0, -0.25]} castShadow>
        <coneGeometry args={[0.08, 0.18, 3]} />
        <Mat color="#e69852" />
      </mesh>
      <mesh position={[0.53, 0.24, 0.14]} rotation={[-0.18, 0, -0.25]} castShadow>
        <coneGeometry args={[0.08, 0.18, 3]} />
        <Mat color="#e69852" />
      </mesh>
      <mesh position={[-0.55, 0.02, 0.06]} rotation={[0.2, 0.65, 0.1]} castShadow>
        <torusGeometry args={[0.18, 0.035, 8, 24, Math.PI * 1.55]} />
        <Mat color="#e9a45e" />
      </mesh>
    </group>
  );
}

function Bookshelf({ palette }) {
  const shelves = [0.25, 0.92, 1.58, 2.24, 2.9];
  const books = [
    palette.bookA,
    palette.bookB,
    palette.bookC,
    "#f0d9a1",
    "#8f4a38",
    "#345359",
  ];

  return (
    <group position={[-3.35, 0, -1.1]} rotation={[0, 0.05, 0]}>
      <mesh position={[0, 1.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.32, 3.3, 1.15]} />
        <Mat color={palette.darkWood} />
      </mesh>
      {shelves.map((y) => (
        <mesh key={y} position={[0.18, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.52, 0.08, 1.25]} />
          <Mat color={palette.wood} />
        </mesh>
      ))}
      {shelves.slice(1).map((y, row) =>
        Array.from({ length: 9 }).map((_, i) => (
          <mesh
            key={`${row}-${i}`}
            position={[0.46, y + 0.18, -0.48 + i * 0.115]}
            rotation={[0, 0, (i % 3 - 1) * 0.04]}
            castShadow
          >
            <boxGeometry args={[0.13, 0.34 + (i % 4) * 0.05, 0.075]} />
            <Mat color={books[(i + row) % books.length]} />
          </mesh>
        ))
      )}
    </group>
  );
}

function WindowPlants({ palette }) {
  return (
    <group position={[0, 1.1, -2.78]}>
      {[-0.85, 0.9].map((x, i) => (
        <group key={x} position={[x, 0, 0.03]}>
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.13, 0.18, 14]} />
            <Mat color={palette.pot} />
          </mesh>
          {Array.from({ length: 6 }).map((_, leaf) => (
            <mesh
              key={leaf}
              position={[
                Math.cos(leaf) * 0.12,
                0.24 + (leaf % 2) * 0.08,
                Math.sin(leaf) * 0.05,
              ]}
              rotation={[0.45, leaf * 0.9, 0.2]}
              scale={[0.11, 0.035, 0.2]}
              castShadow
            >
              <sphereGeometry args={[1, 12, 8]} />
              <Mat color={leaf % 2 ? palette.leaf : palette.leafDeep} />
            </mesh>
          ))}
          {i === 1 && (
            <pointLight color="#ffb45a" intensity={0.22} distance={1.8} position={[-0.2, 0.45, 0.2]} />
          )}
        </group>
      ))}
    </group>
  );
}

function WallFrames({ palette }) {
  return (
    <group position={[3.98, 0, -1.3]} rotation={[0, -Math.PI / 2, 0]}>
      {[
        [0, 2.65, 0],
        [0.02, 1.92, -0.32],
        [0.02, 2.02, 0.42],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.06, 0.62, 0.48]} />
            <Mat color={palette.darkWood} />
          </mesh>
          <mesh position={[-0.035, 0, 0]} receiveShadow>
            <planeGeometry args={[0.46, 0.34]} />
            <meshStandardMaterial color={i === 0 ? "#e9a46a" : "#f2c382"} side={THREE.DoubleSide} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloorPlants({ palette }) {
  return (
    <group position={[-2.55, 0, 1.48]}>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.22, 0.36, 18]} />
        <Mat color={palette.pot} />
      </mesh>
      {Array.from({ length: 11 }).map((_, i) => (
        <mesh
          key={i}
          position={[Math.cos(i * 0.9) * 0.22, 0.58 + (i % 4) * 0.11, Math.sin(i * 0.9) * 0.14]}
          rotation={[0.9, i * 0.72, 0.2]}
          scale={[0.18, 0.045, 0.36]}
          castShadow
        >
          <sphereGeometry args={[1, 16, 8]} />
          <Mat color={i % 2 ? palette.leaf : palette.leafDeep} />
        </mesh>
      ))}
    </group>
  );
}
