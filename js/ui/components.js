/** Reusable HTML snippets: status label, status tag, part thumbnail, KPI card. */
const st = (p) => (p.qty <= 0 ? "Out of Stock" : p.qty <= p.low ? "Low Stock" : "In Stock");
const tg = (p) => {
  const s = st(p);
  return `<span class="tag ${s == "In Stock" ? "t-ok" : s == "Low Stock" ? "t-low" : "t-out"}">${s}</span>`;
};
const thumb = (p) =>
  `<div class="ph">${ini(p)}${src(p) ? `<img src="${esc(src(p))}" alt="" onerror="this.remove()">` : ""}</div>`;
const k = (a, b, c, x) =>
  `<div class="card kpi ${x || ""}"><span>${a}</span><b>${b}</b><small>${c}</small></div>`;
