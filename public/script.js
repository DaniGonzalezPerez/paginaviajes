const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Menú móvil
const burger = $('.burger'), menu = $('#menu');
const closeMenu = () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = ''; };
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
menu.addEventListener('click', e => e.target.closest('a') && closeMenu());

// Aparición al hacer scroll
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .15, rootMargin: '0px 0px -6% 0px' }) : null;
$$('[data-reveal]').forEach(el => io ? io.observe(el) : el.classList.add('in'));

// Scroll: header, progreso, parallax, botón flotante
const header = $('.site-header'), bar = $('.progress'), fab = $('.fab');
const px = $$('[data-parallax]');
let lastY = 0, ticking = false;
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  header.classList.toggle('solid', y > 40);
  header.classList.toggle('hide', y > lastY && y > 500 && !menu.classList.contains('open'));
  fab.classList.toggle('show', y > innerHeight * .8);
  lastY = y;
  if (!reduce) px.forEach(el => {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -parseFloat(el.dataset.parallax)}px,0)`;
  });
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Tarjetas con inclinación 3D
if (!reduce && matchMedia('(hover:hover)').matches) {
  $$('.tilt').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
  // Botones magnéticos
  $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });
}

// Formulario (solo visual, sin backend)
$('.form').addEventListener('submit', e => {
  e.preventDefault();
  const b = $('button', e.target);
  b.firstElementChild.textContent = '¡Gracias! Te responderemos pronto';
  b.disabled = true;
});

$('#y').textContent = new Date().getFullYear();
