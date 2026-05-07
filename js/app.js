/* ══════════════════════════════════════
   DR. SUNNY B — APP.JS
   Handles: page routing, nav, cart,
   language toggle, orchid animation
══════════════════════════════════════ */

'use strict';

/* ── CONFIG ── */
const CONFIG = {
  VENMO_HANDLE:    'drsunnybrph',
  CASHAPP_HANDLE:  'drsunnybrph',
  ZELLE_URL:       'https://enroll.zellepay.com',
  SQUARE_URL:      'https://squareup.com/pay',
  WHATSAPP_NUMBER: '19185550000',
  CAL_URL:         'https://cal.com/drsunnyb',
  CHARM_URL:       'https://www.charmhealth.com',
};

/* ════════════════════════════════════
   PAGE ROUTING
════════════════════════════════════ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  closeDropdown();
  closeMobileMenu();
}

/* ════════════════════════════════════
   NAVIGATION — DESKTOP DROPDOWN
════════════════════════════════════ */
function toggleDropdown(itemEl) {
  const isOpen = itemEl.classList.contains('open');
  closeDropdown();
  if (!isOpen) {
    itemEl.classList.add('open');
    const btn = itemEl.querySelector('[aria-expanded]');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

function closeDropdown() {
  document.querySelectorAll('.nav-item.open').forEach(el => {
    el.classList.remove('open');
    const btn = el.querySelector('[aria-expanded]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

/* ════════════════════════════════════
   NAVIGATION — MOBILE MENU
════════════════════════════════════ */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn   = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('open');
  menu.setAttribute('aria-hidden', String(!isOpen));
  btn.textContent = isOpen ? '✕' : '☰';
  btn.setAttribute('aria-expanded', String(isOpen));
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn   = document.getElementById('hamburger');
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
  btn.textContent = '☰';
  btn.setAttribute('aria-expanded', 'false');
}

/* ════════════════════════════════════
   LANGUAGE TOGGLE
════════════════════════════════════ */
let isES = false;

function toggleLang() {
  isES = !isES;
  document.body.classList.toggle('es', isES);
  const flag = isES ? '🇺🇸' : '🇨🇴';
  const text = isES ? 'EN'   : 'ES';
  document.getElementById('langFlag').textContent = flag;
  document.getElementById('langText').textContent = text;
  document.getElementById('fabFlag').textContent  = flag;
  document.getElementById('fabText').textContent  = isES ? 'Switch to English' : 'Switch to Español';
  document.getElementById('mobFlag').textContent  = flag;
}

/* ════════════════════════════════════
   CART
════════════════════════════════════ */
let cart = [];

function addToCart(icon, name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ icon, name, price, qty: 1 });
  }
  renderCart();
  showToast(isES ? `✦ ¡${name} agregado!` : `✦ ${name} added!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function renderCart() {
  const body    = document.getElementById('cartBody');
  const empty   = document.getElementById('cartEmpty');
  const foot    = document.getElementById('cartFoot');
  const badge   = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  badge.textContent = count;
  badge.classList.toggle('show', count > 0);
  totalEl.textContent = '$' + total;

  if (cart.length === 0) {
    empty.style.display = 'block';
    foot.hidden = true;
    body.innerHTML = '';
    body.appendChild(empty);
    return;
  }

  empty.style.display = 'none';
  foot.hidden = false;

  body.innerHTML = cart.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-icon">
        <i class="fa-solid fa-${item.icon}"></i>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price} · Subtotal: $${item.price * item.qty}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${i}, -1)" aria-label="Decrease quantity">−</button>
        <span class="qty-n" aria-label="Quantity: ${item.qty}">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i}, 1)" aria-label="Increase quantity">+</button>
        <button class="rm-btn" onclick="removeFromCart(${i})" aria-label="Remove item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function checkout(method) {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
  const msg   = encodeURIComponent(`Hi Dr. Sunny B! I'd like to book/order: ${items}. Total: $${total}`);

  const urls = {
    square:    CONFIG.SQUARE_URL,
    zelle:     CONFIG.ZELLE_URL,
    venmo:     `https://venmo.com/${CONFIG.VENMO_HANDLE}`,
    whatsapp:  `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`,
  };

  if (urls[method]) window.open(urls[method], '_blank', 'noopener');
}

/* ════════════════════════════════════
   TOAST
════════════════════════════════════ */
let toastTimer;

function showToast(message) {
  const t = document.getElementById('toast');
  clearTimeout(toastTimer);
  t.textContent = message;
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ════════════════════════════════════
   ORCHID RAIN
   Cattleya trianae — Colombia's
   national flower (Flor de Mayo)
   Colors: pink, purple, white, lavender
════════════════════════════════════ */
(function initOrchidRain() {
  const canvas = document.getElementById('orchid-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, orchids = [];

  const COLORS = [
    { petals: '#C97EC4', lip: '#8B2FC9', center: '#F5E6FF' }, // purple/lavender
    { petals: '#E8A8D8', lip: '#C94F9B', center: '#FFF0F8' }, // pink/magenta
    { petals: '#D4A8E8', lip: '#7A30B8', center: '#F8F0FF' }, // deep purple
    { petals: '#F0D0F0', lip: '#A855B8', center: '#FFFFFF'  }, // pale lilac
    { petals: '#E8C0E8', lip: '#9B2FA8', center: '#FFF5FF'  }, // rose purple
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function drawOrchid(x, y, size, alpha, rotation, variant) {
    const c = COLORS[variant % COLORS.length];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    /* 5 rounded petals */
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -size * .65, size * .28, size * .55, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.petals;
      ctx.fill();
      /* petal vein */
      ctx.beginPath();
      ctx.moveTo(0, -size * .2);
      ctx.lineTo(0, -size * 1.1);
      ctx.strokeStyle = 'rgba(255,255,255,.2)';
      ctx.lineWidth = size * .04;
      ctx.stroke();
      ctx.restore();
    }

    /* lip petal */
    ctx.save();
    ctx.rotate(Math.PI);
    ctx.beginPath();
    ctx.ellipse(0, -size * .5, size * .38, size * .55, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.lip;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -size * .45, size * .18, size * .25, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.18)';
    ctx.fill();
    ctx.restore();

    /* column */
    ctx.beginPath();
    ctx.ellipse(0, 0, size * .14, size * .2, 0, 0, Math.PI * 2);
    ctx.fillStyle = c.center;
    ctx.fill();
    /* anther cap */
    ctx.beginPath();
    ctx.arc(0, -size * .08, size * .07, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,230,80,.7)';
    ctx.fill();

    ctx.restore();
  }

  function spawnOrchid(randomY = false) {
    const size = 6 + Math.random() * 14;
    return {
      x:         Math.random() * W,
      y:         randomY ? Math.random() * H : -size * 2,
      size,
      speed:     .3 + Math.random() * .7,
      drift:     (Math.random() - .5) * .4,
      rotation:  Math.random() * Math.PI * 2,
      rotSpeed:  (Math.random() - .5) * .015,
      alpha:     .15 + Math.random() * .55,
      variant:   Math.floor(Math.random() * COLORS.length),
      sway:      Math.random() * Math.PI * 2,
      swaySpeed: .005 + Math.random() * .01,
      swayAmt:   1 + Math.random() * 2,
    };
  }

  function initOrchids() {
    const count = Math.max(12, Math.floor(W / 80));
    orchids = Array.from({ length: count }, () => spawnOrchid(true));
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    orchids.forEach((o, i) => {
      o.sway += o.swaySpeed;
      o.x    += o.drift + Math.sin(o.sway) * o.swayAmt;
      o.y    += o.speed;
      o.rotation += o.rotSpeed;
      if (o.y > H + o.size * 2) {
        orchids[i] = spawnOrchid(false);
      } else {
        drawOrchid(o.x, o.y, o.size, o.alpha, o.rotation, o.variant);
      }
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); initOrchids(); });
  resize();
  initOrchids();
  animate();
})();

/* ════════════════════════════════════
   EVENT LISTENERS — wired on DOMContentLoaded
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* Initial cart render */
  renderCart();

  /* ── Page routing via data-page attribute ── */
  document.addEventListener('click', e => {
    const pageBtn = e.target.closest('[data-page]');
    if (pageBtn) {
      showPage(pageBtn.dataset.page);
      return;
    }
  });

  /* ── Services dropdown ── */
  const ddSvc = document.getElementById('ddSvc');
  const servicesBtn = document.getElementById('servicesDropBtn');
  if (servicesBtn && ddSvc) {
    servicesBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleDropdown(ddSvc);
    });
  }

  /* ── Close dropdown on outside click ── */
  document.addEventListener('click', () => closeDropdown());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDropdown(); closeMobileMenu(); }
  });

  /* ── Hamburger ── */
  document.getElementById('hamburger')?.addEventListener('click', toggleMobileMenu);

  /* ── Cart toggles ── */
  document.getElementById('cartNavBtn')?.addEventListener('click', toggleCart);
  document.getElementById('cartClose')?.addEventListener('click', toggleCart);
  document.getElementById('cartOverlay')?.addEventListener('click', toggleCart);
  document.getElementById('mobCartBtn')?.addEventListener('click', () => {
    toggleCart();
    closeMobileMenu();
  });

  /* ── Cart checkout buttons ── */
  document.querySelectorAll('[data-method]').forEach(btn => {
    btn.addEventListener('click', () => checkout(btn.dataset.method));
  });

  /* ── Language toggle ── */
  document.getElementById('langBtn')?.addEventListener('click', toggleLang);
  document.getElementById('langFab')?.addEventListener('click', toggleLang);
  document.getElementById('mobLangBtn')?.addEventListener('click', toggleLang);

  /* ── Keyboard: enter/space on cards ── */
  document.querySelectorAll('.card[role="button"]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ── Stop dropdown closing when clicking inside it ── */
  document.querySelectorAll('.dropdown').forEach(dd => {
    dd.addEventListener('click', e => e.stopPropagation());
  });
});
