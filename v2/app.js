(() => {
  const P = window.PROFILE, SK = window.SKYLINES;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const pad = (n) => String(n).padStart(2, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAD = Math.PI / 180, NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return parent.appendChild(e);
  };

  /* ---------- Identity, top right ---------- */
  $('#name').textContent = P.name;
  $('#title').textContent = P.title;
  const links = P.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');
  $('#links').innerHTML = links;

  /* ---------- Story items: prologue, one per stop, epilogue ---------- */
  const stops = P.stops, N = stops.length;
  const items = [
    { kind: 'prologue', scene: 'prologue' },
    ...stops.map((s, i) => ({ kind: 'stop', s, i, scene: s.type === 'formation' ? 'online' : s.place, coords: s.coords })),
    { kind: 'epilogue', scene: 'epilogue' },
  ];
  const M = items.length;
  items.forEach((it) => {
    it.sc = SK.scenes[it.scene] || SK.scenes.prologue;
    it.pal = SK.palettes[it.sc.palette];
  });

  // Signpost between two items: the next place and, when both ends are on the map, the distance as the crow flies.
  const km = ([lo1, la1], [lo2, la2]) => {
    const d = Math.sin(((la2 - la1) * RAD) / 2) ** 2 + Math.cos(la1 * RAD) * Math.cos(la2 * RAD) * Math.sin(((lo2 - lo1) * RAD) / 2) ** 2;
    return Math.round((12742 * Math.asin(Math.sqrt(d))) / 10) * 10;
  };
  const lastCoords = (p) => {
    for (let q = p; q > 0; q--) if (items[q].coords) return items[q].coords;
    return null;
  };
  const signs = items.slice(0, -1).map((_, p) => {
    const next = items[p + 1], from = lastCoords(p);
    const name = next.kind === 'epilogue' ? '?' : next.coords ? next.s.place : 'En ligne';
    const d = next.coords && from ? km(from, next.coords) : 0;
    return d > 30 ? `${name} · ${d.toLocaleString('fr-FR')} km` : name;
  });

  /* ---------- Scene graph ---------- */
  const svg = $('#scene');
  const sun = el('g', { class: 'sun' }, svg);
  const sunDisc = el('circle', {}, sun), sunRing = el('circle', { class: 'ring' }, sun);
  const clouds = el('path', { class: 'clouds' }, svg);
  const world = el('g', {}, svg);
  const layers = ['far', 'mid', 'near'].map((n) => el('g', { class: `layer ${n}` }, world));
  items.forEach((it) => (it.paths = layers.map((g, l) => el('path', { fill: it.pal.layers[l] }, g))));
  const props = el('g', { class: 'props' }, world);
  const posts = signs.map((label) => {
    const g = el('g', {}, props);
    return { g, label, shape: el('path', {}, g), text: Object.assign(el('text', {}, g), { textContent: label.toUpperCase() }) };
  });
  const ground = el('circle', { class: 'ground' }, world);
  const strata = [1, 2, 3].map((i) => el('circle', { class: `stratum s${i}` }, world));
  const tufts = el('path', { class: 'tufts' }, world);
  const walker = window.createWalker(svg);
  // Walker scale (px per body unit, times k) and the distance between two stops, in scene units.
  const WS = 1.75, SP = 900;

  /* ---------- Geometry: flat scene units bent around the planet ---------- */
  let W, H, k, R, cx, cy, S;
  const polar = (x, y) => {
    const a = (x * k) / R, r = R + y * k;
    return `${(r * Math.sin(a)).toFixed(1)} ${(-r * Math.cos(a)).toFixed(1)}`;
  };
  // Hand-cut look: long edges are split and nudged a little, which also lets them follow the planet's curve.
  const ellipse = (x, y, rx, ry, n = 18) => Array.from({ length: n }, (_, i) => [x + rx * Math.cos((i / n) * 2 * Math.PI), y + ry * Math.sin((i / n) * 2 * Math.PI)]);
  const cut = (pts, seed) => {
    let s = (seed * 7919) % 233280;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280 - 0.5, out = [];
    pts.forEach(([x1, y1], i) => {
      const [x2, y2] = pts[(i + 1) % pts.length], dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, n = Math.max(1, Math.floor(len / 14));
      for (let j = 0; j < n; j++) {
        const t = j / n, jit = j ? rnd() * 1.2 : 0;
        out.push([x1 + dx * t - (dy / len) * jit, y1 + dy * t + (dx / len) * jit]);
      }
    });
    return out;
  };
  // Polygons are prepared once (winding, cut edges, feet pushed into the ground), then drawn at any pop-up opening.
  const prepare = (polys) => polys.map((poly, j) => {
    // Shapes wind one way and holes the other, so a hole only cuts what it sits on under the nonzero rule.
    const area = poly.reduce((a, [x, y], i) => { const [x2, y2] = poly[(i + 1) % poly.length]; return a + x * y2 - x2 * y; }, 0);
    let pts = (area > 0) === !!poly.hole ? [...poly].reverse() : poly;
    if (!poly.hole) pts = cut(pts, j + 1);
    // Anything standing on the ground is pushed a bit into it, so no gap shows along the curve.
    pts = pts.map(([x, y]) => [x, y <= 0.5 ? -14 : y]);
    return { pts, hole: !!poly.hole, group: poly.group, cx: pts.reduce((a, [x]) => a + x, 0) / pts.length };
  }).map((p, _, all) => {
    // A group rises as one piece, from the average position of its shapes.
    const mates = p.group ? all.filter((q) => q.group === p.group && !q.hole) : [p];
    return Object.assign(p, { gcx: mates.reduce((a, q) => a + q.cx, 0) / mates.length });
  });
  // Pop-up opening from 0 (flat on the ground) to 1 (standing): shapes near the walker rise first, with a small paper bounce.
  const back = (t) => 1 + 2.4 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;
  const render = (prep, open = 1) => {
    let d = '';
    for (const p of prep) {
      const h = open >= 1 ? 1 : back(clamp(open * 1.4 - (Math.abs(p.gcx) / 650) * 0.4));
      if (h < 0.02) continue;
      d += 'M' + p.pts.map(([x, y]) => polar(x, y > 0 ? y * h : y)).join('L') + 'Z';
    }
    return d;
  };
  const toPath = (polys) => render(prepare(polys));

  const build = () => {
    W = innerWidth;
    H = innerHeight;
    const portrait = W < H * 0.9;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    k = portrait ? Math.min(W / 760, H / 1250) : Math.min(W / 1500, H / 950);
    R = Math.max(W, H) * (portrait ? 1.25 : 1.15);
    const horizon = H * (portrait ? 0.52 : 0.72);
    cx = W * (portrait ? 0.5 : 0.4);
    cy = horizon + R;
    S = (SP * k) / R;
    world.setAttribute('transform', `translate(${cx} ${cy})`);
    ground.setAttribute('r', R);
    strata.forEach((c, i) => c.setAttribute('r', R - [22, 70, 150][i] * k));
    items.forEach((it) => {
      it.prep = ['far', 'mid', 'near'].map((l) => prepare(it.sc[l]));
      it.cache = [new Map(), new Map(), new Map()];
      it.paths.forEach((path) => (path.q = -1));
    });

    // Grass tufts and pebbles all around the planet: they roll with the ground and show it turning.
    let d = '', a = 0, s = 7;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const P2 = (ang, r) => `${(r * Math.sin(ang)).toFixed(1)} ${(-r * Math.cos(ang)).toFixed(1)}`;
    while (a < 2 * Math.PI) {
      const u = k / R;
      if (rnd() < 0.7) for (const [o, h] of [[-3, 7], [0, 11], [3, 8]]) d += `M${P2(a + (o - 1.2) * u, R - 2)}L${P2(a + o * 1.6 * u, R + h * k * (0.7 + rnd() * 0.6))}L${P2(a + (o + 1.2) * u, R - 2)}Z`;
      else d += `M${P2(a - 6 * u, R - 2)}Q${P2(a, R + 7 * k)} ${P2(a + 6 * u, R - 2)}Z`;
      a += (30 + rnd() * 70) * u;
    }
    tufts.setAttribute('d', d);

    // Paper clouds on a slower ring above the skylines.
    const circ = (2 * Math.PI * R) / k;
    const cl = [];
    for (let x = 0, i = 0; x < circ - 400; x += 420 + ((i * 263) % 380), i++) {
      const y = 330 + ((i * 97) % 170), w = 50 + ((i * 53) % 40);
      // A flat base and three or four puffs.
      cl.push([[x - w, y], [x + w, y], [x + w, y + 8], [x - w, y + 8]]);
      [[-0.55, 0.42], [-0.1, 0.62], [0.4, 0.48], [0.8, 0.3]].slice(0, 3 + (i % 2)).forEach(([o, r]) => cl.push(ellipse(x + o * w, y + 8, r * w, r * w * 0.85)));
    }
    clouds.setAttribute('d', toPath(cl));

    sunDisc.setAttribute('r', 58 * k);
    sunRing.setAttribute('r', 70 * k);
    sun.setAttribute('transform', `translate(${cx + (portrait ? 150 : 330) * k} ${horizon - (portrait ? 250 : 360) * k})`);

    posts.forEach((p) => {
      const w = p.label.length * 7.2 + 20;
      p.shape.setAttribute('d', toPath([[[-2.5, 0], [2.5, 0], [2.5, 84], [-2.5, 84]], [[-10, 58], [w, 58], [w + 10, 67], [w, 76], [-10, 76]]]));
      Object.assign(p.text.style, { fontSize: `${11 * k}px` });
      p.text.setAttribute('x', -3 * k);
      p.text.setAttribute('y', -(R + 63.4 * k));
    });
  };

  /* ---------- Narration and card ---------- */
  const chapter = $('#chapter'), tale = $('#tale'), hint = $('#hint'), card = $('#card'), rail = $('#rail');
  const story = $('.story');
  const city = (name) => name.split(',')[0];

  // Entry dates parsed from their French text ('mars 2023 – aujourd’hui'), to list activities still running at a later stop.
  const MONTHS = ['janv', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  const span = (text) => {
    const ms = [...text.matchAll(/([a-zéû]+)\.?\s+(\d{4})/gi)].map(([, mo, y]) => +y * 12 + MONTHS.findIndex((p) => mo.toLowerCase().startsWith(p.slice(0, 3))));
    return [ms[0], /aujourd/i.test(text) ? Infinity : ms[ms.length - 1]];
  };
  stops.forEach((s, j) => {
    const [y, m] = s.from.split('-').map(Number);
    s.m = y * 12 + m - 1;
    s.entries.forEach((e) => { e.span = span(e.dates); e.stop = j; });
  });
  const ongoing = (i) => stops.slice(0, i).flatMap((s) => s.entries).filter((e) => e.span[0] < stops[i].m && e.span[1] > stops[i].m);

  const words = (text) => text.split(' ').map((w, i) => `<span style="--i:${i}">${esc(w)}</span>`).join(' ');
  const replay = (node) => {
    node.classList.remove('show');
    void node.offsetWidth;
    node.classList.add('show');
  };

  const renderStory = (it) => {
    if (it.kind === 'prologue') {
      chapter.innerHTML = esc(P.prologue.title);
      tale.innerHTML = words(P.prologue.text);
      hint.innerHTML = `${esc(P.prologue.hint)} <span class="arrow">↓</span>`;
    } else if (it.kind === 'epilogue') {
      chapter.innerHTML = 'Épilogue';
      tale.innerHTML = words(`${P.epilogue.title} ${P.epilogue.text}`);
      hint.innerHTML = `<span class="big-links">${links}</span>`;
    } else {
      const s = it.s;
      chapter.innerHTML = `${s.type === 'formation' ? 'Formation' : 'Escale'} ${pad(it.i + 1)} / ${pad(N)} · ${esc(s.period)} <span class="stamp">${esc(s.coords ? `${s.place}, ${s.country}` : s.place)}</span>`;
      tale.innerHTML = words(s.story || '');
      hint.innerHTML = '';
    }
    replay(story);
  };

  const remoteLine = (s) => {
    if (!s.remoteFrom) return '';
    const list = typeof s.remoteFrom[0] === 'string' && s.remoteFrom.length === 3 && typeof s.remoteFrom[1] === 'number' ? [s.remoteFrom] : s.remoteFrom;
    const onsite = list.includes('sur place');
    const lead = !s.coords ? 'Suivie depuis' : onsite ? 'Travail depuis' : 'À distance depuis';
    const names = list.map((p) => (p === 'sur place' ? `${s.place} (sur place)` : city(p[0])));
    return `<p class="remote mono${s.coords ? '' : ' online'}">${lead} : ${names.map(esc).join(s.remoteRoute ? ' → ' : ' · ')}</p>`;
  };
  const cardHTML = (it) => {
    const s = it.s, also = ongoing(it.i);
    return `
      <p class="kind mono">${s.type === 'formation' ? 'Formation' : 'Mission'}${s.label && s.label !== 'Formation' ? ` · ${esc(s.label)}` : ''}<span>${esc(s.period)}</span></p>
      ${remoteLine(s)}
      ${s.entries.map((e) => `
        <div class="entry">
          <h3>${esc(e.company)}</h3>
          <p class="role">${esc(e.role)}</p>
          <p class="dates mono">${esc(e.dates)}${e.remote ? '<span class="badge remote-b">À distance</span>' : ''}${e.context ? `<span class="badge">${esc(e.context)}</span>` : ''}</p>
          ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
          ${e.bullets ? `<ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        </div>`).join('')}
      ${also.length ? `<div class="parallel"><p class="mono">En parallèle</p>${also.map((e) => `<button data-p="${e.stop + 1}"><b>${esc(e.company)}</b> · ${esc(e.role)}<span class="mono">${esc(e.dates)}</span></button>`).join('')}</div>` : ''}`;
  };
  // The card folds away, then unfolds with the next stop's content.
  let cardToken = 0;
  const renderCard = (it) => {
    const token = ++cardToken, wasOpen = card.classList.contains('show');
    card.classList.remove('show');
    card.classList.toggle('fold', wasOpen);
    setTimeout(() => {
      if (token !== cardToken) return;
      card.classList.remove('fold');
      if (it.kind !== 'stop') return (card.hidden = true);
      card.hidden = false;
      card.innerHTML = cardHTML(it);
      card.scrollTop = 0;
      replay(card);
    }, wasOpen ? 260 : 0);
  };

  // Year rail: one notch per stop, the year written when it changes.
  rail.innerHTML = stops.map((s, i) => {
    const y = s.from.slice(0, 4), shown = !i || stops[i - 1].from.slice(0, 4) !== y;
    return `<li data-p="${i + 1}" class="${s.type === 'formation' ? 'formation' : ''}" title="${esc(s.coords ? s.place : s.entries[0].company)} · ${esc(s.period)}"><span>${shown ? y : ''}</span></li>`;
  }).join('');
  const notches = [...rail.children];

  const setPalette = (it) => {
    const st = document.body.style;
    st.setProperty('--sky1', it.pal.sky[0]);
    st.setProperty('--sky2', it.pal.sky[1]);
    st.setProperty('--sun', it.pal.sun);
  };

  /* ---------- Scroll: each item rests a while, then the planet turns to the next ---------- */
  const track = $('#track');
  const HOLD = 0.4, TOTAL = M - 1 + HOLD;
  track.style.height = `${M * 100}vh`;
  let target = 0, pos = 0, vpos = 0, active = -1;
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const activate = (p) => {
    if (p === active) return;
    active = p;
    const it = items[p];
    renderStory(it);
    renderCard(it);
    setPalette(it);
    notches.forEach((n, i) => { n.classList.toggle('active', i + 1 === p); n.classList.toggle('done', i + 1 <= p); });
  };
  const onScroll = () => {
    const f = clamp(scrollY / maxScroll()) * TOTAL;
    const seg = Math.min(M - 2, Math.floor(f)), t = ease(clamp((f - seg - HOLD) / (1 - HOLD)));
    target = seg + t;
  };
  const goTo = (p) => {
    p = clamp(p, 0, M - 1);
    // Far jumps skip ahead so the walk only replays the last stretch.
    if (Math.abs(p - pos) > 1.5) { pos = p - Math.sign(p - pos) * 1.1; vpos = 0; }
    scrollTo({ top: p < M - 1 ? ((p + HOLD / 2) / TOTAL) * maxScroll() : maxScroll(), behavior: 'instant' });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { build(); onScroll(); });
  rail.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) goTo(+li.dataset.p); });
  card.addEventListener('click', (e) => { const b = e.target.closest('.parallel button'); if (b) goTo(+b.dataset.p); });
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(active + 1);
    if (e.key === 'ArrowLeft') goTo(active - 1);
  });

  /* ---------- Frame loop ---------- */
  // Each layer folds flat as the walker leaves a stop and unfolds on arrival: near first, far last.
  const FOLD = [[0.28, 0.62], [0.2, 0.52], [0.12, 0.44]];
  const unfold = (d, [a, b]) => 1 - ease(clamp((d - a) / (b - a)));
  // Top speed: a sprint of 400 body units per second, in stops per second.
  const VMAX = (400 * WS) / SP;
  let last = performance.now();
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (reduced) { pos = target; vpos = 0; }
    else {
      // The walker chases the scroll position like a spring, capped at sprint speed so the legs never blur into nonsense.
      const want = clamp((target - pos) * 3.2, -VMAX, VMAX);
      vpos += (want - vpos) * Math.min(1, dt * 6);
      pos += vpos * dt;
      if (Math.abs(target - pos) < 2e-4 && Math.abs(vpos) < 2e-3) { pos = target; vpos = 0; }
    }

    items.forEach((it, p) => {
      const d = Math.abs(p - pos);
      it.paths.forEach((path, l) => {
        const q = d < FOLD[l][1] ? Math.round(unfold(d, FOLD[l]) * 48) : 0;
        if (q !== path.q) {
          path.q = q;
          if (q && !it.cache[l].has(q)) it.cache[l].set(q, render(it.prep[l], q / 48));
          path.setAttribute('d', q ? it.cache[l].get(q) : '');
        }
        if (q) path.setAttribute('transform', `rotate(${((p - pos) * S) / RAD})`);
      });
    });
    posts.forEach((p, i) => {
      const d = i + 0.5 - pos, h = back(1 - ease(clamp((Math.abs(d) - 0.22) / 0.26)));
      p.g.style.display = h > 0.02 ? '' : 'none';
      if (h > 0.02) p.g.setAttribute('transform', `rotate(${(d * S) / RAD}) translate(0 ${-R}) scale(1 ${h}) translate(0 ${R})`);
    });
    tufts.setAttribute('transform', `rotate(${(-pos * S) / RAD})`);
    clouds.setAttribute('transform', `translate(${cx} ${cy}) rotate(${(-pos * S * 0.35) / RAD - now * 0.0004})`);
    // Story, card and rail follow the walker, not the scrollbar: they switch as he passes the signpost.
    activate(clamp(Math.round(pos), 0, M - 1));
    rail.style.setProperty('--p', clamp((pos - 1) / (N - 1)));
    walker.update(dt, (vpos * SP) / WS, now);
    walker.place(cx, cy - R, WS * k);
    requestAnimationFrame(frame);
  };

  build();
  onScroll();
  pos = target;
  requestAnimationFrame(frame);
})();
