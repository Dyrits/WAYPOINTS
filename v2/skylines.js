// Paper-cut scenery for the walk, one scene per place.
// Coordinates are flat: x runs along the ground (the walker stands at x = 0, a scene spans about -650 to 650), y points up from the ground, 1 unit is about 1 px on a 1500 px wide screen.
// A scene lists polygons per depth layer (far, mid, near) and a palette name; app.js bends them around the planet.
// A polygon flagged with hole = true is cut out of the shapes under it (windows, arches).
window.SKYLINES = (() => {
  const PI = Math.PI;
  // Seeded random, so a scene is cut the same way on every load.
  const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  /* ---------- Primitives: each returns a list of polygons ---------- */
  const hole = (p) => ((p.hole = true), p);
  const box = (x, w, h, y = 0) => [[x - w / 2, y], [x + w / 2, y], [x + w / 2, y + h], [x - w / 2, y + h]];
  const tri = (x, w, h, y = 0) => [[x - w / 2, y], [x + w / 2, y], [x, y + h]];
  const arc = (cx, cy, rx, ry, a0, a1, n = 16) => Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  const ellipse = (cx, cy, rx, ry, n = 22) => arc(cx, cy, rx, ry, 0, 2 * PI, n).slice(0, -1);
  const dome = (x, w, dh, y = 0) => arc(x, y, w / 2, dh, 0, PI);
  const blob = (cx, cy, rx, ry, seed, n = 18) => {
    const r = rng(seed);
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * 2 * PI, k = 0.84 + r() * 0.3;
      return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
    });
  };
  // A part is either a list of polygons or a single polygon.
  const list = (p) => (typeof p[0][0] === 'number' ? [p] : p);
  const move = (polys, dx, dy = 0) => list(polys).map((p) => Object.assign(p.map(([x, y]) => [x + dx, y + dy]), p.hole && { hole: true }));
  const shape = (pts, x, s, flip = false, y = 0) => pts.map(([px, py]) => [x + (flip ? -px : px) * s, y + py * s]);

  const windows = (x, w, h, y0, cols, rows, ww = 0.45, wh = 0.5) => {
    const out = [], cw = w / cols, rh = h / rows;
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) out.push(hole(box(x - w / 2 + cw * (c + 0.5), cw * ww, rh * wh, y0 + rh * r + (rh * (1 - wh)) / 2)));
    return out;
  };
  const tower = (x, w, h, o = {}) => {
    const out = [box(x, w, h)];
    if (o.top === 'gable') out.push(tri(x, w * 1.12, w * 0.5, h - 1));
    if (o.top === 'spire') out.push(tri(x, w * 0.8, w * 1.4, h - 1));
    if (o.top === 'dome') out.push(dome(x, w, w * 0.45, h - 1));
    if (o.top === 'antenna') out.push(box(x, w * 0.4, h * 0.05, h - 1), box(x, 2.5, h * 0.16, h - 1));
    if (o.top === 'step') out.push(box(x, w * 0.72, h * 0.06, h - 1), box(x, w * 0.42, h * 0.1, h - 1));
    if (o.top === 'slant') out.push([[x - w / 2, h - 1], [x + w / 2, h - 1], [x + w / 2, h + w * 0.4]]);
    if (o.win) out.push(...windows(x, w * 0.78, h * 0.86, h * 0.07, ...o.win));
    return out;
  };
  const house = (x, w, h, rh = w * 0.45) => [[[x - w / 2, 0], [x + w / 2, 0], [x + w / 2, h], [x, h + rh], [x - w / 2, h]]];

  // Row of small buildings between x0 and x1; roofs picked among gable, flat, mansard (Paris), shop (cornice).
  const row = (x0, x1, seed, { lo = 40, hi = 80, wlo = 30, whi = 58, roofs = ['gable', 'flat'], win = true } = {}) => {
    const r = rng(seed), out = [];
    for (let x = x0; x < x1;) {
      const w = wlo + r() * (whi - wlo), h = lo + r() * (hi - lo), cx = x + w / 2, roof = roofs[Math.floor(r() * roofs.length)];
      out.push(box(cx, w + 1, h));
      if (roof === 'gable') out.push(tri(cx, w + 4, w * 0.42, h - 1));
      if (roof === 'mansard') out.push([[cx - w / 2 - 1, h - 1], [cx + w / 2 + 1, h - 1], [cx + w / 2 - 7, h + 16], [cx - w / 2 + 7, h + 16]], box(cx - w / 4, 5, 24, h), box(cx + w / 5, 5, 21, h));
      if (roof === 'shop') out.push(box(cx, w + 3, 5, h - 1), tri(cx, w * 0.5, 9, h + 3));
      if (win && w > 24 && h > 34) out.push(...windows(cx, w * 0.78, h * 0.72, h * 0.14, Math.max(1, Math.round(w / 17)), Math.max(1, Math.round(h / 24))));
      x += w;
    }
    return out;
  };

  // Ground-hugging ridge between x0 and x1, tapering to the ground at both ends; peaked gives mountains.
  const ridge = (x0, x1, base, amp, seed, peaked = false, n = 56) => {
    const r = rng(seed), f = [r() * 6, r() * 6, r() * 6], pts = [[x0, 0]];
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t;
      const v = peaked
        ? 1 - Math.abs(Math.sin(t * 4.3 + f[0])) * 0.65 - Math.abs(Math.sin(t * 9.1 + f[1])) * 0.35
        : Math.sin(t * 3.1 + f[0]) * 0.5 + Math.sin(t * 7.3 + f[1]) * 0.3 + Math.sin(t * 13.7 + f[2]) * 0.2;
      pts.push([x, (base + amp * v) * Math.pow(Math.sin(PI * t), 0.45)]);
    }
    pts.push([x1, 0]);
    return [pts];
  };
  const volcano = (x, w, h) => [[[x - w / 2, 0], [x - w * 0.18, h * 0.62], [x - w * 0.07, h], [x - w * 0.02, h * 0.95], [x + w * 0.03, h * 0.99], [x + w * 0.08, h * 0.97], [x + w * 0.2, h * 0.6], [x + w / 2, 0]]];
  const terraces = (x0, x1, h, steps = 6) => {
    const sw = (x1 - x0) / (steps * 2), up = [];
    for (let i = 0; i < steps; i++) up.push([sw * i, (h * i) / steps], [sw * (i + 0.25), (h * (i + 1)) / steps]);
    return [[...up.map(([a, y]) => [x0 + a, y]), ...[...up].reverse().map(([a, y]) => [x1 - a, y])]];
  };
  const cliff = (x0, x1, h) => [[[x0, 0], [x0, h * 0.9], [x0 + 20, h], [x1 - 40, h], [x1 - 22, h * 0.8], [x1 - 12, h * 0.55], [x1 - 4, h * 0.2], [x1, 0]]];
  const waves = (x0, x1, h = 10, step = 26) => {
    const pts = [[x0, 0]];
    for (let x = x0; x < x1; x += step) pts.push(...arc(x + step / 2, 2, step / 2, h, PI, 0, 6).map(([a, b]) => [a, Math.max(2, b)]));
    pts.push([x1, 0]);
    return [pts];
  };
  const wheat = (x0, x1, h, seed) => {
    const r = rng(seed), pts = [[x0, 0]];
    for (let x = x0; x < x1; x += 5) pts.push([x, h * (0.55 + r() * 0.2)], [x + 2.5, h * (0.85 + r() * 0.3)]);
    pts.push([x1, 0]);
    return [pts];
  };

  const tree = (x, h, seed = 1, w = h * 0.6) => [box(x, h * 0.08, h * 0.5), blob(x, h * 0.64, w / 2, h * 0.36, seed)];
  const cypress = (x, h, w = h * 0.24) => [[[x - 2, 0], [x + 2, 0], [x + 2, h * 0.08], [x + w / 2, h * 0.34], [x + w * 0.24, h * 0.84], [x, h], [x - w * 0.24, h * 0.84], [x - w / 2, h * 0.34], [x - 2, h * 0.08]]];
  const gum = (x, h, seed = 1) => [
    [[x - 4, 0], [x + 4, 0], [x + 3, h * 0.45], [x + h * 0.18, h * 0.7], [x + h * 0.15, h * 0.73], [x + 1, h * 0.54], [x - h * 0.13, h * 0.72], [x - h * 0.16, h * 0.69], [x - 3, h * 0.45]],
    blob(x + h * 0.19, h * 0.8, h * 0.2, h * 0.12, seed), blob(x - h * 0.17, h * 0.77, h * 0.18, h * 0.11, seed + 1), blob(x, h * 0.9, h * 0.22, h * 0.12, seed + 2),
  ];
  const palm = (x, h, lean = 0.15, s = 1) => {
    const tx = x + lean * h, left = [], right = [], out = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, px = x + lean * h * t * t, py = h * t, w = 4 * s * (1 - t * 0.45);
      left.push([px - w, py]);
      right.unshift([px + w, py]);
    }
    out.push([...left, ...right]);
    for (const a of [-0.35, 0.25, 0.9, 2.25, 2.9, 3.5]) {
      const len = h * 0.42, up = [], dn = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8, px = tx + Math.cos(a) * len * t, py = h + Math.sin(a) * len * t - len * 0.5 * t * t, w = 5 * s * Math.sin(PI * t) + 0.6;
        up.push([px, py + w]);
        dn.unshift([px, py - w]);
      }
      out.push([...up, ...dn]);
    }
    return out;
  };

  /* ---------- Landmarks ---------- */
  const minaret = (x, w, h) => [box(x, w, h * 0.86), box(x, w * 1.8, h * 0.03, h * 0.6), box(x, w * 1.6, h * 0.025, h * 0.78), tri(x, w * 1.1, h * 0.16, h * 0.86 - 1)];
  const pagoda = (x, w, tiers, th, taper = 0.11) => {
    const out = [];
    for (let i = 0; i < tiers; i++) {
      const y = i * th, rw = w * (1 - taper * i), bw = rw * 0.6;
      out.push(box(x, bw, th * 0.7, y), [[x - rw / 2, y + th * 0.72], [x - rw * 0.38, y + th * 0.64], [x + rw * 0.38, y + th * 0.64], [x + rw / 2, y + th * 0.72], [x + bw * 0.42, y + th], [x - bw * 0.42, y + th]]);
    }
    out.push(box(x, 3, th * 1.3, tiers * th - 1), ellipse(x, tiers * th + th * 0.5, 5, 5, 10));
    return out;
  };
  const petronas = (x, h) => {
    const t = (cx) => [box(cx, 34, h * 0.62), box(cx, 29, h * 0.1, h * 0.62 - 1), box(cx, 23, h * 0.07, h * 0.72 - 1), box(cx, 16, h * 0.06, h * 0.79 - 1), box(cx, 9, h * 0.06, h * 0.85 - 1), tri(cx, 5, h * 0.11, h * 0.9 - 1), ...windows(cx, 26, h * 0.56, h * 0.04, 3, 16, 0.5, 0.35)];
    return [...t(x - 30), ...t(x + 30), box(x, 30, 6, h * 0.41), [[x - 13, h * 0.41], [x - 3, h * 0.33], [x + 3, h * 0.33], [x + 13, h * 0.41]]];
  };
  const needle = (x, h) => [[[x - 10, 0], [x + 10, 0], [x + 4, h * 0.72], [x - 4, h * 0.72]], ellipse(x, h * 0.76, 18, 10), box(x, 7, h * 0.07, h * 0.8), tri(x, 3, h * 0.14, h * 0.86)];
  const eiffel = (x, h) => {
    const w = h * 0.42, right = [], left = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16, y = t * h * 0.9, hw = 2.5 + (w / 2) * Math.pow(1 - t, 2.4);
      right.push([x + hw, y]);
      left.unshift([x - hw, y]);
    }
    return [[...right, [x + 1.2, h], [x - 1.2, h], ...left], hole(arc(x, -12, w * 0.3, h * 0.17, 0, PI, 14)), box(x, w * 0.66, h * 0.028, h * 0.19), box(x, w * 0.3, h * 0.022, h * 0.46), box(x, 7, h * 0.03, h * 0.86)];
  };
  const lighthouse = (x, h, y = 0) => move([[[x - 13, 0], [x + 13, 0], [x + 8, h * 0.74], [x - 8, h * 0.74]], box(x, 24, 4, h * 0.74), box(x, 14, h * 0.13, h * 0.77), hole(box(x, 8, h * 0.08, h * 0.8)), dome(x, 16, h * 0.07, h * 0.9 - 1), box(x, 2, h * 0.07, h * 0.95)], 0, y);
  const windpump = (x, h) => {
    const cx = x, cy = h * 0.87, out = [
      [[x - h * 0.13, 0], [x + h * 0.13, 0], [x + 2.5, h * 0.85], [x - 2.5, h * 0.85]],
      hole([[x - h * 0.1, h * 0.03], [x + h * 0.1, h * 0.03], [x, h * 0.72]]),
      box(x, h * 0.16, 2.5, h * 0.3), box(x, h * 0.09, 2.5, h * 0.56),
      [[x, h * 0.85], [x - h * 0.3, h * 0.84], [x - h * 0.36, h * 0.8], [x - h * 0.36, h * 0.93], [x - h * 0.3, h * 0.88], [x, h * 0.88]],
      ellipse(cx, cy, 4, 4, 8),
    ];
    for (let k = 0; k < 14; k++) {
      const a = (k * 2 * PI) / 14, p = (r, d) => [cx + r * Math.cos(a + d), cy + r * Math.sin(a + d)];
      out.push([p(h * 0.03, -0.12), p(h * 0.2, -0.13), p(h * 0.2, 0.13), p(h * 0.03, 0.12)]);
    }
    return out;
  };
  const mill = (x, h, turn = 0.5) => {
    const cy = h * 0.66, L = h * 0.46, w = h * 0.08, out = [[[x - h * 0.15, 0], [x + h * 0.15, 0], [x + h * 0.1, h * 0.62], [x - h * 0.1, h * 0.62]], dome(x, h * 0.22, h * 0.1, h * 0.62 - 1), hole(dome(x, h * 0.08, h * 0.12, 0))];
    for (let k = 0; k < 4; k++) {
      const a = turn + (k * PI) / 2, dx = Math.cos(a), dy = Math.sin(a), px = -dy, py = dx, at = (r, o) => [x + dx * r + px * o, cy + dy * r + py * o];
      out.push([at(0, -1.5), at(L, -1.5), at(L, 1.5), at(0, 1.5)], [at(L * 0.22, 1), at(L, 1), at(L, w), at(L * 0.22, w)]);
    }
    return out;
  };
  const silo = (x, w, h) => [box(x, w, h), dome(x, w, w * 0.3, h - 1)];
  const crane = (x, h) => [box(x, 14, h * 0.78), box(x + h * 0.18, h * 0.95, 8, h * 0.78), tri(x, 20, h * 0.18, h * 0.78 + 7), box(x - h * 0.22, 22, 16, h * 0.7), box(x + h * 0.55, 1.6, h * 0.28, h * 0.5), box(x + h * 0.55, 8, 5, h * 0.48), box(x, 26, 20, h * 0.66), hole(box(x + 5, 8, 7, h * 0.7))];
  const chateau = (x, w, h) => {
    const out = [box(x, w, h)];
    for (let mx = x - w / 2; mx < x + w / 2 - 4; mx += 12) out.push(box(mx + 4, 7, 7, h - 1));
    for (const tx of [x - w / 2, x + w / 2, x - w * 0.12]) out.push(box(tx, 34, h * 1.35), box(tx, 40, 6, h * 1.35 - 1), ...[-14, -4, 6, 16].map((o) => box(tx + o - 1, 6, 7, h * 1.35 + 4)), hole(box(tx, 5, 14, h * 0.8)));
    out.push(tri(x - w * 0.12, 30, 36, h * 1.35 + 9), hole(dome(x + w * 0.2, 26, 34, 0)));
    return out;
  };
  const cathedral = (x, s = 1, flat = false) => [box(x, 90 * s, 72 * s), tri(x, 92 * s, 32 * s, 72 * s - 1), ...[-1, 1].flatMap((d) => tower(x + d * 55 * s, 28 * s, 128 * s, { top: flat ? null : 'dome' })), box(x - 55 * s, 34 * s, 5 * s, 96 * s), box(x + 55 * s, 34 * s, 5 * s, 96 * s), hole(dome(x, 26 * s, 42 * s, 0)), hole(ellipse(x, 60 * s, 8 * s, 8 * s, 12))];
  const archHole = (x, y, w, h) => hole([[x - w / 2, y], [x + w / 2, y], ...arc(x, y + h - w / 2, w / 2, w / 2, 0, PI, 8)]);
  // Notre-Dame de Fourvière seen from the Saône: nave, four crenellated towers, pediment, and the chapel bell tower with the Virgin.
  const basilica = (bx, y) => {
    const crown = (x, w, h) => [box(x, w, h, y), box(x, w + 6, 6, y + h - 1), ...[-1, 0, 1].map((o) => box(x + (o * w) / 3, w / 5, 5, y + h + 4))];
    return [
      box(bx, 150, 46, y), [[bx - 64, y + 45], [bx + 64, y + 45], [bx + 40, y + 60], [bx - 40, y + 60]], tri(bx - 40, 46, 24, y + 44),
      ...crown(bx - 76, 22, 92), ...crown(bx - 52, 18, 80), ...crown(bx + 52, 18, 80), ...crown(bx + 76, 22, 92),
      dome(bx + 18, 34, 15, y + 59), box(bx + 18, 2.5, 10, y + 73),
      archHole(bx - 40, y, 12, 22), hole(ellipse(bx - 40, y + 34, 5.5, 5.5, 12)), ...[-10, 8, 26, 44].map((o) => archHole(bx + o, y + 14, 7, 20)),
      box(bx + 110, 14, 64, y), dome(bx + 110, 16, 9, y + 63), box(bx + 110, 3, 6, y + 71), [[bx + 108, y + 76], [bx + 112, y + 76], [bx + 113, y + 84], [bx + 110, y + 93], [bx + 107, y + 84]],
    ];
  };
  // The hill with its plateau, trees on the slopes and the basilica on top, all in one piece.
  const fourviere = (bx) => [
    [[-720, 0], [-650, 20], [-600, 44], [-545, 70], [bx - 110, 88], [bx - 96, 92], [bx + 128, 92], [bx + 150, 84], [bx + 185, 66], [bx + 230, 40], [bx + 290, 16], [bx + 350, 0]],
    blob(-610, 50, 16, 13, 36), blob(-572, 66, 18, 14, 37), blob(-530, 82, 15, 12, 38), blob(bx + 158, 88, 16, 12, 39), blob(bx + 200, 64, 18, 13, 40), blob(bx + 245, 42, 16, 12, 41),
    ...basilica(bx, 90),
  ];
  const crayon = (x) => [box(x, 34, 170), tri(x, 36, 34, 169), ...windows(x, 26, 150, 10, 3, 16, 0.5, 0.35)];
  const incity = (x) => [box(x, 44, 205), [[x - 22, 204], [x + 22, 204], [x + 18, 222], [x + 8, 236], [x - 8, 236], [x - 18, 222]], box(x, 2.5, 24, 235), ...windows(x, 34, 180, 12, 4, 18, 0.45, 0.4)];
  const mosque = (x, s = 1) => [
    box(x, 150 * s, 58 * s), box(x, 74 * s, 10 * s, 56 * s), dome(x, 88 * s, 50 * s, 64 * s), box(x, 3 * s, 18 * s, 112 * s),
    dome(x - 48 * s, 44 * s, 26 * s, 57 * s), dome(x + 48 * s, 44 * s, 26 * s, 57 * s), dome(x - 76 * s, 24 * s, 14 * s, 57 * s), dome(x + 76 * s, 24 * s, 14 * s, 57 * s),
    ...minaret(x - 104 * s, 9 * s, 190 * s), ...minaret(x + 104 * s, 9 * s, 190 * s), ...minaret(x - 134 * s, 8 * s, 150 * s), ...minaret(x + 134 * s, 8 * s, 150 * s),
    ...windows(x, 130 * s, 26 * s, 12 * s, 9, 1, 0.4, 0.8),
  ];
  const galata = (x, h) => [box(x, 28, h * 0.72), box(x, 36, h * 0.04, h * 0.7), box(x, 26, h * 0.08, h * 0.74 - 1), tri(x, 32, h * 0.22, h * 0.82 - 1), box(x, 2, h * 0.06, h * 0.98), ...windows(x, 18, h * 0.5, h * 0.14, 2, 5)];
  const bellTower = (x, h) => [[[x - 15, 0], [x + 15, 0], [x + 11, h * 0.62], [x + 5, h * 0.9], [x, h], [x - 5, h * 0.9], [x - 11, h * 0.62]], hole(ellipse(x, h * 0.5, 5, 9, 12))];
  const clockTower = (x, h) => [...tower(x, 22, h, { top: 'gable' }), hole(ellipse(x, h * 0.78, 6, 6, 12))];
  const splitGate = (x, h) => {
    const lv = [[54, 0.3], [46, 0.48], [38, 0.63], [30, 0.76], [22, 0.86], [14, 0.94], [8, 1]], half = (d) => {
      const pts = [[x + d * 7, 0], [x + d * 61, 0]];
      lv.forEach(([o, t], i) => pts.push([x + d * (7 + o), h * t], [x + d * (7 + (lv[i + 1]?.[0] ?? 0)), h * t]));
      return pts;
    };
    return [half(-1), half(1)];
  };
  const laptop = (x, s = 1) => [
    [[x - 120 * s, 0], [x + 120 * s, 0], [x + 108 * s, 10 * s], [x - 108 * s, 10 * s]],
    box(x, 190 * s, 128 * s, 10 * s), hole(box(x, 172 * s, 110 * s, 19 * s)),
    // A graduation cap on the screen.
    [[x - 48 * s, 84 * s], [x, 104 * s], [x + 48 * s, 84 * s], [x, 64 * s]], [[x - 26 * s, 76 * s], [x + 26 * s, 76 * s], [x + 24 * s, 52 * s], [x - 24 * s, 52 * s]], box(x + 38 * s, 2.5 * s, 34 * s, 50 * s), ellipse(x + 38 * s, 48 * s, 4 * s, 5 * s, 10),
  ];
  const books = (x, seed) => {
    const r = rng(seed), out = [];
    let y = 0;
    for (let i = 0; i < 5; i++) {
      const w = 60 + r() * 30, h = 10 + r() * 7;
      out.push(box(x + (r() - 0.5) * 12, w, h, y));
      y += h - 1;
    }
    return out;
  };
  const mug = (x) => [box(x, 30, 36), [...arc(x + 15, 18, 13, 11, -PI / 2, PI / 2, 10), ...arc(x + 15, 18, 7, 6, PI / 2, -PI / 2, 10)], ...[-7, 3].map((o) => [[x + o, 44], [x + o + 3, 44], [x + o + 7, 60], [x + o + 1, 76], [x + o - 1, 76], [x + o + 4, 60]])];
  const paperPlane = (x, y, s = 1, flip = false) => [shape([[-20, 0], [22, 6], [-12, 12], [-8, 5]], x, s, flip, y)];
  const plane = (x, y, s = 1) => [shape([[-44, 2], [30, 0], [44, 5], [34, 10], [-30, 12], [-44, 30], [-52, 30], [-48, 8]], x, s, false, y), shape([[-8, 6], [12, 6], [-10, -16], [-18, -16]], x, s, false, y)];
  const controlTower = (x, h) => [box(x, 12, h * 0.76), [[x - 16, h * 0.76], [x + 16, h * 0.76], [x + 21, h * 0.9], [x - 21, h * 0.9]], hole(box(x, 30, h * 0.07, h * 0.81)), box(x, 38, 4, h * 0.9), box(x, 2, h * 0.12, h * 0.92)];
  const hangar = (x, w, h) => [dome(x, w, h), hole(box(x, w * 0.5, h * 0.5))];
  const boat = (x, s = 1, sail = false) => [shape([[-30, 2], [30, 2], [38, 12], [-38, 12]], x, s), ...(sail ? [shape([[2, 13], [2, 70], [30, 14]], x, s), shape([[-2, 13], [-2, 56], [-24, 14]], x, s)] : [box(x - 4 * s, 34 * s, 12 * s, 11 * s), box(x + 8 * s, 6 * s, 12 * s, 22 * s)])];
  const paraglider = (x, y, s = 1) => [[...arc(x, y, 46 * s, 16 * s, 0.1 * PI, 0.9 * PI, 12), ...arc(x, y - 3 * s, 40 * s, 10 * s, 0.88 * PI, 0.12 * PI, 12)], [[x - 30 * s, y + 1], [x - 29 * s, y + 2], [x, y - 40 * s], [x + 29 * s, y + 2], [x + 30 * s, y + 1], [x + 1, y - 41 * s], [x - 1, y - 41 * s]], box(x, 5 * s, 10 * s, y - 50 * s)];
  const fence = (x0, x1, h = 26) => {
    const out = [box((x0 + x1) / 2, x1 - x0, 2.5, h * 0.45), box((x0 + x1) / 2, x1 - x0, 2.5, h * 0.8)];
    for (let x = x0; x <= x1; x += 34) out.push(box(x, 4, h));
    return out;
  };
  const rock = (x, w, h, seed) => [blob(x, h * 0.45, w / 2, h * 0.6, seed, 14)];
  const lamp = (x, h = 60) => [box(x, 3, h), box(x, 10, 6, h), tri(x, 12, 6, h + 5)];

  /* ---------- Animals, facing right ---------- */
  const elephant = (x, s = 1) => [
    shape([[-38, 0], [-28, 0], [-27, 20], [-20, 22], [6, 22], [12, 20], [13, 0], [23, 0], [24, 24], [30, 34], [36, 30], [39, 18], [42, 8], [46, 9], [44, 20], [41, 34], [38, 46], [34, 56], [25, 63], [14, 62], [6, 60], [-10, 62], [-28, 58], [-40, 50], [-44, 40], [-43, 28], [-39, 20]], x, s),
    box(x - 8 * s, 30 * s, 14 * s, 58 * s), tri(x - 8 * s, 36 * s, 10 * s, 71 * s),
  ];
  const kangaroo = (x, s = 1, flip = false) => [
    shape([[-30, 1], [-26, 1], [-10, 10], [-4, 6], [0, 0], [14, 0], [14, 3], [4, 4], [6, 12], [10, 22], [12, 30], [16, 34], [20, 40], [22, 46], [28, 48], [30, 51], [26, 54], [24, 60], [22, 54], [19, 57], [17, 52], [14, 48], [10, 44], [6, 40], [0, 36], [-6, 30], [-12, 22], [-20, 12]], x, s, flip),
    shape([[13, 34], [21, 30], [22, 28], [14, 31]], x, s, flip),
  ];
  const cow = (x, s = 1, flip = false) => [
    shape([[-20, 14], [16, 14], [16, 36], [-20, 36]], x, s, flip), shape([[14, 30], [26, 27], [29, 20], [24, 18], [16, 22]], x, s, flip), shape([[-20, 34], [-25, 22], [-24, 21], [-19, 30]], x, s, flip),
    ...[-17, -11, 7, 13].map((lx) => shape([[lx - 1.5, 0], [lx + 1.5, 0], [lx + 1.5, 15], [lx - 1.5, 15]], x, s, flip)),
  ];
  const sheep = (x, s = 1, flip = false, seed = 3) => [
    shape(blob(-2, 22, 17, 10, seed, 14), x, s, flip), shape(ellipse(17, 24, 6, 4.5, 10), x, s, flip),
    ...[-12, -6, 4, 9].map((lx) => shape([[lx - 1.2, 0], [lx + 1.2, 0], [lx + 1.2, 14], [lx - 1.2, 14]], x, s, flip)),
  ];
  const flock = (x, y, n, seed) => {
    const r = rng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const bx = x + i * 16 + r() * 8, by = y + r() * 22;
      out.push([[bx - 7, by + 3], [bx, by], [bx + 7, by + 3], [bx, by + 1.2]]);
    }
    return out;
  };

  /* ---------- Scenes ---------- */
  // Each part becomes a group that pops up as one piece (a tower and its windows, a hill and what stands on it).
  let gid = 0;
  const L = (...parts) => parts.flatMap((p) => { const g = ++gid; return list(p).map((poly) => Object.assign(poly, { group: g })); });
  const nantes = {
    palette: 'france',
    far: L(ridge(-720, 720, 70, 26, 11)),
    mid: L(row(-560, -320, 21, { lo: 60, hi: 110, roofs: ['flat', 'gable'] }), tower(-250, 46, 214, { win: [4, 17], top: 'antenna' }), cathedral(-110, 1.05, true), chateau(160, 190, 70), crane(420, 190), row(540, 700, 22, { lo: 40, hi: 80 })),
    near: L(tree(-470, 70, 4), tree(-420, 54, 5), elephant(-300, 1.1), lamp(-160), tree(250, 62, 6), row(330, 470, 23, { lo: 28, hi: 44, win: false }), tree(560, 74, 7)),
  };
  const lyon = {
    palette: 'france',
    far: L(ridge(-720, 720, 50, 16, 31)),
    mid: L(fourviere(-380), row(-10, 210, 33, { lo: 50, hi: 80, roofs: ['mansard', 'flat'] }), crayon(270), incity(350), row(390, 700, 34, { lo: 60, hi: 120, roofs: ['flat'] })),
    near: L(row(-600, -250, 35, { lo: 30, hi: 48, wlo: 22, whi: 34, roofs: ['gable'] }), waves(-250, -50, 7), tree(160, 60, 8), tree(470, 70, 9), lamp(560)),
  };
  const merredin = {
    palette: 'outback',
    far: L(ridge(-720, 720, 34, 12, 41)),
    mid: L(silo(-330, 44, 120), silo(-284, 44, 120), silo(-238, 44, 120), silo(-192, 44, 120), box(-120, 110, 60), tri(-120, 118, 26, 59), windpump(140, 170), gum(330, 150, 42), gum(470, 110, 45)),
    near: L(wheat(-720, -60, 34, 43), kangaroo(120, 1.2), kangaroo(200, 0.9, true), wheat(260, 720, 30, 44)),
  };
  const perth = {
    palette: 'ocean',
    far: L(ridge(-720, 720, 50, 16, 51)),
    mid: L(row(-600, -420, 52, { lo: 40, hi: 70, roofs: ['flat'] }), tower(-380, 40, 170, { win: [3, 13], top: 'flat' }), tower(-330, 52, 250, { win: [4, 19], top: 'antenna' }), tower(-270, 44, 205, { win: [3, 15], top: 'step' }), tower(-215, 48, 150, { win: [4, 11], top: 'slant' }), tower(-165, 36, 120, { win: [3, 9] }), bellTower(-60, 150), gum(460, 140, 53)),
    near: L(waves(-720, 20, 6), boat(-420, 1, true), boat(-180, 0.8, true), palm(140, 110, 0.12), palm(200, 90, -0.1), gum(330, 90, 54)),
  };
  const dubbo = {
    palette: 'outback',
    far: L(ridge(-720, 720, 55, 22, 61)),
    mid: L(gum(-420, 170, 62), house(-230, 110, 50, 30), hole(box(-230, 40, 34)), windpump(-60, 160), gum(260, 190, 64), gum(470, 140, 66)),
    near: L(fence(-640, -120), cow(-420, 1.3), cow(-320, 1.2, true), sheep(160, 1.1), sheep(210, 1, true, 5), sheep(270, 1.15, false, 7), fence(120, 640)),
  };
  const ubud = {
    palette: 'tropics',
    far: L(volcano(-120, 900, 250), ridge(200, 720, 60, 24, 71)),
    mid: L(terraces(-700, -250, 120, 7), pagoda(-160, 92, 7, 26, 0.1), pagoda(-60, 70, 5, 22, 0.12), splitGate(210, 150), terraces(360, 720, 90, 5)),
    near: L(palm(-460, 140, 0.18), palm(-390, 110, -0.12), rock(-300, 40, 16, 72), palm(320, 150, -0.15), palm(420, 120, 0.1), palm(520, 100, 0.2)),
  };
  const georgetown = {
    palette: 'tropics',
    far: L(ridge(-720, 200, 120, 40, 81), move(pagoda(-420, 70, 7, 20, 0.1), 0, 138)),
    mid: L(tower(-150, 56, 250, { win: [4, 20], top: 'flat' }), box(-150, 64, 8, 248), tower(-60, 40, 160, { win: [3, 12], top: 'antenna' }), row(0, 180, 82, { lo: 70, hi: 120, roofs: ['flat'] }), pagoda(360, 90, 3, 34, 0.14)),
    near: L(row(-640, -240, 83, { lo: 48, hi: 66, wlo: 34, whi: 42, roofs: ['shop'] }), palm(-200, 130, 0.14), row(180, 640, 84, { lo: 48, hi: 66, wlo: 34, whi: 42, roofs: ['shop'] })),
  };
  const taichung = {
    palette: 'tropics',
    far: L(ridge(-720, 720, 150, 70, 91, true)),
    mid: L(row(-620, -300, 92, { lo: 60, hi: 130, roofs: ['flat'] }), tower(-240, 50, 230, { win: [4, 18], top: 'step' }), tower(-170, 40, 180, { win: [3, 14], top: 'slant' }), pagoda(180, 110, 3, 40, 0.16), row(300, 700, 93, { lo: 50, hi: 110, roofs: ['flat'] })),
    near: L(tree(-420, 70, 94), tree(-360, 56, 95), palm(-90, 120, 0.1), lamp(90), tree(420, 76, 96), tree(490, 60, 97)),
  };
  const kl = {
    palette: 'tropics',
    far: L(ridge(-720, 720, 90, 30, 101)),
    mid: L(row(-640, -400, 102, { lo: 60, hi: 140, roofs: ['flat'] }), needle(-320, 250), tower(-210, 44, 170, { win: [3, 13], top: 'slant' }), petronas(160, 300), tower(300, 50, 190, { win: [4, 15], top: 'antenna' }), row(360, 700, 103, { lo: 70, hi: 150, roofs: ['flat'] })),
    near: L(palm(-470, 130, 0.16), palm(-120, 110, -0.1), row(-60, 60, 104, { lo: 30, hi: 44, win: false }), palm(460, 140, 0.12), palm(540, 100, -0.15)),
  };
  const malacca = {
    palette: 'tropics',
    far: L(ridge(-720, 720, 70, 26, 111), move([box(-300, 70, 34)], 0, 88), move([hole(box(-300, 16, 20))], 0, 90)),
    mid: L(house(-160, 100, 56, 32), tower(-222, 28, 104, { top: 'gable' }), clockTower(-60, 110), mill(180, 150), row(290, 700, 112, { lo: 50, hi: 80, roofs: ['gable', 'shop'] })),
    near: L(palm(-440, 130, 0.14), waves(-380, 120, 6), boat(-260, 0.9), boat(20, 0.7), palm(400, 120, -0.1)),
  };
  const bouguenais = {
    palette: 'france',
    far: L(ridge(-720, 720, 30, 10, 121)),
    mid: L(hangar(-360, 200, 90), hangar(-170, 140, 64), controlTower(60, 180), box(280, 220, 40), plane(300, 220, 1.4)),
    near: L(tree(-520, 60, 122), box(-40, 70, 18), box(-40, 50, 10, 17), ...[-600, -460, 200, 380, 520].map((x) => lamp(x, 24)), tree(620, 70, 123)),
  };
  const biarritz = {
    palette: 'ocean',
    far: L(ridge(-720, 720, 80, 40, 131, true)),
    mid: L(cliff(-700, -280, 70), lighthouse(-460, 150, 68), row(-240, 40, 132, { lo: 60, hi: 90, roofs: ['mansard'] }), tower(120, 30, 120, { top: 'spire' }), house(200, 80, 50, 26), row(260, 700, 133, { lo: 40, hi: 70 })),
    near: L(waves(-720, 720, 9), rock(-140, 90, 70, 134), box(-140, 4, 26, 70), box(-70, 90, 4, 40), rock(260, 50, 30, 135), paraglider(420, 260, 0.6)),
  };
  const istanbul = {
    palette: 'bosphorus',
    far: L(ridge(-720, 720, 50, 18, 141), move(minaret(-480, 5, 70), 0, 50), move(dome(-440, 40, 22), 0, 52)),
    mid: L(row(-640, -420, 142, { lo: 40, hi: 70 }), mosque(-200, 1), row(20, 180, 143, { lo: 40, hi: 80 }), galata(260, 200), row(320, 700, 144, { lo: 40, hi: 80, roofs: ['gable', 'flat'] })),
    near: L(waves(-720, 720, 7), boat(-420, 1.1), flock(-560, 250, 5, 145), cypress(120, 80), cypress(150, 64), boat(460, 0.9)),
  };
  const lima = {
    palette: 'andes',
    far: L(ridge(-720, 720, 150, 60, 151, true)),
    mid: L(move(row(-620, -330, 152, { lo: 40, hi: 90, roofs: ['flat'] }), 0, 60), move(cathedral(-200, 0.95), 0, 60), move(row(-80, 280, 153, { lo: 50, hi: 120, roofs: ['flat'] }), 0, 60), paraglider(-60, 330, 0.8), paraglider(120, 280, 0.5)),
    near: L(cliff(-700, 320, 70), waves(320, 720, 9), move(palm(-470, 120, 0.1), 0, 68), move(palm(-420, 94, -0.14), 0, 68), rock(380, 40, 20, 154)),
  };
  const paris = {
    palette: 'france',
    far: L(ridge(-720, 720, 70, 20, 161), move(L(dome(-420, 50, 40), box(-420, 36, 12, -2), dome(-450, 20, 16), dome(-390, 20, 16), box(-420, 3, 14, 40), tower(-380, 12, 40, { top: 'dome' })), 0, 80)),
    mid: L(row(-640, -180, 162, { lo: 70, hi: 90, roofs: ['mansard'] }), eiffel(180, 320), row(320, 700, 163, { lo: 70, hi: 90, roofs: ['mansard'] })),
    near: L(tree(-440, 70, 164), tree(-380, 76, 165), lamp(-300), tree(20, 66, 166), lamp(100), tree(410, 72, 167), tree(480, 64, 168)),
  };
  const online = {
    palette: 'online',
    far: L(ridge(-720, 720, 60, 24, 171), paperPlane(-380, 260, 1.4), paperPlane(260, 300, 1.1, true), paperPlane(480, 220, 1.2)),
    mid: L(laptop(-200, 1.3), books(170, 172), move(books(170, 173), 6, 72)),
    near: L(mug(20), cypress(340, 100), tree(480, 80, 174)),
  };
  const prologue = {
    palette: 'dawn',
    far: L(ridge(-720, 720, 90, 40, 181, true)),
    mid: L(ridge(-700, -100, 60, 20, 182), house(-300, 64, 40, 26), tree(-220, 70, 183), ridge(200, 720, 50, 18, 184)),
    near: L(tree(-460, 80, 185), cypress(-400, 90), tree(360, 66, 186), tree(420, 84, 187)),
  };
  const epilogue = {
    palette: 'dusk',
    far: L(ridge(-720, 720, 120, 50, 191, true)),
    mid: L(ridge(-700, 720, 50, 20, 192), flock(260, 280, 6, 193)),
    near: L(tree(-280, 150, 194, 120), tree(-200, 90, 195), rock(360, 60, 24, 196)),
  };

  return {
    scenes: {
      prologue, epilogue, online,
      Lyon: lyon, Nantes: nantes, Merredin: merredin, Perth: perth, Dubbo: dubbo, Ubud: ubud, 'George Town': georgetown, Taichung: taichung,
      'Kuala Lumpur': kl, Malacca: malacca, Bouguenais: bouguenais, Biarritz: biarritz, Istanbul: istanbul, Lima: lima, Paris: paris,
    },
    // Paper tones per region: sky gradient, sun, then the three layers from far to near.
    palettes: {
      dawn: { sky: ['#f3e6d6', '#ead2bb'], sun: '#efb58f', layers: ['#dcc5b4', '#b39684', '#5b4a42'] },
      france: { sky: ['#efe8da', '#e0d6c2'], sun: '#e8c39a', layers: ['#c8cdcc', '#8d9ca3', '#46586a'] },
      ocean: { sky: ['#ebeee6', '#d4e1dc'], sun: '#f0cc98', layers: ['#bcd3d3', '#6d9ca5', '#2e5a66'] },
      outback: { sky: ['#f4e5ca', '#ecca9c'], sun: '#e59d5c', layers: ['#e7c69b', '#c3814c', '#7a4424'] },
      tropics: { sky: ['#e8eedd', '#d2dfc5'], sun: '#efcd86', layers: ['#b4cea6', '#6b997a', '#2e5949'] },
      bosphorus: { sky: ['#f2e4da', '#e5c9b8'], sun: '#e6a386', layers: ['#dcbcae', '#ab7666', '#5b3433'] },
      andes: { sky: ['#eee4d4', '#ddc9ae'], sun: '#dba173', layers: ['#d1b99e', '#9d7859', '#4d3727'] },
      online: { sky: ['#ebe9f0', '#d7d4e6'], sun: '#cdc5ea', layers: ['#c4c1dd', '#8480b3', '#3f3b6c'] },
      dusk: { sky: ['#ecdcd6', '#c9b3c0'], sun: '#e58e6c', layers: ['#b9a6b6', '#7d6882', '#3b2f45'] },
    },
  };
})();
