/* ============================================================
   dashboard.js  –  Mera Ilaka Dashboard Logic
   Beginner-friendly: every section explained with comments
   ============================================================ */

/* ── STEP 1: Run everything once the page loads ─────────────── */
document.addEventListener("DOMContentLoaded", function () {

  checkLogin();          // make sure user is logged in
  loadUserInfo();        // show user name & role on screen
  activateSidebarLinks();// make sidebar links highlight on click
  setupQuickActions();   // attach quick-action button popups
  setupEmergencyClose(); // allow closing the alert banner
  startClock();          // show live time in navbar
  animateStatNumbers();  // count-up animation on stat cards
});

/* ────────────────────────────────────────────────────────────
   STEP 2: Protect the dashboard – if not logged in, go back
──────────────────────────────────────────────────────────── */
function checkLogin() {
  const data = sessionStorage.getItem("loggedUser");

  if (!data) {
    /* No logged-in user found → redirect to login page */
    window.location.href = "login.html";
  }
}

/* ────────────────────────────────────────────────────────────
   STEP 3: Load user name, role into the page
──────────────────────────────────────────────────────────── */
function loadUserInfo() {
  const data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  /* Parse JSON string back into an object */
  const user = JSON.parse(data);

  /* ── Update Navbar user pill ── */
  const navUser = document.getElementById("navUser");
  if (navUser) {
    navUser.textContent = "👤 " + user.name + "  (" + user.role + ")";
  }

  /* ── Update Welcome banner ── */
  const welcomeName = document.getElementById("welcomeName");
  const welcomeRole = document.getElementById("welcomeRole");

  if (welcomeName) {
    welcomeName.textContent = "Welcome, " + user.name + "! 👋";
  }

  if (welcomeRole) {
    welcomeRole.textContent =
      "Role: " + user.role + "  ·  Sector 14, Green Valley – Your Digital Neighbourhood";
  }

  /* ── Add a role badge inside welcome banner ── */
  const roleBadge = document.getElementById("roleBadge");
  if (roleBadge) {
    roleBadge.textContent = "🏷️ " + user.role;
  }
}

/* ────────────────────────────────────────────────────────────
   STEP 4: Logout function  (called by button in HTML)
──────────────────────────────────────────────────────────── */
function logout() {
  /* Ask user to confirm before logging out */
  const confirmed = confirm("Are you sure you want to logout?");

  if (confirmed) {
    sessionStorage.removeItem("loggedUser");   // delete saved user
    window.location.href = "login.html";       // go back to login
  }
}

/* ────────────────────────────────────────────────────────────
   STEP 5: Sidebar – highlight the clicked link
──────────────────────────────────────────────────────────── */
function activateSidebarLinks() {
  /* Get all <a> tags inside the sidebar */
  const links = document.querySelectorAll(".sidebar a");

  links.forEach(function (link) {
    link.addEventListener("click", function () {

      /* Remove 'active' class from ALL links */
      links.forEach(function (l) { l.classList.remove("active"); });

      /* Add 'active' class ONLY to the clicked link */
      this.classList.add("active");
    });
  });
}

/* ────────────────────────────────────────────────────────────
   STEP 6: Quick Action buttons – open a modal popup
──────────────────────────────────────────────────────────── */
function setupQuickActions() {
  /* Each button has a data-action attribute set in HTML below */
  const quickBtns = document.querySelectorAll(".quick-btn");

  quickBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const action = this.getAttribute("data-action");
      openModal(action);
    });
  });
}

/* ── Open modal with correct title/placeholder ── */
function openModal(action) {
  const overlay  = document.getElementById("modalOverlay");
  const title    = document.getElementById("modalTitle");
  const textarea = document.getElementById("modalInput");

  if (!overlay || !title || !textarea) return;

  /* Set title and placeholder based on which button was clicked */
  const config = {
    "post-update":    { title: "📢 Post a Neighbourhood Update",  ph: "What's happening in your neighbourhood?" },
    "sell-item":      { title: "🛒 List an Item for Sale",         ph: "Describe the item, price, and condition..." },
    "report-issue":   { title: "📝 Report a Civic Issue",          ph: "Describe the issue and its location..." },
    "emergency":      { title: "🚨 Send Emergency Alert",          ph: "Describe the emergency clearly and quickly..." }
  };

  const cfg = config[action] || { title: "New Post", ph: "Write something..." };

  title.textContent       = cfg.title;
  textarea.placeholder    = cfg.ph;
  textarea.value          = "";          // clear previous text

  /* Show the modal */
  overlay.classList.add("open");
  textarea.focus();
}

