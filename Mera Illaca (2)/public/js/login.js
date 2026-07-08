/**
 * Mera Ilaka — Login / Register / Forgot Password
 * ─────────────────────────────────────────────────
 * 100% frontend — no backend / API calls required.
 * Uses localStorage for demo session persistence.
 */

'use strict';

/* ════════════════════════════════════════════════════
   TAB SWITCHER
   ════════════════════════════════════════════════════ */

/**
 * Show one of: 'login' | 'register' | 'forgot'
 * @param {string} tab
 */
function switchTab(tab) {
  /* hide all panels */
  document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));

  /* reset tab buttons */
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });

  /* clear all alert banners */
  ['login-alert', 'register-alert', 'forgot-alert'].forEach(clearAlert);

  /* activate the requested panel */
  const panel = document.getElementById('panel-' + tab);
  if (panel) panel.classList.add('active');

  /* activate the matching tab button (login / register only) */
  const tabBtn = document.getElementById('tab-' + tab);
  if (tabBtn) {
    tabBtn.classList.add('active');
    tabBtn.setAttribute('aria-selected', 'true');
  }

  /* scroll form card to top */
  const card = document.querySelector('.form-card');
  if (card) card.scrollTop = 0;
}

/* ════════════════════════════════════════════════════
   ALERT HELPERS
   ════════════════════════════════════════════════════ */

function showAlert(id, message, type) {
  const el = document.getElementById(id);
  if (!el) return;
  const icons = { success: '✅', error: '⚠️', info: 'ℹ️', warning: '⚠️' };
  el.innerHTML = `<span>${icons[type] || '⚠️'}</span><span>${message}</span>`;
  el.className = 'alert ' + type;
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('hidden'); el.innerHTML = ''; }
}

/* ════════════════════════════════════════════════════
   FIELD ERROR HELPERS
   ════════════════════════════════════════════════════ */

function setFieldError(inputId, errorId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (inp) { inp.classList.add('error'); inp.classList.remove('success'); }
  if (err) err.textContent = msg;
}

function clearFieldError(inputId, errorId) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (inp) {
    inp.classList.remove('error');
    if (inp.value.trim()) inp.classList.add('success');
  }
  if (err) err.textContent = '';
}

function clearAllErrors(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.querySelectorAll('input, select').forEach(el => el.classList.remove('error', 'success'));
  form.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
}

/* ════════════════════════════════════════════════════
   VALIDATION HELPERS
   ════════════════════════════════════════════════════ */

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
const isValidPhone = phone => !phone || /^[\+\d\s\-\(\)]{7,15}$/.test(phone.trim());

/* ════════════════════════════════════════════════════
   PASSWORD TOGGLE
   ════════════════════════════════════════════════════ */

function togglePassword(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  const svg = btn.querySelector('svg');
  if (!svg) return;
  svg.innerHTML = show
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
}

/* ════════════════════════════════════════════════════
   PASSWORD STRENGTH METER
   ════════════════════════════════════════════════════ */

function checkPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 6)              score++;
  if (pwd.length >= 10)             score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;

  const LEVELS = [
    { label: 'Too short', color: '#ef4444', pct: '8%'  },
    { label: 'Weak',      color: '#ef4444', pct: '25%' },
    { label: 'Fair',      color: '#f59e0b', pct: '50%' },
    { label: 'Good',      color: '#3b82f6', pct: '75%' },
    { label: 'Strong',    color: '#22c55e', pct: '90%' },
    { label: 'Very strong', color: '#16a34a', pct: '100%' }
  ];

  const block  = document.getElementById('password-strength');
  const fill   = document.getElementById('strength-fill');
  const label  = document.getElementById('strength-label');

  if (!pwd.length) {
    if (block)  block.style.display = 'none';
    if (fill)   fill.style.width = '0%';
    if (label)  label.textContent = '';
    return;
  }

  const lvl = LEVELS[Math.min(score, 5)];
  if (block)  block.style.display = 'flex';
  if (fill)   { fill.style.width = lvl.pct; fill.style.background = lvl.color; }
  if (label)  { label.textContent = lvl.label; label.style.color = lvl.color; }
}

