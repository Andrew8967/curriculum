// Currículum web de Andrés Olarte Molina
(function () {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tema claro / oscuro ---------- */
  const themeBtn = document.getElementById('themeBtn');
  function storedTheme() {
    try { return localStorage.getItem('tema'); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }
  // Se puede forzar con ?tema=claro o ?tema=oscuro en la dirección
  const forced = new URLSearchParams(window.location.search).get('tema');
  const fromUrl = forced === 'claro' ? 'light' : forced === 'oscuro' ? 'dark' : null;
  applyTheme(fromUrl || storedTheme() || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeBtn.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('tema', next); } catch (e) { /* sin almacenamiento: el tema dura esta visita */ }
  });

  /* ---------- Barra de progreso y sombra de la navegación ---------- */
  const bar = document.getElementById('progressBar');
  const nav = document.getElementById('nav');
  let ticking = false;
  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    nav.classList.toggle('scrolled', window.scrollY > 12);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Aparición de los bloques al hacer scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Enlace activo en la navegación ---------- */
  const links = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- Las etiquetas del retrato siguen un poco al ratón ---------- */
  const node = document.getElementById('heroNode');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (node && canHover && !reduceMotion) {
    const tags = node.querySelectorAll('.tag');
    window.addEventListener('pointermove', function (e) {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      tags.forEach(function (tag) {
        const depth = Number(tag.dataset.depth) || 16;
        tag.style.transform = 'translate(' + (x * depth).toFixed(1) + 'px,' + (y * depth).toFixed(1) + 'px)';
      });
    }, { passive: true });
  }

  /* ---------- Las capturas de los proyectos se inclinan con el ratón ---------- */
  if (canHover && !reduceMotion) {
    document.querySelectorAll('.shot').forEach(function (shot) {
      const win = shot.querySelector('.window');
      shot.addEventListener('pointermove', function (e) {
        const r = shot.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        win.style.transform = 'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg)';
      });
      shot.addEventListener('pointerleave', function () { win.style.transform = ''; });
    });
  }

  /* ---------- Copiar el correo ---------- */
  const copyBtn = document.getElementById('copyBtn');
  const mail = document.getElementById('mailText').textContent.trim();
  copyBtn.addEventListener('click', function () {
    const done = function (text) {
      copyBtn.textContent = text;
      setTimeout(function () { copyBtn.textContent = 'Copiar correo'; }, 2200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mail).then(
        function () { done('Correo copiado'); },
        function () { done('Cópialo a mano, el navegador no lo permite'); }
      );
    } else {
      done('Cópialo a mano, el navegador no lo permite');
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
