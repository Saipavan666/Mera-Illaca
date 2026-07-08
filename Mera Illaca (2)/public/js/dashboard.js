/**
 * Mera Ilaka — Dashboard JavaScript
 * ─────────────────────────────────────────────────────────────
 * Sections:
 *   1. Welcome Banner  (greeting + live clock)
 *   2. Quick Statistics (animated counters)
 *   3. Recent Activities
 *   4. Announcements
 *   5. Notifications Preview
 *   6. Upcoming Events Preview (with RSVP toggle)
 *
 * Pure frontend — all data is static/dummy.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   STATIC DATA
   ══════════════════════════════════════════════════════════════ */

const ACTIVITIES = [
  {
    icon:   '💬',
    iconBg: '#fff7ed',
    title:  'Ahmed Khan posted a community update',
    place:  'DHA Phase 5',
    time:   '5 min ago',
    action: 'View Post',
    link:   'community.html'
  },
  {
    icon:   '🛒',
    iconBg: '#eff6ff',
    title:  'New marketplace listing: iPhone 14 — PKR 145,000',
    place:  'Marketplace',
    time:   '22 min ago',
    action: 'View Listing',
    link:   'marketplace.html'
  },
  {
    icon:   '🔧',
    iconBg: '#f0fdf4',
    title:  'Ali Electricals added 3 new services',
    place:  'Services',
    time:   '1 hr ago',
    action: 'View Profile',
    link:   'services.html'
  },
  {
    icon:   '📅',
    iconBg: '#faf5ff',
    title:  'Community Clean-up Drive scheduled for July 12',
    place:  'Events',
    time:   '2 hr ago',
    action: 'RSVP Now',
    link:   'events.html'
  },
  {
    icon:   '🏢',
    iconBg: '#ecfeff',
    title:  'Naan & Karahi restaurant opened in Phase 5',
    place:  'Businesses',
    time:   '3 hr ago',
    action: 'View Details',
    link:   'businesses.html'
  },
  {
    icon:   '📸',
    iconBg: '#fff5f5',
    title:  'Sara Malik shared photos from last week\'s park event',
    place:  'Community Feed',
    time:   '5 hr ago',
    action: 'See Photos',
    link:   'community.html'
  }
];

const ANNOUNCEMENTS = [
  {
    icon:      '🏛️',
    iconBg:   '#eff6ff',
    title:     'Water Supply Maintenance — Saturday, July 12',
    body:      'Water supply will be suspended in sectors C-1 to C-8 on Saturday, July 12 from 8:00 AM to 2:00 PM for routine pipeline maintenance work.',
    tag:       'Official',
    tagClass:  'tag-blue',
    time:      '2 hr ago',
    authority: 'WASA Lahore'
  },
  {
    icon:      '⚠️',
    iconBg:   '#fff5f5',
    title:     'Road Construction — Main Boulevard',
    body:      'Main Boulevard will be partially closed near the commercial roundabout for approximately 3 weeks starting July 10. Please use alternate routes via Street 26.',
    tag:       'Alert',
    tagClass:  'tag-red',
    time:      '5 hr ago',
    authority: 'LDA'
  },
  {
    icon:      '🌳',
    iconBg:   '#f0fdf4',
    title:     'Tree Plantation Drive — This Sunday',
    body:      'Join the community tree plantation drive this Sunday, July 13 at 8:00 AM at Central Park Main Gate. Saplings will be provided free of charge by the Parks Department.',
    tag:       'Community',
    tagClass:  'tag-green',
    time:      '1 day ago',
    authority: 'Parks Department'
  }
];

const NOTIFICATIONS = [
  { id: 1, text: 'Your marketplace listing has 3 new enquiries.', time: '2 min ago',  read: false, icon: '🛒' },
  { id: 2, text: 'Ahmed Khan commented on your post.',            time: '18 min ago', read: false, icon: '💬' },
  { id: 3, text: 'Community meeting reminder: Tomorrow at 5 PM.', time: '1 hr ago',   read: false, icon: '📅' },
  { id: 4, text: 'Your profile was viewed 12 times today.',       time: '3 hr ago',   read: true,  icon: '👤' }
];

