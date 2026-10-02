/** Add / edit / delete parts, including photo upload or image link. */
function del(id) {
  if (confirm("Delete this part?")) {
    D.parts = D.parts.filter((x) => x.id != id);
    persist();
    render();
  }
}
function openM(id) {
  cur = id || null;
  const p = id
    ? D.parts.find((x) => x.id == id)
    : {
        name: "",
        brand: "RCB",
        sku: "",
        cat: "",
        bikes: "",
        cost: "",
        price: "",
        qty: "",
        low: 5,
        note: "",
        img: "",
        imgUrl: "",
      };
  img = p.img;
  $("mt").textContent = id ? "Edit Part" : "Add New Part";
  const m = {
    n: "name",
    b: "brand",
    s: "sku",
    c: "cat",
    cb: "bikes",
    cp: "cost",
    sp: "price",
    qt: "qty",
    lw: "low",
    nt: "note",
    iu: "imgUrl",
  };
  for (const k in m) $(k).value = p[m[k]] == null ? "" : p[m[k]];
  pv();
  $("m").classList.add("on");
}
function closeM() {
  $("m").classList.remove("on");
}
function pv() {
  const u = img || $("iu").value.trim();
  $("pv").outerHTML = u
    ? `<div class="pv" id="pv"><img src="${esc(u)}" alt="" style="max-width:100%;max-height:100%" onerror="this.parentNode.textContent='This link cannot be loaded here'"></div>`
    : `<div class="pv" id="pv">Click to upload or take a photo</div>`;
}
function clearImg() {
  img = "";
  $("iu").value = "";
  pv();
}
function pick(inp) {
  const f = inp.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = (e) => {
    const i = new Image();
    i.onload = () => {
      const s = Math.min(1, 360 / Math.max(i.width, i.height)),
        c = document.createElement("canvas");
      c.width = i.width * s;
      c.height = i.height * s;
      c.getContext("2d").drawImage(i, 0, 0, c.width, c.height);
      img = c.toDataURL("image/jpeg", 0.7);
      $("iu").value = "";
      pv();
    };
    i.src = e.target.result;
  };
  r.readAsDataURL(f);
  inp.value = "";
}
function save() {
  const g = (id) => $(id).value.trim();
  if (!g("n")) return alert("Part name is required");
  const o = {
    name: g("n"),
    brand: g("b"),
    sku: g("s"),
    cat: g("c") || "General",
    bikes: g("cb"),
    cost: +g("cp") || 0,
    price: +g("sp") || 0,
    qty: +g("qt") || 0,
    low: +g("lw") || 0,
    note: g("nt"),
    img,
    imgUrl: g("iu"),
  };
  if (cur)
    Object.assign(
      D.parts.find((x) => x.id == cur),
      o,
    );
  else D.parts.push({ id: Date.now(), ...o });
  persist();
  closeM();
  render();
}
