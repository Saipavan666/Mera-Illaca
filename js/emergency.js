/* ============================================================
   emergency.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Emergency contacts data ─────────────────────────
   Each contact has: name, number, emoji icon, and a
   colour class that controls the card background colour.
──────────────────────────────────────────────────────────── */
var emergencyContacts = [
  { name: "Police",          number: "100",   icon: "👮", color: "blue"   },
  { name: "Fire Brigade",    number: "101",   icon: "🚒", color: "red"    },
  { name: "Ambulance",       number: "102",   icon: "🚑", color: "red"    },
  { name: "Disaster Relief", number: "108",   icon: "🆘", color: "orange" },
  { name: "Women Helpline",  number: "1091",  icon: "👩", color: "purple" },
  { name: "Gas Leak / GAIL", number: "1906",  icon: "⚠️", color: "orange" },
  { name: "Electricity Help",number: "1912",  icon: "⚡", color: "teal"   },
  { name: "Child Helpline",  number: "1098",  icon: "👦", color: "green"  },
  { name: "Senior Citizen",  number: "14567", icon: "👴", color: "green"  }
];

/* ── STEP 2: Colony wardens / security data ───────────────── */
var wardens = [
  { name: "Ramesh Gupta",  role: "Head Warden – Block A & B", phone: "98765 00001", initials: "RG" },
  { name: "Kavita Nair",   role: "Warden – Block C & D",      phone: "98765 00002", initials: "KN" },
  { name: "Suresh Kumar",  role: "Night Security Guard",       phone: "98765 00003", initials: "SK" },
  { name: "Anjali Mehta",  role: "Warden – Main Gate",        phone: "98765 00004", initials: "AM" }
];

/* ── STEP 3: Recent alerts already in the system ─────────── */
var recentAlerts = [
  {
    icon:     "🔥",
    title:    "Minor fire reported near Generator Room",
    location: "Block B, Basement",
    by:       "Mohan Das",
    time:     "Today, 10:30 AM",
    type:     "Fire"
  },
  {
    icon:     "🏥",
    title:    "Elderly resident needs immediate medical help",
    location: "Block A, Floor 4, Flat 401",
    by:       "Sunita Verma",
    time:     "Yesterday, 8:15 PM",
    type:     "Medical"
  },
  {
    icon:     "🚔",
    title:    "Suspicious person spotted near parking area",
    location: "Parking Zone, Block C",
    by:       "Arjun Reddy",
    time:     "13 Jul, 11:00 PM",
    type:     "Security"
  }
];

/* ── STEP 4: Run when page loads ─────────────────────────── */
window.onload = function () {
  checkLogin();
  loadNavUser();
  startClock();
  renderContacts();
  renderWardens();
  renderAlerts();
};

/* ── STEP 4b: Dismiss the warning banner ─────────────────────
   Smoothly hides the orange warning banner at the top
   when the user clicks the ✕ button.
──────────────────────────────────────────────────────────── */
function dismissBanner() {
  var banner = document.getElementById("warningBanner");
  if (!banner) return;

  /* Animate it: fade out + collapse height smoothly */
  banner.style.transition  = "opacity 0.3s ease, max-height 0.4s ease, margin 0.3s ease, padding 0.3s ease";
  banner.style.opacity     = "0";
  banner.style.maxHeight   = "0";
  banner.style.padding     = "0";
  banner.style.marginBottom = "0";
  banner.style.overflow    = "hidden";
  banner.style.border      = "none";
}
/* ── STEP 5: Redirect if not logged in ───────────────────── */
function checkLogin() {
  if (!sessionStorage.getItem("loggedUser")) {
    window.location.href = "login.html";
  }
}

/* ── STEP 6: Show user name in navbar ────────────────────── */
function loadNavUser() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;
  var user = JSON.parse(data);
  var el   = document.getElementById("navUser");
  if (el) el.textContent = "👤 " + user.name + " (" + user.role + ")";
}

/* ── STEP 7: Draw emergency contact cards ────────────────── */
function renderContacts() {
  var grid = document.getElementById("emGrid");
  grid.innerHTML = "";

  emergencyContacts.forEach(function (contact) {
    var card =
      '<div class="em-card ' + contact.color + '" onclick="callNumber(\'' + contact.number + '\', \'' + contact.name + '\')">'
      + '  <span class="em-emoji">' + contact.icon + '</span>'
      + '  <div class="em-name">'   + contact.name   + '</div>'
      + '  <div class="em-number">' + contact.number + '</div>'
      + '  <div class="em-tap">📞 Tap to Call</div>'
      + '</div>';

    grid.innerHTML += card;
  });
}

