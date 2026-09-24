// Stickman traveller with a procedural gait driven by the ground speed, so the stance foot stays planted whatever the scroll speed.
// Body units: the stickman is about 64 tall, feet on y = 0, facing +x, y pointing up (flipped when drawn).
// Gaits blend with speed: idle, walk (about 50 units/s), run (from about 150), and a Naruto sprint with arms thrown back (from about 320).
window.createWalker = (parent) => {
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return parent.appendChild(e);
  };

  const INK = '#2b2621', INK2 = '#6e645a';
  const g = el('g', { class: 'walker' }, parent);
  const line = (c, w) => el('path', { fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const dash = el('path', { fill: 'none', stroke: INK, 'stroke-width': 1.4, 'stroke-linecap': 'round' }, g);
  const legB = line(INK2, 4.2), armB = line(INK2, 3.8);
  const scarf = line('var(--red)', 3.2);
  const torso = line(INK, 4.8), legF = line(INK, 4.2);
  const head = el('circle', { r: 6, fill: INK }, g);
  const armF = line(INK, 3.8);

  const L1 = 15.5, L2 = 15.5, LEG = L1 + L2;
  const st = { phase: 0, speed: 0, idle: 1, dir: 1, face: 1, hip: 29, lean: 0.05 };

  // Two-bone leg: the knee bends forward, the foot is pulled in when out of reach.
  const ik = (hy, fx, fy) => {
    let dx = fx, dy = fy - hy, d = Math.hypot(dx, dy);
    if (d > LEG * 0.999) { dx *= (LEG * 0.999) / d; dy *= (LEG * 0.999) / d; d = LEG * 0.999; }
    const a = Math.atan2(dy, dx), b = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    return [L1 * Math.cos(a + b), hy + L1 * Math.sin(a + b), dx, hy + dy];
  };
  const P = (x, y) => `${x.toFixed(2)} ${(-y).toFixed(2)}`;

  // dt in seconds, v the signed ground speed in body units per second, now in ms.
  const update = (dt, v, now) => {
    const sp = Math.abs(v);
    st.speed += (sp - st.speed) * Math.min(1, dt * 7);
    const s = st.speed;
    if (sp > 3) st.dir = Math.sign(v);
    // Turning around squeezes the figure through its profile in about 0.2 s.
    st.face += clamp(st.dir - st.face, -dt * 10, dt * 10);
    const run = smooth(110, 190, s), sprint = smooth(290, 360, s);
    st.idle += ((s > 5 ? 0 : 1) - st.idle) * Math.min(1, dt * 6);
    const idle = st.idle;

    // One cycle is two steps; the stance foot sweeps back exactly as fast as the ground.
    const cycle = mix(clamp(40 + 0.2 * s, 44, 56), clamp(60 + 0.1 * s, 70, 92), run);
    const stance = mix(0.62, 0.36, run), sweep = stance * cycle, lift = mix(4.5, 12, run) + sprint * 4;
    st.phase = (st.phase + (sp * dt) / cycle) % 1;
    const foot = (ph, rest) => {
      let x, y, down;
      if (ph < stance) { x = sweep / 2 - (sweep * ph) / stance; y = 0; down = true; }
      else {
        const t = (ph - stance) / (1 - stance), e = t * t * (3 - 2 * t);
        x = -sweep / 2 + sweep * e - run * 10 * Math.sin(Math.PI * t) * (1 - t);
        y = lift * Math.sin(Math.PI * t) ** 0.8;
        down = false;
      }
      return [mix(x, rest, idle), mix(y, 0, idle), down || idle > 0.5];
    };
    const fF = foot(st.phase, 3.5), fB = foot((st.phase + 0.5) % 1, -3.5);

    // The hip rides over the stance foot (inverted pendulum) and floats up during a running flight.
    const rest = mix(mix(29.4, 27.2, run) - sprint * 1.6, 30.5, idle);
    let hip = rest;
    const planted = [fF, fB].filter((f) => f[2]);
    planted.forEach((f) => (hip = Math.min(hip, mix(rest, Math.sqrt(Math.max(0, (LEG * 0.985) ** 2 - f[0] ** 2)), 0.75))));
    if (!planted.length) hip = rest + 2.2 * run;
    hip += idle * 0.35 * Math.sin(now / 650);
    st.hip += (hip - st.hip) * Math.min(1, dt * 22);
    st.lean += (mix(0.04, 0.2, run) + sprint * 0.45 - st.lean) * Math.min(1, dt * 5);
    const hy = st.hip, ln = st.lean;

    const leg = (f) => { const [kx, ky, fx, fy] = ik(hy, f[0], f[1]); return `M${P(0, hy)}L${P(kx, ky)}L${P(fx, fy)}l3.2 0`; };
    legF.setAttribute('d', leg(fF));
    legB.setAttribute('d', leg(fB));

    const sx = 18.5 * Math.sin(ln), sy = hy + 18.5 * Math.cos(ln);
    const nx = 21 * Math.sin(ln), ny = hy + 21 * Math.cos(ln);
    torso.setAttribute('d', `M${P(0, hy)}L${P(nx, ny)}`);
    head.setAttribute('cx', nx + 6.8 * Math.sin(ln * 0.6));
    head.setAttribute('cy', -(ny + 6.8 * Math.cos(ln * 0.6)));

    // Arms swing against the leg on the same side; in the sprint they trail straight back.
    const arm = (ph) => {
      const sw = -Math.cos(2 * Math.PI * ph);
      let a = mix(0.55 * sw, 0.2 + 0.95 * sw, run), b = mix(0.3 + 0.12 * (sw + 1), 1.65, run);
      a = mix(mix(a, -1.95 + 0.05 * Math.sin(now / 45 + ph * 9), sprint), 0.05, idle);
      b = mix(mix(b, 0.12, sprint), 0.12, idle);
      const ex = sx + 12 * Math.sin(a), ey = sy - 12 * Math.cos(a);
      return `M${P(sx, sy)}L${P(ex, ey)}L${P(ex + 11 * Math.sin(a + b), ey - 11 * Math.cos(a + b))}`;
    };
    armF.setAttribute('d', arm((st.phase + 0.5) % 1));
    armB.setAttribute('d', arm(st.phase));

    // Scarf: hangs at rest, streams back with speed.
    const wind = clamp(s / 220), tail = [];
    for (let j = 1; j <= 4; j++) tail.push(P(nx - 1 - j * mix(1.2, 4.6, wind), ny - 1.5 - j * mix(2.6, 0.2, wind) + Math.sin(now / mix(400, 70, wind) + j * 1.4) * j * mix(0.2, 0.8, wind)));
    scarf.setAttribute('d', `M${P(nx + 1.5, ny - 1)}L${P(nx - 1.5, ny - 1.5)}L${tail.join('L')}`);

    // Speed lines behind the sprint.
    const len = 8 + 16 * sprint;
    dash.setAttribute('d', sprint > 0.02 ? [22, 34, 46].map((y, i) => `M${P(-12 - i * 3, y)}l${(-len * (0.7 + 0.3 * Math.sin(now / 60 + i))).toFixed(2)} 0`).join('') : '');
    dash.setAttribute('stroke-opacity', 0.6 * sprint);
  };

  const place = (x, y, scale) => g.setAttribute('transform', `translate(${x} ${y}) scale(${scale * st.face} ${scale})`);
  return { g, update, place, state: st };
};
