/** Demo data used the first time the app opens. */
function seed() {
  const p = [
    ["Brake Pad Front", "RCB", "BP-101", "Brakes", "Mio, Click", 180, 320, 14, 5],
    ["Handle Grip Racing", "RCB", "HG-220", "Accessories", "Universal", 120, 250, 3, 5],
    ["Engine Oil 10W-40 1L", "Motul", "EO-310", "Oil & Fluids", "All", 260, 380, 22, 8],
    ["Spark Plug", "NGK", "SP-045", "Engine", "Sniper, Raider", 90, 160, 0, 6],
    ["CVT Drive Belt", "RCB", "CV-512", "Transmission", "NMAX, Aerox", 450, 780, 4, 4],
    ["Rear Shock", "RCB", "RS-880", "Suspension", "Mio, Fino", 1100, 1850, 2, 3],
    ["LED Headlight Bulb", "Osram", "LH-900", "Electrical", "Universal", 350, 600, 9, 4],
    ["Chain & Sprocket Set", "DID", "CS-640", "Transmission", "XRM, TMX", 780, 1300, 0, 3],
  ];
  D = {
    parts: p.map((a, i) => ({
      id: i + 1,
      name: a[0],
      brand: a[1],
      sku: a[2],
      cat: a[3],
      bikes: a[4],
      cost: a[5],
      price: a[6],
      qty: a[7],
      low: a[8],
      note: "",
      img: "",
      imgUrl: "",
    })),
    sales: [],
    ins: [],
    pre: [],
    vch: [],
  };
  D.parts.forEach((x, i) => {
    const q = (i % 4) + 2;
    D.sales.push({
      d: new Date(Date.now() - i * 864e5).toISOString(),
      id: x.id,
      name: x.name,
      cat: x.cat,
      q,
      rev: x.price * q,
      profit: (x.price - x.cost) * q,
    });
  });
}