/* ── STEP 8: Draw colony wardens list ────────────────────── */
function renderWardens() {
  var list = document.getElementById("wardensList");
  list.innerHTML = "";

  wardens.forEach(function (w) {
    var row =
      '<div class="warden-card">'
      + '  <div class="warden-avatar">' + w.initials + '</div>'
      + '  <div class="warden-info">'
      + '    <strong>' + w.name + '</strong>'
      + '    <span>' + w.role + ' · 📞 ' + w.phone + '</span>'
      + '  </div>'
      + '  <button class="btn-warden-call" onclick="callNumber(\'' + w.phone + '\', \'' + w.name + '\')">'
      + '    📞 Call'
      + '  </button>'
      + '</div>';

    list.innerHTML += row;
  });
}

/* ── STEP 9: Draw recent alerts ──────────────────────────── */
function renderAlerts() {
  var list = document.getElementById("alertsList");
  list.innerHTML = "";

  if (recentAlerts.length === 0) {
    list.innerHTML = '<p style="color:#aaa;font-size:14px;padding:10px 0;">No recent alerts. Stay safe! 🙂</p>';
    return;
  }

  recentAlerts.forEach(function (alert) {
    var row =
      '<div class="alert-row">'
      + '  <div class="alert-icon">' + alert.icon + '</div>'
      + '  <div class="alert-body">'
      + '    <div class="alert-title">' + alert.title + '</div>'
      + '    <div class="alert-meta">'
      + '      📍 ' + alert.location
      + '      &nbsp;·&nbsp; 👤 ' + alert.by
      + '      &nbsp;·&nbsp; 🕐 ' + alert.time
      + '    </div>'
      + '  </div>'
      + '  <span class="alert-type-badge">' + alert.type + '</span>'
      + '</div>';

    list.innerHTML += row;
  });
}

/* ── STEP 10: Simulate calling a number ─────────────────── */
function callNumber(number, name) {
  showToast("📞 Calling " + name + " — " + number);
}

/* ── STEP 11: Open SOS Modal ─────────────────────────────── */
function openSosModal() {
  var modal = document.getElementById("sosModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 12: Close SOS Modal ────────────────────────────── */
function closeSosModal() {
  var modal = document.getElementById("sosModal");
  if (modal) modal.classList.remove("open");
}

/* Close modal if user clicks the dark overlay */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("sosModal");
  if (modal && e.target === modal) closeSosModal();
});

/* ── STEP 13: Submit SOS Alert ───────────────────────────── */
function submitSos() {
  var type     = document.getElementById("sosType").value;
  var location = document.getElementById("sosLocation").value.trim();
  var details  = document.getElementById("sosDetails").value.trim();

  /* Both location and details required */
  if (!location || !details) {
    showToast("⚠️ Please fill in location and details.");
    return;
  }

  /* Get logged-in user's name */
  var data     = sessionStorage.getItem("loggedUser");
  var userName = data ? JSON.parse(data).name : "Resident";

  /* Map type value to a readable label + icon */
  var typeLabels = {
    fire:    { label: "Fire",     icon: "🔥" },
    medical: { label: "Medical",  icon: "🏥" },
    theft:   { label: "Security", icon: "🚔" },
    flood:   { label: "Flood",    icon: "🌊" },
    gas:     { label: "Gas Leak", icon: "⚠️" },
    other:   { label: "Other",    icon: "🚨" }
  };

  var chosen = typeLabels[type] || { label: "Emergency", icon: "🚨" };

  /* Get current time as a readable string */
  var now    = new Date();
  var h      = String(now.getHours()).padStart(2, "0");
  var m      = String(now.getMinutes()).padStart(2, "0");
  var timeStr = "Today, " + h + ":" + m;

  /* Create a new alert object and add to the top of the list */
  var newAlert = {
    icon:     chosen.icon,
    title:    details,
    location: location,
    by:       userName,
    time:     timeStr,
    type:     chosen.label
  };

  recentAlerts.unshift(newAlert);

  /* Clear form */
  document.getElementById("sosLocation").value = "";
  document.getElementById("sosDetails").value  = "";

  closeSosModal();
  renderAlerts();  /* re-draw the alerts list to show new alert */

  /* Show a strong confirmation toast */
  showToast("🆘 SOS Alert sent! Neighbours have been notified.");
}

/* ── STEP 14: Toast notification ─────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 3500);
}

/* ── STEP 15: Logout ─────────────────────────────────────── */
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 16: Live clock ─────────────────────────────────── */
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
