(() => {
  const P = window.PROFILE;
  const $ = (s) => document.querySelector(s);
  const h = (tag, attrs = {}, html = '') => Object.assign(document.createElement(tag), attrs, html && { innerHTML: html });
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => t * t * (3 - 2 * t);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RAD = Math.PI / 180;

  /* ---------- Static content ---------- */
  const fmtCoord = ([lon, lat]) => `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
  $('.hero-coords').textContent = `${fmtCoord(P.coords)} · ${P.location}`;
  let ci = 0;
  $('#hero-name').innerHTML = P.name.split(' ').map((w) => `<span class="w">${[...w].map((c) => `<span class="c" style="--i:${ci++}">${esc(c)}</span>`).join('')}</span>`).join('');
  $('#hero-roles').innerHTML = P.roles.map((r) => `<span>${esc(r)}</span>`).join('');
  $('#hero-title').textContent = P.title;
  $('#hero-tagline').textContent = P.tagline;
  const links = P.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');
  $('#hero-links').innerHTML = links;
  $('#footer-links').innerHTML = links;
  $('#copyright').textContent = `© ${new Date().getFullYear()} ${P.name}`;

  $('#stats').innerHTML = P.stats.map((s, i) => `<div class="stat" data-reveal style="--d:${i * 0.1}s"><b data-count="${s.value}" data-suffix="${esc(s.suffix)}">0</b><span>${esc(s.label)}</span></div>`).join('');
  $('#about').innerHTML = P.about.map((a, i) => `<li data-reveal style="--d:${0.1 + i * 0.1}s">${esc(a)}</li>`).join('');

  $('#skills-grid').innerHTML = Object.entries(P.skills).map(([cat, list], i) => `<div data-reveal style="--d:${i * 0.08}s"><h3>${esc(cat)}</h3><div class="chips">${list.map((s) => `<span>${esc(s)}</span>`).join('')}</div></div>`).join('');
  $('#langs').innerHTML = P.languages.map((l, i) => `<div class="lang" data-reveal style="--d:${i * 0.1}s;--v:${l.value}%"><b>${esc(l.name)}</b><small>${esc(l.level)}</small><div class="bar"><i></i></div></div>`).join('');
  $('#edu-list').innerHTML = P.education.map((e, i) => `<li data-reveal style="--d:${i * 0.06}s"><span class="mono">${esc(e.years)}</span><div><b>${esc(e.school)}</b><small>${esc(e.what)}${e.level ? ` · <em>${esc(e.level)}</em>` : ''}</small></div><div class="certs">${e.certs.map((c) => `<span>${esc(c)}</span>`).join('')}</div></li>`).join('');

  /* ---------- Reveal + counters ---------- */
  const count = (el) => {
    const end = +el.dataset.count, suf = el.dataset.suffix, t0 = performance.now();
    const step = (t) => {
      const k = clamp((t - t0) / 1600);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(count);
    io.unobserve(e.target);
  }), { threshold: 0.15 });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

  /* ---------- Globe ---------- */
    const stops = P.stops.map((s) => ({ ...s, online: !s.coords, lon: s.coords?.[0], lat: s.coords?.[1] }));
  const N = stops.length;

  // Decode the land bitmask; grid layout must match tools/build-land.mjs.
  const dots = [];
  {
    const raw = atob(window.LAND.bits), step = window.LAND.step;
    let i = 0;
    for (let lat = 90 - step / 2; lat > -90; lat -= step) {
      const n = Math.max(1, Math.round((360 / step) * Math.cos(lat * RAD)));
      for (let j = 0; j < n; j++, i++) {
        if (raw.charCodeAt(i >> 3) & (1 << (i & 7))) dots.push([(-180 + ((j + 0.5) * 360) / n) * RAD, lat * RAD]);
      }
    }
  }
  const dotSin = dots.map((d) => Math.sin(d[1])), dotCos = dots.map((d) => Math.cos(d[1]));

  const toVec = (lon, lat) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)];
  const toLL = ([x, y, z]) => [Math.atan2(y, x) / RAD, Math.asin(clamp(z, -1, 1)) / RAD];
  const angle = (a, b) => Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
  const slerp = (a, b, t) => {
    const w = angle(a, b);
    if (w < 1e-6) return a;
    const s = Math.sin(w), ka = Math.sin((1 - t) * w) / s, kb = Math.sin(t * w) / s;
    return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
  };
  const month = (s) => { const [y, m, d] = s.split('-').map(Number); return y * 12 + m - 1 + (d ? (d - 1) / 31 : 0); }; // 'YYYY-MM' or 'YYYY-MM-DD', in months.
  // Remote missions carry remoteFrom: one place, or a list of places, I worked from, each linked on the globe to the job location.
  const norm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
  // An online training has no coords: only the places I followed it from are shown, in yellow, while it is active.
  stops.forEach((s) => {
    s.m = month(s.from);
    s.remote = !!s.remoteFrom;
    const list = !s.remote ? [] : Array.isArray(s.remoteFrom[0]) ? s.remoteFrom : [s.remoteFrom];
    s.heres = list.map((p) => (p === 'sur place' ? { name: s.place, onsite: true } : { name: p[0], v: toVec(p[1], p[2]) }));
    const center = s.heres.length ? norm(s.heres.reduce((c, h) => (h.v ? c.map((x, k) => x + h.v[k]) : c), [0, 0, 0])) : null;
    s.v = s.online ? center : toVec(s.lon, s.lat);
    s.heres.forEach((h) => h.onsite && (h.v = s.v));
    // Camera halfway between the job and the center of the places I worked from, zoomed out to fit the farthest one.
    s.cam = center ? slerp(center, s.v, 0.5) : s.v;
    s.zoom = 1.1 - 0.3 * Math.min(1, Math.max(0, ...s.heres.map((h) => angle(h.v, s.v))) / 1.8);
  });
  // Markers grouped by coordinates, so a city with several missions is a single dot.
  const group = (items, key) => Object.values(items.reduce((g, it, i) => ((g[key(it)] ??= []).push([it, i]), g), {}));
  const indexed = stops.map((s, i) => ({ s, i })).filter(({ s }) => !s.online);
  const jobs = group(indexed, ({ s }) => s.coords.join()).map((g) => ({ ...g[0][0].s, stops: g.map(([x]) => x.i) }));
  const origins = group(indexed.flatMap(({ s, i }) => s.heres.filter((h) => !h.onsite).map((h) => ({ ...h, i }))), (h) => h.name).map((g) => ({ ...g[0][0], stops: g.map(([h]) => h.i) }));
  const city = (name) => name.split(',')[0];

  const SHOW_ROUTE = false; // Red line between consecutive stops.

  const createGlobe = (canvas) => {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
    };
    addEventListener('resize', resize);
    resize();

    // View state: center of the globe (lon/lat in degrees) and zoom, eased toward the target every frame.
    const view = { lon: stops[0].lon - 60, lat: stops[0].lat - 10, zoom: 0.8 };

    // Manual rotation by dragging: an offset on top of the scroll-driven view, with inertia, eased back to zero once the user scrolls again.
    const drag = { lon: 0, lat: 0, vlon: 0, vlat: 0, on: false, back: false, x: 0, y: 0, R: 1 };
    const cam = { lon: 0, lat: 0 };
    // Clickable markers, rebuilt every frame in canvas coordinates.
    let hits = [], hover = null, moved = 0;
    const hitAt = (e) => {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      let best = null, bd = 12 * 12;
      for (const h of hits) { const d = (h.x - x) ** 2 + (h.y - y) ** 2; if (d < bd) { bd = d; best = h; } }
      return best;
    };
    canvas.addEventListener('pointerdown', (e) => {
      Object.assign(drag, { on: true, back: false, x: e.clientX, y: e.clientY, vlon: 0, vlat: 0 });
      moved = 0;
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointerup', (e) => {
      if (moved > 5) return;
      const h = hitAt(e);
      if (!h) return api.onMenu?.(null);
      // Every mission tied to the dots under the pointer, as a job location or as a place I worked from.
      const near = hits.filter((o) => (o.x - h.x) ** 2 + (o.y - h.y) ** 2 < 36);
      const found = near.flatMap((o) => o.stops.map((i) => ({ i, remote: o.remote })));
      const picks = [...new Map(found.map((p) => [p.i, p])).values()].sort((p, q) => p.i - q.i);
      picks.length === 1 ? api.onPick?.(picks[0].i) : api.onMenu?.({ names: [...new Set(near.map((o) => city(o.name)))], picks, x: e.clientX, y: e.clientY });
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag.on) {
        hover = hitAt(e);
        canvas.style.cursor = hover ? 'pointer' : '';
        return;
      }
      moved += Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y);
      const k = 180 / Math.PI / drag.R;
      drag.vlon = -(e.clientX - drag.x) * k; drag.vlat = (e.clientY - drag.y) * k;
      drag.lon += drag.vlon; drag.lat = clamp(drag.lat + drag.vlat, -70 - view.lat, 70 - view.lat);
      drag.x = e.clientX; drag.y = e.clientY;
    });
    const release = () => (drag.on = false);
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointerleave', () => (hover = null));
    canvas.addEventListener('pointercancel', release);
    const target = { lon: stops[0].lon, lat: stops[0].lat, zoom: 1, seg: 0, t: 0 };

    const project = (lon, lat, alt = 1) => {
      const l0 = cam.lon * RAD, p0 = cam.lat * RAD, dl = lon * RAD - l0;
      const cl = Math.cos(lat * RAD), sl = Math.sin(lat * RAD);
      const x = cl * Math.sin(dl), y = Math.cos(p0) * sl - Math.sin(p0) * cl * Math.cos(dl), z = Math.sin(p0) * sl + Math.cos(p0) * cl * Math.cos(dl);
      return { x: x * alt, y: y * alt, z, vis: z > 0 || (x * x + y * y) * alt * alt > 1 };
    };

    const drawGreat = (a, b, t, R, cx, cy, color, width) => {
      const d = angle(a, b);
      if (d < 1e-4 || t <= 0) return;
      const lift = 0.02 + d * 0.07, n = 64;
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= n * t; i++) {
        const s = i / n, [lon, lat] = toLL(slerp(a, b, s)), p = project(lon, lat, 1 + lift * Math.sin(Math.PI * s));
        if (!p.vis) { pen = false; continue; }
        const X = cx + p.x * R, Y = cy - p.y * R;
        pen ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
        pen = true;
      }
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
    };

    const graticule = (R, cx, cy) => {
      ctx.strokeStyle = '#efe6d212'; ctx.lineWidth = 0.7;
      ctx.beginPath();
      const line = (f, from, to) => {
        let pen = false;
        for (let v = from; v <= to; v += 4) {
          const p = f(v);
          if (p.z <= 0) { pen = false; continue; }
          pen ? ctx.lineTo(cx + p.x * R, cy - p.y * R) : ctx.moveTo(cx + p.x * R, cy - p.y * R); pen = true;
        }
      };
      for (let m = -180; m < 180; m += 20) line((lat) => project(m, lat), -90, 90);
      for (let lat = -60; lat <= 60; lat += 20) line((lon) => project(lon, lat), -180, 180);
      ctx.stroke();
    };

    const frame = (now) => {
      const k = reduced ? 1 : 0.08;
      view.lon += (((target.lon - view.lon + 540) % 360) - 180) * k;
      view.lat += (target.lat - view.lat) * k; view.zoom += (target.zoom - view.zoom) * k;

      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.36 * view.zoom;
      if (!drag.on) {
        drag.vlon *= 0.94; drag.vlat *= 0.94;
        drag.lon += drag.vlon; drag.lat = clamp(drag.lat + drag.vlat, -70 - view.lat, 70 - view.lat);
        if (drag.back) { drag.lon *= 0.92; drag.lat *= 0.92; }
      }
      drag.R = R; cam.lon = view.lon + drag.lon; cam.lat = view.lat + drag.lat;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Atmosphere and ocean.
      let g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.35);
      g.addColorStop(0, '#e0322b22'); g.addColorStop(1, '#e0322b00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, 0, 7); ctx.fill();
      g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      g.addColorStop(0, '#1f3448'); g.addColorStop(1, '#0a121a');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      ctx.strokeStyle = '#efe6d230'; ctx.lineWidth = 1; ctx.stroke();
      graticule(R, cx, cy);

      // Land dots, fading toward the limb.
      const l0 = cam.lon * RAD, p0 = cam.lat * RAD, sp = Math.sin(p0), cp = Math.cos(p0);
      const size = Math.max(1, R / 170);
      ctx.fillStyle = '#efe6d2';
      for (let i = 0; i < dots.length; i++) {
        const dl2 = dots[i][0] - l0, c = Math.cos(dl2), z = sp * dotSin[i] + cp * dotCos[i] * c;
        if (z <= 0.02) continue;
        const x = dotCos[i] * Math.sin(dl2), y = cp * dotSin[i] - sp * dotCos[i] * c;
        ctx.globalAlpha = 0.15 + z * 0.75;
        const s = size * (0.5 + z * 0.6);
        ctx.fillRect(cx + x * R - s / 2, cy - y * R - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      const screen = (v) => { const [lon, lat] = toLL(v), p = project(lon, lat); return p.z > 0 && [cx + p.x * R, cy - p.y * R]; };
      const dot = (v, r, fill, ring) => {
        const s = screen(v);
        if (!s) return s;
        ctx.beginPath(); ctx.arc(s[0], s[1], r, 0, 7); ctx.fillStyle = fill; ctx.fill();
        if (ring) { ctx.lineWidth = 2; ctx.strokeStyle = ring; ctx.stroke(); }
        return s;
      };
      const label = (s, text, color, dy = -10) => { ctx.fillStyle = color; ctx.fillText(text, s[0] + 12, s[1] + dy); };
      const hold = clamp(1 - Math.abs(target.t - (target.t > 0.5 ? 1 : 0)) * 3); // 1 while resting on a stop, 0 mid-flight.
      hits = [];

      // Route between job locations, drawn up to the current stop (toggle with SHOW_ROUTE).
      if (SHOW_ROUTE) for (let i = 0; i <= target.seg && i < N - 1; i++) drawGreat(stops[i].v, stops[i + 1].v, i < target.seg ? 1 : target.t, R, cx, cy, i < target.seg ? '#e0322b99' : '#e0322b', 1.6);

      // Remote missions: a line from the job location to where I actually worked from, highlighted for the active one.
      const a = stops[activeIndex];
      stops.forEach((s) => {
        if (!s.remote || s.online) return;
        const on = s === a;
        ctx.setLineDash([6, 6]); ctx.lineDashOffset = on ? -now / 40 : 0;
        s.heres.forEach((h) => drawGreat(h.v, s.v, 1, R, cx, cy, on ? '#5aa9ff' : '#5aa9ff40', on ? 1.6 : 1));
      });
      ctx.setLineDash([]);

      // Places I worked remotely from in blue, job locations in red and trainings in yellow on top (a city can be both).
      origins.forEach((o) => {
        const s = dot(o.v, o.stops.includes(activeIndex) ? 5 : 3.4, '#5aa9ff');
        if (s) hits.push({ x: s[0], y: s[1], name: o.name, stops: o.stops, remote: true });
      });
      jobs.forEach((jb) => {
        const s = dot(jb.v, jb.stops.includes(activeIndex) ? 5 : 3.4, jb.type === 'formation' ? '#f4c542' : '#e0322b');
        if (s) hits.push({ x: s[0], y: s[1], name: jb.place, stops: jb.stops, remote: false });
      });
      if (a.online) { ctx.globalAlpha = hold; a.heres.forEach((h) => dot(h.v, 4.5, '#f4c542')); ctx.globalAlpha = 1; }

      // Pulse on the active job location.
      const js = a.online ? null : screen(a.v), pulse = (now / 1600) % 1;
      if (js) { ctx.beginPath(); ctx.arc(js[0], js[1], 6 + pulse * 22, 0, 7); ctx.strokeStyle = `${a.type === 'formation' ? 'rgba(244,197,66,' : 'rgba(224,50,43,'}${(1 - pulse) * hold})`; ctx.lineWidth = 1.5; ctx.stroke(); }

      // Names: only the active stop (and where I worked from, if remote), plus the hovered marker.
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.globalAlpha = hold;
      if (js) label(js, a.place.toUpperCase(), '#efe6d2');
      // Labels for the places I worked from, skipping any that would overlap one already drawn.
      const boxes = js ? [[js[0], js[1] - 22, ctx.measureText(a.place).width + 24, 16]] : [];
      a.heres.forEach((h) => {
        if (h.onsite) return;
        const s = screen(h.v), text = city(h.name).toUpperCase();
        if (!s) return;
        const b = [s[0], s[1] + 6, ctx.measureText(text).width + 24, 16];
        if (boxes.some((o) => b[0] < o[0] + o[2] && o[0] < b[0] + b[2] && b[1] < o[1] + o[3] && o[1] < b[1] + b[3])) return;
        boxes.push(b);
        label(s, text, a.online ? '#f4c542' : '#5aa9ff', 18);
      });
      ctx.globalAlpha = 1;
      if (hover && !drag.on) {
        const h = hits.find((x) => x.name === hover.name && Math.abs(x.x - hover.x) < 30 && Math.abs(x.y - hover.y) < 30) ?? hover;
        label([h.x, h.y], h.name.toUpperCase(), '#efe6d2', 4);
      }
    };
    const api = { canvas, target, frame, release: () => { if (!drag.on) { drag.back = true; drag.vlon = drag.vlat = 0; } } };
    return api;
  };

  const globe = createGlobe($('#globe'));
  const target = globe.target;

  // Only render globes that are on screen.
  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(globe.canvas);
  const draw = (now) => {
    if (visible) globe.frame(now);
    requestAnimationFrame(draw);
  };

  /* ---------- Card + rail ---------- */
  const card = $('#card'), rail = $('#rail');
  const pad = (n) => String(n).padStart(2, '0');
  rail.innerHTML = stops.map((s, i) => `<li data-i="${i}"${s.type === 'formation' ? ' class="formation"' : ''} title="${esc(s.place)} · ${esc(s.period)}"><span>${esc(s.period.slice(0, 4))}</span></li>`).join('');
  const railItems = [...rail.children];

  // Entry dates parsed from their French text ('mars 2023 – aujourd’hui'), to list activities still running at a later stop.
  const MONTHS = ['janv', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  const span = (text) => {
    const ms = [...text.matchAll(/([a-zéû]+)\.?\s+(\d{4})/gi)].map(([, mo, y]) => +y * 12 + MONTHS.findIndex((p) => mo.toLowerCase().startsWith(p.slice(0, 3))));
    return [ms[0], /aujourd/i.test(text) ? Infinity : ms[ms.length - 1]];
  };
  stops.forEach((s, j) => s.entries.forEach((e) => { e.span = span(e.dates); e.stop = j; }));
  const ongoing = (i) => stops.slice(0, i).flatMap((s) => s.entries).filter((e) => e.span[0] < stops[i].m && e.span[1] > stops[i].m);

  const renderCard = (i) => {
    const s = stops[i], also = ongoing(i);
    const entries = s.entries.map((e) => `
      <div class="entry">
        <h4>${esc(e.company)}</h4>
        <div class="role">${esc(e.role)}</div>
        <span class="dates mono">${esc(e.dates)}${e.remote ? '<span class="badge-remote">À distance</span>' : ''}${e.context ? `<span class="badge-context">${esc(e.context)}</span>` : ''}</span>
        ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
        ${e.bullets ? `<ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      </div>`).join('');
    card.classList.remove('show');
    card.innerHTML = `
      <div class="meta mono"><span>${esc(s.period)}</span><span>${pad(i + 1)} / ${pad(N)}</span></div>
      <h3>${esc(s.place)}</h3>
      <div class="where mono">${[s.country, s.label, s.coords && fmtCoord(s.coords)].filter(Boolean).map(esc).join(' · ')}</div>
      ${s.remote ? `<div class="remote mono${s.online ? ' online' : ''}">${s.heres.some((h) => h.onsite) ? 'Travail depuis' : 'À distance depuis'} : ${s.heres.map((h) => esc(city(h.name)) + (h.onsite ? ' (sur place)' : '')).join(s.remoteRoute ? ' → ' : ' · ')}</div>` : ''}
      ${entries}
      ${also.length ? `<div class="parallel"><p class="mono">En parallèle</p>${also.map((e) => `<button data-i="${e.stop}"><b>${esc(e.company)}</b> · ${esc(e.role)}<span class="mono">${esc(e.dates)}${e.remote ? ' · à distance' : ''}</span></button>`).join('')}</div>` : ''}`;
    [...card.children].forEach((c, k) => c.style.setProperty('--i', k));
    card.scrollTop = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('show')));
    railItems.forEach((el, k) => { el.classList.toggle('active', k === i); el.classList.toggle('done', k <= i); });
  };

  /* ---------- Scroll driver ---------- */
  const journey = $('#journey'), bar = $('.progress');
  const HOLD = 0.5; // Share of each segment during which the globe rests on a stop.
  const TOTAL = N - 1 + HOLD; // Extra hold so the last stop also rests before the section ends.
  let activeIndex = -1;
  journey.style.height = `${N * 90 + 10}vh`;

  const onScroll = () => {
    const vh = innerHeight, y = scrollY;
    bar.style.setProperty('--p', y / (document.documentElement.scrollHeight - vh));

    const f = clamp((y - journey.offsetTop) / (journey.offsetHeight - vh)) * TOTAL;
    const seg = Math.min(N - 2, Math.floor(f)), t = ease(clamp((f - seg - HOLD) / (1 - HOLD)));
    const a = stops[seg], b = stops[seg + 1];
    const [lon, lat] = toLL(slerp(a.cam, b.cam, t));
    const dip = Math.min(1, angle(a.cam, b.cam) / 1.2) * 0.35;
    Object.assign(target, { lon, lat: lat * 0.85, zoom: a.zoom + (b.zoom - a.zoom) * t - dip * Math.sin(Math.PI * t), seg, t });
    rail.style.setProperty('--p', clamp(f / (N - 1)));

    const idx = t < 0.5 ? seg : seg + 1;
    if (idx !== activeIndex) { activeIndex = idx; renderCard(idx); }
  };
  addEventListener('scroll', () => { globe.release(); onScroll(); }, { passive: true });
  addEventListener('resize', onScroll);

  const goTo = (i) => {
    const f = i < N - 1 ? i + HOLD / 2 : N - 1;
    // Jump instantly: the globe then eases straight to the stop instead of replaying every stop in between.
    scrollTo({ top: journey.offsetTop + ((journey.offsetHeight - innerHeight) * f) / TOTAL, behavior: 'instant' });
  };
  globe.onPick = goTo;

  // Menu for a dot tied to several missions: pick one to jump to it.
  const menu = $('#pick-menu'), stage = $('.stage');
  const closeMenu = () => (menu.hidden = true);
  globe.onMenu = (m) => {
    if (!m) return closeMenu();
    const r = stage.getBoundingClientRect();
    // Nearby dots can merge (Nantes, Bouguenais, Saint-Herblain): then each line also names its city.
    const several = m.names.length > 1;
    menu.innerHTML = `<p class="mono">${m.names.map(esc).join(' · ')}</p>` + m.picks.map(({ i, remote }) => {
      const s = stops[i];
      return `<button data-i="${i}"><span class="mono">${esc(s.period)}${several && !remote ? ` · ${esc(s.place)}` : ''}</span>${remote ? `${esc(s.place)} <em>à distance</em>` : esc(s.entries.map((e) => e.company).join(' · '))}</button>`;
    }).join('');
    menu.hidden = false;
    menu.style.left = `${Math.min(m.x - r.left + 12, r.width - menu.offsetWidth - 12)}px`;
    menu.style.top = `${Math.min(m.y - r.top + 12, r.height - menu.offsetHeight - 12)}px`;
  };
  card.addEventListener('click', (e) => {
    const b = e.target.closest('.parallel button');
    if (b) goTo(+b.dataset.i);
  });
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) { closeMenu(); goTo(+b.dataset.i); }
  });
  addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
  addEventListener('scroll', closeMenu, { passive: true });
  rail.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (li) goTo(+li.dataset.i);
  });

  onScroll();
  requestAnimationFrame(draw);
})();
