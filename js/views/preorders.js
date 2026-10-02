/** Pre-Orders page: customer orders, deposits and pickup flow. */
function renderPre() {
  const a = D.pre.filter((x) => x.status == "Pending" || x.status == "Arrived"),
    tt = (x) => x.price * x.q;
  const k = (l, b, c) => `<div class="card kpi"><span>${l}</span><b>${b}</b><small>${c}</small></div>`;
  $("pkpi").innerHTML =
    k("Open Pre-orders", a.length, "Waiting or ready") +
    k("Ready for Pickup", D.pre.filter((x) => x.status == "Arrived").length, "Call the customer") +
    k("Deposits Held", P(a.reduce((s, x) => s + x.dep, 0)), "From open orders") +
    k("Balance to Collect", P(a.reduce((s, x) => s + tt(x) - x.dep, 0)), "On pickup");
  const sts = ["", "Pending", "Arrived", "Completed", "Cancelled"];
  $("pchips").innerHTML = sts
    .map(
      (s) =>
        `<button class="chip ${pf == s ? "on" : ""}" onclick="pf='${s}';render()">${s || "All"} (${s ? D.pre.filter((x) => x.status == s).length : D.pre.length})</button>`,
    )
    .join("");
  const cls = { Pending: "t-low", Arrived: "t-acc", Completed: "t-ok", Cancelled: "t-out" };
  const l = D.pre.filter((x) => !pf || x.status == pf).sort((x, y) => y.d.localeCompare(x.d));
  const cx = (x) => `<button class="btn sm" onclick="pSt(${x.id},'Cancelled')">Cancel</button>`;
  $("pt").innerHTML =
    "<tr><th>Ordered</th><th>Customer</th><th>Part</th><th>Qty</th><th>Total</th><th>Deposit</th><th>Balance</th><th>Status</th><th></th></tr>" +
    (l
      .map(
        (x) =>
          `<tr><td>${fd(x.d)}<div class="sub">${x.dt ? "Expected " + esc(x.dt) : "No date set"}</div></td><td><b>${esc(x.cn)}</b><div class="sub">${esc(x.ct)}</div></td><td><b>${esc(x.name)}</b><div class="sub">${esc(x.note)}</div></td><td>${x.q}</td><td>${P(tt(x))}</td><td>${P(x.dep)}</td><td><b>${x.status == "Completed" || x.status == "Cancelled" ? "—" : P(tt(x) - x.dep)}</b></td><td><span class="tag ${cls[x.status]}">${x.status}</span>${x.status == "Pending" && x.dt && x.dt < today() ? '<div class="sub" style="color:var(--out)">Overdue</div>' : ""}</td><td style="white-space:nowrap">${x.status == "Pending" ? `<button class="btn sm p" onclick="pSt(${x.id},'Arrived')">Mark Arrived</button> ${cx(x)}` : x.status == "Arrived" ? `<button class="btn sm ok" onclick="pSt(${x.id},'Completed')">Pickup &amp; Pay</button> ${cx(x)}` : `<button class="btn sm" onclick="pDel(${x.id})">Delete</button>`}</td></tr>`,
      )
      .join("") || '<tr><td colspan=9 class="empty">No pre-orders here yet.</td></tr>');
}
function openP(pid) {
  $("p_pt").innerHTML =
    '<option value="">— Custom part (not in list) —</option>' +
    [...D.parts]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => `<option value="${p.id}">${esc(p.name)} — ${esc(p.brand)}</option>`)
      .join("");
  ["p_cn", "p_ct", "p_dt", "p_nm", "p_pr", "p_dp", "p_cs", "p_nt"].forEach((i) => ($(i).value = ""));
  $("p_q").value = 1;
  $("p_pt").value = pid || "";
  if (pid) pfill();
  $("pm").classList.add("on");
}
function pfill() {
  const p = D.parts.find((x) => x.id == $("p_pt").value);
  if (p) {
    $("p_nm").value = p.name + " (" + p.brand + ")";
    $("p_pr").value = p.price;
    $("p_cs").value = p.cost;
  }
}
function closeP() {
  $("pm").classList.remove("on");
}
function saveP() {
  const g = (i) => $(i).value.trim(),
    q = parseInt($("p_q").value),
    pr = parseFloat($("p_pr").value);
  if (!g("p_cn")) return alert("Customer name is required");
  if (!g("p_nm")) return alert("Part name is required");
  if (!q || q < 1) return alert("Enter the quantity");
  if (!(pr >= 0)) return alert("Enter the price");
  const dep = parseFloat($("p_dp").value) || 0;
  if (dep > pr * q) return alert("Deposit is more than the total.");
  const p = D.parts.find((x) => x.id == $("p_pt").value),
    cs = $("p_cs").value;
  D.pre.push({
    id: Date.now(),
    d: new Date().toISOString(),
    cn: g("p_cn"),
    ct: g("p_ct"),
    dt: $("p_dt").value,
    pid: p ? p.id : 0,
    cat: p ? p.cat : "Pre-order",
    name: g("p_nm"),
    q,
    price: pr,
    cost: cs === "" ? null : parseFloat(cs),
    dep,
    note: g("p_nt"),
    status: "Pending",
  });
  persist();
  closeP();
  pf = "";
  render();
  go("pre");
}
function pSt(id, s) {
  const x = D.pre.find((y) => y.id == id),
    t = x.price * x.q;
  if (s == "Completed") {
    if (!confirm(`Collect balance of ${P(t - x.dep)} from ${x.cn} and complete this order?`)) return;
    D.sales.push({
      d: new Date().toISOString(),
      id: x.pid || 0,
      name: x.name + " (pre-order)",
      cat: x.cat || "Pre-order",
      q: x.q,
      rev: t,
      profit: x.cost == null ? 0 : (x.price - x.cost) * x.q,
    });
  }
  if (
    s == "Cancelled" &&
    !confirm(
      x.dep
        ? `Cancel this order? Deposit of ${P(x.dep)} must be returned or handled per your store policy.`
        : "Cancel this pre-order?",
    )
  )
    return;
  x.status = s;
  persist();
  render();
}
function pDel(id) {
  if (confirm("Delete this record?")) {
    D.pre = D.pre.filter((x) => x.id != id);
    persist();
    render();
  }
}
