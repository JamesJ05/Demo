/** Numbers shared by the dashboard, inventory, stock and sales views. */
function stats() {
  const sm = {};
  D.sales.forEach((x) => {
    const o = sm[x.id] || (sm[x.id] = { q: 0, p: 0, r: 0 });
    o.q += x.q;
    o.p += x.profit;
    o.r += x.rev;
  });
  const sd = (p) => sm[p.id] || { q: 0, p: 0, r: 0 };
  const ps = D.parts,
    low = ps.filter((p) => p.qty > 0 && p.qty <= p.low).length,
    out = ps.filter((p) => p.qty <= 0).length;
  const real = D.sales.reduce((a, s) => a + s.profit, 0),
    rev = D.sales.reduce((a, s) => a + s.rev, 0),
    val = ps.reduce((a, p) => a + p.cost * p.qty, 0),
    pot = ps.reduce((a, p) => a + (p.price - p.cost) * p.qty, 0);
  const need = ps.filter((p) => p.qty <= p.low).sort((a, b) => a.qty - b.qty);
  return { sm, sd, ps, low, out, real, rev, val, pot, need };
}
