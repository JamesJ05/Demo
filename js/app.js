/** Entry point: runs last, after every other script has loaded. */
function render() {
  renderDashboard();
  renderInventory();
  renderStock();
  renderPre();
  renderV();
  renderSales();
}

async function startApp() {
  try {
    initFirebase();
    if (FIREBASE_ENABLED) {
      $("lg_user_label").textContent = "Email";
      $("lg_u").type = "email";
      $("lg_u").autocomplete = "username";
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          document.body.classList.add("locked");
          return;
        }
        try {
          await load();
          document.body.classList.remove("locked");
          go("dash");
          render();
        } catch (e) {
          console.error("Could not load store data", e);
          document.body.classList.add("locked");
          $("lg_m").textContent = "Could not load Firebase data. Check Firestore setup and rules.";
        }
      });
      return;
    }
    await load();
    go("dash");
    render();
    try {
      if (sessionStorage.getItem("mp_auth") == "1") document.body.classList.remove("locked");
    } catch (e) {}
  } catch (e) {
    console.error("App startup failed", e);
    $("lg_m").textContent = e.message || "Could not start the app.";
  }
}

startApp();
