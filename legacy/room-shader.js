// =========================================================
// Real-time 3D anime room — plain Three.js (UMD), toon-shaded
// (R3F equivalent: same scene, no build step needed)
// =========================================================
(function () {
  const THREE = window.THREE;
  if (!THREE) { console.error("[scene] THREE missing"); return; }

  const canvas = document.querySelector(".hero__webgl");
  const hero   = document.querySelector(".hero");
  if (!canvas || !hero) { console.error("[scene] canvas/hero missing"); return; }

  // ---------- renderer / scene / camera ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(2.6, 1.7, 4.6);
  camera.lookAt(0, 1.0, 0);

  // ---------- toon ramp (5-step quantized) ----------
  function makeToonRamp(stops) {
    const data = new Uint8Array(stops.length * 4);
    stops.forEach((v, i) => {
      data[i * 4 + 0] = v; data[i * 4 + 1] = v;
      data[i * 4 + 2] = v; data[i * 4 + 3] = 255;
    });
    const tex = new THREE.DataTexture(data, stops.length, 1, THREE.RGBAFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
  }
  const toonRamp = makeToonRamp([60, 110, 165, 215, 255]);

  function toonMat(color) {
    return new THREE.MeshToonMaterial({ color, gradientMap: toonRamp });
  }

  // ---------- outline (inverted-hull style) ----------
  function withOutline(mesh, thickness = 0.012, color = 0x14110a) {
    const outline = new THREE.Mesh(
      mesh.geometry,
      new THREE.MeshBasicMaterial({ color, side: THREE.BackSide })
    );
    outline.scale.multiplyScalar(1 + thickness);
    mesh.add(outline);
    return mesh;
  }

  // ---------- COLOR PALETTE (day, night) ----------
  const palette = {
    day: {
      wall:   0xece1c2,
      floor:  0xb88550,
      window: 0x2c1d12,
      bed:    0xe7d6b0,
      bedFr:  0x4a2f1c,
      desk:   0x6b3f1f,
      lamp:   0xf3c768,
      pot:    0x8a5a36,
      leaf:   0x4a7048,
      sky:    0x9ec6dc,
      skyHor: 0xf1d09a,
      sun:    0xfff1b8,
      cloud:  0xfdf6e6,
      city:   0x4a6478,
      ground: 0x6b8a5a,
      sunDir: 0xffd189,
      ambient:0xe0d4b0,
    },
    night: {
      wall:   0x1c2138,
      floor:  0x121424,
      window: 0x05080e,
      bed:    0x2a3552,
      bedFr:  0x05080e,
      desk:   0x05080e,
      lamp:   0xf3c768,
      pot:    0x161b30,
      leaf:   0x1d2c3a,
      sky:    0x06091a,
      skyHor: 0x10172e,
      sun:    0xe6e2d0,
      cloud:  0x2a3550,
      city:   0x06091a,
      ground: 0x06091a,
      sunDir: 0xa8c6ec,
      ambient:0x182040,
    }
  };
  let mode = "day";

  // ---------- LIGHTS ----------
  const ambient = new THREE.AmbientLight(palette.day.ambient, 0.55);
  scene.add(ambient);

  // Window-anchored "sun" light
  const sunLight = new THREE.DirectionalLight(palette.day.sunDir, 1.6);
  sunLight.position.set(-3.0, 3.5, 2.2); // outside the window, upper-left
  sunLight.target.position.set(0.5, 0.2, 0); // points into the room
  scene.add(sunLight);
  scene.add(sunLight.target);

  // ---------- ROOM ----------
  const room = new THREE.Group();
  scene.add(room);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    toonMat(palette.day.floor)
  );
  floor.rotation.x = -Math.PI / 2;
  room.add(floor);

  // Back wall
  const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4),
    toonMat(palette.day.wall)
  );
  backWall.position.set(0, 2, -3);
  room.add(backWall);

  // Left wall (with window cut out — we fake it with two panels framing the window)
  const wallMat = toonMat(palette.day.wall);

  const wallH = 4;
  const winW = 2.0, winH = 2.2;
  const winCx = 0, winCy = 1.7; // center of window in the wall's local coords

  const buildLeftWall = () => {
    // Top panel
    const topH = wallH - (winCy + winH/2);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(8, topH), wallMat);
    top.position.set(0, wallH - topH/2, 0);
    // Bottom panel
    const botH = winCy - winH/2;
    const bot = new THREE.Mesh(new THREE.PlaneGeometry(8, botH), wallMat);
    bot.position.set(0, botH/2, 0);
    // Left strip (forward of window, between front of room and window's left edge)
    const leftStripW = (8/2) + (winCx - winW/2);
    const leftStrip = new THREE.Mesh(new THREE.PlaneGeometry(leftStripW, winH), wallMat);
    leftStrip.position.set(-(8/2) + leftStripW/2, winCy, 0);
    // Right strip
    const rightStripW = (8/2) - (winCx + winW/2);
    const rightStrip = new THREE.Mesh(new THREE.PlaneGeometry(rightStripW, winH), wallMat);
    rightStrip.position.set((8/2) - rightStripW/2, winCy, 0);

    const wall = new THREE.Group();
    wall.add(top, bot, leftStrip, rightStrip);
    wall.rotation.y = Math.PI / 2;
    wall.position.set(-3, 0, 0);
    return wall;
  };
  const leftWall = buildLeftWall();
  room.add(leftWall);

  // Outside view: a quad far behind the wall (sky + city), seen through the window hole
  const outsideGroup = new THREE.Group();
  const skyGeo = new THREE.PlaneGeometry(6, 6);
  // Build a procedural canvas texture with sky + sun + city silhouette
  function buildOutsideTexture(p) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 512;
    const ctx = c.getContext("2d");
    // Sky bands (cel)
    const bands = mode === "day"
      ? [[0.0, "#9ec6dc"], [0.45, "#cee2dc"], [0.65, "#f1d09a"], [0.78, "#e9b76a"]]
      : [[0.0, "#06091a"], [0.45, "#0c1226"], [0.65, "#10172e"], [0.78, "#1a2444"]];
    bands.forEach(([y, color], i) => {
      ctx.fillStyle = color;
      const y0 = c.height * y;
      const y1 = i + 1 < bands.length ? c.height * bands[i + 1][0] : c.height * 0.78;
      ctx.fillRect(0, y0, c.width, y1 - y0);
    });
    // Sun / Moon
    ctx.fillStyle = mode === "day" ? "#fff5d0" : "#e6e2d0";
    ctx.beginPath();
    ctx.arc(c.width * 0.7, c.height * 0.25, 38, 0, Math.PI * 2);
    ctx.fill();
    // soft halo (cel)
    ctx.fillStyle = mode === "day" ? "rgba(255,217,122,0.45)" : "rgba(180,200,232,0.30)";
    ctx.beginPath();
    ctx.arc(c.width * 0.7, c.height * 0.25, 70, 0, Math.PI * 2);
    ctx.fill();
    // Clouds
    ctx.fillStyle = mode === "day" ? "#fdf6e6" : "#2a3550";
    [
      [120, 120, 70, 14],
      [330, 200, 60, 12],
      [200, 270, 80, 16],
    ].forEach(([x, y, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    // Mountains
    ctx.fillStyle = mode === "day" ? "#5e7c8d" : "#0a1024";
    ctx.beginPath();
    ctx.moveTo(0, 360);
    ctx.lineTo(80, 290);
    ctx.lineTo(160, 330);
    ctx.lineTo(240, 280);
    ctx.lineTo(320, 320);
    ctx.lineTo(420, 290);
    ctx.lineTo(512, 320);
    ctx.lineTo(512, 380);
    ctx.lineTo(0, 380);
    ctx.closePath();
    ctx.fill();
    // City silhouette
    ctx.fillStyle = mode === "day" ? "#3b536a" : "#020410";
    const buildings = [
      [20, 380, 36, 70], [60, 360, 28, 90], [92, 390, 44, 60],
      [142, 360, 36, 90], [184, 380, 56, 70], [246, 372, 40, 78],
      [292, 396, 32, 54], [328, 380, 38, 70], [372, 366, 44, 84],
      [420, 380, 36, 70], [460, 360, 38, 90]
    ];
    buildings.forEach(([x, y, w, h]) => ctx.fillRect(x, y, w, h));
    // Night-only city window lights
    if (mode === "night") {
      ctx.fillStyle = "#ffd57a";
      buildings.forEach(([x, y, w, h]) => {
        for (let i = 0; i < 6; i++) {
          const px = x + 4 + Math.floor(Math.random() * (w - 8));
          const py = y + 8 + Math.floor(Math.random() * (h - 12));
          if (Math.random() > 0.55) ctx.fillRect(px, py, 3, 3);
        }
      });
    }
    // Ground
    ctx.fillStyle = mode === "day" ? "#5d7e4a" : "#04060c";
    ctx.fillRect(0, 450, c.width, 62);
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }
  let outsideTex = buildOutsideTexture(palette.day);
  const outsideMat = new THREE.MeshBasicMaterial({ map: outsideTex });
  const outside = new THREE.Mesh(skyGeo, outsideMat);
  outside.position.set(-3.6, 1.7, 0);
  outside.rotation.y = Math.PI / 2;
  outsideGroup.add(outside);
  scene.add(outsideGroup);

  // Window frame (thin wood ring)
  function buildFrame() {
    const t = 0.06; // frame thickness
    const w = winW, h = winH;
    const mat = new THREE.MeshBasicMaterial({ color: palette.day.window });
    const top = new THREE.Mesh(new THREE.BoxGeometry(w + t * 2, t, t), mat);
    top.position.set(0, h/2 + t/2, 0);
    const bot = new THREE.Mesh(new THREE.BoxGeometry(w + t * 2, t, t), mat);
    bot.position.set(0, -h/2 - t/2, 0);
    const left = new THREE.Mesh(new THREE.BoxGeometry(t, h, t), mat);
    left.position.set(-w/2 - t/2, 0, 0);
    const right = new THREE.Mesh(new THREE.BoxGeometry(t, h, t), mat);
    right.position.set(w/2 + t/2, 0, 0);
    // Mullions (cross)
    const vMul = new THREE.Mesh(new THREE.BoxGeometry(0.04, h, 0.04), mat);
    vMul.position.set(0, 0, 0);
    const hMul = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.04), mat);
    hMul.position.set(0, 0, 0);
    // 2 horizontal extras
    const hMul2 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.025, 0.04), mat);
    hMul2.position.set(0, h/4, 0);
    const hMul3 = new THREE.Mesh(new THREE.BoxGeometry(w, 0.025, 0.04), mat);
    hMul3.position.set(0, -h/4, 0);

    const f = new THREE.Group();
    f.add(top, bot, left, right, vMul, hMul, hMul2, hMul3);
    f.position.set(-2.99, winCy, 0);
    f.rotation.y = Math.PI / 2;
    return f;
  }
  const frame = buildFrame();
  scene.add(frame);

  // ---------- FURNITURE ----------
  // Bed
  const bedGroup = new THREE.Group();
  const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 1.0), toonMat(palette.day.bedFr));
  bedBase.position.set(0, 0.2, 0);
  withOutline(bedBase);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.95), toonMat(palette.day.bed));
  mattress.position.set(0, 0.49, 0);
  withOutline(mattress);
  const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.10, 0.4), toonMat(0xfaf3e2));
  pillow.position.set(-0.7, 0.63, 0);
  withOutline(pillow);
  const headboard = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.7, 1.0), toonMat(palette.day.bedFr));
  headboard.position.set(-1.1, 0.5, 0);
  withOutline(headboard);
  bedGroup.add(bedBase, mattress, pillow, headboard);
  bedGroup.position.set(1.4, 0, -1.7);
  bedGroup.rotation.y = Math.PI;
  room.add(bedGroup);

  // Desk
  const deskGroup = new THREE.Group();
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.6), toonMat(palette.day.desk));
  deskTop.position.set(0, 0.85, 0);
  withOutline(deskTop);
  const deskLegs = [
    [-0.65, 0.42, -0.25], [0.65, 0.42, -0.25],
    [-0.65, 0.42, 0.25],  [0.65, 0.42, 0.25],
  ].map(([x, y, z]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.85, 0.05), toonMat(palette.day.desk));
    m.position.set(x, y, z);
    withOutline(m);
    return m;
  });
  deskGroup.add(deskTop, ...deskLegs);
  deskGroup.position.set(-1.5, 0, -1.5);
  room.add(deskGroup);

  // Lamp on the desk
  const lampGroup = new THREE.Group();
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.04, 16), toonMat(palette.day.bedFr));
  lampBase.position.set(0, 0.02, 0);
  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.30, 8), toonMat(palette.day.bedFr));
  lampStem.position.set(0, 0.18, 0);
  const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.18, 16, 1, true), toonMat(palette.day.lamp));
  lampShade.position.set(0, 0.42, 0);
  lampGroup.add(lampBase, lampStem, lampShade);
  lampGroup.position.set(-1.9, 0.88, -1.5);
  room.add(lampGroup);

  // Plant
  const plantGroup = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.10, 0.18, 12), toonMat(palette.day.pot));
  pot.position.set(0, 0.09, 0);
  const leaves = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), toonMat(palette.day.leaf));
  leaves.position.set(0, 0.30, 0);
  plantGroup.add(pot, leaves);
  plantGroup.position.set(-1.0, 0.88, -1.4);
  room.add(plantGroup);

  // ---------- DUST PARTICLES (Points) ----------
  const dustCount = 80;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  const dustVel = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i*3+0] = -1.5 + Math.random() * 2.5;
    dustPos[i*3+1] = Math.random() * 3;
    dustPos[i*3+2] = -1.5 + Math.random() * 2.5;
    dustVel[i*3+0] = (Math.random() - 0.5) * 0.002;
    dustVel[i*3+1] = 0.003 + Math.random() * 0.005;
    dustVel[i*3+2] = (Math.random() - 0.5) * 0.002;
  }
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0xfff0c0,
    size: 0.04,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  // ---------- THEME SWITCH ----------
  function applyMode(next) {
    mode = next;
    const p = palette[mode];
    floor.material.color.setHex(p.floor);
    wallMat.color.setHex(p.wall);
    backWall.material.color.setHex(p.wall);
    bedBase.material.color.setHex(p.bedFr);
    mattress.material.color.setHex(p.bed);
    headboard.material.color.setHex(p.bedFr);
    deskTop.material.color.setHex(p.desk);
    deskLegs.forEach(l => l.material.color.setHex(p.desk));
    lampBase.material.color.setHex(p.bedFr);
    lampStem.material.color.setHex(p.bedFr);
    lampShade.material.color.setHex(p.lamp);
    pot.material.color.setHex(p.pot);
    leaves.material.color.setHex(p.leaf);
    frame.children.forEach(c => c.material.color.setHex(p.window));

    sunLight.color.setHex(p.sunDir);
    sunLight.intensity = mode === "day" ? 1.8 : 0.7;
    ambient.color.setHex(p.ambient);
    ambient.intensity = mode === "day" ? 0.55 : 0.30;

    dustMat.color.setHex(mode === "day" ? 0xfff0c0 : 0xc8d8f0);

    outsideTex.dispose();
    outsideTex = buildOutsideTexture(p);
    outsideMat.map = outsideTex;
    outsideMat.needsUpdate = true;
  }

  // ---------- RESIZE ----------
  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------- INTERACTION (scroll, cursor, theme) ----------
  let scroll = 0;
  let cx = 0, cy = 0;
  const root = document.documentElement;

  function syncFromDOM() {
    const s = getComputedStyle(hero);
    scroll = parseFloat(s.getPropertyValue("--scroll")) || 0;
    cx     = parseFloat(s.getPropertyValue("--cursor-x")) || 0;
    cy     = parseFloat(s.getPropertyValue("--cursor-y")) || 0;
    const desired = root.getAttribute("data-theme") === "dark" ? "night" : "day";
    if (desired !== mode) applyMode(desired);
  }

  // ---------- RENDER LOOP ----------
  const clock = new THREE.Clock();
  function tick() {
    const dt = clock.getDelta();
    syncFromDOM();

    // Sun moves slightly along an arc as you scroll (afternoon → evening)
    const arc = scroll * 0.6;
    sunLight.position.set(-3.0 + arc * 1.2, 3.5 - arc * 0.6, 2.2 - arc * 0.4);
    sunLight.intensity = (mode === "day" ? 1.4 : 0.55) + scroll * 0.6;

    // Cursor: very subtle camera nudge (perspective shift)
    camera.position.x = 2.6 + cx * 0.30;
    camera.position.y = 1.7 + cy * 0.15;
    camera.lookAt(0, 1.0, 0);

    // Dust drift
    const pos = dustGeo.attributes.position.array;
    for (let i = 0; i < dustCount; i++) {
      pos[i*3+0] += dustVel[i*3+0];
      pos[i*3+1] += dustVel[i*3+1];
      pos[i*3+2] += dustVel[i*3+2];
      if (pos[i*3+1] > 3.5) {
        pos[i*3+1] = 0;
        pos[i*3+0] = -1.5 + Math.random() * 2.5;
        pos[i*3+2] = -1.5 + Math.random() * 2.5;
      }
    }
    dustGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  applyMode(root.getAttribute("data-theme") === "dark" ? "night" : "day");
  requestAnimationFrame(tick);
  console.log("[scene] Real 3D anime room initialised.");
})();
