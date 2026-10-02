/** Admin sign in / sign out (client-side, see README for limits). */
async function sha(t) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(b))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
let fails = 0,
  lockUntil = 0;
async function doLogin() {
  if (FIREBASE_ENABLED) {
    try {
      await firebase.auth().signInWithEmailAndPassword($("lg_u").value.trim(), $("lg_p").value);
      $("lg_p").value = "";
      $("lg_m").textContent = "";
    } catch (e) {
      $("lg_p").value = "";
      $("lg_m").textContent = e.code === "auth/invalid-credential" || e.code === "auth/wrong-password" || e.code === "auth/user-not-found"
        ? "Incorrect email or password."
        : "Sign-in failed: " + (e.message || "check your Firebase setup.");
    }
    return;
  }
  const now = Date.now();
  if (now < lockUntil) {
    $("lg_m").textContent =
      "Too many attempts. Try again in " + Math.ceil((lockUntil - now) / 1000) + " seconds.";
    return;
  }
  const u = $("lg_u").value.trim().toLowerCase(),
    p = $("lg_p").value;
  let h = "";
  try {
    h = await sha("motorshop|" + u + "|" + p);
  } catch (e) {
    $("lg_m").textContent = "Sign-in is not supported in this browser.";
    return;
  }
  if (h === AUTH) {
    fails = 0;
    try {
      sessionStorage.setItem("mp_auth", "1");
    } catch (e) {}
    $("lg_p").value = "";
    $("lg_m").textContent = "";
    document.body.classList.remove("locked");
    go("dash");
    render();
  } else {
    $("lg_p").value = "";
    fails++;
    if (fails >= 5) {
      lockUntil = Date.now() + 30000;
      fails = 0;
      $("lg_m").textContent = "Too many attempts. Locked for 30 seconds.";
    } else $("lg_m").textContent = "Incorrect username or password.";
  }
}
function logout() {
  if (FIREBASE_ENABLED) {
    firebase.auth().signOut().catch((e) => { $("lg_m").textContent = e.message; });
    return;
  }
  try {
    sessionStorage.removeItem("mp_auth");
  } catch (e) {}
  document.body.classList.add("locked");
  $("lg_u").value = "";
  $("lg_p").value = "";
  $("lg_m").textContent = "";
}
