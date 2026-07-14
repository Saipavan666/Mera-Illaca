/* ============================================================
   lostfound.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Sample Lost & Found posts data ──────────────────
   Each post has: id, type (lost/found/resolved), item name,
   location, date, description, contact, postedBy, and an icon.
──────────────────────────────────────────────────────────── */
var posts = [
  {
    id:       1,
    type:     "lost",
    item:     "Blue Leather Wallet",
    location: "Near Main Park Gate",
    date:     "13 Jul 2026",
    desc:     "Blue leather wallet with some cash and an Aadhar card inside. Lost during evening walk.",
    contact:  "98765 43210",
    postedBy: "Rahul Sharma",
    icon:     "👜"
  },
  {
    id:       2,
    type:     "found",
    item:     "Black Umbrella",
    location: "Community Hall Entrance",
    date:     "12 Jul 2026",
    desc:     "Found a black umbrella with a wooden handle near the main entrance of Community Hall after yesterday's rain.",
    contact:  "91234 56789",
    postedBy: "Sunita Verma",
    icon:     "☂️"
  },
  {
    id:       3,
    type:     "lost",
    item:     "Golden Earrings (Pair)",
    location: "Block B Staircase / Lift Area",
    date:     "11 Jul 2026",
    desc:     "Small golden hoop earrings. Sentimental value. May have dropped near the lift on the 3rd floor of Block B.",
    contact:  "90001 23456",
    postedBy: "Priya Singh",
    icon:     "💛"
  },
  {
    id:       4,
    type:     "found",
    item:     "Kids Water Bottle – Red",
    location: "Playground, Block C",
    date:     "10 Jul 2026",
    desc:     "Red plastic water bottle with cartoon stickers. Found at the playground near the swings.",
    contact:  "77665 44332",
    postedBy: "Amit Kumar",
    icon:     "🍼"
  },
  {
    id:       5,
    type:     "resolved",
    item:     "House Keys",
    location: "Near Parking Area",
    date:     "9 Jul 2026",
    desc:     "A bunch of keys with a small car keychain. Owner has been found and keys returned. ✅",
    contact:  "88776 65544",
    postedBy: "Mohan Das",
    icon:     "🔑"
  },
  {
    id:       6,
    type:     "lost",
    item:     "Spectacles – Black Frame",
    location: "Garden / Walking Track",
    date:     "8 Jul 2026",
    desc:     "Black rectangular spectacles. Power –2.5. Lost during morning walk. Please contact if found.",
    contact:  "99887 76655",
    postedBy: "Deepak Joshi",
    icon:     "👓"
  }
];

/* Track which type the modal is currently set to */
var currentModalType = "lost";

/* ── STEP 2: Run when page loads ─────────────────────────── */
window.onload = function () {
  checkLogin();
  loadNavUser();
  startClock();
  renderStats();
  renderPosts(posts);
};

/* ── STEP 3: Redirect to login if not logged in ──────────── */
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

/* ── STEP 5: Render the stats bar (count of each type) ────── */
function renderStats() {
  var lostCount     = posts.filter(function (p) { return p.type === "lost";     }).length;
  var foundCount    = posts.filter(function (p) { return p.type === "found";    }).length;
  var resolvedCount = posts.filter(function (p) { return p.type === "resolved"; }).length;

  var bar = document.getElementById("statsBar");
  bar.innerHTML =
    '<div class="stat-pill lost">'
    + '  <span>😢</span>'
    + '  <span class="snum">' + lostCount + '</span>'
    + '  <span>Lost</span>'
    + '</div>'
    + '<div class="stat-pill found">'
    + '  <span>🎉</span>'
    + '  <span class="snum">' + foundCount + '</span>'
    + '  <span>Found</span>'
    + '</div>'
    + '<div class="stat-pill resolved">'
    + '  <span>✅</span>'
    + '  <span class="snum">' + resolvedCount + '</span>'
    + '  <span>Resolved</span>'
    + '</div>';
}