/* ════════════════════════════════════════════════════
   BUTTON LOADING STATE
   ════════════════════════════════════════════════════ */

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const txt = btn.querySelector('.btn-text');
  const ldr = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (txt) txt.style.opacity = loading ? '0.6' : '1';
  if (ldr) ldr.classList.toggle('hidden', !loading);
}

/* ════════════════════════════════════════════════════
   SESSION STORAGE (frontend-only demo)
   ════════════════════════════════════════════════════ */

function saveSession(user, remember) {
  /* Generate a fake token for demo */
  const token = 'demo-token-' + Date.now();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem('mi_token', token);
  storage.setItem('mi_user',  JSON.stringify(user));
}

function getToken() {
  return localStorage.getItem('mi_token') || sessionStorage.getItem('mi_token');
}

/* ════════════════════════════════════════════════════
   DEMO USER STORE  (simulates a users database)
   ════════════════════════════════════════════════════ */

function getRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem('mi_registered_users') || '[]');
  } catch { return []; }
}

function saveRegisteredUsers(users) {
  localStorage.setItem('mi_registered_users', JSON.stringify(users));
}

/* ════════════════════════════════════════════════════
   LOGIN FORM
   ════════════════════════════════════════════════════ */

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  clearAllErrors('loginForm');
  clearAlert('login-alert');

  const email      = document.getElementById('login-email').value.trim();
  const password   = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  /* ── Client-side validation ── */
  let valid = true;

  if (!email) {
    setFieldError('login-email', 'login-email-error', 'Email address is required.');
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

  /* ── Demo login: check stored users ── */
  setLoading('login-btn', true);

  /* Simulate a short "network" delay for realism */
  setTimeout(() => {
    const users = getRegisteredUsers();

    /* Accept any @demo.com address as a quick demo shortcut */
    const isDemo = email.endsWith('@demo.com') && password.length >= 3;
    const found  = users.find(u => u.email === email && u.password === password);

    if (found || isDemo) {
      const user = found || {
        fullName:     'Demo User',
        email:        email,
        phone:        '',
        role:         'resident',
        neighborhood: 'DHA Phase 5'
      };

      saveSession(user, rememberMe);
      showAlert('login-alert', '✅ Login successful! Redirecting to your dashboard…', 'success');

      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1300);
    } else {
      setLoading('login-btn', false);
      /* Show inline error without revealing which field is wrong */
      showAlert('login-alert', 'Incorrect email or password. Please try again.', 'error');
      document.getElementById('login-password').value = '';
      document.getElementById('login-password').focus();
    }
  }, 800);
});

/* ════════════════════════════════════════════════════
   REGISTER FORM
   ════════════════════════════════════════════════════ */

/* Live password strength */
document.getElementById('reg-password').addEventListener('input', function () {
  checkPasswordStrength(this.value);
});

