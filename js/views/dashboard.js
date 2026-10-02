/** Dashboard: KPI cards, profit by category, stock level, top sellers, alerts. */
function renderDashboard() {
  const { sd, ps, low, out, real, rev, val, pot, need } = stats();
  $("kpis").innerHTML =
    k("Total Products", ps.length, "Kinds of parts") +
    k(
      "Units in Stock",
      ps.reduce((a, p) => a + p.qty, 0),
      "Available pieces",
    ) +
    k("Low Stock", low, "Restock soon") +
    k("Out of Stock", out, "Zero quantity") +
    k("Realized Profit", P(real), D.sales.reduce((a, x) => a + x.q, 0) + " units sold", "adm") +
    k(
      "Open Pre-orders",
      D.pre.filter((x) => x.status == "Pending" || x.status == "Arrived").length,
      "Waiting for parts",
    ) +
    k("Stock Value", P(val), "At cost", "adm") +
    k("Potential Profit", P(pot), "If all stock sold", "adm");
  const bc = {};
  D.sales.forEach((s) => (bc[s.cat] = (bc[s.cat] || 0) + s.profit));
  const en = Object.entries(bc).sort((a, b) => b[1] - a[1]),
    tot = en.reduce((a, e) => a + e[1], 0);
  let off = 0,
    C = 2 * Math.PI * 42,
    h = "";
  en.forEach((e, i) => {
    const l = (e[1] / (tot || 1)) * C;
    h += `<circle cx="60" cy="60" r="42" fill="none" stroke="${COL[i % 6]}" stroke-width="18" stroke-dasharray="${l} ${C - l}" stroke-dashoffset="${-off}" transform="rotate(-90 60 60)"/>`;
    off += l;
  });
  $("donut").innerHTML =
    h +
    `<text x="60" y="64" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">${P(tot)}</text>`;
  $("legend").innerHTML =
    en
      .map(
        (e, i) =>
          `<div><span><i style="background:${COL[i % 6]}"></i>${esc(e[0])}</span><b>${P(e[1])}</b></div>`,
      )
      .join("") || '<div class="empty">No sales yet</div>';
  const mx = Math.max(...ps.map((p) => p.qty), 1);
  $("stk").innerHTML = [...ps]
    .sort((a, b) => a.qty - b.qty)
    .slice(0, 6)
    .map(
      (p) =>
        `<div><small><span>${esc(p.name)}</span><b>${p.qty} pcs</b></small><div class="bar"><i style="width:${(p.qty / mx) * 100}%;${p.qty <= p.low ? "background:var(--out)" : ""}"></i></div></div>`,
    )
    .join("");
  $("top").innerHTML =
    "<tr><th>Part</th><th>Sold</th><th>Sales</th><th>Profit</th><th>Margin</th></tr>" +
    ([...ps]
      .filter((p) => sd(p).q > 0)
      .sort((a, b) => sd(b).q - sd(a).q)
      .slice(0, 5)
      .map((p) => {
        const o = sd(p);
        return `<tr><td><div class="row" style="flex-wrap:nowrap">${thumb(p)}<div><b>${esc(p.name)}</b><div class="sub">${esc(p.brand)}</div></div></div></td><td><b>${o.q}</b></td><td>${P(o.r)}</td><td>${P(o.p)}</td><td>${o.r ? Math.round((o.p / o.r) * 100) : 0}%</td></tr>`;
      })
      .join("") || '<tr><td colspan=5 class="empty">No sales recorded yet.</td></tr>');
  $("alerts").innerHTML =
    need
      .map(
        (p) =>
          `<div class="q">${thumb(p)}<div class="n"><b>${esc(p.name)}</b><div class="sub">${esc(p.brand)} · ${p.qty} left (alert at ${p.low})</div></div>${tg(p)}</div>`,
      )
      .join("") || '<div class="empty">Everything is well stocked</div>';
}
