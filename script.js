// ─── NAV ACTIVE STATE ───
// Automatically highlights the correct nav link based on current page
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const servicePages = ['travel-health.html','supplements.html','web-consulting.html','retainer.html','resources.html'];

  // Highlight exact-match nav links
  document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
    const nav = link.dataset.nav;
    if (nav === 'home' && (page === 'index.html' || page === '')) link.classList.add('active');
    if (nav === 'about' && page === 'about.html') link.classList.add('active');
    if (nav === 'pay' && page === 'pay.html') link.classList.add('active');
    if (nav === 'book' && page === 'book.html') link.classList.add('active');
    if (nav === 'services' && servicePages.includes(page)) link.classList.add('active');
  });
});

// ─── DROPDOWN ───
function toggleDropdown(id) {
  const el = document.getElementById(id);
  const isOpen = el.classList.contains('open');
  closeDropdowns();
  if (!isOpen) el.classList.add('open');
}

function closeDropdowns() {
  document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
}

// Close dropdowns when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-item')) closeDropdowns();
});

// ─── MOBILE MENU ───
function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  const btn = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('mobile-open');
  btn.textContent = isOpen ? '✕' : '☰';
}

function closeMobileMenu() {
  const menu = document.getElementById('navMenu');
  const btn = document.getElementById('hamburger');
  if (menu) menu.classList.remove('mobile-open');
  if (btn) btn.textContent = '☰';
}

// Escape key closes everything
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeDropdowns(); closeMobileMenu(); }
});

// ─── COPY TO CLIPBOARD (Zelle handle) ───
function copyToClipboard(text, btnId) {
  const btn = document.getElementById(btnId);
  const original = btn.innerHTML;

  const finish = () => {
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 2000);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(finish).catch(() => fallbackCopy(text, finish));
  } else {
    fallbackCopy(text, finish);
  }
}

function fallbackCopy(text, callback) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.focus();
  el.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(el);
  if (callback) callback();
}

// ─── WAITLIST MODAL ───
function openWaitlist(service) {
  const el = document.getElementById('waitlistService');
  if (el) el.textContent = service;
  const modal = document.getElementById('waitlistModal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeWaitlist() {
  const modal = document.getElementById('waitlistModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  const nameEl = document.getElementById('waitlistName');
  const emailEl = document.getElementById('waitlistEmail');
  if (nameEl) nameEl.value = '';
  if (emailEl) emailEl.value = '';
}

function submitWaitlist() {
  const name = document.getElementById('waitlistName')?.value?.trim() || '';
  const email = document.getElementById('waitlistEmail')?.value?.trim() || '';
  const service = document.getElementById('waitlistService')?.textContent || 'Service';

  if (!email) {
    document.getElementById('waitlistEmail').style.borderColor = '#EF4444';
    document.getElementById('waitlistEmail').placeholder = 'Email is required';
    return;
  }

  const subject = encodeURIComponent(`Waitlist Request: ${service}`);
  const body = encodeURIComponent(`Hi Dr. Sunny B,\n\nPlease add me to the waitlist for: ${service}\n\nName: ${name || 'Not provided'}\nEmail: ${email}\n\nThank you!`);
  window.location.href = `mailto:drsunnybrph@gmail.com?subject=${subject}&body=${body}`;
  closeWaitlist();
}

// Close waitlist modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeDropdowns(); closeMobileMenu(); closeWaitlist(); }
});
