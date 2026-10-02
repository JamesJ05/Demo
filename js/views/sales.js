/** Sales page (log + totals) and the Sell dialog with voucher support. */
function renderSales() {
  const { rev, real } = stats();
  const td = D.sales.filter((s) => new Date(s.d).toDateString() == new Date().toDateString());
  $("skpi").innerHTML =
    k("Sales Today", P(td.reduce((a, s) => a + s.rev, 0)), td.length + " transactions") +
    k("Total Sales", P(rev), D.sales.length + " transactions") +
    k("Profit Today", P(td.reduce((a, s) => a + s.profit, 0)), "", "adm") +
    k("Total Profit", P(real), "", "adm");
  $("sl").innerHTML =
    "<tr><th>Date</th><th>Part</th><th>Qty</th><th>Voucher</th><th>Sales</th><th>Profit</th></tr>" +
    [...D.sales]
      .reverse()
      .map(
        (s) =>
          `<tr><td>${fd(s.d)}</td><td>${esc(s.name)}</td><td>${s.q}</td><td>${s.vc ? `<span class="code" style="padding:2px 7px;font-size:11px">${esc(s.vc)}</span> -${P(s.disc)}` : "—"}</td><td>${P(s.rev)}</td><td>${P(s.profit)}</td></tr>`,
      )
      .join("");
}
let sellId = null;
function sell(id) {
  const p = D.parts.find((x) => x.id == id);
  if (p.qty <= 0) return alert("Out of stock!");
  sellId = id;
  $("sl_info").innerHTML =
    `<div class="info">${thumb(p)}<div class="n"><b>${esc(p.name)}</b><div class="sub">${esc(p.brand)} · ${esc(p.sku)} · ${P(p.price)} each</div></div><div class="v"><div class="sub">In stock</div><b>${p.qty}</b></div></div>`;
  $("sl_q").value = 1;
  $("sl_v").value = "";
  slCalc();
  $("sm").classList.add("on");
}
function slCalc() {
  const p = D.parts.find((x) => x.id == sellId),
    q = parseInt($("sl_q").value) || 0,
    sub = p.price * q,
    c = $("sl_v").value.trim();
  let d = 0,
    m = "",
    v = null;
  if (c) {
    v = vf(c);
    if (!v) m = '<span class="tag t-out">Voucher code not found</span>';
    else {
      const st = vst(v);
      if (st != "Active") {
        m = `<span class="tag t-out">This voucher is ${st.toLowerCase()}</span>`;
        v = null;
      } else {
        d = v.type == "pct" ? Math.round(sub * v.val) / 100 : Math.min(v.val, sub);
        m = `<span class="tag t-ok">${esc(v.name)}: ${vlab(v)} applied</span>`;
      }
    }
  }
  $("sl_msg").innerHTML = m;
  $("sl_sum").innerHTML =
    `<div><span>Subtotal (${q} x ${P(p.price)})</span><span>${P(sub)}</span></div><div><span>Voucher discount</span><span>-${P(d)}</span></div><div class="t"><span>Total</span><span>${P(sub - d)}</span></div>`;
  return { p, q, sub, d, v };
}
function closeS() {
  $("sm").classList.remove("on");
}
function slDo() {
  const r = slCalc();
  if (!r.q || r.q < 1) return alert("Enter the quantity.");
  if (r.q > r.p.qty) return alert("Only " + r.p.qty + " in stock.");
  if ($("sl_v").value.trim() && !r.v) return alert("Fix or clear the voucher code first.");
  const tot = r.sub - r.d;
  r.p.qty -= r.q;
  if (r.v) r.v.used++;
  D.sales.push({
    d: new Date().toISOString(),
    id: r.p.id,
    name: r.p.name,
    cat: r.p.cat,
    q: r.q,
    rev: tot,
    profit: tot - r.p.cost * r.q,
    vc: r.v ? r.v.code : "",
    disc: r.d,
  });
  persist();
  closeS();
  render();
}
