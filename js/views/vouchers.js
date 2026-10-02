/** Vouchers page: auto-generated codes, discount rules, status handling. */
const vf = (c) => D.vch.find((v) => v.code == c.trim().toUpperCase());
function vst(v) {
  return !v.on
    ? "Disabled"
    : v.exp && v.exp < today()
      ? "Expired"
      : v.lim && v.used >= v.lim
        ? "Used up"
        : "Active";
}
const vlab = (v) => (v.type == "pct" ? v.val + "% off" : P(v.val) + " off");
function genCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let x;
  do {
    x = "MS-" + Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join("");
  } while (D.vch.some((v) => v.code == x));
  return x;
}
function openV() {
  ["v_nm", "v_ds", "v_val", "v_ex", "v_lm"].forEach((i) => ($(i).value = ""));
  $("v_ty").value = "pct";
  $("v_code").value = genCode();
  $("vm").classList.add("on");
}
function saveV() {
  const n = $("v_nm").value.trim(),
    val = parseFloat($("v_val").value),
    ty = $("v_ty").value;
  if (!n) return alert("Enter a voucher name.");
  if (!(val > 0)) return alert("Enter how much off.");
  if (ty == "pct" && val > 100) return alert("Percent cannot be more than 100.");
  let code = $("v_code").value;
  if (D.vch.some((v) => v.code == code)) code = genCode();
  D.vch.push({
    id: Date.now(),
    d: new Date().toISOString(),
    code,
    name: n,
    desc: $("v_ds").value.trim(),
    type: ty,
    val,
    exp: $("v_ex").value,
    lim: parseInt($("v_lm").value) || 0,
    used: 0,
    on: true,
  });
  persist();
  $("vm").classList.remove("on");
  render();
}
function vTog(id) {
  const v = D.vch.find((x) => x.id == id);
  v.on = !v.on;
  persist();
  render();
}
function vDel(id) {
  if (confirm("Delete this voucher? Past sales keep their record.")) {
    D.vch = D.vch.filter((x) => x.id != id);
    persist();
    render();
  }
}
function vCopy(c) {
  try {
    navigator.clipboard.writeText(c).then(
      () => alert("Copied: " + c),
      () => prompt("Copy this code:", c),
    );
  } catch (e) {
    prompt("Copy this code:", c);
  }
}
function renderV() {
  const a = D.vch.filter((v) => vst(v) == "Active").length,
    dg = D.sales.reduce((t, x) => t + (x.disc || 0), 0),
    us = D.vch.reduce((t, v) => t + v.used, 0);
  $("vkpi").innerHTML = [
    ["Active Vouchers", a, "Ready to use"],
    ["Total Vouchers", D.vch.length, "Created"],
    ["Times Redeemed", us, "All vouchers"],
    ["Discounts Given", P(dg), "Total value"],
  ]
    .map((x) => `<div class="card kpi"><span>${x[0]}</span><b>${x[1]}</b><small>${x[2]}</small></div>`)
    .join("");
  const cl = { Active: "t-ok", Disabled: "t-low", Expired: "t-out", "Used up": "t-out" };
  $("vt").innerHTML =
    "<tr><th>Code</th><th>Name / Description</th><th>Discount</th><th>Valid until</th><th>Used</th><th>Status</th><th></th></tr>" +
    ([...D.vch]
      .reverse()
      .map((v) => {
        const st = vst(v);
        return `<tr><td><span class="code">${esc(v.code)}</span></td><td><b>${esc(v.name)}</b><div class="sub">${esc(v.desc)}</div></td><td><b>${vlab(v)}</b></td><td>${v.exp ? esc(v.exp) : "No expiry"}</td><td>${v.used}${v.lim ? " / " + v.lim : ""}</td><td><span class="tag ${cl[st]}">${st}</span></td><td style="white-space:nowrap"><button class="btn sm p" onclick="openVP(${v.id})">Print</button> <button class="btn sm" onclick="vCopy('${v.code}')">Copy</button> <button class="btn sm" onclick="vTog(${v.id})">${v.on ? "Disable" : "Enable"}</button> <button class="btn sm" onclick="vDel(${v.id})">Delete</button></td></tr>`;
      })
      .join("") ||
      '<tr><td colspan=7 class="empty">No vouchers yet. Click New Voucher to create one.</td></tr>');
}
