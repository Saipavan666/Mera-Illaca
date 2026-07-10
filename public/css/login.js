/* ============================================================
   login.js  –  Mera Ilaka Login Page Logic
   Beginner-friendly: every step has comments explaining WHY
   ============================================================ */

/* ── STEP 1: Demo user credentials stored as an object ──────────
   Key   = email address
   Value = { pass, role, name }  ──────────────────────────────── */
const users = {
  "resident@mera.com":  { pass: "resident123", role: "Resident",  name: "Priya Sharma"    },
  "business@mera.com":  { pass: "business123", role: "Business",  name: "Rahul Stores"    },
  "admin@mera.com":     { pass: "admin123",    role: "Admin",     name: "Community Admin" },
  "moderator@mera.com": { pass: "mod123",      role: "Moderator", name: "Rohan Gupta"     }
};

/* ── STEP 2: Run setup once the page HTML is fully loaded ──── */
document.addEventListener("DOMContentLoaded", function () {

  /* Grab the form and attach a submit listener */
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();    // stop browser from refreshing the page
      loginUser();               // run our own login function
    });
  }

  /* If user is already logged in, send them straight to dashboard */
  const existing = sessionStorage.getItem("loggedUser");
  if (existing) {
    window.location.href = "dashboard.html";
  }

  /* Auto-hide error box when user starts typing */
  const emailInput    = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (emailInput)    emailInput.addEventListener("input",    hideError);
  if (passwordInput) passwordInput.addEventListener("input", hideError);
});

/* ── STEP 3: Main login function ──────────────────────────────── */
function loginUser() {

  /* Read what the user typed */
  const emailRaw = document.getElementById("email").value;
  const passRaw  = document.getElementById("password").value;

  /* Clean up spaces and make email lowercase */
  const email    = emailRaw.trim().toLowerCase();
  const password = passRaw.trim();

  /* --- Validation: are fields empty? --- */
  if (!email && !password) {
    showError("⚠️ Please enter your email and password.");
    shakeBtnLogin();
    return;    // stop here, do not continue
  }

  if (!email) {
    showError("⚠️ Please enter your email or mobile number.");
    shakeBtnLogin();
    return;
  }

  if (!password) {
    showError("⚠️ Please enter your password.");
    shakeBtnLogin();
    return;
  }

  /* --- Show loading state on button --- */
  setButtonLoading(true);

  /* --- Simulate a short delay (like a real server call) --- */
  setTimeout(function () {

    /* ✅ Accept ANY non-empty email + password
       If the email matches a demo account, use that name & role.
       Otherwise use the email itself as the name with role "Resident". */

    let name = email;   // default: use whatever they typed as name
    let role = "Resident";

    /* Check if it matches one of the demo accounts */
    if (users[email] && users[email].pass === password) {
      /* exact demo match → use demo name & role */
      name = users[email].name;
      role = users[email].role;
    } else if (users[email]) {
      /* email matches but password differs → still let them in
         (open access mode) using the demo name               */
      name = users[email].name;
      role = users[email].role;
    }
    /* else: completely new email → use email as name, role = Resident */

    /* Save user info to sessionStorage */
    const userData = { email: email, name: name, role: role };
    sessionStorage.setItem("loggedUser", JSON.stringify(userData));

    /* Show green success message */
    showSuccess("✅ Login successful! Redirecting...");

    /* Go to dashboard after 0.8 seconds */
    setTimeout(function () {
      window.location.href = "dashboard.html";
    }, 800);

  }, 600);   // 600ms fake loading delay
}

/* ── STEP 4: Demo tile click ─────────────────────────────────────
   When user clicks "Resident", "Business" etc. tile,
   this function fills in the email + password and logs in  ─────── */
function demoLogin(type) {

  /* Map type name to email */
  const emailMap = {
    resident:  "resident@mera.com",
    business:  "business@mera.com",
    admin:     "admin@mera.com",
    moderator: "moderator@mera.com"
  };

  const selectedEmail = emailMap[type];

  if (!selectedEmail) return;   // safety check

  /* Fill the form fields */
  document.getElementById("email").value    = selectedEmail;
  document.getElementById("password").value = users[selectedEmail].pass;

  /* Hide any existing error */
  hideError();

  /* Now run login */
  loginUser();
}

/* ── HELPER: Show red error message ───────────────────────────── */
function showError(message) {
  const box = document.getElementById("errorMsg");
  if (!box) return;

  box.textContent    = message;
  box.style.display  = "block";
  box.style.background = "#ffebee";
  box.style.color      = "#c62828";
}

/* ── HELPER: Show green success message ───────────────────────── */
function showSuccess(message) {
  const box = document.getElementById("errorMsg");
  if (!box) return;

  box.textContent    = message;
  box.style.display  = "block";
  box.style.background = "#e8f5e9";
  box.style.color      = "#2e7d32";
}

/* ── HELPER: Hide the message box ─────────────────────────────── */
function hideError() {
  const box = document.getElementById("errorMsg");
  if (box) box.style.display = "none";
}

/* ── HELPER: Set login button to loading / normal state ───────── */
function setButtonLoading(isLoading) {
  const btn = document.querySelector(".btn-login");
  if (!btn) return;

  if (isLoading) {
    btn.textContent       = "Logging in...";
    btn.style.opacity     = "0.75";
    btn.style.cursor      = "not-allowed";
    btn.style.pointerEvents = "none";
  } else {
    btn.textContent       = "Login to My Neighbourhood";
    btn.style.opacity     = "1";
    btn.style.cursor      = "pointer";
    btn.style.pointerEvents = "all";
  }
}

/* ── HELPER: Shake the login button on wrong input ────────────── */
function shakeBtnLogin() {
  const btn = document.querySelector(".btn-login");
  if (!btn) return;

  /* Add shake class, then remove it after animation finishes */
  btn.style.animation = "none";
  btn.style.animation = "shake 0.35s ease";

  setTimeout(function () {
    btn.style.animation = "";
  }, 350);
}
