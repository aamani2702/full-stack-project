// Modules 4 & 5 - JavaScript: variables, functions, events, DOM, validation, cookies, localStorage, redirection.
'use strict';

const $ = (sel) => document.querySelector(sel);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- Cookies (Module 4) ---------- */
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
function getCookie(name) {
  const hit = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.split('=')[1]) : null;
}

/* ---------- Navigation: mobile menu + current page highlight ---------- */
const menuBtn = $('.menu-btn');
const nav = $('#nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
const here = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a:not(.pill)').forEach((a) => {
  if (a.getAttribute('href') === here) a.classList.add('current');
});

/* ---------- Validation helpers (Module 5) ---------- */
function showError(id, msg) {
  const input = document.getElementById(id);
  const out = document.querySelector(`.err[data-for="${id}"]`);
  if (out) out.textContent = msg;
  input?.classList.toggle('invalid', Boolean(msg));
  return !msg;
}
const required = (id, label) => showError(id, document.getElementById(id).value.trim() ? '' : `${label} is required.`);
const validEmail = (id) => showError(id, EMAIL_RE.test(document.getElementById(id).value.trim()) ? '' : 'Enter a valid email address.');
function validPassword(id) {
  const v = document.getElementById(id).value;
  let msg = '';
  if (v.length < 8) msg = 'Use at least 8 characters.';
  else if (!/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/\d/.test(v)) msg = 'Include upper case, lower case and a number.';
  return showError(id, msg);
}

/* ---------- Contact form ---------- */
$('#contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = [required('cName', 'Name'), validEmail('cEmail'), required('cTopic', 'Topic'), required('cMsg', 'Message')].every(Boolean);
  if (ok) {
    $('#contactOk').hidden = false;
    alert('Thank you! Your message has been sent.'); // popup (Module 4)
    e.target.reset();
  }
});

/* ---------- Sign up: validate, save to localStorage + cookie, redirect ---------- */
$('#signupForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const terms = $('#sTerms').checked;
  const ok = [
    required('sName', 'Name'), validEmail('sEmail'), validPassword('sPass'), required('sCountry', 'Country'),
    showError('sTerms', terms ? '' : 'You must accept the terms.'),
  ].every(Boolean);
  if (!ok) return;
  const user = {
    name: $('#sName').value.trim(),
    email: $('#sEmail').value.trim().toLowerCase(),
    country: $('#sCountry').value,
    interest: document.querySelector('input[name=interest]:checked').value,
  };
  localStorage.setItem('bloom_user', JSON.stringify(user)); // demo only - never store passwords client side
  setCookie('bloom_name', user.name);
  alert(`Welcome, ${user.name}! Redirecting to login…`);
  window.location.href = 'login.html'; // page redirection
});

/* ---------- Login ---------- */
if ($('#welcomeBack')) {
  const saved = getCookie('bloom_name');
  if (saved) { $('#welcomeBack').hidden = false; $('#welcomeBack').textContent = `Welcome back, ${saved}!`; }
}
$('#loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (![validEmail('lEmail'), required('lPass', 'Password')].every(Boolean)) return;
  const user = JSON.parse(localStorage.getItem('bloom_user') || 'null');
  if (user && user.email === $('#lEmail').value.trim().toLowerCase()) {
    alert(`Logged in as ${user.name}`);
    window.location.href = 'index.html';
  } else {
    showError('lEmail', 'No account found - please sign up first.');
  }
});

/* ---------- To-do list (DOM manipulation) ---------- */
if ($('#todoForm')) {
  let todos = JSON.parse(localStorage.getItem('bloom_todos') || '[]');
  const list = $('#todoList');

  const save = () => localStorage.setItem('bloom_todos', JSON.stringify(todos));
  function render() {
    list.innerHTML = '';
    todos.forEach((t, i) => {
      const li = document.createElement('li');
      li.className = t.done ? 'done' : '';
      const cb = Object.assign(document.createElement('input'), { type: 'checkbox', checked: t.done });
      cb.setAttribute('aria-label', 'Mark done');
      cb.addEventListener('change', () => { todos[i].done = cb.checked; save(); render(); });
      const text = document.createElement('span');
      text.textContent = t.text; // textContent avoids HTML injection
      const del = document.createElement('button');
      del.textContent = '✕';
      del.setAttribute('aria-label', 'Delete task');
      del.addEventListener('click', () => { todos.splice(i, 1); save(); render(); });
      li.append(cb, text, del);
      list.append(li);
    });
    const left = todos.filter((t) => !t.done).length;
    $('#todoCount').textContent = todos.length ? `${left} of ${todos.length} tasks left` : 'No tasks yet - add one above.';
  }
  $('#todoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('#todoInput').value.trim();
    if (!v) return;
    todos.push({ text: v, done: false });
    $('#todoInput').value = '';
    save(); render();
  });
  render();
}

/* ---------- Calculator (no eval) ---------- */
if ($('#calcKeys')) {
  const display = $('#calcDisplay');
  let current = '0', prev = null, op = null, fresh = true;
  const layout = ['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '0', '.', '=' ];
  const ops = { '+': (a, b) => a + b, '−': (a, b) => a - b, '×': (a, b) => a * b, '÷': (a, b) => (b === 0 ? NaN : a / b) };
  const fmt = (n) => (Number.isFinite(n) ? String(+n.toFixed(10)) : 'Error');

  function press(k) {
    if (/\d/.test(k)) { current = fresh || current === '0' ? k : current + k; fresh = false; }
    else if (k === '.') { if (fresh) { current = '0.'; fresh = false; } else if (!current.includes('.')) current += '.'; }
    else if (k === 'C') { current = '0'; prev = null; op = null; fresh = true; }
    else if (k === '±') current = fmt(-parseFloat(current));
    else if (k === '%') current = fmt(parseFloat(current) / 100);
    else if (k in ops) {
      if (op && !fresh) current = fmt(ops[op](prev, parseFloat(current)));
      prev = parseFloat(current); op = k; fresh = true;
    } else if (k === '=' && op) {
      current = fmt(ops[op](prev, parseFloat(current)));
      op = null; fresh = true;
    }
    display.value = current;
  }
  layout.forEach((k) => {
    const b = document.createElement('button');
    b.textContent = k;
    if ('÷×−+='.includes(k)) b.className = 'op';
    if (k === '=') b.className = 'op wide';
    b.addEventListener('click', () => press(k));
    $('#calcKeys').append(b);
  });
}
