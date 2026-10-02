/** Small shared helpers (DOM lookup, formatting, escaping). */
const $ = (id) => document.getElementById(id);
const P = (v) => "₱" + Math.round(v).toLocaleString();
const esc = (s) =>
  String(s == null ? "" : s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
const fd = (d) => new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
const today = () => new Date().toISOString().slice(0, 10);
const ini = (p) =>
  String(p.name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
const src = (p) => p.img || p.imgUrl || "";
