/* ============================================================
   businesses.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Sample business data ────────────────────────────
   Each business is an object with name, type, phone,
   address, hours, category, and an emoji icon.
──────────────────────────────────────────────────────────── */
var businesses = [
  {
    id: 1,
    name:     "Sharma Grocery Store",
    type:     "Grocery & General Store",
    phone:    "98765 43210",
    address:  "Block A, Near Main Gate",
    hours:    "7 AM – 10 PM",
    category: "shop",
    icon:     "🛍️"
  },
  {
    id: 2,
    name:     "Green Leaf Restaurant",
    type:     "Multi-Cuisine Restaurant",
    phone:    "91234 56789",
    address:  "Block B, Ground Floor",
    hours:    "11 AM – 11 PM",
    category: "food",
    icon:     "🍽️"
  },
  {
    id: 3,
    name:     "Dr. Priya Clinic",
    type:     "General Physician",
    phone:    "90000 11223",
    address:  "Block C, Room 4",
    hours:    "9 AM – 1 PM, 5 PM – 8 PM",
    category: "medical",
    icon:     "🏥"
  },
  {
    id: 4,
    name:     "Ramesh Electricals",
    type:     "Electrical Repairs & Sales",
    phone:    "88776 65544",
    address:  "Main Street, Shop No. 7",
    hours:    "9 AM – 8 PM",
    category: "service",
    icon:     "⚡"
  },
  {
    id: 5,
    name:     "Bright Future Tuitions",
    type:     "Classes for Grades 6–12",
    phone:    "77665 54433",
    address:  "Block D, First Floor",
    hours:    "4 PM – 8 PM",
    category: "education",
    icon:     "📚"
  },
  {
    id: 6,
    name:     "Chai & Snacks Corner",
    type:     "Tea Stall & Fast Food",
    phone:    "99887 76655",
    address:  "Near Park Gate",
    hours:    "6 AM – 9 PM",
    category: "food",
    icon:     "☕"
  }
];

/* ── STEP 2: Run when page loads ─────────────────────────── */
window.onload = function () {
  checkLogin();
  loadNavUser();
  startClock();
  renderBusinesses(businesses);
};

/* ── STEP 3: Redirect if not logged in ───────────────────── */
function checkLogin() {
  if (!sessionStorage.getItem("loggedUser")) {
    window.location.href = "login.html";
  }
}

/* ── STEP 4: Show user name in navbar ────────────────────── */
function loadNavUser() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;
  var user = JSON.parse(data);
  var el   = document.getElementById("navUser");
  if (el) el.textContent = "👤 " + user.name + " (" + user.role + ")";
}

/* ── STEP 5: Draw all business cards on the page ─────────── */
function renderBusinesses(list) {
  var grid = document.getElementById("bizGrid");
  grid.innerHTML = "";   /* clear old cards */

  /* Show empty message if nothing to show */
  if (list.length === 0) {
    grid.innerHTML = '<div class="no-result">😕 No businesses found. Try a different search or filter.</div>';
    return;
  }

  /* Loop through each business and build its card HTML */
  list.forEach(function (biz) {
    var card =
      '<div class="biz-card" data-cat="' + biz.category + '">'

      /* Top: icon + category badge */
      + '  <div class="biz-card-top">'
      + '    <div class="biz-icon">' + biz.icon + '</div>'
      + '    <span class="biz-badge ' + biz.category + '">' + capitalise(biz.category) + '</span>'
      + '  </div>'

      /* Business name and type */
      + '  <h4>' + biz.name + '</h4>'
      + '  <div class="biz-type">' + biz.type + '</div>'

      /* Contact details */
      + '  <div class="biz-info">'
      + '    <span>📍 ' + biz.address + '</span>'
      + '    <span>📞 ' + biz.phone   + '</span>'
      + '    <span>🕐 ' + biz.hours   + '</span>'
      + '  </div>'

      /* Call button */
      + '  <button class="btn-call" onclick="callBusiness(\'' + biz.phone + '\', \'' + biz.name + '\')">'
      + '    📞 Call Now'
      + '  </button>'

      + '</div>';

    grid.innerHTML += card;
  });
}

/* ── STEP 6: Filter by category ──────────────────────────── */
function filterBiz(category, clickedBtn) {

  /* Update active button highlight */
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  clickedBtn.classList.add("active");

  /* Also clear the search box when filtering */
  document.getElementById("searchInput").value = "";

  var list = (category === "all")
    ? businesses
    : businesses.filter(function (b) { return b.category === category; });

  renderBusinesses(list);
}

/* ── STEP 7: Search businesses by name or type ───────────── */
function searchBusinesses() {
  var query = document.getElementById("searchInput").value.toLowerCase().trim();

  var filtered = businesses.filter(function (b) {
    /* Check if name OR type includes the search text */
    return b.name.toLowerCase().includes(query)
        || b.type.toLowerCase().includes(query);
  });

  /* Reset filter buttons to "All" when searching */
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  document.querySelectorAll(".filter-btn")[0].classList.add("active");

  renderBusinesses(filtered);
}

/* ── STEP 8: Call button action ──────────────────────────── */
function callBusiness(phone, name) {
  showToast("📞 Calling " + name + " at " + phone);
}

/* ── STEP 9: Open "Add Business" modal ───────────────────── */
function openAddModal() {
  var modal = document.getElementById("addModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 10: Close modal ────────────────────────────────── */
function closeAddModal() {
  var modal = document.getElementById("addModal");
  if (modal) modal.classList.remove("open");
}

/* Close if user clicks the dark overlay */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("addModal");
  if (modal && e.target === modal) closeAddModal();
});

/* ── STEP 11: Submit a new business ─────────────────────── */
function submitBusiness() {
  var name     = document.getElementById("bizName").value.trim();
  var type     = document.getElementById("bizType").value.trim();
  var phone    = document.getElementById("bizPhone").value.trim();
  var address  = document.getElementById("bizAddress").value.trim();
  var hours    = document.getElementById("bizHours").value.trim();
  var category = document.getElementById("bizCategory").value;

  /* All fields required */
  if (!name || !type || !phone || !address || !hours) {
    showToast("⚠️ Please fill in all fields.");
    return;
  }

  /* Emoji icons per category */
  var icons = { food: "🍽️", medical: "🏥", shop: "🛍️", service: "🔧", education: "📚" };

  /* Create new business object */
  var newBiz = {
    id:       businesses.length + 1,
    name:     name,
    type:     type,
    phone:    phone,
    address:  address,
    hours:    hours,
    category: category,
    icon:     icons[category] || "🏪"
  };

  /* Add to start of list so it appears first */
  businesses.unshift(newBiz);

  /* Clear form */
  ["bizName","bizType","bizPhone","bizAddress","bizHours"].forEach(function (id) {
    document.getElementById(id).value = "";
  });

  closeAddModal();
  renderBusinesses(businesses);
  showToast("✅ Business added successfully!");
}

/* ── STEP 12: Toast notification ─────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 3000);
}

/* ── STEP 13: Logout ─────────────────────────────────────── */
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 14: Live clock ─────────────────────────────────── */
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

/* ── Helper: capitalise first letter ── */
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
