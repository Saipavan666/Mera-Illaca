/* ============================================================
   events.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Sample events data ──────────────────────────────
   An array of objects. Each object = one event.
──────────────────────────────────────────────────────────── */
var events = [
  {
    id: 1,
    title: "Blood Donation Camp",
    day: "12", month: "JUL",
    time: "9 AM – 3 PM",
    location: "Community Hall",
    category: "health",
    description: "Give the gift of life! Join the blood donation drive organised by the Resident Welfare Association."
  },
  {
    id: 2,
    title: "Resident Meeting – Block A",
    day: "15", month: "JUL",
    time: "7 PM – 9 PM",
    location: "Block A Terrace",
    category: "meeting",
    description: "Monthly resident meeting to discuss upcoming maintenance work and security arrangements."
  },
  {
    id: 3,
    title: "Diwali Celebration",
    day: "20", month: "JUL",
    time: "6 PM Onwards",
    location: "Main Park",
    category: "festival",
    description: "Grand Diwali celebration with lights, music, food stalls and prizes. Bring your family!"
  },
  {
    id: 4,
    title: "Health Awareness Camp",
    day: "22", month: "JUL",
    time: "10 AM – 1 PM",
    location: "Clinic Gate",
    category: "health",
    description: "Free health check-up including blood pressure, sugar, and BMI tests for all residents."
  },
  {
    id: 5,
    title: "Neighbourhood Clean-Up Drive",
    day: "27", month: "JUL",
    time: "7 AM – 10 AM",
    location: "Main Park & Surrounding Streets",
    category: "social",
    description: "Come together to keep our colony clean. Gloves and bags will be provided."
  },
  {
    id: 6,
    title: "Kids Sports Day",
    day: "30", month: "JUL",
    time: "9 AM – 12 PM",
    location: "Playground, Block C",
    category: "social",
    description: "Fun sports activities for children aged 5–15. Prizes for all participants!"
  }
];

/* Keep track of which events the user has RSVP'd for */
var rsvpSet = [];

/* ── STEP 2: Run when page finishes loading ───────────────── */
window.onload = function () {
  checkLogin();
  loadNavUser();
  startClock();
  renderEvents(events);
  showAdminButton();
};

/* ── STEP 3: Redirect if not logged in ───────────────────── */
function checkLogin() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) {
    window.location.href = "login.html";
  }
}

/* ── STEP 4: Show user name in navbar ────────────────────── */
function loadNavUser() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  var user = JSON.parse(data);
  var el   = document.getElementById("navUser");
  if (el) {
    el.textContent = "👤 " + user.name + " (" + user.role + ")";
  }
}

/* ── STEP 5: Show "Add Event" button only for admin ─────── */
function showAdminButton() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  var user = JSON.parse(data);
  var btn  = document.getElementById("addEventBtn");

  if (btn && user.role && user.role.toLowerCase().includes("admin")) {
    btn.style.display = "block";
  }
}

/* ── STEP 6: Render (draw) event cards on the page ──────── */
function renderEvents(list) {
  var container = document.getElementById("eventsList");
  container.innerHTML = "";  /* clear old cards */

  /* Show message if no events found */
  if (list.length === 0) {
    container.innerHTML = '<div class="no-result">😕 No events found for this category.</div>';
    return;
  }

  /* Loop through each event and build a card */
  list.forEach(function (ev) {

    /* Check if user already RSVP'd for this event */
    var isRsvpd  = rsvpSet.indexOf(ev.id) !== -1;
    var btnClass = isRsvpd ? "ev-rsvp rsvpd" : "ev-rsvp";
    var btnText  = isRsvpd ? "✅ Going!" : "👍 I'll Attend";
    var btnClick = isRsvpd ? "" : 'onclick="rsvp(' + ev.id + ')"';

    /* Category badge labels */
    var badgeLabels = { health: "🏥 Health", social: "🤝 Social", meeting: "📋 Meeting", festival: "🎉 Festival" };

    /* Build the card HTML */
    var card = '<div class="ev-card" data-cat="' + ev.category + '">'

      /* Top row: date box + category badge */
      + '  <div class="ev-card-top">'
      + '    <div class="ev-date-box">'
      + '      <span class="day">'  + ev.day   + '</span>'
      + '      <span class="mon">'  + ev.month + '</span>'
      + '    </div>'
      + '    <span class="ev-badge ' + ev.category + '">' + (badgeLabels[ev.category] || ev.category) + '</span>'
      + '  </div>'

      /* Event title */
      + '  <h4>' + ev.title + '</h4>'

      /* Meta details */
      + '  <div class="ev-meta">'
      + '    <span>🕐 ' + ev.time     + '</span>'
      + '    <span>📍 ' + ev.location + '</span>'
      + '  </div>'

      /* Description */
      + '  <p style="font-size:13px;color:#666;line-height:1.5;">' + ev.description + '</p>'

      /* RSVP button */
      + '  <button class="' + btnClass + '" id="rsvp-' + ev.id + '" ' + btnClick + '>' + btnText + '</button>'

      + '</div>';

    container.innerHTML += card;
  });
}

