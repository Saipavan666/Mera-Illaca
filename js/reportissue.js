/* ============================================================
   reportissue.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Sample issues data ──────────────────────────────
   Each issue has: id, title, location, category, priority,
   status, description, date, reportedBy, and upvotes count.
──────────────────────────────────────────────────────────── */
var issues = [
  {
    id:         1,
    title:      "Large pothole on Main Street near Gate 1",
    location:   "Main Street, Near Gate 1",
    category:   "road",
    priority:   "high",
    status:     "open",
    desc:       "There is a very deep pothole that has caused two bike accidents this week. Needs urgent repair.",
    date:       "13 Jul 2026",
    reportedBy: "Rahul Sharma",
    upvotes:    14
  },
  {
    id:         2,
    title:      "Water supply cuts off daily at 8 AM in Block C",
    location:   "Block C, All Floors",
    category:   "water",
    priority:   "high",
    status:     "inprogress",
    desc:       "Every morning the water supply stops completely for 2–3 hours. RWA has been informed but no fix yet.",
    date:       "12 Jul 2026",
    reportedBy: "Sunita Verma",
    upvotes:    22
  },
  {
    id:         3,
    title:      "Street light not working near Park Gate",
    location:   "Main Park Gate, Block B Side",
    category:   "electricity",
    priority:   "medium",
    status:     "open",
    desc:       "The street light outside the park entrance has been off for 10 days. It is very dark and unsafe at night.",
    date:       "11 Jul 2026",
    reportedBy: "Priya Singh",
    upvotes:    9
  },
  {
    id:         4,
    title:      "Garbage not collected from Block A for 3 days",
    location:   "Block A Waste Collection Point",
    category:   "cleanliness",
    priority:   "medium",
    status:     "resolved",
    desc:       "The garbage van has not visited Block A for the past 3 days. Waste is overflowing and causing bad smell.",
    date:       "10 Jul 2026",
    reportedBy: "Mohan Das",
    upvotes:    18
  },
  {
    id:         5,
    title:      "CCTV camera broken at Parking Zone entrance",
    location:   "Parking Zone, Entry Gate",
    category:   "security",
    priority:   "high",
    status:     "inprogress",
    desc:       "The CCTV camera at the parking zone gate has been damaged. Several residents have raised this concern.",
    date:       "9 Jul 2026",
    reportedBy: "Arjun Reddy",
    upvotes:    11
  }
];

/* Track which issue IDs the user has already upvoted */
var upvotedSet = [];

/* Active filters — status and category */
var activeStatus   = "all";
var activeCategory = "all";

/* Track which issue the reply modal is open for */
var activeReplyId = null;

/* Add some sample replies to existing issues */
issues[0].replies = [
  { author: "Sunita Verma",  initials: "SV", msg: "Yes! This pothole damaged my scooter tyre last week. Please fix urgently." },
  { author: "Community Admin", initials: "CA", msg: "We have raised this with the municipal corporation. Work scheduled for next week." }
];
issues[1].replies = [
  { author: "Deepak Joshi", initials: "DJ", msg: "Same issue in Block D also. Water comes back only after 10 AM." }
];
issues[2].replies = [];
issues[3].replies = [
  { author: "Kavya Nair", initials: "KN", msg: "Garbage was collected this morning. Issue seems resolved now! ✅" }
];
issues[4].replies = [];

