/**
 * Mera Ilaka — Sidebar HTML injector
 * ─────────────────────────────────────────────────────────────────────────────
 * Some pages (e.g. community.html, marketplace.html …) do NOT have the sidebar
 * written inline in their HTML. This file injects the full sidebar markup into
 * .app-shell so those pages share the exact same navigation.
 *
 * IMPORTANT: If the page already contains <aside id="sidebar"> in its HTML
 * (e.g. dashboard.html), this script safely skips injection to avoid creating
 * duplicate elements with the same ID — which would break getElementById()
 * and all JS that relies on it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const SIDEBAR_HTML = `
<aside class="sidebar" id="sidebar" role="complementary" aria-label="Main navigation">
  <div class="sidebar-header">
    <div class="sidebar-logo" aria-hidden="true">🏘️</div>
    <span class="sidebar-brand">Mera Ilaka</span>
    <button class="sidebar-toggle" id="sidebarToggle" aria-label="Collapse sidebar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </div>

  <nav class="sidebar-nav" role="navigation" aria-label="Main navigation">
    <span class="nav-section-label">Main</span>

    <a href="dashboard.html" class="nav-item" data-page="dashboard.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></span>
      <span class="nav-label">Dashboard</span>
    </a>

    <a href="community.html" class="nav-item" data-page="community.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
      <span class="nav-label">Community Feed</span>
      <span class="nav-badge">5</span>
    </a>

    <a href="marketplace.html" class="nav-item" data-page="marketplace.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></span>
      <span class="nav-label">Marketplace</span>
    </a>

    <span class="nav-section-label">Directory</span>

    <a href="businesses.html" class="nav-item" data-page="businesses.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
      <span class="nav-label">Businesses</span>
    </a>

    <a href="services.html" class="nav-item" data-page="services.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span>
      <span class="nav-label">Service Providers</span>
    </a>

    <a href="events.html" class="nav-item" data-page="events.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span>
      <span class="nav-label">Events</span>
    </a>

    <span class="nav-section-label">Account</span>

    <a href="notifications.html" class="nav-item" data-page="notifications.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span>
      <span class="nav-label">Notifications</span>
      <span class="nav-badge">3</span>
    </a>

    <a href="profile.html" class="nav-item" data-page="profile.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
      <span class="nav-label">My Profile</span>
    </a>

    <a href="settings.html" class="nav-item" data-page="settings.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
      <span class="nav-label">Settings</span>
    </a>

    <a href="admin.html" class="nav-item" data-page="admin.html">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
      <span class="nav-label">Admin Panel</span>
    </a>

    <button class="nav-item nav-logout" data-action="logout" aria-label="Sign out">
      <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
      <span class="nav-label">Logout</span>
    </button>
  </nav>

  <div class="sidebar-footer">
    <div class="sidebar-avatar" id="sidebarAvatar" aria-hidden="true">U</div>
    <div class="sidebar-user-info">
      <div class="sidebar-user-name" id="sidebarUserName">Loading…</div>
      <div class="sidebar-user-role" id="sidebarUserRole">Resident</div>
    </div>
  </div>
</aside>

<div class="sidebar-overlay" id="sidebarOverlay" aria-hidden="true"></div>
`;

/**
 * Inject sidebar into .app-shell ONLY if the page does not already
 * have a #sidebar element in its static HTML.
 *
 * Pages like dashboard.html have the sidebar written inline, so we
 * must skip injection — otherwise two elements share the same id="sidebar"
 * and getElementById returns only the first one (the static one), leaving
 * the injected duplicate dangling and the JS wiring broken.
 */
document.addEventListener('DOMContentLoaded', function () {
  // If #sidebar already exists in the DOM, do nothing.
  if (document.getElementById('sidebar')) {
    return;
  }

  const shell = document.querySelector('.app-shell');
  if (shell) {
    shell.insertAdjacentHTML('afterbegin', SIDEBAR_HTML);
  }
});
