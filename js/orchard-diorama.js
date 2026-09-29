/**
 * Orchard hero, 3D diorama variant (three.js). A real rolling landscape with rows of 3D trees that grow and
 * blossom. Wind, cursor gusts and falling petals all run on the GPU; the cursor is a ray into the scene that
 * parts the blossoms and draws the bees. The camera drifts with the mouse, cranes up as you scroll, and the
 * blossoms turn to summer green on the way out. A click regrows the orchard.
 *
 * Fast path: every branch of every tree is one merged mesh (one draw call), blossoms and petals are instanced,
 * and nothing renders while the hero is off screen.
 */
(() => {
  const T = THREE, { $, clamp, lerp, damp, sstep, reduce, RNG, Noise, M, scene } = MO;
  const hero = $("#hero"), cv = $("#orchard");
  hero.classList.add("is-diorama");
  const mobile = innerWidth < 700;
  const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  const r = new T.WebGLRenderer({ canvas: cv, antialias: dpr < 1.5, alpha: true, powerPreference: "high-performance" });
  r.setPixelRatio(dpr); r.setClearColor(0, 0); r.outputEncoding = T.sRGBEncoding;
  const sc = new T.Scene(); sc.fog = new T.Fog(0xE9E5D6, 11, 36);
  const cam = new T.PerspectiveCamera(32, 1, 0.1, 120);
  sc.add(new T.HemisphereLight(0xFFF6E5, 0x7F9463, 0.95));
  const key = new T.DirectionalLight(0xFFE3B8, 0.55); key.position.set(6, 9, -4); sc.add(key);
  const col = (h) => new T.Color(h).convertSRGBToLinear();

  // Shared wind: sway grows with height, the cursor ray pushes things away from it
  const U = { uTime: { value: 0 }, uWind: { value: 0 }, uGust: { value: 0 }, uRayO: { value: new T.Vector3() }, uRayD: { value: new T.Vector3(0, 0, -1) }, uGrow: { value: 0 }, uBloom: { value: 0 }, uSeason: { value: 0 }, uDrift: { value: 0 } };
  const WIND = `
    uniform float uTime, uWind, uGust, uGrow, uBloom, uSeason, uDrift; uniform vec3 uRayO, uRayD;
    vec3 windAt(vec3 p, float h, float ph) {
      float s = h * h;
      vec3 o = vec3(uWind * 0.05 * s + sin(uTime * 1.4 + ph + h * 1.3) * 0.018 * s, 0.0, sin(uTime * 1.1 + ph * 1.7 + h) * 0.014 * s);
      vec3 d = p - uRayO; vec3 c = uRayO + uRayD * max(dot(d, uRayD), 0.0); vec3 away = p - c; float dist = length(away);
      o += (away / max(dist, 1e-3)) * smoothstep(1.4, 0.0, dist) * uGust * 0.28 * min(h, 2.5);
      return o;
    }`;
  const inject = (m, fn) => { m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U); fn(sh); }; return m; };

  // ---------- Terrain: rolling hills that climb toward the horizon ----------
  let N = Noise(11);
  const hgt = (x, z) => N(x * 0.07, z * 0.09) * 0.7 * (0.4 + sstep(2, -8, z) * 0.6) + N(x * 0.18 + 5, z * 0.2) * 0.2 + Math.max(0, -z - 8) * 0.07 + Math.max(0, -z - 22) * 0.1;
  const tg = new T.PlaneGeometry(90, 60, mobile ? 70 : 120, mobile ? 45 : 80); tg.rotateX(-Math.PI / 2); tg.translate(0, 0, -20);
  const terrainMat = new T.MeshLambertMaterial({ vertexColors: true });
  const terrain = new T.Mesh(tg, terrainMat); sc.add(terrain);
  const cNear = col("#5E6B45"), cMid = col("#9DB27E"), cFar = col("#C5D0A8"), tmp = new T.Color();
  function shapeTerrain() {
    const p = tg.attributes.position, c = new Float32Array(p.count * 3);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i); p.setY(i, hgt(x, z));
      // Paper-layer bands: near ground, mid hills, far hills
      const u = sstep(4, -3, z), v = sstep(-3, -12, z);
      tmp.copy(cNear).lerp(cMid, u).lerp(cFar, v); c.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    p.needsUpdate = true; tg.setAttribute("color", new T.BufferAttribute(c, 3)); tg.computeVertexNormals();
  }

  // ---------- Trees: all branches of the whole orchard in one merged mesh ----------
  const barkMat = inject(new T.MeshLambertMaterial({ color: col("#3B2A22") }), (sh) => {
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec3 aBase; attribute float aLvl, aH, aPh, aD;" + WIND)
      .replace("#include <begin_vertex>", `#include <begin_vertex>
        float g = clamp(uGrow * (aD + 2.0) - aLvl, 0.0, 1.0);
        transformed = mix(aBase, transformed, g);
        transformed += windAt(transformed, aH, aPh);`);
  });
  const BLOOM = ["#E8B4A0", "#F7E4DA", "#D98A7A", "#F2CC8F", "#FFFFFF"], LEAF = ["#5E6B45", "#87A96B", "#3D5A40"];
  // Blossoms are flat, camera-facing discs: the illustrated look of the 2D orchard, with real depth
  const bloomMat = inject(new T.MeshBasicMaterial(), (sh) => {
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float aH, aPh, aDelay; varying vec2 vQ;" + WIND)
      .replace("#include <project_vertex>", `
        vec3 ip = vec3(instanceMatrix[3]);
        float sc = length(instanceMatrix[0].xyz) * clamp((uBloom - aDelay) / 0.3, 0.0, 1.0) * (1.0 - uSeason * 0.2);
        vec4 mvPosition = modelViewMatrix * vec4(ip + windAt(ip, aH, aPh), 1.0);
        mvPosition.xy += position.xy * sc * 2.0; vQ = position.xy * 2.0;
        gl_Position = projectionMatrix * mvPosition;`)
      .replace("#include <color_vertex>", `#include <color_vertex>
        vColor.xyz = mix(vColor.xyz, mix(vec3(0.09, 0.2, 0.05), vec3(0.24, 0.4, 0.13), fract(aPh * 3.7)), uSeason);`);
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vQ;")
      .replace("void main() {", "void main() {\n float q2 = dot(vQ, vQ); if (q2 > 1.0) discard;")
      .replace("#include <fog_fragment>", "gl_FragColor.rgb *= mix(1.0, 0.9, smoothstep(0.7, 1.0, q2));\n#include <fog_fragment>");
  });
  const shadowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d"); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(40,45,25,.55)"); gr.addColorStop(1, "rgba(40,45,25,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })();
  const shadowMat = new T.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, fog: true });

  let orchard = null, tips = [], seed = 11; const SC = 0.62;
  // Landscape frames the whole orchard; portrait moves in closer and aims higher, so the trees sit under the headline
  const CAM = { y: 1.45, z: 11.5, ty: 3.3 }, frame = () => Object.assign(CAM, cam.aspect < 1 ? { y: 1.2, z: 9, ty: 3.85 } : { y: 1.45, z: 11.5, ty: 3.3 }, window.__CAM || {});
  const up = new T.Vector3(0, 1, 0);
  function build() {
    if (orchard) { orchard.traverse((o) => { if (o.geometry && o !== terrain) o.geometry.dispose(); }); sc.remove(orchard); }
    orchard = new T.Group(); sc.add(orchard); tips = [];
    const R = RNG(seed); N = Noise(seed); shapeTerrain();
    const pos = [], nor = [], base = [], lvl = [], hh = [], ph = [], dd = [], idx = [];
    const blooms = []; // [x, y, z, s, colorIndex, h, ph, delay]
    // Rows fill the visible width at their depth, spaced a little wider the further back they are
    const rz = mobile ? [1, -3.5, -8.5] : [1, -3, -7.5, -12.5, -18], tanH = Math.tan((cam.fov * Math.PI) / 360) * cam.aspect;
    const rows = rz.map((z, i) => { const half = (CAM.z - z) * tanH * 1.1 + 1, sp = 2.5 + i * 0.5, n = Math.max(2, Math.floor((half * 2) / sp)); return [z, n, half * 2]; });
    const shadows = [];
    const cyl = new T.CylinderGeometry(1, 1, 1, 6, 1, true); cyl.translate(0, 0.5, 0);
    const cp = cyl.attributes.position, cn = cyl.attributes.normal, ci = cyl.index.array;
    const q = new T.Quaternion(), m4 = new T.Matrix4(), v = new T.Vector3(), n3 = new T.Matrix3();
    rows.forEach(([z0, n, span], ri) => {
      const depthMax = ri < 2 ? 6 : ri < 4 ? 5 : 4;
      for (let i = 0; i < n; i++) {
        const x0 = -span / 2 + (span * (i + 0.5)) / n + (R() - 0.5) * (span / n) * 0.5, z = z0 + (R() - 0.5) * 1.4, y0 = hgt(x0, z) - 0.05, s = (0.85 + R() * 0.3) * (ri === 0 ? 1.05 : 1) * SC, phase = R() * 6;
        shadows.push([x0, y0 + 0.02, z, s]);
        (function grow(from, dir, len, depth, rad) {
          const lv = depthMax - depth, to = from.clone().addScaledVector(dir, len);
          // One tapered cylinder per branch
          q.setFromUnitVectors(up, dir); const rTop = depth > 0 ? rad * 0.68 : rad * 0.5;
          const b0 = pos.length / 3;
          for (let k = 0; k < cp.count; k++) {
            const yy = cp.getY(k), rr = lerp(rad, rTop, yy);
            v.set(cp.getX(k) * rr, yy * len, cp.getZ(k) * rr).applyQuaternion(q).add(from);
            pos.push(v.x, v.y, v.z); base.push(from.x, from.y, from.z);
            const nn = new T.Vector3(cn.getX(k), cn.getY(k), cn.getZ(k)).applyQuaternion(q); nor.push(nn.x, nn.y, nn.z);
            lvl.push(lv); hh.push(Math.max(0, v.y - y0)); ph.push(phase); dd.push(depthMax);
          }
          for (let k = 0; k < ci.length; k++) idx.push(b0 + ci[k]);
          if (depth > 0) {
            const k = R() < 0.25 ? 3 : 2, side = new T.Vector3(R() - 0.5, 0, R() - 0.5).cross(dir).normalize();
            for (let j = 0; j < k; j++) {
              const ang = (0.42 + R() * 0.3) * (lv === 0 ? 0.8 : 1), spin = (j / k) * Math.PI * 2 + R() * 1.2;
              const axis = side.clone().applyAxisAngle(dir, spin), nd = dir.clone().applyAxisAngle(axis, ang);
              nd.y += 0.18; nd.normalize(); // keep the crown reaching up and out
              grow(to, nd, len * (0.72 + R() * 0.12), depth - 1, rTop);
            }
          } else {
            const nb = ri > 2 ? 3 : 4;
            for (let f = 0; f < nb; f++) {
              const leaf = R() < 0.28, c = leaf ? LEAF[Math.floor(R() * 3)] : BLOOM[Math.floor(R() * BLOOM.length)];
              const p = to.clone().add(new T.Vector3((R() - 0.5) * 0.42, (R() - 0.5) * 0.34, (R() - 0.5) * 0.42).multiplyScalar(s));
              blooms.push([p.x, p.y, p.z, (0.05 + R() * 0.06) * s, c, p.y - y0, phase, R() * 0.6]);
            }
            if (ri < 2) tips.push(to.clone());
          }
        })(new T.Vector3(x0, y0, z), new T.Vector3((R() - 0.5) * 0.12, 1, (R() - 0.5) * 0.12).normalize(), 0.95 * s, depthMax, 0.075 * s);
      }
    });
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new T.Float32BufferAttribute(nor, 3));
    g.setAttribute("aBase", new T.Float32BufferAttribute(base, 3)); g.setAttribute("aLvl", new T.Float32BufferAttribute(lvl, 1)); g.setAttribute("aH", new T.Float32BufferAttribute(hh, 1)); g.setAttribute("aPh", new T.Float32BufferAttribute(ph, 1)); g.setAttribute("aD", new T.Float32BufferAttribute(dd, 1));
    g.setIndex(idx);
    const bark = new T.Mesh(g, barkMat); bark.frustumCulled = false; orchard.add(bark);

    const bg = new T.PlaneGeometry(1, 1);
    const im = new T.InstancedMesh(bg, bloomMat, blooms.length); im.frustumCulled = false;
    const aH = new Float32Array(blooms.length), aPh = new Float32Array(blooms.length), aDelay = new Float32Array(blooms.length);
    const qq = new T.Quaternion(), sv = new T.Vector3();
    blooms.forEach((b, i) => { qq.identity(); sv.setScalar(b[3]); m4.compose(v.set(b[0], b[1], b[2]), qq, sv); im.setMatrixAt(i, m4); im.setColorAt(i, col(b[4])); aH[i] = b[5]; aPh[i] = b[6] + i * 0.37; aDelay[i] = b[7]; });
    bg.setAttribute("aH", new T.InstancedBufferAttribute(aH, 1)); bg.setAttribute("aPh", new T.InstancedBufferAttribute(aPh, 1)); bg.setAttribute("aDelay", new T.InstancedBufferAttribute(aDelay, 1));
    orchard.add(im);

    // Soft contact shadows under each tree
    const sg = new T.PlaneGeometry(1, 1); sg.rotateX(-Math.PI / 2);
    const sh = new T.InstancedMesh(sg, shadowMat, shadows.length);
    shadows.forEach(([x, y, z, s], i) => { m4.compose(v.set(x, y, z), qq.identity(), sv.set(3.4 * s, 1, 2 * s)); sh.setMatrixAt(i, m4); });
    orchard.add(sh);
    buildPetals(R); buildBees(R);
  }

  // ---------- Petals: fall, flutter and drift with the wind entirely in the vertex shader ----------
  const petalMat = inject(new T.MeshBasicMaterial({ side: T.DoubleSide, transparent: true, opacity: 0.9, depthWrite: false }), (sh) => {
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec4 aSeed; varying vec2 vQ;" + WIND)
      .replace("#include <project_vertex>", `
        float fall = 0.35 + aSeed.w * 0.45, H = 9.0, W = 26.0;
        float y = 6.5 - mod(uTime * fall + aSeed.y * H, H);
        float x = mod(aSeed.x * W + uTime * 0.25 + uDrift + sin(uTime * 0.9 + aSeed.z * 6.0) * 0.4 + W * 0.5, W) - W * 0.5;
        float z = aSeed.z * 14.0 - 9.0;
        float a = uTime * (1.5 + aSeed.w * 2.0) + aSeed.x * 6.0;
        vQ = position.xy / vec2(0.0375, 0.0225);
        vec3 p = transformed; p.xy = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xy; p.yz = mat2(cos(a * 0.7), -sin(a * 0.7), sin(a * 0.7), cos(a * 0.7)) * p.yz;
        vec3 w = vec3(x, y, z);
        vec3 d = w - uRayO; vec3 c = uRayO + uRayD * max(dot(d, uRayD), 0.0); vec3 away = w - c; w += (away / max(length(away), 1e-3)) * smoothstep(1.2, 0.0, length(away)) * (0.3 + uGust * 0.6);
        vec4 mvPosition = modelViewMatrix * vec4(w + p * uBloom, 1.0); gl_Position = projectionMatrix * mvPosition;`);
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vQ;").replace("void main() {", "void main() {\n if (dot(vQ, vQ) > 1.0) discard;");
  });
  let petals = null;
  function buildPetals(R) {
    if (petals) { orchard.remove(petals); petals.geometry.dispose(); }
    const n = reduce ? 0 : mobile ? 90 : 220, g = new T.PlaneGeometry(0.075, 0.045), s = new Float32Array(n * 4);
    for (let i = 0; i < n * 4; i++) s[i] = R();
    g.setAttribute("aSeed", new T.InstancedBufferAttribute(s, 4));
    petals = new T.InstancedMesh(g, petalMat, Math.max(1, n)); petals.count = n; petals.frustumCulled = false;
    for (let i = 0; i < n; i++) petals.setColorAt(i, col(BLOOM[Math.floor(R() * 3)]));
    orchard.add(petals);
  }

  // ---------- Bees: small flocks that visit blossoms and gather around the cursor ray ----------
  let bees = [], beeBody = null, beeWing = null, trail = null;
  const TR = 10;
  function buildBees(R) {
    const n = reduce ? 0 : mobile ? 10 : 20;
    const body = new T.SphereGeometry(1, 8, 6); body.scale(1.5, 1, 1);
    beeBody = new T.InstancedMesh(body, new T.MeshLambertMaterial({ color: col("#E0A33A") }), Math.max(1, n)); beeBody.count = n; beeBody.frustumCulled = false;
    const wing = new T.PlaneGeometry(1.6, 1); wing.translate(0, 0.5, 0);
    beeWing = new T.InstancedMesh(wing, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, side: T.DoubleSide, depthWrite: false }), Math.max(1, n)); beeWing.count = n; beeWing.frustumCulled = false;
    const tp = new Float32Array(n * TR * 3), ta = new Float32Array(n * TR);
    const tgm = new T.BufferGeometry(); tgm.setAttribute("position", new T.BufferAttribute(tp, 3)); tgm.setAttribute("alpha", new T.BufferAttribute(ta, 1));
    trail = new T.Points(tgm, new T.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uPx: { value: dpr } }, vertexShader: "attribute float alpha; varying float vA; uniform float uPx; void main(){ vA = alpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = uPx * 22.0 / -mv.z; gl_Position = projectionMatrix * mv; }", fragmentShader: "varying float vA; void main(){ if (length(gl_PointCoord - 0.5) > 0.5) discard; gl_FragColor = vec4(0.88, 0.64, 0.23, vA * 0.4); }" }));
    trail.frustumCulled = false;
    bees = Array.from({ length: n }, (_, i) => ({ p: tips.length ? tips[Math.floor(R() * tips.length)].clone().add(new T.Vector3(0, 0.5, 0)) : new T.Vector3(), v: new T.Vector3(), tgt: null, wait: 0, tr: [], ph: i }));
    orchard.add(beeBody, beeWing, trail);
  }

  // ---------- Frame ----------
  const ray = new T.Raycaster(), v2 = new T.Vector2(), m4 = new T.Matrix4(), qb = new T.Quaternion(), sb = new T.Vector3(), eb = new T.Euler(), tv = new T.Vector3(), cp = new T.Vector3();
  let W = 0, H = 0, t0 = null, wind = 0, gust = 0, inHero = false, camX = 0, camY = 0, intro = 0, drift = 0;
  hero.addEventListener("pointerenter", () => (inHero = true)); hero.addEventListener("pointerleave", () => (inHero = false));
  const resize = () => {
    W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return; r.setSize(W, H, false); cam.aspect = W / H;
    // Keep roughly the same slice of orchard in view on any screen shape
    cam.fov = clamp(32 * (1.6 / cam.aspect) ** 0.55, 26, 50); cam.updateProjectionMatrix(); frame();
  };
  new ResizeObserver(resize).observe(cv); resize();
  cv.addEventListener("click", () => { seed = Math.floor(Math.random() * 9999); build(); t0 = performance.now() / 1000; });
  build();

  let drawn = false;
  scene(hero, (t, dt) => {
    if (!W) return;
    if (t0 === null && (hero.classList.contains("is-in") || reduce)) t0 = t;
    const age = t0 === null ? 0 : t - t0, g = reduce ? 1 : clamp(age / 5.5, 0, 1);
    if (reduce && drawn) return;
    const scr = clamp(scrollY / H, 0, 1);
    // Camera: a slow dolly in on arrival, a drift with the mouse, a crane up as you scroll away
    intro = reduce ? 1 : damp(intro, t0 === null ? 0 : 1, 0.02, dt);
    camX = damp(camX, inHero ? M.nx * 0.9 : 0, 0.04, dt); camY = damp(camY, inHero ? M.ny * 0.35 : 0, 0.04, dt);
    const s = sstep(0, 1, scr);
    cam.position.set(camX, CAM.y + camY + s * 1.6 + (1 - intro) * 0.4, CAM.z + (1 - intro) * 3 - s * 1.2);
    cp.set(camX * 0.35, CAM.ty - s * 0.4, -4); cam.lookAt(cp);
    // Wind from pointer speed, plus a local gust along the cursor ray
    wind = damp(wind, clamp(M.vx * 0.06, -3, 3) + Math.sin(t * 0.6) * 0.5, 0.05, dt);
    gust = damp(gust, inHero ? clamp(Math.hypot(M.vx, M.vy) * 0.08, 0.25, 2.5) : 0, 0.08, dt);
    drift += wind * 0.15 * dt;
    v2.set(M.nx, M.ny); ray.setFromCamera(v2, cam);
    U.uTime.value = reduce ? 0 : t; U.uWind.value = reduce ? 0 : wind; U.uGust.value = reduce ? 0 : gust; U.uDrift.value = drift;
    U.uRayO.value.copy(ray.ray.origin); U.uRayD.value.copy(ray.ray.direction);
    U.uGrow.value = g; U.uBloom.value = clamp((g - 0.72) / 0.28, 0, 1) * 1.3; U.uSeason.value = sstep(0.15, 0.85, scr);
    petalMat.opacity = 0.9 * (1 - U.uSeason.value);

    if (bees.length && g > 0.8) {
      const k = dt * 60;
      const tp = trail.geometry.attributes.position, ta = trail.geometry.attributes.alpha;
      bees.forEach((b, i) => {
        // Closest point on the cursor ray to this bee: the cursor, at the bee's depth
        tv.copy(b.p).sub(ray.ray.origin); const along = Math.max(0, tv.dot(ray.ray.direction)); tv.copy(ray.ray.origin).addScaledVector(ray.ray.direction, along);
        const near = inHero && tv.distanceTo(b.p) < 2.2;
        if (near) { b.tgt = tv.clone().add(new T.Vector3(Math.cos(t * 3 + i) * 0.35, Math.sin(t * 3.4 + i * 2) * 0.25, Math.sin(t * 2.6 + i) * 0.3)); b.wait = 0; }
        else if (!b.tgt || b.wait > 0) { b.wait -= k; if (b.wait <= 0 || !b.tgt) { b.tgt = tips[Math.floor(Math.random() * tips.length)]; b.wait = 0; } }
        tv.copy(b.tgt).sub(b.p); const d = tv.length();
        if (!near && d < 0.12) { b.wait = 40 + Math.random() * 60; b.tgt = null; }
        b.v.addScaledVector(tv, (0.004 / (d + 0.3)) * k).add(sb.set((Math.random() - 0.5) * 0.006, (Math.random() - 0.5) * 0.006 + Math.sin(t * 9 + i) * 0.001, (Math.random() - 0.5) * 0.006).multiplyScalar(k));
        const mx = near ? 0.075 : 0.055, sp = b.v.length(); if (sp > mx) b.v.multiplyScalar(mx / sp); b.v.multiplyScalar(0.96);
        b.p.addScaledVector(b.v, k);
        eb.set(0, Math.atan2(-b.v.z, b.v.x), Math.atan2(b.v.y, Math.hypot(b.v.x, b.v.z))); qb.setFromEuler(eb);
        m4.compose(b.p, qb, sb.setScalar(0.03)); beeBody.setMatrixAt(i, m4);
        m4.compose(tv.copy(b.p).add(sb.set(0, 0.03, 0)), qb, sb.set(0.035, 0.035 * (0.3 + Math.abs(Math.sin(t * 40 + i))), 0.035)); beeWing.setMatrixAt(i, m4);
        b.tr.unshift(b.p.x, b.p.y, b.p.z); if (b.tr.length > TR * 3) b.tr.length = TR * 3;
        for (let j = 0; j < TR; j++) { const o = (i * TR + j) * 3; if (j * 3 < b.tr.length) { tp.array[o] = b.tr[j * 3]; tp.array[o + 1] = b.tr[j * 3 + 1]; tp.array[o + 2] = b.tr[j * 3 + 2]; } ta.array[i * TR + j] = (1 - j / TR) * (j % 2 ? 0 : 1); }
      });
      beeBody.instanceMatrix.needsUpdate = true; beeWing.instanceMatrix.needsUpdate = true; tp.needsUpdate = true; ta.needsUpdate = true;
      beeBody.visible = beeWing.visible = trail.visible = true;
    } else if (beeBody) beeBody.visible = beeWing.visible = trail.visible = false;

    r.render(sc, cam); drawn = true;
  });
  addEventListener("resize", () => (drawn = false));
})();
