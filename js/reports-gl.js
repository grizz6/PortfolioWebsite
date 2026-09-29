/**
 * Selected reports, WebGL variant: real reports as 3D paper pages with generative covers.
 * Scroll (or drag) deals through them, the pages bend with the motion, and a click opens the report.
 *
 * Fast path: covers are painted in idle time and swapped in without recompiling shaders, scroll is eased
 * so wheel steps glide, the shadow map is modest, and nothing renders while the section is off screen.
 */
(() => {
  if (!window.THREE) return;
  const { $, clamp, lerp, sstep, damp, reduce, M, scene, DOCS, pageCanvas, idle, fontsReady, deal } = MO;
  const T = THREE, sec = $("#reports"), cv = $("#reports canvas"), N = DOCS.length;
  const dpr = Math.min(devicePixelRatio || 1, 1.75);
  const r = new T.WebGLRenderer({ canvas: cv, antialias: dpr < 1.5, alpha: true, powerPreference: "high-performance" });
  r.setPixelRatio(dpr); r.setClearColor(0, 0);
  r.outputEncoding = T.sRGBEncoding; r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.02; r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
  const scene3 = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, 0.1, 100); cam.position.set(0, 0.5, 11.5);
  scene3.add(new T.HemisphereLight(0xffffff, 0xc9c3b6, 0.75));
  const sun = new T.DirectionalLight(0xfff5e6, 1.35); sun.position.set(-3, 6, 7); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.radius = 3;
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6, near: 1, far: 30 }); sun.shadow.bias = -0.0006; scene3.add(sun);
  const catcher = new T.Mesh(new T.PlaneGeometry(40, 40), new T.ShadowMaterial({ opacity: 0.14 })); catcher.position.z = -1.6; catcher.receiveShadow = true; scene3.add(catcher);

  // Paper: a gently cupped sheet. `uBend` curls it further while it moves (same maths for its shadow).
  const geo = new T.PlaneGeometry(2.1, 2.716, 24, 6), pa = geo.attributes.position;
  for (let k = 0; k < pa.count; k++) { const X = pa.getX(k), Y = pa.getY(k); pa.setZ(k, 0.05 * X * X + 0.02 * Math.sin(Y * 1.4)); } geo.computeVertexNormals();
  const bendChunk = (u) => (sh) => {
    sh.uniforms.uBend = u;
    sh.vertexShader = "uniform float uBend;\n" + sh.vertexShader
      .replace("#include <begin_vertex>", "#include <begin_vertex>\n float bx = position.x; transformed.z += uBend * (bx * bx * 0.55 - 0.3) + uBend * 0.12 * position.y; transformed.x *= 1.0 - abs(uBend) * 0.04;")
      .replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\n objectNormal = normalize(objectNormal + vec3(-1.1 * uBend * position.x, -0.12 * uBend, 0.0));");
  };
  const blank = () => { const c = document.createElement("canvas"); c.width = c.height = 4; const g = c.getContext("2d"); g.fillStyle = "#F7F5EF"; g.fillRect(0, 0, 4, 4); return c; };
  const pages = DOCS.map((d, i) => {
    const u = { value: 0 }, tx = new T.CanvasTexture(blank()); tx.encoding = T.sRGBEncoding; tx.anisotropy = Math.min(8, r.capabilities.getMaxAnisotropy());
    const mat = new T.MeshStandardMaterial({ map: tx, roughness: 0.92, metalness: 0, side: T.DoubleSide }); mat.onBeforeCompile = bendChunk(u);
    const m = new T.Mesh(geo, mat); m.castShadow = m.receiveShadow = true;
    m.customDepthMaterial = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking }); m.customDepthMaterial.onBeforeCompile = bendChunk(u);
    scene3.add(m); return { m, u, tx, lift: 0, pop: 0, bend: 0, i };
  });
  // Paint the covers one per idle slot, then swap the image in place (no shader recompiles)
  fontsReady().then(() => { let i = 0; const next = () => { if (i >= N) return; const q = pages[i]; q.tx.image = pageCanvas(DOCS[i], i); q.tx.needsUpdate = true; i++; idle(next); }; idle(next); });

  const ray = new T.Raycaster(), v2 = new T.Vector2(); let hover = -1, W = 0, H = 0;
  cv.style.pointerEvents = "auto"; cv.style.touchAction = "pan-y";
  // Drag to deal; a short press still counts as a click
  const { st, drag, caption } = deal(sec, cv, () => W * 0.3);
  cv.addEventListener("click", () => { if (drag.moved > 6) return; if (hover >= 0) { pages[hover].pop = 1; window.open(DOCS[hover].href, "_blank", "noopener"); } });

  const resize = () => {
    W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return; r.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix();
    if (W / H > 1.1) cam.setViewOffset(W, H, -W * 0.16, 0, W, H); else cam.setViewOffset(W, H, 0, -H * 0.1, W, H);
  };
  new ResizeObserver(resize).observe(cv); resize();

  let rx = 0, ry = 0;
  scene(sec, (t, dt) => {
    if (!W) return;
    const p = st.update(dt), vel = clamp(st.v * 2.2, -1.2, 1.2);
    const fan = reduce ? 1 : sstep(0.02, 0.24, p), act = sstep(0.24, 0.96, p) * (N - 1);
    rx = damp(rx, M.ny, 0.08, dt); ry = damp(ry, M.nx, 0.08, dt);
    v2.set(M.nx, M.ny); ray.setFromCamera(v2, cam); const hits = drag.active ? [] : ray.intersectObjects(pages.map((q) => q.m));
    hover = hits.length ? pages.findIndex((q) => q.m === hits[0].object) : -1;
    cv.style.cursor = drag.active ? "" : hover >= 0 ? "pointer" : "grab";
    pages.forEach((q) => {
      const i = q.i, o = i - act, ao = Math.abs(o), so = Math.sign(o);
      const fx = o * 1.05 + so * Math.min(1, ao) * 0.85, fz = -ao * 0.85 + (ao < 0.5 ? 0.9 * (1 - ao * 2) : 0), fry = -clamp(o, -1, 1) * 0.95;
      q.lift = damp(q.lift, hover === i ? 1 : 0, 0.12, dt); q.pop = damp(q.pop, 0, 0.06, dt);
      // Pages curl against the direction they travel, most at the centre of the deal
      q.bend = reduce ? 0 : damp(q.bend, -vel * (1 - clamp(ao / 2.5, 0, 0.7)) + q.lift * 0.06, 0.1, dt); q.u.value = q.bend;
      q.m.position.set(lerp(0.03 * i, fx, fan), lerp(-0.02 * i, 0, fan) + (reduce ? 0 : Math.sin(t * 0.9 + i) * 0.04) + q.lift * 0.15, lerp(-i * 0.035, fz, fan) + q.lift * 0.35 + q.pop * 0.8);
      q.m.rotation.set(-0.08 + rx * 0.05, lerp(-0.2, fry, fan) + ry * 0.08 + q.bend * 0.1, lerp((i - 2.5) * 0.05, 0, fan));
    });
    const ai = clamp(Math.round(act), 0, N - 1);
    if (fan > 0.5) caption(ai);
    r.render(scene3, cam);
  });
})();
