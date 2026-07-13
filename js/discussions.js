/* ============================================================
   discussions.js  –  Mera Ilaka
   Beginner-friendly: every step explained clearly
   ============================================================ */

/* ── STEP 1: Sample discussion topics data ───────────────────
   Each topic is an object with these fields:
   id, author, initials, category, title, msg, date, likes, replies
──────────────────────────────────────────────────────────── */
var topics = [
  {
    id: 1,
    author:   "Rahul Sharma",
    initials: "RS",
    category: "general",
    title:    "Welcome to Mera Ilaka Discussions! 👋",
    msg:      "Hello neighbours! This is a space for all of us to talk, share ideas, raise issues and help each other. Please keep conversations respectful and friendly.",
    date:     "13 Jul 2026",
    likes:    12,
    replies: [
      { author: "Priya Singh",  initials: "PS", msg: "Great initiative! Happy to be part of this community." },
      { author: "Amit Kumar",   initials: "AK", msg: "Looking forward to connecting with everyone here!" }
    ]
  },
  {
    id: 2,
    author:   "Sunita Verma",
    initials: "SV",
    category: "safety",
    title:    "Stray dogs near Gate 1 – what should we do?",
    msg:      "There are 3-4 stray dogs near Gate 1 that have been aggressive lately. Has anyone else noticed this? Should we contact the municipal corporation?",
    date:     "12 Jul 2026",
    likes:    8,
    replies: [
      { author: "Ravi Patel",   initials: "RP", msg: "Yes, I noticed too. We should file a complaint with the RWA." }
    ]
  },
  {
    id: 3,
    author:   "Mohan Das",
    initials: "MD",
    category: "suggestion",
    title:    "Idea: Set up a community library in Block C",
    msg:      "I think we should start a small community library where residents can donate and borrow books. A shelf in the common area could work great. Thoughts?",
    date:     "11 Jul 2026",
    likes:    20,
    replies: [
      { author: "Kavya Nair",   initials: "KN", msg: "Love this idea! I have around 30 books I can donate." },
      { author: "Arjun Reddy",  initials: "AR", msg: "Count me in. Let's bring this to the next resident meeting." }
    ]
  },
  {
    id: 4,
    author:   "Neha Gupta",
    initials: "NG",
    category: "help",
    title:    "Looking for a good plumber in the area",
    msg:      "My kitchen tap is leaking and I need a reliable plumber. Does anyone have a contact they trust? Would really appreciate it!",
    date:     "10 Jul 2026",
    likes:    5,
    replies: [
      { author: "Deepak Joshi",  initials: "DJ", msg: "Try Ramesh Plumbing – 9876543210. He lives in Block B and does great work!" }
    ]
  },
  {
    id: 5,
    author:   "Arjun Reddy",
    initials: "AR",
    category: "suggestion",
    title:    "Can we add more street lights near the park?",
    msg:      "The path near the main park is very dark at night and feels unsafe, especially for children coming back from tuitions. Can we raise this with the RWA?",
    date:     "9 Jul 2026",
    likes:    15,
    replies: []
  }
];

/* Track which topic IDs the user has liked */
var likedSet = [];

/* Track which topic the reply modal is open for */
var activeReplyTopicId = null;

/* ── STEP 2: Run everything when the page loads ──────────── */
window.onload = function () {
  checkLogin();
  loadNavUser();
  startClock();
  renderTopics(topics);
};

/* ── STEP 3: Protect page – redirect if not logged in ────── */
function checkLogin() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) {
    window.location.href = "login.html";
  }
}

/* ── STEP 4: Show logged-in user name in the navbar ─────── */
function loadNavUser() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;

  var user = JSON.parse(data);
  var el   = document.getElementById("navUser");
  if (el) {
    el.textContent = "👤 " + user.name + " (" + user.role + ")";
  }
}