/* ── STEP 7: Filter events by category ──────────────────── */
function filterEvents(category, clickedBtn) {

  /* Remove "active" from all filter buttons */
  var buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(function (b) { b.classList.remove("active"); });

  /* Highlight the clicked one */
  clickedBtn.classList.add("active");

  /* Show all or filtered list */
  if (category === "all") {
    renderEvents(events);
  } else {
    var filtered = events.filter(function (ev) {
      return ev.category === category;
    });
    renderEvents(filtered);
  }
}

/* ── STEP 8: RSVP – mark yourself as attending ───────────── */
function rsvp(eventId) {

  /* Save this event ID to our rsvpSet array */
  rsvpSet.push(eventId);

  /* Find the button for this event and update its look */
  var btn = document.getElementById("rsvp-" + eventId);
  if (btn) {
    btn.textContent  = "✅ Going!";
    btn.className    = "ev-rsvp rsvpd";  /* grey out the button */
    btn.onclick      = null;             /* disable further clicks */
  }

  /* Show a confirmation toast */
  showToast("🎉 You're attending! See you there.");
}

/* ── STEP 9: Open "Add Event" modal ──────────────────────── */
function openEventModal() {
  var modal = document.getElementById("eventModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 10: Close modal ────────────────────────────────── */
function closeEventModal() {
  var modal = document.getElementById("eventModal");
  if (modal) modal.classList.remove("open");
}

/* Close modal if user clicks the dark overlay background */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("eventModal");
  if (modal && e.target === modal) {
    closeEventModal();
  }
});

/* ── STEP 11: Submit new event (Admin only) ──────────────── */
function submitEvent() {
  var title    = document.getElementById("evTitle").value.trim();
  var dateVal  = document.getElementById("evDate").value;
  var time     = document.getElementById("evTime").value.trim();
  var location = document.getElementById("evLocation").value.trim();
  var category = document.getElementById("evCategory").value;
  var desc     = document.getElementById("evDesc").value.trim();

  /* All fields are required */
  if (!title || !dateVal || !time || !location || !desc) {
    showToast("⚠️ Please fill in all fields.");
    return;
  }

  /* Parse the date to get day and month abbreviation */
  var d     = new Date(dateVal);
  var day   = String(d.getDate()).padStart(2, "0");
  var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  var month = months[d.getMonth()];

  /* Create a new event object */
  var newEvent = {
    id:          events.length + 1,
    title:       title,
    day:         day,
    month:       month,
    time:        time,
    location:    location,
    category:    category,
    description: desc
  };

  /* Add to beginning of array */
  events.unshift(newEvent);

  /* Clear the form */
  document.getElementById("evTitle").value    = "";
  document.getElementById("evDate").value     = "";
  document.getElementById("evTime").value     = "";
  document.getElementById("evLocation").value = "";
  document.getElementById("evDesc").value     = "";

  /* Close modal and re-render */
  closeEventModal();
  renderEvents(events);

  showToast("✅ Event added successfully!");
}

/* ── STEP 12: Toast notification ────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

/* ── STEP 13: Logout ─────────────────────────────────────── */
function logout() {
  var confirmed = confirm("Are you sure you want to logout?");
  if (confirmed) {
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