/* ── STEP 6: Draw all post cards on the page ─────────────── */
function renderPosts(list) {
  var container = document.getElementById("postsList");
  container.innerHTML = "";   /* clear old cards */

  /* Show empty message if nothing to display */
  if (list.length === 0) {
    container.innerHTML = '<div class="no-result">😕 No posts found. Try a different filter or search.</div>';
    return;
  }

  /* Build each card */
  list.forEach(function (post) {

    /* Decide button text and CSS class based on type */
    var claimBtn = "";
    if (post.type === "lost") {
      /* On a LOST post → "I Have It!" button */
      claimBtn = '<button class="btn-claim lost-claim" onclick="claimPost(' + post.id + ')">🙋 I Have It!</button>';
    } else if (post.type === "found") {
      /* On a FOUND post → "That's Mine!" button */
      claimBtn = '<button class="btn-claim found-claim" onclick="claimPost(' + post.id + ')">🙋 That\'s Mine!</button>';
    }

    /* "Mark as Resolved" button – only for active (non-resolved) posts */
    var resolveBtn = "";
    if (post.type !== "resolved") {
      resolveBtn = '<button class="btn-resolve" onclick="resolvePost(' + post.id + ')">✅ Mark Resolved</button>';
    }

    /* Build full card HTML */
    var card =
      '<div class="post-card ' + post.type + '" id="post-' + post.id + '">'

      /* Left emoji icon */
      + '  <div class="post-icon">' + post.icon + '</div>'

      /* Right text body */
      + '  <div class="post-body">'

      /* Top row: badge + date */
      + '    <div class="post-top">'
      + '      <span class="status-badge ' + post.type + '">' + post.type.toUpperCase() + '</span>'
      + '      <span class="post-date">📅 ' + post.date + '</span>'
      + '    </div>'

      /* Item name */
      + '    <div class="post-item">' + post.item + '</div>'

      /* Location */
      + '    <div class="post-location">📍 ' + post.location + '</div>'

      /* Description */
      + '    <div class="post-desc">' + post.desc + '</div>'

      /* Footer: poster + action buttons */
      + '    <div class="post-footer">'
      + '      <span class="post-by">👤 ' + post.postedBy + ' · 📞 ' + post.contact + '</span>'
      + '      ' + claimBtn
      + '      ' + resolveBtn
      + '    </div>'

      + '  </div>'
      + '</div>';

    container.innerHTML += card;
  });
}

/* ── STEP 7: Filter posts by type ────────────────────────── */
function filterPosts(type, clickedBtn) {

  /* Highlight the clicked button */
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  clickedBtn.classList.add("active");

  /* Clear search box */
  document.getElementById("searchInput").value = "";

  var list = (type === "all")
    ? posts
    : posts.filter(function (p) { return p.type === type; });

  renderPosts(list);
}

/* ── STEP 8: Search posts by item name or location ───────── */
function searchPosts() {
  var query = document.getElementById("searchInput").value.toLowerCase().trim();

  var filtered = posts.filter(function (p) {
    return p.item.toLowerCase().includes(query)
        || p.location.toLowerCase().includes(query)
        || p.desc.toLowerCase().includes(query);
  });

  /* Reset filter to All */
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  document.querySelectorAll(".filter-btn")[0].classList.add("active");

  renderPosts(filtered);
}

/* ── STEP 9: Claim a post ("I Have It" or "That's Mine") ─── */
function claimPost(id) {
  var post = posts.find(function (p) { return p.id === id; });
  if (!post) return;

  if (post.type === "lost") {
    showToast("📞 Contacting " + post.postedBy + " at " + post.contact + " — they lost a " + post.item);
  } else {
    showToast("📞 Contacting " + post.postedBy + " at " + post.contact + " — they found a " + post.item);
  }
}

