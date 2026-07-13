/* ============================================================
   announcements.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Sample announcements data ──────────────────────
   In a real app this would come from a server/database.
   For now we store them in an array of objects.
──────────────────────────────────────────────────────────── */
var announcements = [
  {
    id: 1,
    title: "Water Supply Maintenance – Sunday",
    details: "Water supply will be off on Sunday 8 AM to 12 PM in Block A, B, and C. Please store water in advance.",
    category: "maintenance",
    icon: "🔧",
    date: "13 Jul 2026"
  },
  {
    id: 2,
    title: "New Security Guards at Gate 2",
    details: "New security personnel have been deployed at Gate 2 starting Monday. All visitors must carry valid ID.",
    category: "safety",
    icon: "🛡️",
    date: "12 Jul 2026"
  },
  {
    id: 3,
    title: "Diwali Celebration – Community Hall",
    details: "Join us for a grand Diwali celebration this Saturday at Community Hall. Programme starts at 6 PM. Everyone is welcome!",
    category: "event",
    icon: "🎉",
    date: "11 Jul 2026"
  },
  {
    id: 4,
    title: "Road Repair on Main Street",
    details: "Road repair work is scheduled on Main Street from Monday to Wednesday. Expect minor traffic delays near Gate 1.",
    category: "civic",
    icon: "🏛️",
    date: "10 Jul 2026"
  },
  {
    id: 5,
    title: "Park Cleaning Drive – Volunteers Needed",
    details: "We are organising a park cleaning drive this Sunday morning. Volunteers are requested to gather at the main park gate at 7 AM.",
    category: "civic",
    icon: "🌳",
    date: "9 Jul 2026"
  },
  {
    id: 6,
    title: "CCTV Cameras Upgraded",
    details: "All CCTV cameras in the colony have been upgraded to HD. Coverage now includes parking areas and all entry points.",
    category: "safety",
    icon: "📷",
    date: "8 Jul 2026"
  }
];

/* ── STEP 2: Run when the page finishes loading ──────────── */
window.onload = function () {
  checkLogin();       /* make sure user is logged in */
  loadNavUser();      /* show user name in navbar */
  startClock();       /* live clock in navbar */
  renderAnn(announcements); /* show all announcements on screen */
  showAdminButton();  /* show "Post" button only for admin */
};

/* ── STEP 3: Redirect to login if not logged in ─────────── */
function checkLogin() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) {
    window.location.href = "login.html";
  }
}

/* ── STEP 4: Show user name in the navbar ───────────────── */
function loadNavUser() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  var user = JSON.parse(data);
  var el   = document.getElementById("navUser");
  if (el) {
    el.textContent = "👤 " + user.name + " (" + user.role + ")";
  }
}

/* ── STEP 5: Show "+ Post Announcement" button only for admin ── */
function showAdminButton() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  var user = JSON.parse(data);
  var btn  = document.getElementById("postBtn");

  /* Check if role contains "admin" (case-insensitive) */
  if (btn && user.role && user.role.toLowerCase().includes("admin")) {
    btn.style.display = "block";
  }
}

/* ── STEP 6: Render (draw) announcement cards on the page ── */
function renderAnn(list) {
  var container = document.getElementById("annList");
  container.innerHTML = "";  /* clear old cards first */

  /* If no announcements match the filter, show a message */
  if (list.length === 0) {
    container.innerHTML = '<div class="no-result">😕 No announcements found for this category.</div>';
    return;
  }

  /* Loop through each announcement and create a card */
  list.forEach(function (ann) {

    /* Create the card HTML as a string */
    var card = '<div class="ann-card" data-cat="' + ann.category + '">'
      + '  <div class="ann-card-icon">' + ann.icon + '</div>'
      + '  <div class="ann-card-body">'
      + '    <h4>' + ann.title + '</h4>'
      + '    <p>' + ann.details + '</p>'
      + '    <div class="ann-card-meta">'
      + '      <span class="ann-badge ' + ann.category + '">' + capitalise(ann.category) + '</span>'
      + '      <span class="date">📅 ' + ann.date + '</span>'
      + '    </div>'
      + '  </div>'
      + '</div>';

    /* Add card HTML to the container */
    container.innerHTML += card;
  });
}

/* ── STEP 7: Filter announcements by category ───────────── */
function filterAnn(category, clickedBtn) {

  /* Remove "active" class from all filter buttons */
  var buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(function (b) { b.classList.remove("active"); });

  /* Add "active" class to the clicked button */
  clickedBtn.classList.add("active");

  /* Filter the list based on chosen category */
  if (category === "all") {
    /* Show everything */
    renderAnn(announcements);
  } else {
    /* Show only matching items */
    var filtered = announcements.filter(function (ann) {
      return ann.category === category;
    });
    renderAnn(filtered);
  }
}

/* ── STEP 8: Open "Post Announcement" modal ─────────────── */
function openPostModal() {
  var modal = document.getElementById("postModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 9: Close the modal ─────────────────────────────── */
function closePostModal() {
  var modal = document.getElementById("postModal");
  if (modal) modal.classList.remove("open");
}

/* Close modal if user clicks the dark background */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("postModal");
  if (modal && e.target === modal) {
    closePostModal();
  }
});

/* ── STEP 10: Submit a new announcement (Admin) ─────────── */
function submitAnnouncement() {
  var title    = document.getElementById("annTitle").value.trim();
  var category = document.getElementById("annCategory").value;
  var details  = document.getElementById("annDetails").value.trim();

  /* Validate: both fields must be filled */
  if (!title || !details) {
    showToast("⚠️ Please fill in the title and details.");
    return;
  }

  /* Category icons map */
  var icons = { maintenance: "🔧", safety: "🛡️", event: "🎉", civic: "🏛️" };

  /* Get today's date as a readable string */
  var today = new Date();
  var dateStr = today.getDate() + " " + today.toLocaleString("en-US", { month: "short" }) + " " + today.getFullYear();

  /* Create a new announcement object */
  var newAnn = {
    id:       announcements.length + 1,
    title:    title,
    details:  details,
    category: category,
    icon:     icons[category] || "📢",
    date:     dateStr
  };

  /* Add to the front of the array so it appears at the top */
  announcements.unshift(newAnn);

  /* Clear the form inputs */
  document.getElementById("annTitle").value   = "";
  document.getElementById("annDetails").value = "";

  /* Close modal and refresh the list */
  closePostModal();
  renderAnn(announcements);

  /* Show success message */
  showToast("✅ Announcement posted successfully!");
}

/* ── STEP 11: Toast notification (popup at bottom right) ── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  /* Auto-hide after 3 seconds */
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

/* ── STEP 12: Logout ─────────────────────────────────────── */
function logout() {
  var confirmed = confirm("Are you sure you want to logout?");
  if (confirmed) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 13: Live clock in navbar ──────────────────────── */
function startClock() {
  var el = document.getElementById("navClock");
  if (!el) return;

  function tick() {
    var now  = new Date();
    var h    = String(now.getHours()).padStart(2, "0");
    var m    = String(now.getMinutes()).padStart(2, "0");
    el.textContent = "🕐 " + h + ":" + m;
  }

  tick();
  setInterval(tick, 1000);
}

/* ── Helper: capitalise first letter ── */
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