/* ── Close modal ── */
function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.classList.remove("open");
}

/* ── Submit modal form ── */
function submitModal() {
  const textarea = document.getElementById("modalInput");
  const text     = textarea ? textarea.value.trim() : "";

  if (!text) {
    /* Shake the textarea if empty */
    if (textarea) {
      textarea.style.borderColor = "#e53935";
      setTimeout(function () { textarea.style.borderColor = ""; }, 1500);
    }
    return;
  }

  /* Close modal and show toast */
  closeModal();
  showToast("✅ Your post was submitted successfully!");
}

/* Close modal when clicking outside of it */
document.addEventListener("click", function (e) {
  const overlay = document.getElementById("modalOverlay");
  if (overlay && e.target === overlay) {
    closeModal();
  }
});

/* ────────────────────────────────────────────────────────────
   STEP 7: Close the emergency/alert banner
──────────────────────────────────────────────────────────── */
function setupEmergencyClose() {
  const closeBtn = document.querySelector(".em-close");
  const banner   = document.querySelector(".emergency-banner");

  if (closeBtn && banner) {
    closeBtn.addEventListener("click", function () {
      banner.style.transition = "opacity 0.3s, max-height 0.4s";
      banner.style.opacity    = "0";
      banner.style.maxHeight  = "0";
      banner.style.padding    = "0";
      banner.style.margin     = "0";
      banner.style.overflow   = "hidden";

      /* Remove from page after animation */
      setTimeout(function () { banner.remove(); }, 400);
    });
  }
}

/* ────────────────────────────────────────────────────────────
   STEP 8: Toast notification (green popup bottom right)
──────────────────────────────────────────────────────────── */
function showToast(message) {
  /* Find or create toast element */
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id        = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  /* Show toast */
  toast.classList.add("show");

  /* Auto-hide after 3 seconds */
  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

/* ────────────────────────────────────────────────────────────
   STEP 9: Live clock in the navbar
──────────────────────────────────────────────────────────── */
function startClock() {
  const clockEl = document.getElementById("navClock");
  if (!clockEl) return;   /* only runs if element exists in HTML */

  function updateClock() {
    const now  = new Date();
    const hrs  = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = "🕐 " + hrs + ":" + mins;
  }

  updateClock();                    /* show immediately */
  setInterval(updateClock, 1000);   /* update every second */
}

/* ────────────────────────────────────────────────────────────
   STEP 10: Count-up animation on stat numbers
   e.g. "0" → "1248" over 1.5 seconds
──────────────────────────────────────────────────────────── */
function animateStatNumbers() {
  const statNums = document.querySelectorAll(".stat-num");

  statNums.forEach(function (el) {
    /* Read the final target number from the HTML (remove commas) */
    const target = parseInt(el.textContent.replace(/,/g, ""), 10);

    if (isNaN(target)) return;   /* skip if not a number */

    let current  = 0;
    const steps  = 60;           /* number of animation steps */
    const step   = target / steps;
    let count    = 0;

    const timer = setInterval(function () {
      current += step;
      count++;

      /* Format with comma separator e.g. 1248 → "1,248" */
      el.textContent = Math.min(Math.round(current), target).toLocaleString();

      /* Stop when we reach the target */
      if (count >= steps) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      }
    }, 25);   /* run every 25ms → total ~1.5 seconds */
  });
}

/* ────────────────────────────────────────────────────────────
   STEP 11: Greeting message based on time of day
──────────────────────────────────────────────────────────── */
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 20) return "Good Evening";
  return "Good Night";
}

/* Update welcome banner greeting based on time */
(function applyGreeting() {
  const nameEl = document.getElementById("welcomeName");
  if (!nameEl) return;

  const data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  const user     = JSON.parse(data);
  const greeting = getGreeting();

  nameEl.textContent = greeting + ", " + user.name + "! 👋";
})();
