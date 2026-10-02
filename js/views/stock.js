/** Stock Area page: restock queue, receive stock form, delivery history. */
function renderStock() {
  const { ps, out, need } = stats();
  $("rs").innerHTML =
    "<tr><th>Part</th><th>On hand</th><th>Alert at</th><th>Status</th><th>Suggested</th><th></th></tr>" +
    (need
      .map(
        (p) =>
          `<tr><td><div class="row" style="flex-wrap:nowrap">${thumb(p)}<div><b>${esc(p.name)}</b><div class="sub">${esc(p.brand)} · ${esc(p.sku)}</div></div></div></td><td><b>${p.qty}</b></td><td>${p.low}</td><td>${tg(p)}</td><td>${sug(p)} pcs</td><td><button class="btn sm p" onclick="prefill(${p.id})">Receive</button></td></tr>`,
      )
      .join("") || '<tr><td colspan=6 class="empty">All parts are above their alert level.</td></tr>');
  // stock area
  const sv = $("si_p").value;
  $("si_p").innerHTML = [...ps]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => `<option value="${p.id}">${esc(p.name)} — ${esc(p.brand)} (${p.qty} now)</option>`)
    .join("");
  if (sv) $("si_p").value = sv;
  if (!$("si_d").value) $("si_d").value = today();
  siInfo();
  const d30 = Date.now() - 30 * 864e5;
  $("skp").innerHTML = [
    ["Needs Restock", need.length, "At or below alert level"],
    ["Out of Stock", out, "Zero quantity"],
    ["Units Received", D.ins.filter((x) => new Date(x.d) > d30).reduce((a, x) => a + x.q, 0), "Last 30 days"],
    ["Deliveries Logged", D.ins.length, "All time"],
  ]
    .map((a) => `<div class="card kpi"><span>${a[0]}</span><b>${a[1]}</b><small>${a[2]}</small></div>`)
    .join("");
  $("sups").innerHTML = [...new Set(D.ins.map((x) => x.sup).filter(Boolean))]
    .map((x) => `<option value="${esc(x)}">`)
    .join("");
  $("hcount").textContent = D.ins.length
    ? `Latest ${Math.min(D.ins.length, 100)} of ${D.ins.length} records`
    : "";
  $("hs").innerHTML =
    "<tr><th>Date</th><th>Part</th><th>Qty in</th><th>Stock after</th><th>Supplier</th><th>Reference</th></tr>" +
    ([...D.ins]
      .reverse()
      .slice(0, 100)
      .map(
        (x) =>
          `<tr><td>${new Date(x.d).toLocaleDateString([], { dateStyle: "medium" })}</td><td><b>${esc(x.name)}</b></td><td>+${x.q}</td><td>${x.after == null ? "—" : x.after}</td><td>${esc(x.sup) || "—"}</td><td>${esc(x.note) || "—"}</td></tr>`,
      )
      .join("") || '<tr><td colspan=6 class="empty">No deliveries recorded yet.</td></tr>');
}
const sug = (p) => Math.max(p.low * 2 - p.qty, 1);
function prefill(id) {
  const p = D.parts.find((x) => x.id == id);
  $("si_p").value = id;
  $("si_q").value = sug(p);
  siInfo();
  $("si_q").focus();
  $("si_q").scrollIntoView({ block: "center" });
}
function siInfo() {
  const p = D.parts.find((x) => x.id == $("si_p").value);
  if (!p) {
    $("si_info").innerHTML = "";
    return;
  }
  const n = parseInt($("si_q").value) || 0;
  $("si_info").innerHTML =
    `<div class="info">${thumb(p)}<div class="n"><b>${esc(p.name)}</b><div class="sub">${esc(p.brand)} · ${esc(p.sku)} · Cost ${P(p.cost)}</div></div><div class="v"><div class="sub">On hand</div><b>${p.qty}</b></div><div class="v"><div class="sub">After</div><b>${p.qty + n}</b></div></div>`;
}
function stockIn() {
  const p = D.parts.find((x) => x.id == $("si_p").value),
    n = parseInt($("si_q").value);
  if (!p) return alert("Select a part.");
  if (!n || n < 1) return alert("Enter the quantity received.");
  const b = p.qty;
  p.qty += n;
  const cs = $("si_c").value;
  if (cs !== "" && parseFloat(cs) >= 0) p.cost = parseFloat(cs);
  const dv = $("si_d").value;
  D.ins.push({
    d: dv ? new Date(dv + "T12:00:00").toISOString() : new Date().toISOString(),
    id: p.id,
    name: p.name,
    q: n,
    sup: $("si_s").value.trim(),
    note: $("si_n").value.trim(),
    before: b,
    after: p.qty,
  });
  ["si_q", "si_c", "si_n"].forEach((i) => ($(i).value = ""));
  persist();
  render();
}
