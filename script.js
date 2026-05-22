// ─── NAV ACTIVE STATE ───
// Highlights the correct nav link based on current page
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
    const nav = link.dataset.nav;
    if (nav === 'home'   && (page === 'index.html' || page === '')) link.classList.add('active');
    if (nav === 'travel' && page === 'travel-health.html')          link.classList.add('active');
    if (nav === 'about'  && page === 'about.html')                  link.classList.add('active');
    if (nav === 'pay'    && page === 'pay.html')                    link.classList.add('active');
    if (nav === 'book'   && page === 'book.html')                   link.classList.add('active');
  });
});

// ─── MOBILE MENU ───
function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  const btn  = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('mobile-open');
  btn.textContent = isOpen ? '✕' : '☰';
}

function closeMobileMenu() {
  const menu = document.getElementById('navMenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('mobile-open');
  if (btn)  btn.textContent = '☰';
}

// Escape key closes the mobile menu
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ─── COPY TO CLIPBOARD (payment handles) ───
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
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(el);
  if (callback) callback();
}
