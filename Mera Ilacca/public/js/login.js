/**
 * Mera Ilaka — Login Page JavaScript
 * Handles: tab switching, form validation, API calls, password strength
 */

'use strict';

// ── Configuration ──────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:5000/api';

// ── Tab Switcher ──────────────────────────────────────────────────────────────

/**
 * Switch between login / register / forgot panels.
 * @param {'login'|'register'|'forgot'} tab
 */
function switchTab(tab) {
  // Hide all panels
  document.querySelectorAll('.form-panel').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach((t) => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });

  // Clear alerts
  clearAlert('login-alert');
  clearAlert('register-alert');
  clearAlert('forgot-alert');

  // Show target panel
  const panel = document.getElementById(`panel-${tab}`);
  if (panel) panel.classList.add('active');

  // Activate matching tab button (login / register only)
  const tabBtn = document.getElementById(`tab-${tab}`);
  if (tabBtn) {
    tabBtn.classList.add('active');
    tabBtn.setAttribute('aria-selected', 'true');
  }
}

// ── Alert helpers ─────────────────────────────────────────────────────────────

function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  const icon = type === 'success' ? '✅' : type === 'info' ? 'ℹ️' : '⚠️';
  el.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  el.className = `alert ${type}`;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

// ── Field error helpers ───────────────────────────────────────────────────────

function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (input) input.classList.remove('success');
  if (error) error.textContent = message;
}

function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) {
    input.classList.remove('error');
    if (input.value.trim()) input.classList.add('success');
  }
  if (error) error.textContent = '';
}

function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('input, select').forEach((el) => {
    el.classList.remove('error', 'success');
  });
  form.querySelectorAll('.field-error').forEach((el) => {
    el.textContent = '';
  });
}

// ── Validation helpers ────────────────────────────────────────────────────────

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPhone = (phone) =>
  !phone || /^[\+\d\s\-\(\)]{7,15}$/.test(phone.trim());

// ── Password visibility toggle ────────────────────────────────────────────────

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');

  // Swap icon
  const svg = btn.querySelector('svg');
  if (svg) {
    svg.innerHTML = isHidden
      ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
      : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
}

// ── Password strength meter ───────────────────────────────────────────────────

function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: 'Too short', color: '#ef4444', pct: '10%' },
    { label: 'Weak',      color: '#ef4444', pct: '25%' },
    { label: 'Fair',      color: '#f59e0b', pct: '50%' },
    { label: 'Good',      color: '#3b82f6', pct: '75%' },
    { label: 'Strong',    color: '#22c55e', pct: '90%' },
    { label: 'Very strong', color: '#16a34a', pct: '100%' }
  ];

  const level = password.length === 0 ? null : levels[Math.min(score, 5)];

  const fill  = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');
  const block = document.getElementById('password-strength');

  if (!level) {
    if (fill)  fill.style.width = '0%';
    if (label) label.textContent = '';
    if (block) block.style.display = 'none';
    return;
  }

  if (block) block.style.display = 'flex';
  if (fill)  { fill.style.width = level.pct; fill.style.background = level.color; }
  if (label) { label.textContent = level.label; label.style.color = level.color; }
}

// ── Button loading state ──────────────────────────────────────────────────────

function setLoading(btnId, loading) {
  const btn  = document.getElementById(btnId);
  if (!btn) return;
  const text   = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (loading) {
    if (text)   text.style.opacity = '0.6';
    if (loader) loader.classList.remove('hidden');
  } else {
    if (text)   text.style.opacity = '1';
    if (loader) loader.classList.add('hidden');
  }
}

// ── API call wrapper ──────────────────────────────────────────────────────────

async function apiPost(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  return { ok: res.ok, status: res.status, ...json };
}

// ── Token storage ─────────────────────────────────────────────────────────────

function saveSession(token, user, remember) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('mi_token', token);
  storage.setItem('mi_user', JSON.stringify(user));
}

function getToken() {
  return localStorage.getItem('mi_token') || sessionStorage.getItem('mi_token');
}

// ── LOGIN form ────────────────────────────────────────────────────────────────

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors('loginForm');
  clearAlert('login-alert');

  const email      = document.getElementById('login-email').value.trim();
  const password   = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  // Client-side validation
  let valid = true;

  if (!email) {
    setFieldError('login-email', 'login-email-error', 'Email is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setFieldError('login-email', 'login-email-error', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearFieldError('login-email', 'login-email-error');
  }

  if (!password) {
    setFieldError('login-password', 'login-password-error', 'Password is required.');
    valid = false;
  } else {
    clearFieldError('login-password', 'login-password-error');
  }

  if (!valid) return;

  setLoading('login-btn', true);

  try {
    const result = await apiPost('/auth/login', { email, password, rememberMe });

    if (result.success) {
      saveSession(result.token, result.user, rememberMe);
      showAlert('login-alert', result.message || 'Login successful!', 'success');

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1200);
    } else {
      showAlert('login-alert', result.message || 'Login failed. Please try again.', 'error');
    }
  } catch (err) {
    // Network / server unreachable
    showAlert(
      'login-alert',
      '⚡ Could not reach the server. Check your connection or ensure the server is running.',
      'error'
    );
  } finally {
    setLoading('login-btn', false);
  }
});

