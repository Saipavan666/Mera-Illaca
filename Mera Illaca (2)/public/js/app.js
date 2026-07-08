/**
 * Mera Ilaka — Shared App JavaScript
 * Handles: Sidebar toggle, mobile menu, active nav, toast, modals, session
 */

'use strict';

/* ── Session helpers ─────────────────────────────────────────────────── */
function getUser() {
  const raw = localStorage.getItem('mi_user') || sessionStorage.getItem('mi_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function getToken() {
  return localStorage.getItem('mi_token') || sessionStorage.getItem('mi_token');
}

function logout() {
  ['mi_token', 'mi_user'].forEach(k => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
  window.location.href = 'login.html'; // relative path within /public
}

/* ── Initials from name ───────────────────────────────────────────────── */
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Sidebar management ───────────────────────────────────────────────── */
function initSidebar() {
  const sidebar     = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const toggleBtn   = document.getElementById('sidebarToggle');
  const mobileBtn   = document.getElementById('mobileMenuBtn');
  const overlay     = document.getElementById('sidebarOverlay');

  // Guard: sidebar element must exist before we wire anything up
  if (!sidebar) return;

  // ── Desktop: restore collapsed state from last visit ──
  const isCollapsed = localStorage.getItem('mi_sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('collapsed');
    mainContent && mainContent.classList.add('expanded');
  }

  // ── Desktop: collapse / expand toggle (≡ button inside sidebar header) ──
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      sidebar.classList.toggle('collapsed');
      mainContent && mainContent.classList.toggle('expanded');
      localStorage.setItem(
        'mi_sidebar_collapsed',
        sidebar.classList.contains('collapsed').toString()
      );
    });
  }

  // ── Mobile: hamburger button opens the sidebar ──
  if (mobileBtn) {
    mobileBtn.addEventListener('click', function () {
      sidebar.classList.add('mobile-open');
      if (overlay) {
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
      }
      // Prevent body scroll while sidebar is open on mobile
      document.body.style.overflow = 'hidden';
    });
  }

  // ── Helper: close mobile sidebar ──
  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  // ── Mobile: tap overlay to close sidebar ──
  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }

  // ── Mobile: pressing Escape closes the sidebar ──
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeMobileSidebar();
    }
  });
}

/* ── Populate sidebar user info ────────────────────────────────────────── */
function populateSidebarUser() {
  const user = getUser();
  const name   = document.getElementById('sidebarUserName');
  const role   = document.getElementById('sidebarUserRole');
  const avatar = document.getElementById('sidebarAvatar');

  if (name) name.textContent = user?.fullName || 'Guest User';
  if (role) role.textContent = user?.role ? capitalise(user.role) : 'Resident';
  if (avatar) avatar.textContent = getInitials(user?.fullName || 'G');

  // Header avatar
  const headerAvatar = document.getElementById('headerAvatar');
  if (headerAvatar) headerAvatar.textContent = getInitials(user?.fullName || 'G');
}

function capitalise(str) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ── Mark active nav item ─────────────────────────────────────────────── */
function markActiveNav() {
  const page = location.pathname.split('/').pop() || 'dashboard.html';
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.dataset.page === page) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/* ── Toast notifications ──────────────────────────────────────────────── */
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Modal helpers ────────────────────────────────────────────────────── */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('hidden');
}

/* ── Format date helpers ──────────────────────────────────────────────── */
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

/* ── Init everything on DOMContentLoaded ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  populateSidebarUser();
  markActiveNav();

  // Logout buttons (both data-action="logout" and .nav-logout)
  document.querySelectorAll('[data-action="logout"], .nav-logout').forEach(btn => {
    btn.addEventListener('click', logout);
  });

  // Close modals when clicking overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.add('hidden');
    });
  });
});
