import * as THREE from "three";

// Hybrid soft cel ramp — keeps quantization but allows smoother transitions
// so post-bloom and GI bounce don't read as flat plastic.
export function makeToonRamp(steps = [70, 130, 175, 215, 255]) {
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => {
    data[i * 4 + 0] = v;
    data[i * 4 + 1] = v;
    data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  });
  const tex = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export const toonRamp = makeToonRamp();