/* ── STEP 5: Render (draw) all topic cards on screen ─────── */
function renderTopics(list) {
  var container = document.getElementById("topicsList");
  container.innerHTML = "";  /* clear old content first */

  /* Show empty message if no results */
  if (list.length === 0) {
    container.innerHTML = '<div class="no-result">😕 No discussions found for this category.</div>';
    return;
  }

  /* Loop through each topic and build its HTML card */
  list.forEach(function (topic) {

    /* Count of replies */
    var replyCount = topic.replies.length;

    /* Check if user already liked this topic */
    var isLiked    = likedSet.indexOf(topic.id) !== -1;
    var likeClass  = isLiked ? "btn-action liked" : "btn-action";
    var likeText   = "👍 " + topic.likes;

    /* Build replies HTML (hidden by default) */
    var repliesHTML = "";
    topic.replies.forEach(function (r) {
      repliesHTML +=
        '<div class="reply-item">'
        + '  <div class="reply-avatar">' + r.initials + '</div>'
        + '  <div class="reply-body">'
        + '    <strong>' + r.author + '</strong>'
        + '    <p>' + r.msg + '</p>'
        + '  </div>'
        + '</div>';
    });

    /* Build the full card HTML string */
    var card =
      '<div class="topic-card" id="card-' + topic.id + '" data-cat="' + topic.category + '">'

      /* Top row: avatar, author name, badge, date */
      + '  <div class="topic-top">'
      + '    <div class="avatar">' + topic.initials + '</div>'
      + '    <span class="topic-author">' + topic.author + '</span>'
      + '    <span class="topic-badge ' + topic.category + '">' + capitalise(topic.category) + '</span>'
      + '    <span class="topic-date">📅 ' + topic.date + '</span>'
      + '  </div>'

      /* Discussion title */
      + '  <div class="topic-title">' + topic.title + '</div>'

      /* Message body */
      + '  <div class="topic-msg">' + topic.msg + '</div>'

      /* Footer: like, reply buttons + reply count */
      + '  <div class="topic-footer">'
      + '    <button class="' + likeClass + '" id="like-' + topic.id + '" onclick="likeTopic(' + topic.id + ')">' + likeText + '</button>'
      + '    <button class="btn-action" onclick="openReplyModal(' + topic.id + ', \'' + topic.title.replace(/'/g, "") + '\')">'
      + '      💬 Reply'
      + '    </button>'
      + '    <button class="btn-action" onclick="toggleReplies(' + topic.id + ')">'
      + '      🗨️ View Replies'
      + '    </button>'
      + '    <span class="reply-count">' + replyCount + ' repl' + (replyCount === 1 ? 'y' : 'ies') + '</span>'
      + '  </div>'

      /* Replies section (hidden by default) */
      + '  <div class="replies-section" id="replies-' + topic.id + '">'
      + (repliesHTML || '<p style="color:#aaa;font-size:13px;">No replies yet. Be the first to reply!</p>')
      + '  </div>'

      + '</div>';

    /* Add card to the page */
    container.innerHTML += card;
  });
}

/* ── STEP 6: Filter topics by category ──────────────────── */
function filterTopics(category, clickedBtn) {

  /* Remove active highlight from all buttons */
  var buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(function (b) { b.classList.remove("active"); });

  /* Highlight the clicked button */
  clickedBtn.classList.add("active");

  /* Show all or filtered */
  if (category === "all") {
    renderTopics(topics);
  } else {
    var filtered = topics.filter(function (t) {
      return t.category === category;
    });
    renderTopics(filtered);
  }
}

/* ── STEP 7: Like a topic ────────────────────────────────── */
function likeTopic(id) {

  /* If already liked, do nothing */
  if (likedSet.indexOf(id) !== -1) return;

  /* Add to liked list */
  likedSet.push(id);

  /* Find the topic and increase its like count */
  var topic = topics.find(function (t) { return t.id === id; });
  if (topic) {
    topic.likes++;

    /* Update the like button on screen */
    var btn = document.getElementById("like-" + id);
    if (btn) {
      btn.textContent = "👍 " + topic.likes;
      btn.classList.add("liked");
    }
  }
}

/* ── STEP 8: Show / hide replies section ────────────────── */
function toggleReplies(id) {
  var section = document.getElementById("replies-" + id);
  if (!section) return;

  /* Toggle display between "block" and "none" */
  if (section.style.display === "block") {
    section.style.display = "none";
  } else {
    section.style.display = "block";
  }
}

/* ── STEP 9: Open "Reply" modal ─────────────────────────── */
function openReplyModal(id, title) {
  activeReplyTopicId = id;   /* remember which topic we're replying to */

  var modal     = document.getElementById("replyModal");
  var titleEl   = document.getElementById("replyModalTitle");
  var replyMsg  = document.getElementById("replyMsg");

  if (titleEl)  titleEl.textContent = '💬 Reply to: "' + title + '"';
  if (replyMsg) replyMsg.value = "";

  if (modal) modal.classList.add("open");
}

/* ── STEP 10: Close reply modal ─────────────────────────── */
function closeReplyModal() {
  var modal = document.getElementById("replyModal");
  if (modal) modal.classList.remove("open");
  activeReplyTopicId = null;
}

/* ── STEP 11: Submit a reply ─────────────────────────────── */
function submitReply() {
  var msg = document.getElementById("replyMsg").value.trim();

  /* Validate: message must not be empty */
  if (!msg) {
    showToast("⚠️ Please write something before replying.");
    return;
  }

  /* Get logged-in user's name */
  var data     = sessionStorage.getItem("loggedUser");
  var user     = data ? JSON.parse(data) : { name: "You" };
  var initials = user.name.split(" ").map(function (w) { return w[0]; }).join("").toUpperCase().slice(0, 2);

  /* Find the topic and add the reply to its replies array */
  var topic = topics.find(function (t) { return t.id === activeReplyTopicId; });

  if (topic) {
    topic.replies.push({
      author:   user.name,
      initials: initials,
      msg:      msg
    });

    /* Re-render cards to show the updated reply count */
    renderTopics(topics);

    /* After re-render, auto-show the replies section for this topic */
    var section = document.getElementById("replies-" + activeReplyTopicId);
    if (section) section.style.display = "block";
  }

  closeReplyModal();
  showToast("✅ Your reply was posted!");
}

/* ── STEP 12: Open "New Topic" modal ─────────────────────── */
function openNewTopicModal() {
  var modal = document.getElementById("topicModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 13: Close new topic modal ─────────────────────── */
function closeNewTopicModal() {
  var modal = document.getElementById("topicModal");
  if (modal) modal.classList.remove("open");
}

/* ── STEP 14: Submit a new discussion topic ─────────────── */
function submitTopic() {
  var title    = document.getElementById("topicTitle").value.trim();
  var category = document.getElementById("topicCategory").value;
  var msg      = document.getElementById("topicMsg").value.trim();

  /* Both title and message are required */
  if (!title || !msg) {
    showToast("⚠️ Please fill in the title and message.");
    return;
  }

  /* Get current user info */
  var data     = sessionStorage.getItem("loggedUser");
  var user     = data ? JSON.parse(data) : { name: "Resident" };
  var initials = user.name.split(" ").map(function (w) { return w[0]; }).join("").toUpperCase().slice(0, 2);

  /* Today's date as a readable string */
  var today  = new Date();
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var dateStr = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();

  /* Build the new topic object */
  var newTopic = {
    id:       topics.length + 1,
    author:   user.name,
    initials: initials,
    category: category,
    title:    title,
    msg:      msg,
    date:     dateStr,
    likes:    0,
    replies:  []
  };

  /* Add to the front so it shows at the top */
  topics.unshift(newTopic);

  /* Clear form fields */
  document.getElementById("topicTitle").value = "";
  document.getElementById("topicMsg").value   = "";

  closeNewTopicModal();
  renderTopics(topics);
  showToast("✅ Your discussion was posted!");
}

/* Close modals when clicking the dark background overlay */
document.addEventListener("click", function (e) {
  var topicModal = document.getElementById("topicModal");
  var replyModal = document.getElementById("replyModal");

  if (topicModal && e.target === topicModal) closeNewTopicModal();
  if (replyModal && e.target === replyModal) closeReplyModal();
});

/* ── STEP 15: Toast notification ─────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

/* ── STEP 16: Logout ─────────────────────────────────────── */
function logout() {
  var confirmed = confirm("Are you sure you want to logout?");
  if (confirmed) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 17: Live clock in navbar ──────────────────────── */
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

/* ── Helper: capitalise first letter of a string ── */
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
