import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

// Tracks cursor position over the canvas and very subtly nudges the camera.
export default function CameraRig() {
  const { camera, gl } = useThree();
  const cursor = useRef({ x: 0, y: 0 });
  const base = useRef({ x: 0.15, y: 1.55, z: 5.15 });

  useEffect(() => {
    const dom = gl.domElement;
    const onMove = (e) => {
      const r = dom.getBoundingClientRect();
      cursor.current.x = (e.clientX - r.left) / r.width  - 0.5;
      cursor.current.y = (e.clientY - r.top)  / r.height - 0.5;
    };
    const onLeave = () => { cursor.current.x = 0; cursor.current.y = 0; };
    dom.addEventListener("mousemove", onMove);
    dom.addEventListener("mouseleave", onLeave);
    return () => {
      dom.removeEventListener("mousemove", onMove);
      dom.removeEventListener("mouseleave", onLeave);
    };
  }, [gl]);

  useFrame(() => {
    const tx = base.current.x + cursor.current.x * 0.18;
    const ty = base.current.y + cursor.current.y * 0.12;
    camera.position.x += (tx - camera.position.x) * 0.05;
    camera.position.y += (ty - camera.position.y) * 0.05;
    camera.lookAt(0.05, 1.35, -1.1);
  });

  return null;
}