/* ── STEP 2: Run when page loads ─────────────────────────── */
window.onload = function () {
  checkLogin();
  loadNavUser();
  startClock();
  renderStats();
  renderIssues();
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

/* ── STEP 5: Render stats bar (count per status) ─────────── */
function renderStats() {
  var openCount       = issues.filter(function (i) { return i.status === "open";       }).length;
  var progressCount   = issues.filter(function (i) { return i.status === "inprogress"; }).length;
  var resolvedCount   = issues.filter(function (i) { return i.status === "resolved";   }).length;

  document.getElementById("statsBar").innerHTML =
    '<div class="stat-pill open">'
    + '  <span>🔴</span><span class="snum">' + openCount + '</span><span>Open</span>'
    + '</div>'
    + '<div class="stat-pill inprogress">'
    + '  <span>🟡</span><span class="snum">' + progressCount + '</span><span>In Progress</span>'
    + '</div>'
    + '<div class="stat-pill resolved">'
    + '  <span>🟢</span><span class="snum">' + resolvedCount + '</span><span>Resolved</span>'
    + '</div>';
}

/* ── STEP 6: Render issue cards on the page ──────────────── */
function renderIssues() {
  var container = document.getElementById("issuesList");
  container.innerHTML = "";

  /* Apply both status and category filters together */
  var filtered = issues.filter(function (issue) {
    var statusMatch   = (activeStatus   === "all") || (issue.status   === activeStatus);
    var categoryMatch = (activeCategory === "all") || (issue.category === activeCategory);
    return statusMatch && categoryMatch;
  });

  /* Show empty message if nothing matches */
  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-result">😕 No issues found for this filter.</div>';
    return;
  }

  /* Category icons map */
  var catIcons = {
    road:        "🛣️",
    water:       "💧",
    electricity: "⚡",
    cleanliness: "🧹",
    security:    "🔒",
    other:       "📦"
  };

  /* Status label text */
  var statusLabels = {
    open:       "Open",
    inprogress: "In Progress",
    resolved:   "Resolved"
  };

  /* Loop and build each card */
  filtered.forEach(function (issue) {

    /* Has the current user upvoted this issue? */
    var isUpvoted = upvotedSet.indexOf(issue.id) !== -1;
    var upClass   = isUpvoted ? "btn-upvote upvoted" : "btn-upvote";

    /* Only show status-change buttons if NOT already resolved */
    var actionBtns = "";
    if (issue.status === "open") {
      actionBtns =
        '<button class="btn-status progress" onclick="changeStatus(' + issue.id + ', \'inprogress\')">'
        + '  🟡 Mark In Progress'
        + '</button>'
        + '<button class="btn-status done" onclick="changeStatus(' + issue.id + ', \'resolved\')">'
        + '  🟢 Mark Resolved'
        + '</button>';
    } else if (issue.status === "inprogress") {
      actionBtns =
        '<button class="btn-status done" onclick="changeStatus(' + issue.id + ', \'resolved\')">'
        + '  🟢 Mark Resolved'
        + '</button>';
    }

    /* Count of replies for this issue */
    var replyCount = issue.replies ? issue.replies.length : 0;

    /* Build replies HTML (shown when user clicks "View Replies") */
    var repliesHTML = "";
    if (issue.replies && issue.replies.length > 0) {
      issue.replies.forEach(function (r) {
        repliesHTML +=
          '<div class="reply-item">'
          + '  <div class="reply-avatar">' + r.initials + '</div>'
          + '  <div class="reply-body">'
          + '    <strong>' + r.author + '</strong>'
          + '    <p>' + r.msg + '</p>'
          + '  </div>'
          + '</div>';
      });
    } else {
      repliesHTML = '<p class="no-replies-yet">No replies yet. Be the first to reply! 💬</p>';
    }

    /* Build full card HTML */
    var card =
      '<div class="issue-card ' + issue.status + '" id="issue-' + issue.id + '">'

      /* Top row: status badge + priority + category + date */
      + '  <div class="issue-top">'
      + '    <span class="status-badge ' + issue.status + '">' + statusLabels[issue.status] + '</span>'
      + '    <span class="priority-badge ' + issue.priority + '">' + capitalise(issue.priority) + ' Priority</span>'
      + '    <span class="cat-badge">' + (catIcons[issue.category] || "📦") + ' ' + capitalise(issue.category) + '</span>'
      + '    <span class="issue-date">📅 ' + issue.date + '</span>'
      + '  </div>'

      /* Title */
      + '  <div class="issue-title">' + issue.title + '</div>'

      /* Location */
      + '  <div class="issue-location">📍 ' + issue.location + '</div>'

      /* Description */
      + '  <div class="issue-desc">' + issue.desc + '</div>'

      /* Footer: reporter + upvote + reply + view replies + status buttons */
      + '  <div class="issue-footer">'
      + '    <span class="issue-by">👤 ' + issue.reportedBy + '</span>'

      /* Upvote button */
      + '    <button class="' + upClass + '" id="up-' + issue.id + '" onclick="upvote(' + issue.id + ')">'
      + '      👍 ' + issue.upvotes
      + '    </button>'

      /* 💬 Reply button — opens the reply modal */
      + '    <button class="btn-action" onclick="openReplyModal(' + issue.id + ', \'' + issue.title.replace(/'/g, "") + '\')">'
      + '      💬 Reply'
      + '    </button>'

      /* 🗨️ View Replies button — shows/hides replies section */
      + '    <button class="btn-action" onclick="toggleReplies(' + issue.id + ')">'
      + '      🗨️ View Replies'
      + '    </button>'

      /* Reply count on the right */
      + '    <span class="reply-count">' + replyCount + ' repl' + (replyCount === 1 ? 'y' : 'ies') + '</span>'

      /* Status change buttons */
      + '    ' + actionBtns
      + '  </div>'

      /* Replies section — hidden by default, shown on "View Replies" click */
      + '  <div class="replies-section" id="replies-' + issue.id + '">'
      + repliesHTML
      + '  </div>'

      + '</div>';

    container.innerHTML += card;
  });
}

/* ── STEP 7: Filter by status ────────────────────────────── */
function filterIssues(status, clickedBtn) {
  activeStatus = status;

  /* Highlight clicked status button */
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  clickedBtn.classList.add("active");

  renderIssues();
}

/* ── STEP 8: Filter by category ──────────────────────────── */
function filterCategory(category, clickedBtn) {
  activeCategory = category;

  /* Highlight clicked category button */
  document.querySelectorAll(".cat-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  clickedBtn.classList.add("active");

  renderIssues();
}

/* ── STEP 9: Upvote an issue ─────────────────────────────── */
function upvote(id) {

  /* Cannot upvote the same issue twice */
  if (upvotedSet.indexOf(id) !== -1) return;

  upvotedSet.push(id);

  /* Find issue and increase its upvote count */
  var issue = issues.find(function (i) { return i.id === id; });
  if (issue) {
    issue.upvotes++;

    /* Update the button text and style directly without full re-render */
    var btn = document.getElementById("up-" + id);
    if (btn) {
      btn.textContent = "👍 " + issue.upvotes;
      btn.classList.add("upvoted");
    }
  }
}

/* ── STEP 10: Change issue status ────────────────────────── */
function changeStatus(id, newStatus) {
  var issue = issues.find(function (i) { return i.id === id; });
  if (!issue) return;

  issue.status = newStatus;

  /* Re-render everything to show updated status */
  renderStats();
  renderIssues();

  var msg = newStatus === "inprogress"
    ? "🟡 Issue marked as In Progress!"
    : "🟢 Issue marked as Resolved!";

  showToast(msg);
}

/* ── STEP 11: Open "Report Issue" modal ──────────────────── */
function openReportModal() {
  var modal = document.getElementById("reportModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 12: Close modal ────────────────────────────────── */
function closeReportModal() {
  var modal = document.getElementById("reportModal");
  if (modal) modal.classList.remove("open");
}

/* Close modal if user clicks the dark overlay */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("reportModal");
  if (modal && e.target === modal) closeReportModal();
});

/* ── STEP 13: Submit a new issue ─────────────────────────── */
function submitIssue() {
  var title    = document.getElementById("issueTitle").value.trim();
  var location = document.getElementById("issueLocation").value.trim();
  var category = document.getElementById("issueCategory").value;
  var priority = document.getElementById("issuePriority").value;
  var desc     = document.getElementById("issueDesc").value.trim();

  /* All fields required */
  if (!title || !location || !desc) {
    showToast("⚠️ Please fill in title, location, and description.");
    return;
  }

  /* Get current user */
  var data     = sessionStorage.getItem("loggedUser");
  var userName = data ? JSON.parse(data).name : "Resident";

  /* Today's date formatted nicely */
  var today  = new Date();
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var dateStr = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();

  /* Create new issue object */
  var newIssue = {
    id:         issues.length + 1,
    title:      title,
    location:   location,
    category:   category,
    priority:   priority,
    status:     "open",          /* all new issues start as "open" */
    desc:       desc,
    date:       dateStr,
    reportedBy: userName,
    upvotes:    0,
    replies:    []               /* start with empty replies array */
  };

  /* Add to front of array so it shows at top */
  issues.unshift(newIssue);

  /* Clear form fields */
  document.getElementById("issueTitle").value    = "";
  document.getElementById("issueLocation").value = "";
  document.getElementById("issueDesc").value     = "";

  closeReportModal();
  renderStats();
  renderIssues();
  showToast("✅ Issue reported successfully! We'll look into it.");
}

/* ── STEP 14: Toggle show/hide replies section ───────────── */
function toggleReplies(id) {
  var section = document.getElementById("replies-" + id);
  if (!section) return;

  /* If visible → hide it. If hidden → show it. */
  if (section.style.display === "block") {
    section.style.display = "none";
  } else {
    section.style.display = "block";
  }
}

/* ── STEP 15: Open reply modal ───────────────────────────── */
function openReplyModal(id, title) {
  activeReplyId = id;   /* remember which issue we are replying to */

  var modal   = document.getElementById("replyModal");
  var titleEl = document.getElementById("replyModalTitle");
  var input   = document.getElementById("replyInput");

  if (titleEl) titleEl.textContent = '💬 Reply to: "' + title + '"';
  if (input)   input.value = "";

  if (modal) modal.classList.add("open");
  if (input) input.focus();
}

/* ── STEP 16: Close reply modal ──────────────────────────── */
function closeReplyModal() {
  var modal = document.getElementById("replyModal");
  if (modal) modal.classList.remove("open");
  activeReplyId = null;
}

/* Close reply modal when clicking the dark overlay */
document.addEventListener("click", function (e) {
  var rModal = document.getElementById("replyModal");
  if (rModal && e.target === rModal) closeReplyModal();
});

/* ── STEP 17: Submit a reply ─────────────────────────────── */
function submitReply() {
  var msg = document.getElementById("replyInput").value.trim();

  /* Reply text must not be empty */
  if (!msg) {
    showToast("⚠️ Please write something before replying.");
    return;
  }

  /* Get the logged-in user's name and make initials */
  var data     = sessionStorage.getItem("loggedUser");
  var user     = data ? JSON.parse(data) : { name: "Resident" };
  var initials = user.name
    .split(" ")
    .map(function (w) { return w[0]; })
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /* Find the issue and push the new reply into its replies array */
  var issue = issues.find(function (i) { return i.id === activeReplyId; });
  if (issue) {
    if (!issue.replies) issue.replies = [];
    issue.replies.push({ author: user.name, initials: initials, msg: msg });

    /* Re-render all cards to show updated reply count */
    renderIssues();

    /* Auto-open the replies section for this issue after posting */
    var section = document.getElementById("replies-" + activeReplyId);
    if (section) section.style.display = "block";
  }

  closeReplyModal();
  showToast("✅ Your reply was posted!");
}

/* ── STEP 18: Toast notification ─────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 3000);
}

/* ── STEP 19: Logout ─────────────────────────────────────── */
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 20: Live clock ─────────────────────────────────── */
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
