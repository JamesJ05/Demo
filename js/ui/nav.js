/** Page navigation, list view toggle, filters and theme. */
function setView(v) {
  view = v;
  try {
    localStorage.setItem("mp_view", v);
  } catch (e) {}
  render();
}
function go(t) {
  tab = t;
  ["dash", "inv", "stock", "pre", "vch", "sales"].forEach((x) => ($(x).style.display = x == t ? "" : "none"));
  document.querySelectorAll("aside a[data-t]").forEach((a) => a.classList.toggle("on", a.dataset.t == t));
  const m = {
    dash: ["Dashboard", "Quick view of your store"],
    inv: ["All Inventory", "Search and filter every part"],
    stock: ["Stock Area", "Receive deliveries and restock"],
    pre: ["Pre-Orders", "Customer orders for parts not yet in stock"],
    vch: ["Vouchers", "Create and manage discount codes"],
    sales: ["Sales", "Every sale recorded"],
  }[t];
  $("ttl").textContent = m[0];
  $("sub").textContent = m[1];
  $("addbtn").style.display = t == "inv" ? "" : "none";
  $("prebtn").style.display = t == "pre" ? "" : "none";
  $("vbtn").style.display = t == "vch" ? "" : "none";
  window.scrollTo(0, 0);
}
function clearF() {
  $("q").value = "";
  $("cf").value = "";
  $("bf").value = "";
  $("so").value = "name";
  sf = "";
  render();
}
function fill(sel, arr, all) {
  const v = sel.value;
  sel.innerHTML =
    (all ? `<option value="">${all}</option>` : "") + arr.map((c) => `<option>${esc(c)}</option>`).join("");
  sel.value = arr.includes(v) || v == "" ? v : "";
}
function toggleTheme() {
  const r = document.documentElement;
  r.dataset.theme = r.dataset.theme == "dark" ? "light" : "dark";
}