/* Live confirm-password match check */
document.getElementById('reg-confirm-password').addEventListener('input', function () {
  const pwd = document.getElementById('reg-password').value;
  if (this.value && this.value !== pwd) {
    setFieldError('reg-confirm-password', 'reg-confirm-error', 'Passwords do not match.');
  } else if (this.value) {
    clearFieldError('reg-confirm-password', 'reg-confirm-error');
  }
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();
  clearAllErrors('registerForm');
  clearAlert('register-alert');

  const fullName     = document.getElementById('reg-fullname').value.trim();
  const email        = document.getElementById('reg-email').value.trim();
  const phone        = document.getElementById('reg-phone').value.trim();
  const role         = document.getElementById('reg-role').value;
  const neighborhood = document.getElementById('reg-neighborhood').value.trim();
  const password     = document.getElementById('reg-password').value;
  const confirm      = document.getElementById('reg-confirm-password').value;
  const terms        = document.getElementById('reg-terms').checked;

  let valid = true;

  /* Full name */
  if (!fullName || fullName.length < 3) {
    setFieldError('reg-fullname', 'reg-fullname-error', 'Full name must be at least 3 characters.');
    valid = false;
  } else {
    clearFieldError('reg-fullname', 'reg-fullname-error');
  }

  /* Email */
  if (!email) {
    setFieldError('reg-email', 'reg-email-error', 'Email address is required.');
    valid = false;
  } else if (!isValidEmail(email)) {
    setFieldError('reg-email', 'reg-email-error', 'Please enter a valid email address.');
    valid = false;
  } else {
    /* Check if email already registered */
    const existing = getRegisteredUsers().find(u => u.email === email);
    if (existing) {
      setFieldError('reg-email', 'reg-email-error', 'This email is already registered. Sign in instead.');
      valid = false;
    } else {
      clearFieldError('reg-email', 'reg-email-error');
    }
  }

  /* Phone (optional) */
  if (phone && !isValidPhone(phone)) {
    setFieldError('reg-phone', 'reg-phone-error', 'Please enter a valid phone number.');
    valid = false;
  } else {
    clearFieldError('reg-phone', 'reg-phone-error');
  }

  /* Password */
  if (!password || password.length < 6) {
    setFieldError('reg-password', 'reg-password-error', 'Password must be at least 6 characters.');
    valid = false;
  } else {
    clearFieldError('reg-password', 'reg-password-error');
  }

  /* Confirm password */
  if (!confirm) {
    setFieldError('reg-confirm-password', 'reg-confirm-error', 'Please confirm your password.');
    valid = false;
  } else if (password !== confirm) {
    setFieldError('reg-confirm-password', 'reg-confirm-error', 'Passwords do not match.');
    valid = false;
  } else {
    clearFieldError('reg-confirm-password', 'reg-confirm-error');
  }

  /* Terms */
  const termsErr = document.getElementById('reg-terms-error');
  if (!terms) {
    if (termsErr) termsErr.textContent = 'You must agree to the Terms of Service to continue.';
    valid = false;
  } else {
    if (termsErr) termsErr.textContent = '';
  }

  if (!valid) return;

  setLoading('register-btn', true);

  setTimeout(() => {
    /* Save new user to demo store */
    const newUser = { fullName, email, phone, role, neighborhood, password };
    const users   = getRegisteredUsers();
    users.push(newUser);
    saveRegisteredUsers(users);

    /* Auto-login the new user */
    saveSession(newUser, false);

    showAlert('register-alert', `🎉 Welcome, ${fullName}! Your account has been created. Redirecting…`, 'success');
    document.getElementById('registerForm').reset();
    checkPasswordStrength('');

    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
  }, 900);
});

/* ════════════════════════════════════════════════════
   FORGOT PASSWORD FORM
   ════════════════════════════════════════════════════ */

document.getElementById('forgotForm').addEventListener('submit', function (e) {
  e.preventDefault();
  clearAlert('forgot-alert');

  const email = document.getElementById('forgot-email').value.trim();

  /* Validation */
  if (!email) {
    setFieldError('forgot-email', 'forgot-email-error', 'Email address is required.');
    return;
  }
  if (!isValidEmail(email)) {
    setFieldError('forgot-email', 'forgot-email-error', 'Please enter a valid email address.');
    return;
  }
  clearFieldError('forgot-email', 'forgot-email-error');

  setLoading('forgot-btn', true);

  setTimeout(() => {
    setLoading('forgot-btn', false);

    /* Check if this email exists in demo store */
    const users = getRegisteredUsers();
    const found = users.find(u => u.email === email);

    /* Security best-practice: always show the same success-like message
       regardless of whether the email exists (prevents user enumeration). */
    showAlert(
      'forgot-alert',
      `ℹ️ If <strong>${email}</strong> is registered, a password reset link has been sent. Please check your inbox (and spam folder).`,
      'info'
    );

    document.getElementById('forgotForm').reset();

    /* For demo purposes, show the "found" password in console only */
    if (found) {
      console.info('[Demo] Password for', email, 'is:', found.password);
    }
  }, 1000);
});

/* ════════════════════════════════════════════════════
   REAL-TIME INLINE VALIDATION (blur events)
   ════════════════════════════════════════════════════ */

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

/* ════════════════════════════════════════════════════
   PAGE LOAD: redirect if already logged in
   ════════════════════════════════════════════════════ */
(function checkExistingSession() {
  if (getToken()) {
    /* Already logged in — go straight to dashboard */
    window.location.href = 'dashboard.html';
  }
})();
