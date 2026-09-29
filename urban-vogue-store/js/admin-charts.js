// Gráficas en SVG / HTML puro (sin librerías, funcionan sin internet)
let uid = 0;

export const compact = (v) => {
  if (v >= 1e6) return "$" + (v / 1e6).toFixed(1).replace(".0", "") + "M";
  if (v >= 1e3) return "$" + Math.round(v / 1e3) + "k";
  return "$" + Math.round(v);
};

const niceMax = (v, integer) => {
  if (integer) return Math.max(4, Math.ceil(v / 4) * 4);
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
};

// curva suave (Catmull-Rom → Bézier)
function smoothPath(pts, top, base) {
  const cl = (y) => Math.min(base, Math.max(top, y));
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, cl(p1[1] + (p2[1] - p0[1]) / 6)];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, cl(p2[1] - (p3[1] - p1[1]) / 6)];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function lineChart(data, { format = compact, integer = false, w = 640, h = 240 } = {}) {
  const id = "g" + ++uid;
  const W = w, H = h, L = 58, R = 16, T = 16, B = 30;
  const max = niceMax(Math.max(...data.map((d) => d.value), 0), integer);
  const x = (i) => L + (i * (W - L - R)) / Math.max(1, data.length - 1);
  const y = (v) => T + (H - T - B) * (1 - v / max);
  const pts = data.map((d, i) => [x(i), y(d.value)]);
  const step = Math.ceil(data.length / 8);
  const base = y(0);

  const grid = [0, 1, 2, 3, 4]
    .map((k) => {
      const v = (max * k) / 4;
      return `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#20254a"/>
              <text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" fill="#8e93b8" font-size="11">${format(v)}</text>`;
    })
    .join("");
  const labels = data
    .map((d, i) =>
      (i % step === 0 && (data.length - 1 - i >= step / 2 || i === data.length - 1)) || i === data.length - 1
        ? `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" fill="#8e93b8" font-size="11">${d.label}</text>`
        : ""
    )
    .join("");
  const dots = data
    .map((d, i) => `<circle cx="${x(i)}" cy="${y(d.value)}" r="4" fill="#a78bfa" stroke="#0f1329" stroke-width="2"><title>${d.label}: ${format(d.value)}</title></circle>`)
    .join("");
  const line = smoothPath(pts, T, base);

  return `<svg viewBox="0 0 ${W} ${H}" class="ad-svg" role="img" aria-label="Gráfica de ventas">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c3aed" stop-opacity=".45"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></linearGradient></defs>
    ${grid}${labels}
    <path d="${line} L${x(data.length - 1)},${base} L${x(0)},${base} Z" fill="url(#${id})"/>
    <path d="${line}" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}

export function donut(data, { format = compact, center = format, amounts = true } = {}) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const R = 70, C = 2 * Math.PI * R;
  let offset = 0;
  const arcs = data
    .map((d) => {
      const len = (d.value / total) * C;
      const arc = `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${d.color}" stroke-width="26" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 100 100)"><title>${d.label}: ${format(d.value)}</title></circle>`;
      offset += len;
      return arc;
    })
    .join("");
  const legend = data
    .map((d) => `<li><i style="background:${d.color}"></i><span>${d.label}</span><b>${Math.round((d.value / total) * 100)}%</b>${amounts ? `<small>${format(d.value)}</small>` : ""}</li>`)
    .join("");
  return `<div class="ad-donut">
    <svg viewBox="0 0 200 200" role="img" aria-label="Ventas por categoría">
      <circle cx="100" cy="100" r="${R}" fill="none" stroke="#181c3a" stroke-width="26"/>${arcs}
      <text x="100" y="98" text-anchor="middle" fill="#f3f3f8" font-size="14" font-weight="700">${center(total)}</text>
      <text x="100" y="116" text-anchor="middle" fill="#8e93b8" font-size="11">Total</text>
    </svg>
    <ul>${legend}</ul>
  </div>`;
}

export function hbars(items) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return `<div class="ad-hbars">${items
    .map(
      (i) => `<div class="ad-hbar">
        <div class="ad-hbar-top"><span>${i.label}</span><b>${i.text}</b></div>
        <div class="ad-hbar-track"><div style="width:${Math.max(3, (i.value / max) * 100)}%;background:${i.color || "#7c3aed"}"></div></div>
      </div>`
    )
    .join("")}</div>`;
}