const EVENTS = [
  { day: '12', month: 'Jul', name: 'Community Clean-up Drive',   loc: 'Central Park',       rsvp: false },
  { day: '15', month: 'Jul', name: 'Neighborhood Sports Day',    loc: 'DHA Sports Club',    rsvp: false },
  { day: '19', month: 'Jul', name: 'Local Business Expo',        loc: 'Community Hall',     rsvp: true  },
  { day: '25', month: 'Jul', name: 'Eid Milad Celebration',      loc: 'Main Masjid',        rsvp: false }
];

/* track RSVP state in memory */
const rsvpState = {};
EVENTS.forEach((ev, i) => { rsvpState[i] = ev.rsvp; });

/* ══════════════════════════════════════════════════════════════
   1. WELCOME BANNER — greeting + live clock
   ══════════════════════════════════════════════════════════════ */

function updateClock() {
  const now  = new Date();
  const hour = now.getHours();

  /* greeting */
  let greet, emoji;
  if (hour < 5)       { greet = 'Good night';      emoji = '🌙'; }
  else if (hour < 12) { greet = 'Good morning';    emoji = '☀️'; }
  else if (hour < 17) { greet = 'Good afternoon';  emoji = '🌤️'; }
  else if (hour < 20) { greet = 'Good evening';    emoji = '🌆'; }
  else                { greet = 'Good night';       emoji = '🌙'; }

  const user     = getUser();
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  const msgEl   = document.getElementById('welcomeMsg');
  const subEl   = document.getElementById('welcomeSub');
  const emojiEl = document.getElementById('welcomeEmoji');

  if (msgEl)   msgEl.textContent  = `${greet}, ${firstName}!`;
  if (subEl)   subEl.textContent  = "Here's what's happening in your neighborhood today.";
  if (emojiEl) emojiEl.textContent = emoji;

  /* date parts */
  const dayEl  = document.getElementById('welcomeDay');
  const dateEl = document.getElementById('welcomeDate');
  const timeEl = document.getElementById('welcomeTime');

  if (dayEl)  dayEl.textContent  = now.toLocaleDateString('en-PK', { weekday: 'long' });
  if (dateEl) dateEl.textContent = now.toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' });

  /* live time — HH:MM:SS */
  if (timeEl) {
    const hh = String(hour).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    timeEl.textContent = `${hh}:${mm}:${ss}`;
  }
}

/* ══════════════════════════════════════════════════════════════
   2. QUICK STATISTICS — animated counter
   ══════════════════════════════════════════════════════════════ */

/**
 * Animate a number from 0 → target over ~1200 ms using easeOut.
 * @param {HTMLElement} el
 * @param {number} target
 */
function animateCounter(el, target) {
  if (!el) return;
  const duration  = 1200;  /* ms */
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    /* easeOutQuart */
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = Math.round(eased * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initCounters() {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    animateCounter(el, target);
  });
}

/* ══════════════════════════════════════════════════════════════
   3. RECENT ACTIVITIES
   ══════════════════════════════════════════════════════════════ */

function renderActivities() {
  const container = document.getElementById('activityFeed');
  if (!container) return;

  container.innerHTML = ACTIVITIES.map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${a.iconBg};" aria-hidden="true">${a.icon}</div>
      <div class="activity-content">
        <div class="activity-title">${a.title}</div>
        <div class="activity-meta">
          <span>${a.place}</span>
          <span class="dot" aria-hidden="true"></span>
          <span>${a.time}</span>
        </div>
      </div>
      <a href="${a.link}" class="activity-action">${a.action}</a>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════════════
   4. ANNOUNCEMENTS
   ══════════════════════════════════════════════════════════════ */

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  if (!container) return;

  container.innerHTML = ANNOUNCEMENTS.map(a => `
    <div class="announcement-item">
      <div class="announcement-header">
        <div class="announcement-icon-wrap" style="background:${a.iconBg};" aria-hidden="true">${a.icon}</div>
        <div class="announcement-title-wrap">
          <div class="announcement-title">${a.title}</div>
          <span class="tag ${a.tagClass}">${a.tag} · ${a.authority}</span>
        </div>
      </div>
      <div class="announcement-body">${a.body}</div>
      <div class="announcement-footer">
        <span class="text-sm text-muted">${a.time}</span>
        <button
          class="btn btn-sm btn-secondary"
          onclick="showToast('Opening full announcement…', 'info')"
          aria-label="Read full announcement: ${a.title}"
        >Read More</button>
      </div>
    </div>
  `).join('');
}