// ── REGISTER form ─────────────────────────────────────────────────────────────

document.getElementById('reg-password').addEventListener('input', function () {
  checkPasswordStrength(this.value);
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAllErrors('registerForm');
  clearAlert('register-alert');

  const fullName        = document.getElementById('reg-fullname').value.trim();
  const email           = document.getElementById('reg-email').value.trim();
  const phone           = document.getElementById('reg-phone').value.trim();
  const role            = document.getElementById('reg-role').value;
  const neighborhood    = document.getElementById('reg-neighborhood').value.trim();
  const password        = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  const terms           = document.getElementById('reg-terms').checked;

  let valid = true;

  if (!fullName || fullName.length < 3) {
    setFieldError('reg-fullname', 'reg-fullname-error', 'Name must be at least 3 characters.');
    valid = false;
  } else {
    clearFieldError('reg-fullname', 'reg-fullname-error');
  }

  if (!email) {
    setFieldError('reg-email', 'reg-email-error', 'Email is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setFieldError('reg-email', 'reg-email-error', 'Please enter a valid email address.');
    valid = false;
  } else {
    clearFieldError('reg-email', 'reg-email-error');
  }

  if (phone && !isValidPhone(phone)) {
    setFieldError('reg-phone', 'reg-phone-error', 'Please enter a valid phone number.');
    valid = false;
  } else {
    clearFieldError('reg-phone', 'reg-phone-error');
  }

  if (!password || password.length < 6) {
    setFieldError('reg-password', 'reg-password-error', 'Password must be at least 6 characters.');
    valid = false;
  } else {
    clearFieldError('reg-password', 'reg-password-error');
  }

  if (!confirmPassword) {
    setFieldError('reg-confirm-password', 'reg-confirm-error', 'Please confirm your password.');
    valid = false;
  } else if (password !== confirmPassword) {
    setFieldError('reg-confirm-password', 'reg-confirm-error', 'Passwords do not match.');
    valid = false;
  } else {
    clearFieldError('reg-confirm-password', 'reg-confirm-error');
  }

  if (!terms) {
    document.getElementById('reg-terms-error').textContent =
      'You must agree to the Terms of Service to continue.';
    valid = false;
  } else {
    document.getElementById('reg-terms-error').textContent = '';
  }

  if (!valid) return;

  setLoading('register-btn', true);

  try {
    const result = await apiPost('/auth/register', {
      fullName,
      email,
      phone,
      role,
      neighborhood,
      password
    });

    if (result.success) {
      saveSession(result.token, result.user, false);
      showAlert('register-alert', result.message || 'Account created!', 'success');
      document.getElementById('registerForm').reset();
      checkPasswordStrength('');

      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500);
    } else {
      showAlert('register-alert', result.message || 'Registration failed.', 'error');
    }
  } catch (err) {
    showAlert(
      'register-alert',
      '⚡ Could not reach the server. Check your connection or ensure the server is running.',
      'error'
    );
  } finally {
    setLoading('register-btn', false);
  }
});

// ── FORGOT PASSWORD form ──────────────────────────────────────────────────────

document.getElementById('forgotForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert('forgot-alert');

  const email = document.getElementById('forgot-email').value.trim();

  if (!email) {
    setFieldError('forgot-email', 'forgot-email-error', 'Email is required.');
    return;
  }
  if (!isValidEmail(email)) {
    setFieldError('forgot-email', 'forgot-email-error', 'Please enter a valid email address.');
    return;
  }
  clearFieldError('forgot-email', 'forgot-email-error');

  setLoading('forgot-btn', true);

  try {
    const result = await apiPost('/auth/forgot-password', { email });
    showAlert('forgot-alert', result.message, result.success ? 'info' : 'error');
    if (result.success) document.getElementById('forgotForm').reset();
  } catch (err) {
    showAlert('forgot-alert', '⚡ Could not reach the server.', 'error');
  } finally {
    setLoading('forgot-btn', false);
  }
});

// ── Real-time inline validation ───────────────────────────────────────────────

document.getElementById('login-email').addEventListener('blur', function () {
  if (this.value && !isValidEmail(this.value)) {
    setFieldError('login-email', 'login-email-error', 'Please enter a valid email address.');
  } else if (this.value) {
    clearFieldError('login-email', 'login-email-error');
  }
});

document.getElementById('reg-email').addEventListener('blur', function () {
  if (this.value && !isValidEmail(this.value)) {
    setFieldError('reg-email', 'reg-email-error', 'Please enter a valid email address.');
  } else if (this.value) {
    clearFieldError('reg-email', 'reg-email-error');
  }
});

document.getElementById('reg-confirm-password').addEventListener('input', function () {
  const pwd = document.getElementById('reg-password').value;
  if (this.value && this.value !== pwd) {
    setFieldError('reg-confirm-password', 'reg-confirm-error', 'Passwords do not match.');
  } else if (this.value) {
    clearFieldError('reg-confirm-password', 'reg-confirm-error');
  }
});

// ── On page load: check if already logged in ──────────────────────────────────
(function checkExistingSession() {
  const token = getToken();
  if (token) {
    // Optionally redirect to dashboard
    // window.location.href = '/dashboard.html';
  }
})();
