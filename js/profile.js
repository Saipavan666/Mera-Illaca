/* ============================================================
   profile.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Run everything when the page is ready ───────────
   We use DOMContentLoaded instead of window.onload so it
   fires as soon as the HTML is built — faster and safer.
──────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {

  /* 1. Check if user is logged in — if not, go to login */
  var data = sessionStorage.getItem("loggedUser");
  if (!data) {
    window.location.href = "login.html";
    return;   /* stop running any more code */
  }

  /* 2. All good — run all setup functions */
  loadNavUser();
  startClock();
  loadProfile();
  loadNotifPrefs();
});

/* ── STEP 2: Show user name in the navbar ────────────────── */
function loadNavUser() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  var user = JSON.parse(data);
  var el   = document.getElementById("navUser");
  if (el) el.textContent = "👤 " + user.name + " (" + user.role + ")";
}

/* ── STEP 3: Load and display all profile info ───────────── */
function loadProfile() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  var user = JSON.parse(data);

  /* Get extra details saved during edit (phone, flat) */
  var extra = JSON.parse(localStorage.getItem("profileExtra") || "{}");

  /* Build initials from name  e.g. "Priya Sharma" → "PS" */
  var words    = user.name.trim().split(" ");
  var initials = words.map(function (w) { return w[0]; }).join("").toUpperCase().slice(0, 2);

  /* ── Hero card ── */
  document.getElementById("profileAvatar").textContent = initials;
  document.getElementById("profileName").textContent   = user.name;
  document.getElementById("profileRole").textContent   = "🏷️ " + user.role;
  document.getElementById("profileEmail").textContent  = "✉️ " + (extra.email || user.email);

  /* ── Personal Details card ── */
  document.getElementById("detailName").textContent  = user.name;
  document.getElementById("detailEmail").textContent = extra.email || user.email;
  document.getElementById("detailPhone").textContent = extra.phone || "Not added yet";
  document.getElementById("detailFlat").textContent  = extra.flat  || "Not added yet";
  document.getElementById("detailRole").textContent  = user.role;
}

/* ── STEP 4: Load saved notification toggle states ───────── */
function loadNotifPrefs() {
  var saved = JSON.parse(localStorage.getItem("notifPrefs") || "{}");

  if (saved.announcements !== undefined)
    document.getElementById("notifAnnounce").checked = saved.announcements;

  if (saved.events !== undefined)
    document.getElementById("notifEvents").checked = saved.events;

  if (saved.discussions !== undefined)
    document.getElementById("notifDiscuss").checked = saved.discussions;

  if (saved.emergency !== undefined)
    document.getElementById("notifEmergency").checked = saved.emergency;
}

/* ── STEP 5: Open "Edit Profile" modal ───────────────────── */
function openEditModal() {
  var data  = sessionStorage.getItem("loggedUser");
  var user  = data ? JSON.parse(data) : {};
  var extra = JSON.parse(localStorage.getItem("profileExtra") || "{}");

  /* Pre-fill the form with current values */
  document.getElementById("editName").value  = user.name   || "";
  document.getElementById("editEmail").value = extra.email || user.email || "";
  document.getElementById("editPhone").value = extra.phone || "";
  document.getElementById("editFlat").value  = extra.flat  || "";

  document.getElementById("editModal").classList.add("open");
}

/* ── STEP 6: Close edit modal ────────────────────────────── */
function closeEditModal() {
  document.getElementById("editModal").classList.remove("open");
}

/* Close modal when clicking the dark background */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("editModal");
  if (modal && e.target === modal) closeEditModal();
});

/* ── STEP 7: Save edited profile ─────────────────────────── */
function saveProfile() {
  var name  = document.getElementById("editName").value.trim();
  var email = document.getElementById("editEmail").value.trim();
  var phone = document.getElementById("editPhone").value.trim();
  var flat  = document.getElementById("editFlat").value.trim();

  if (!name) {
    showToast("⚠️ Name cannot be empty.");
    return;
  }

  /* Update name (and email if provided) in sessionStorage */
  var data = sessionStorage.getItem("loggedUser");
  if (data) {
    var user = JSON.parse(data);
    user.name = name;
    /* Only update email in session if user typed a new one */
    if (email) user.email = email;
    sessionStorage.setItem("loggedUser", JSON.stringify(user));
  }

  /* Save phone, flat, and custom email in localStorage */
  localStorage.setItem("profileExtra", JSON.stringify({
    email: email,
    phone: phone,
    flat:  flat
  }));

  closeEditModal();
  loadProfile();   /* refresh all displayed text on the page */
  loadNavUser();   /* update name in the navbar too */
  showToast("✅ Profile updated successfully!");
}

/* ── STEP 8: Change password ─────────────────────────────── */
function changePassword() {
  var oldPass     = document.getElementById("oldPass").value.trim();
  var newPass     = document.getElementById("newPass").value.trim();
  var confirmPass = document.getElementById("confirmPass").value.trim();

  if (!oldPass || !newPass || !confirmPass) {
    showToast("⚠️ Please fill in all three password fields.");
    return;
  }

  if (newPass !== confirmPass) {
    showToast("⚠️ New password and confirm password do not match.");
    return;
  }

  if (newPass.length < 6) {
    showToast("⚠️ Password must be at least 6 characters long.");
    return;
  }

  /* Clear fields and show success */
  document.getElementById("oldPass").value     = "";
  document.getElementById("newPass").value     = "";
  document.getElementById("confirmPass").value = "";

  showToast("🔒 Password updated successfully!");
}

/* ── STEP 9: Save notification preferences ──────────────── */
function saveNotifPrefs() {
  var prefs = {
    announcements: document.getElementById("notifAnnounce").checked,
    events:        document.getElementById("notifEvents").checked,
    discussions:   document.getElementById("notifDiscuss").checked,
    emergency:     document.getElementById("notifEmergency").checked
  };

  localStorage.setItem("notifPrefs", JSON.stringify(prefs));
  showToast("💾 Notification preferences saved!");
}

/* ── STEP 10: Toast notification ─────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 3000);
}

/* ── STEP 11: Logout ─────────────────────────────────────── */
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 12: Live clock in navbar ───────────────────────── */
function startClock() {
  var el = document.getElementById("navClock");
  if (!el) return;

  function tick() {
    var now = new Date();
    var h   = String(now.getHours()).padStart(2, "0");
    var m   = String(now.getMinutes()).padStart(2, "0");
    el.textContent = "🕐 " + h + ":" + m;
  }

  tick();
  setInterval(tick, 1000);
}
