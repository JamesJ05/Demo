/** All Inventory page: filters, sorting, list and photo views. */
function renderInventory() {
  const { sd, ps, low, out } = stats();
  // inventory filters
  fill($("cf"), [...new Set(ps.map((p) => p.cat))].sort(), "All categories");
  fill($("bf"), [...new Set(ps.map((p) => p.brand))].sort(), "All brands");
  $("cats").innerHTML = [...new Set(ps.map((p) => p.cat))].map((c) => `<option value="${esc(c)}">`).join("");
  $("brs").innerHTML = [...new Set(ps.map((p) => p.brand))].map((c) => `<option value="${esc(c)}">`).join("");
  const cn = { "": ps.length, "In Stock": ps.length - low - out, "Low Stock": low, "Out of Stock": out };
  $("chips").innerHTML = Object.keys(cn)
    .map(
      (s) =>
        `<button class="chip ${sf == s ? "on" : ""}" onclick="sf='${s}';render()">${s || "All"} (${cn[s]})</button>`,
    )
    .join("");
  const q = $("q").value.toLowerCase(),
    so = $("so").value;
  let l = ps.filter(
    (p) =>
      (!q || (p.name + p.brand + p.sku + p.bikes + p.cat).toLowerCase().includes(q)) &&
      (!$("cf").value || p.cat == $("cf").value) &&
      (!$("bf").value || p.brand == $("bf").value) &&
      (!sf || st(p) == sf),
  );
  l.sort(
    {
      name: (a, b) => a.name.localeCompare(b.name),
      qtyA: (a, b) => a.qty - b.qty,
      qtyD: (a, b) => b.qty - a.qty,
      priceA: (a, b) => a.price - b.price,
      priceD: (a, b) => b.price - a.price,
      profit: (a, b) => b.price - b.cost - (a.price - a.cost),
      sold: (a, b) => sd(b).q - sd(a).q,
      tprofit: (a, b) => sd(b).p - sd(a).p,
    }[so],
  );
  $("cnt").textContent = `Showing ${l.length} of ${ps.length} parts`;
  $("v-t").classList.toggle("on", view == "t");
  $("v-c").classList.toggle("on", view == "c");
  $("tbw").style.display = view == "t" ? "" : "none";
  $("cds").style.display = view == "c" ? "" : "none";
  const acts = (p) =>
    `<button class="btn sm p" onclick="sell(${p.id})">Sell</button> ${p.qty <= 0 ? `<button class="btn sm" onclick="openP(${p.id})">Pre-order</button> ` : ""}<button class="btn sm" onclick="openM(${p.id})">Edit</button> <button class="btn sm" onclick="del(${p.id})">Delete</button>`;
  $("tb").innerHTML =
    "<tr><th></th><th>Part</th><th>SKU</th><th>Category</th><th>Cost</th><th>Price</th><th>Profit/pc</th><th>Qty</th><th>Sold</th><th>Total Profit</th><th>Status</th><th></th></tr>" +
    (l
      .map(
        (p) =>
          `<tr><td>${thumb(p)}</td><td><b>${esc(p.name)}</b><div class="sub">${esc(p.brand)} · ${esc(p.bikes)}</div></td><td>${esc(p.sku)}</td><td>${esc(p.cat)}</td><td>${P(p.cost)}</td><td>${P(p.price)}</td><td>${P(p.price - p.cost)}</td><td><b>${p.qty}</b></td><td>${sd(p).q}</td><td>${P(sd(p).p)}</td><td>${tg(p)}</td><td style="white-space:nowrap">${acts(p)}</td></tr>`,
      )
      .join("") || '<tr><td colspan=12 class="empty">No parts match these filters.</td></tr>');
  $("cds").innerHTML =
    l
      .map(
        (p) =>
          `<div class="pc"><div class="im">${ini(p)}${src(p) ? `<img src="${esc(src(p))}" alt="" onerror="this.remove()">` : ""}</div><div class="b"><h4>${esc(p.name)}</h4><p>${esc(p.brand)} · ${esc(p.cat)}</p><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>${P(p.price)}</b>${tg(p)}</div><p>${p.qty} in stock · ${sd(p).q} sold<br>Profit earned: <b>${P(sd(p).p)}</b></p><div class="row">${acts(p)}</div></div></div>`,
      )
      .join("") || '<div class="empty">No parts match these filters.</div>';
}