/* ── STEP 10: Mark a post as resolved ───────────────────── */
function resolvePost(id) {

  /* Find the post and change its type to "resolved" */
  var post = posts.find(function (p) { return p.id === id; });
  if (!post) return;

  post.type = "resolved";

  /* Re-render everything to show the updated state */
  renderStats();
  renderPosts(posts);

  showToast("✅ Post marked as resolved!");
}

/* ── STEP 11: Open the post modal ───────────────────────── */
function openModal(type) {
  currentModalType = type;    /* remember if it's "lost" or "found" */

  /* Change the modal title based on type */
  var titleEl = document.getElementById("modalTitle");
  if (type === "lost") {
    titleEl.textContent = "😢 Report a Lost Item";
  } else {
    titleEl.textContent = "🎉 Report a Found Item";
  }

  /* Clear all inputs */
  document.getElementById("postItem").value     = "";
  document.getElementById("postLocation").value = "";
  document.getElementById("postDate").value     = "";
  document.getElementById("postContact").value  = "";
  document.getElementById("postDesc").value     = "";

  /* Show the modal */
  var modal = document.getElementById("postModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 12: Close the modal ───────────────────────────── */
function closeModal() {
  var modal = document.getElementById("postModal");
  if (modal) modal.classList.remove("open");
}

/* Close if user clicks the dark overlay background */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("postModal");
  if (modal && e.target === modal) closeModal();
});

/* ── STEP 13: Submit a new post ─────────────────────────── */
function submitPost() {
  var item     = document.getElementById("postItem").value.trim();
  var location = document.getElementById("postLocation").value.trim();
  var dateVal  = document.getElementById("postDate").value;
  var contact  = document.getElementById("postContact").value.trim();
  var desc     = document.getElementById("postDesc").value.trim();

  /* All fields required */
  if (!item || !location || !dateVal || !contact || !desc) {
    showToast("⚠️ Please fill in all fields.");
    return;
  }

  /* Format date nicely: "2026-07-13" → "13 Jul 2026" */
  var d      = new Date(dateVal);
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var niceDate = d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();

  /* Get logged-in user's name */
  var data     = sessionStorage.getItem("loggedUser");
  var userName = data ? JSON.parse(data).name : "Resident";

  /* Choose a suitable emoji icon based on item name keywords */
  var icon = guessIcon(item);

  /* Build new post object */
  var newPost = {
    id:       posts.length + 1,
    type:     currentModalType,
    item:     item,
    location: location,
    date:     niceDate,
    desc:     desc,
    contact:  contact,
    postedBy: userName,
    icon:     icon
  };

  /* Add to front of array so it appears first */
  posts.unshift(newPost);

  closeModal();
  renderStats();
  renderPosts(posts);

  showToast(currentModalType === "lost"
    ? "😢 Lost item reported. We hope someone finds it!"
    : "🎉 Found item posted. We'll help find the owner!"
  );
}

/* ── STEP 14: Guess a suitable emoji icon from item name ─── */
function guessIcon(name) {
  var n = name.toLowerCase();
  if (n.includes("phone") || n.includes("mobile"))   return "📱";
  if (n.includes("key"))                             return "🔑";
  if (n.includes("wallet") || n.includes("purse"))   return "👜";
  if (n.includes("bag") || n.includes("backpack"))   return "🎒";
  if (n.includes("watch"))                           return "⌚";
  if (n.includes("book"))                            return "📚";
  if (n.includes("umbrella"))                        return "☂️";
  if (n.includes("glasses") || n.includes("specs"))  return "👓";
  if (n.includes("jewel") || n.includes("ring")
    || n.includes("earring") || n.includes("gold"))  return "💛";
  if (n.includes("cycle") || n.includes("bike"))     return "🚲";
  if (n.includes("bottle"))                          return "🍼";
  if (n.includes("dog") || n.includes("cat")
    || n.includes("pet"))                            return "🐾";
  return "📦";   /* default icon */
}

/* ── STEP 15: Toast notification ─────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 3500);
}

/* ── STEP 16: Logout ─────────────────────────────────────── */
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 17: Live clock in navbar ───────────────────────── */
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