/* ══════════════════════════════════════════════════════════════
   5. NOTIFICATIONS PREVIEW
   ══════════════════════════════════════════════════════════════ */

function renderNotifPreview() {
  const container = document.getElementById('notifPreview');
  if (!container) return;

  /* count unread */
  const unread = NOTIFICATIONS.filter(n => !n.read).length;
  const badge  = document.getElementById('notifCountBadge');
  if (badge) {
    badge.textContent    = unread;
    badge.style.display  = unread ? 'inline-flex' : 'none';
  }
  const navBadge = document.getElementById('navBadgeNotif');
  if (navBadge) navBadge.textContent = unread;

  container.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-preview-item" role="article" onclick="markNotifRead(${n.id})">
      <div class="notif-dot ${n.read ? 'read' : ''}" aria-label="${n.read ? 'Read' : 'Unread'}"></div>
      <div class="notif-preview-body">
        <div class="notif-preview-text" style="font-weight:${n.read ? '400' : '600'};">${n.icon} ${n.text}</div>
        <div class="notif-preview-time">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function markNotifRead(id) {
  const notif = NOTIFICATIONS.find(n => n.id === id);
  if (notif && !notif.read) {
    notif.read = true;
    renderNotifPreview();
    showToast('Notification marked as read.', 'info', 1800);
  }
}

/* ══════════════════════════════════════════════════════════════
   6. UPCOMING EVENTS PREVIEW
   ══════════════════════════════════════════════════════════════ */

function renderEventsPreview() {
  const container = document.getElementById('eventsPreview');
  if (!container) return;

  container.innerHTML = EVENTS.map((ev, i) => `
    <div class="event-preview-item">
      <div class="event-date-badge" aria-label="${ev.month} ${ev.day}">
        <div class="event-date-day">${ev.day}</div>
        <div class="event-date-month">${ev.month}</div>
      </div>
      <div class="event-info">
        <div class="event-name">${ev.name}</div>
        <div class="event-loc">📍 ${ev.loc}</div>
      </div>
      <button
        class="event-rsvp-btn ${rsvpState[i] ? 'rsvpd' : ''}"
        id="rsvpBtn${i}"
        onclick="toggleEventRsvp(${i})"
        aria-pressed="${rsvpState[i]}"
        aria-label="${rsvpState[i] ? 'Cancel RSVP for' : 'RSVP for'} ${ev.name}"
      >${rsvpState[i] ? '✓ RSVP\'d' : 'RSVP'}</button>
    </div>
  `).join('');
}

function toggleEventRsvp(index) {
  rsvpState[index] = !rsvpState[index];
  const ev  = EVENTS[index];
  const msg = rsvpState[index]
    ? `You're going to "${ev.name}"! 🎉`
    : `RSVP cancelled for "${ev.name}".`;
  showToast(msg, rsvpState[index] ? 'success' : 'info');
  renderEventsPreview();
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR USER INFO  (fallback populate)
   ══════════════════════════════════════════════════════════════ */
function populateSidebarUserDash() {
  const user = getUser();
  const nameEl   = document.getElementById('sidebarUserName');
  const roleEl   = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarAvatar');
  const hdrEl    = document.getElementById('headerAvatar');

  const name = user?.fullName || 'Guest User';
  const role = user?.role
    ? user.role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'Resident';

  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  if (nameEl)   nameEl.textContent   = name;
  if (roleEl)   roleEl.textContent   = role;
  if (avatarEl) avatarEl.textContent = initials;
  if (hdrEl)    hdrEl.textContent    = initials;
}

/* ══════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — trigger counters when visible
   ══════════════════════════════════════════════════════════════ */
function observeCounters() {
  const statsSection = document.querySelector('.stats-grid');
  if (!statsSection) { initCounters(); return; }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initCounters();
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    io.observe(statsSection);
  } else {
    initCounters();
  }
}

/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  /* 1. Welcome + live clock */
  updateClock();
  setInterval(updateClock, 1000);

  /* 2. Sidebar user details */
  populateSidebarUserDash();

  /* 3. Animated stat counters (on scroll into view) */
  observeCounters();

  /* 4. Activities */
  renderActivities();

  /* 5. Announcements */
  renderAnnouncements();

  /* 6. Notifications preview */
  renderNotifPreview();

  /* 7. Events preview */
  renderEventsPreview();
});
