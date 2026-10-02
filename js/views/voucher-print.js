/** Printable voucher with logo and a Code 39 barcode. */
const LOGO = (document.querySelector(".brand img") || {}).src || "";
let vpId = null;
function vpCard(v) {
  const off = v.type == "pct" ? v.val + "%" : P(v.val),
    ex = v.exp ? new Date(v.exp + "T12:00:00").toLocaleDateString([], { dateStyle: "long" }) : "No expiry";
  return `<div class="vpw"><div class="vp"><div class="vp-main"><div class="vp-head"><img src="${LOGO}" alt="Motor Shop"><span class="vp-tag">Discount Voucher</span></div><div class="vp-off"><span class="vp-n">${esc(off)}</span><span class="vp-o">OFF</span></div><div class="vp-t1">${esc(v.name)}</div><div class="vp-t2">${esc(v.desc)}</div><div class="vp-f"><div><small>Valid until</small><b>${esc(ex)}</b></div>${v.lim ? `<div><small>Usage limit</small><b>${v.lim} use${v.lim > 1 ? "s" : ""}</b></div>` : ""}<div class="vp-fine">Present this voucher at the counter before payment. Not exchangeable for cash.</div></div><div class="chk"></div></div><div class="vp-stub"><small>Voucher code</small><div class="vp-code">${esc(v.code)}</div>${barcode(v.code)}<small>Redeem at the counter</small></div></div></div>`;
}
function openVP(id) {
  vpId = id;
  $("vp_n").value = "1";
  drawVP();
  $("vprint").classList.add("on");
}
function drawVP() {
  const v = D.vch.find((x) => x.id == vpId);
  $("vpArea").innerHTML = Array(parseInt($("vp_n").value))
    .fill(vpCard(v))
    .join("");
}
function doPrint() {
  try {
    window.print();
  } catch (e) {
    alert("Printing is blocked here. Press Ctrl+P (or Cmd+P) instead.");
  }
}
const C39 = {
  0: "nnnwwnwnn",
  1: "wnnwnnnnw",
  2: "nnwwnnnnw",
  3: "wnwwnnnnn",
  4: "nnnwwnnnw",
  5: "wnnwwnnnn",
  6: "nnwwwnnnn",
  7: "nnnwnnwnw",
  8: "wnnwnnwnn",
  9: "nnwwnnwnn",
  A: "wnnnnwnnw",
  B: "nnwnnwnnw",
  C: "wnwnnwnnn",
  D: "nnnnwwnnw",
  E: "wnnnwwnnn",
  F: "nnwnwwnnn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnnwwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnnwnnww",
  O: "wnnnwnnwn",
  P: "nnwnwnnwn",
  Q: "nnnnnnwww",
  R: "wnnnnnwwn",
  S: "nnwnnnwwn",
  T: "nnnnwnwwn",
  U: "wwnnnnnnw",
  V: "nwwnnnnnw",
  W: "wwwnnnnnn",
  X: "nwnnwnnnw",
  Y: "wwnnwnnnn",
  Z: "nwwnwnnnn",
  "-": "nwnnnnwnw",
  "*": "nwnnwnwnn",
};
function barcode(t) {
  let x = 0,
    r = "";
  for (const ch of "*" + t + "*") {
    const p = C39[ch];
    if (!p) continue;
    for (let i = 0; i < 9; i++) {
      const w = p[i] == "w" ? 3 : 1;
      if (i % 2 == 0) r += `<rect x="${x}" y="0" width="${w}" height="46" fill="#111"/>`;
      x += w;
    }
    x += 1;
  }
  return `<svg viewBox="-10 -5 ${x + 20} 56" width="180" height="52" preserveAspectRatio="none" style="display:block;margin:10px auto;border-radius:4px"><rect x="-10" y="-5" width="${x + 20}" height="56" fill="#fff"/>${r}</svg>`;
}
