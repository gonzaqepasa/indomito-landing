/* ==========================================================================
   INDÓMITO TRAINING · main.js
   JavaScript puro, sin librerías. Todo lo de acá es "extra": si este archivo
   no carga, la página se ve completa igual, solo que quieta.

   Índice:
     1. Datos que podés cambiar (WhatsApp)
     2. Ayudas
     3. Links de WhatsApp, año del footer, eventos que vencen y cuenta regresiva
     4. Header (fondo al bajar) y menú del celular
     5. Apariciones al entrar en pantalla
     6. Contadores
     7. Hero: el logo se arma con el scroll
     8. Frase que se enciende palabra por palabra
     9. El Búnker: galería que corre de costado
    10. Parallax suave y barra de progreso
    11. Cinta de reseñas
    12. Reto: "mantené apretado"
    13. Pausas (pestaña oculta, fuera de pantalla) y movimiento reducido
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- 1. DATOS QUE PODÉS CAMBIAR ---------- */
  // Número de WhatsApp en formato internacional, sin "+" ni espacios.
  // TODO: confirmar que este sea el número que atiende las consultas.
  var WHATSAPP = '5491149702957';
  // Mensaje de los botones que no tienen uno propio (atributo data-wa en el HTML).
  var MSG_DEFAULT = 'Hola! Quiero reservar mi clase de prueba gratis en Indómito 💪';
  // Número que recibe los pedidos del formulario "Nueva rutina" (nueva-rutina.html).
  // Es el mismo que usaba el formulario anterior. TODO: si WhatsApp no lo encuentra, probar con 5491138785934.
  var WHATSAPP_RUTINAS = '541138785934';

  window.__indomitoOK = true; // le avisa al <head> que el JS cargó bien

  var html = document.documentElement;
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 2. AYUDAS ---------- */
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function smooth(p, a, b) {
    var t = clamp((p - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  }
  function motionOK() { return html.classList.contains('motion-ok'); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var vh = window.innerHeight;
  var vw = window.innerWidth;

  // Divide un texto en palabras (<span class="w">) respetando las etiquetas de adentro (por ej. <em>).
  function splitWords(el) {
    var count = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            w.style.setProperty('--wi', count++);
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    }
    walk(el);
    return $all('.w', el);
  }

  /* ---------- 3. LINKS DE WHATSAPP Y AÑO ---------- */
  $all('.js-wa').forEach(function (a) {
    var msg = a.getAttribute('data-wa') || MSG_DEFAULT;
    a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $all('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- 3b. EVENTOS QUE VENCEN SOLOS ----------
     data-hasta="2026-12-18": se ve hasta ese día inclusive y después se oculta.
     data-desde="2026-12-19": está oculto (con el atributo hidden) y aparece desde ese día. */
  function fechaLocal(txt, fin) {
    var p = txt.split('-').map(Number);
    return fin ? new Date(p[0], p[1] - 1, p[2], 23, 59, 59) : new Date(p[0], p[1] - 1, p[2], 0, 0, 0);
  }
  var ahora = new Date();
  $all('[data-hasta]').forEach(function (el) {
    if (ahora > fechaLocal(el.getAttribute('data-hasta'), true)) el.hidden = true;
  });
  $all('[data-desde]').forEach(function (el) {
    if (ahora >= fechaLocal(el.getAttribute('data-desde'), false)) el.hidden = false;
  });

  /* ---------- 3c. CUENTA REGRESIVA (página de eventos) ---------- */
  $all('[data-cuenta]').forEach(function (box) {
    var objetivo = fechaLocal(box.getAttribute('data-cuenta'), false); // cuenta hasta el inicio de ese día
    var celdas = {};
    ['d', 'h', 'm', 's'].forEach(function (u) { celdas[u] = box.querySelector('[data-u="' + u + '"]'); });
    var previo = {};
    function dos(n) { return n < 10 ? '0' + n : String(n); }
    function pintar() {
      var ms = objetivo - new Date();
      if (ms <= 0) {
        box.classList.add('is-hoy');
        clearInterval(intervalo);
        return;
      }
      var s = Math.floor(ms / 1000);
      var valores = { d: String(Math.floor(s / 86400)), h: dos(Math.floor((s % 86400) / 3600)), m: dos(Math.floor((s % 3600) / 60)), s: dos(s % 60) };
      Object.keys(valores).forEach(function (u) {
        if (celdas[u] && previo[u] !== valores[u]) { previo[u] = valores[u]; celdas[u].textContent = valores[u]; }
      });
    }
    var intervalo = setInterval(function () { if (!document.hidden) pintar(); }, 1000);
    pintar();
  });

  /* ---------- 4. HEADER Y MENÚ ---------- */
  var hdr = document.getElementById('hdr');
  var sentinel = document.querySelector('.hdr-sentinel');
  if (hdr && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      hdr.classList.toggle('is-solid', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  var burger = document.querySelector('.hdr__burger');
  var menu = document.getElementById('menu');
  var mainEl = document.getElementById('main');
  var footer = document.querySelector('.pie');
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('.sr-only').textContent = open ? 'Cerrar menú' : 'Abrir menú';
    menu.classList.toggle('is-open', open);
    html.style.overflow = open ? 'hidden' : '';
    [mainEl, footer].forEach(function (el) { if (el) el.inert = open; });
    if (open) {
      var first = menu.querySelector('a');
      if (first) setTimeout(function () { first.focus(); }, 60);
    }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        burger.focus();
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- 5. APARICIONES ---------- */
  // Los hermanos dentro de un [data-stagger] aparecen escalonados.
  $all('[data-stagger]').forEach(function (group) {
    $all(':scope > .rv', group).forEach(function (el, i) { el.style.setProperty('--i', i % 6); });
  });
  var revealIO = null;
  function initReveal() {
    if (!motionOK() || !('IntersectionObserver' in window)) return;
    html.classList.add('rv-on');
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('in');
        revealIO.unobserve(el);
        // Cuando termina la entrada, sacamos el retraso para que el hover responda al instante.
        setTimeout(function () { el.classList.add('done'); }, 1400);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $all('.rv').forEach(function (el) { revealIO.observe(el); });
  }
  function finishReveal() {
    $all('.rv').forEach(function (el) { el.classList.add('in', 'done'); });
    if (revealIO) { revealIO.disconnect(); revealIO = null; }
  }

  /* ---------- 6. CONTADORES ---------- */
  var counters = $all('[data-count]');
  function fmtNum(v, dec) { return dec ? v.toFixed(dec).replace('.', ',') : String(Math.round(v)); }
  function counterFinal(el) {
    el.textContent = fmtNum(parseFloat(el.getAttribute('data-count')), +(el.getAttribute('data-dec') || 0));
  }
  function runCounter(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var from = parseFloat(el.getAttribute('data-from') || 0);
    var dec = +(el.getAttribute('data-dec') || 0);
    var t0 = performance.now();
    var dur = 1600;
    var last = '';
    function step(now) {
      if (!motionOK()) { counterFinal(el); return; }
      var t = clamp((now - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - t, 3);
      var txt = fmtNum(from + (to - from) * e, dec);
      if (txt !== last) { el.textContent = txt; last = txt; }
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (motionOK() && 'IntersectionObserver' in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); countIO.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.textContent = fmtNum(parseFloat(el.getAttribute('data-from') || 0), +(el.getAttribute('data-dec') || 0));
      countIO.observe(el);
    });
  }

  /* ---------- 7. HERO: EL LOGO SE ARMA CON EL SCROLL ---------- */
  var hero = (function () {
    var el = document.querySelector('.hero');
    if (!el) return null;
    var stage = el.querySelector('.hero__stage');
    var bands = $all('.band', el).map(function (b) {
      var r = b.getAttribute('data-band').split(',').map(Number);
      // Cada palabra entra un poquito después que la anterior (--th = su "turno")
      $all('[data-split]', b).forEach(function (s) {
        var ws = splitWords(s);
        ws.forEach(function (w, i) { w.style.setProperty('--th', ((i / Math.max(1, ws.length)) * 0.5).toFixed(3)); });
      });
      return { el: b, a: r[0], z: r[1], o: '', k: -1, off: null };
    });
    var top = 0, range = 1, target = 0, shown = 0, raf = null, last = 0;
    var onScreen = true, enabled = false;
    var loadK = 0, loadStart = 0;
    var cache = {};

    function setVar(name, v) {
      var s = v.toFixed(3);
      if (cache[name] !== s) { cache[name] = s; stage.style.setProperty(name, s); }
    }
    function measure() {
      top = el.getBoundingClientRect().top + window.scrollY;
      range = Math.max(1, el.offsetHeight - stage.offsetHeight);
    }
    function progress() { return clamp((window.scrollY - top) / range, 0, 1); }

    function render(p) {
      // El logo: rombo y dinosaurio crecen, el hexágono se dibuja, después ruge.
      setVar('--core', 0.74 + 0.26 * smooth(p, 0.28, 0.58));
      setVar('--e0', smooth(p, 0.28, 0.40));
      setVar('--e1', smooth(p, 0.37, 0.49));
      setVar('--e2', smooth(p, 0.46, 0.58));
      setVar('--hex', smooth(p, 0.47, 0.61));
      setVar('--roar', smooth(p, 0.67, 0.72) - smooth(p, 0.72, 0.86));
      for (var i = 0; i < 3; i++) {
        var t = clamp((p - (0.67 + i * 0.055)) / 0.2, 0, 1);
        setVar('--r' + i + 's', 1 + 0.95 * t);
        setVar('--r' + i + 'o', t > 0 && t < 1 ? Math.sin(t * Math.PI) * 0.85 : 0);
      }
      setVar('--glow', 0.45 + 0.55 * smooth(p, 0.55, 0.85));
      setVar('--cue', 1 - smooth(p, 0.015, 0.07));

      // Los textos: cada uno tiene su tramo, con entrada y salida suaves.
      var f = 0.045; // largo de la entrada/salida de cada texto (en avance del scroll)
      bands.forEach(function (b, idx) {
        var first = idx === 0, lastB = idx === bands.length - 1;
        var o = (first ? 1 : smooth(p, b.a, b.a + f)) * (lastB ? 1 : 1 - smooth(p, b.z - f, b.z));
        var k = clamp((p - b.a) / 0.075, 0, 1);
        if (first) k = Math.max(k, loadK);
        var os = o.toFixed(3);
        if (os !== b.o) { b.o = os; b.el.style.setProperty('--o', os); }
        // Solo escribimos --k si cambió lo suficiente (o si llegó justo a 0 o a 1)
        if (Math.abs(k - b.k) >= 0.008 || ((k === 0 || k === 1) && k !== b.k)) {
          b.k = k; b.el.style.setProperty('--k', k.toFixed(3));
        }
        var off = o < 0.02;
        if (off !== b.off) { b.off = off; b.el.classList.toggle('is-off', off); }
      });
    }

    function tick(now) {
      var dt = Math.min(100, now - (last || now));
      last = now;
      if (loadK < 1) {
        var lt = clamp((now - loadStart) / 1200, 0, 1);
        loadK = 1 - Math.pow(1 - lt, 3);
      }
      // Suavizado independiente de los Hz de la pantalla
      shown += (target - shown) * (1 - Math.pow(1 - 0.14, dt / 16.667));
      var settled = Math.abs(target - shown) < 0.0005;
      if (settled) shown = target;
      render(shown);
      if (enabled && (!settled || loadK < 1)) raf = requestAnimationFrame(tick);
      else { raf = null; last = 0; }
    }
    function kick() { if (raf === null && enabled) raf = requestAnimationFrame(tick); }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        onScreen = en[0].isIntersecting;
        if (onScreen) { target = progress(); kick(); }
      }).observe(el);
    }

    return {
      enable: function () {
        if (enabled) return;
        enabled = true;
        cache = {};
        bands.forEach(function (b) { b.o = ''; b.k = -1; b.off = null; });
        measure();
        if (!loadStart) loadStart = performance.now();
        target = shown = progress();
        render(shown);
        kick();
      },
      disable: function () {
        enabled = false;
        if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      },
      measure: measure,
      onScroll: function () { if (!enabled) return; target = progress(); if (onScreen) kick(); }
    };
  })();

  /* ---------- 8. FRASE QUE SE ENCIENDE ---------- */
  var fills = $all('[data-fill]').map(function (el) {
    return { el: el, words: splitWords(el), top: 0, h: 0, lit: -1 };
  });
  function measureFills() {
    fills.forEach(function (f) {
      var r = f.el.getBoundingClientRect();
      f.top = r.top + window.scrollY; f.h = r.height;
    });
  }
  function updateFills(y) {
    fills.forEach(function (f) {
      var q = clamp((y + vh * 0.82 - f.top) / (f.h + vh * 0.28), 0, 1);
      var n = Math.round(q * f.words.length);
      if (n === f.lit) return;
      var lo = Math.min(n, Math.max(0, f.lit)), hi = Math.max(n, Math.max(0, f.lit));
      if (f.lit < 0) { lo = 0; hi = f.words.length; }
      for (var i = lo; i < hi; i++) f.words[i].classList.toggle('lit', i < n);
      f.lit = n;
    });
  }
  function fillsFinal() {
    fills.forEach(function (f) { f.words.forEach(function (w) { w.classList.add('lit'); }); f.lit = f.words.length; });
  }

  /* ---------- 9. EL BÚNKER ---------- */
  var bunker = (function () {
    var el = document.querySelector('.bunker');
    if (!el) return null;
    var pin = el.querySelector('.bunker__pin');
    var track = el.querySelector('.bunker__track');
    var pars = $all('.par', el);
    var top = 0, total = 1, overflow = 0, lastX = '';
    var SPEED = 0.85; // cuánto scroll vertical hace falta por cada píxel de costado
    function measure() {
      if (!motionOK()) { el.style.removeProperty('--bunker-h'); return; }
      track.style.setProperty('--x', '0px');
      overflow = Math.max(0, track.scrollWidth - pin.clientWidth);
      var h = pin.offsetHeight + overflow * SPEED;
      el.style.setProperty('--bunker-h', Math.round(h) + 'px');
      top = el.getBoundingClientRect().top + window.scrollY;
      total = Math.max(1, h - pin.offsetHeight);
      lastX = '';
    }
    function update(y) {
      if (!motionOK()) return;
      var q = clamp((y - top) / total, 0, 1);
      var x = Math.round(-q * overflow);
      var xs = x + 'px';
      if (xs === lastX) return;
      lastX = xs;
      track.style.setProperty('--x', xs);
      // Parallax de adentro de cada foto: se corre un poco al revés que la galería
      pars.forEach(function (p) {
        var panel = p.parentNode;
        var center = panel.offsetLeft + x + panel.offsetWidth / 2;
        var d = (center - vw / 2) / vw;
        p.style.setProperty('--px', (d * -48).toFixed(1) + 'px');
      });
    }
    function reset() {
      track.style.removeProperty('--x');
      pars.forEach(function (p) { p.style.removeProperty('--px'); });
      lastX = '';
    }
    return { measure: measure, update: update, reset: reset };
  })();

  /* ---------- 10. PARALLAX Y BARRA DE PROGRESO ---------- */
  var parallax = $all('[data-par]').map(function (el) {
    return { el: el, speed: parseFloat(el.getAttribute('data-par')) || 0.1, top: 0, h: 0, last: '' };
  });
  function measureParallax() {
    parallax.forEach(function (p) {
      p.el.style.removeProperty('--py');
      var r = p.el.getBoundingClientRect();
      p.top = r.top + window.scrollY; p.h = r.height; p.last = '';
    });
  }
  function updateParallax(y) {
    parallax.forEach(function (p) {
      var center = p.top + p.h / 2 - y - vh / 2;
      if (Math.abs(center) > vh * 1.5) return;
      var v = (center * -p.speed).toFixed(1) + 'px';
      if (v !== p.last) { p.last = v; p.el.style.setProperty('--py', v); }
    });
  }
  var docH = 1, lastPg = '';
  function updateProgress(y) {
    var v = clamp(y / Math.max(1, docH - vh), 0, 1).toFixed(3);
    if (v !== lastPg && hdr) { lastPg = v; hdr.style.setProperty('--pg', v); }
  }

  // Un solo "motor" de scroll para todo, a lo sumo una vez por cuadro.
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY;
    updateProgress(y);
    if (!motionOK()) return;
    updateFills(y);
    if (bunker) bunker.update(y);
    updateParallax(y);
  }
  function onScroll() {
    if (hero) hero.onScroll();
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  function measureAll() {
    vh = window.innerHeight; vw = window.innerWidth;
    docH = document.documentElement.scrollHeight;
    if (hero) hero.measure();
    if (bunker) bunker.measure();
    measureFills();
    measureParallax();
    // El Búnker cambia el alto de la página: volvemos a medir lo que está más abajo.
    docH = document.documentElement.scrollHeight;
    if (hero) hero.measure();
    measureFills();
    measureParallax();
    onScroll();
  }

  /* ---------- 11. CINTA DE RESEÑAS ---------- */
  (function () {
    var mq = document.querySelector('.marquee');
    if (!mq) return;
    var track = mq.querySelector('.marquee__track');
    var group = mq.querySelector('.marquee__group');
    var originals = $all('.rev', group);
    function build() {
      if (!motionOK() || mq.classList.contains('is-ready')) return;
      // Repetimos las tarjetas hasta pasar los 2560 px, así la cinta nunca muestra un hueco.
      var guard = 0;
      while (group.scrollWidth < 2560 && guard++ < 10) {
        originals.forEach(function (r) {
          var c = r.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          group.appendChild(c);
        });
      }
      var copy = group.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
      mq.style.setProperty('--dur', Math.round(group.scrollWidth / 45) + 's');
      mq.classList.add('is-ready');
    }
    function unbuild() {
      if (!mq.classList.contains('is-ready')) return;
      mq.classList.remove('is-ready');
      $all('.marquee__group', track).slice(1).forEach(function (g) { g.remove(); });
      $all('.rev[aria-hidden="true"]', group).forEach(function (r) { r.remove(); });
    }
    build();
    reduceMQ.addEventListener('change', function () { if (motionOK()) build(); else unbuild(); });
    window.__marquee = { build: build, unbuild: unbuild };
  })();

  /* ---------- 12. RETO: "MANTENÉ APRETADO" ---------- */
  var hold = (function () {
    var btn = document.querySelector('.hold');
    if (!btn) return null;
    var ticksG = btn.querySelector('.hold__ticks');
    var num = btn.querySelector('.hold__num b');
    var ayuda = document.getElementById('hold-ayuda');
    var live = document.getElementById('hold-live');
    var cta = document.querySelector('.ticket__cta');
    var N = 30, FILL_MS = 1800, DRAIN_MS = 1500;
    var ticks = [];
    for (var i = 0; i < N; i++) {
      var a = (i / N) * Math.PI * 2 - Math.PI / 2;
      var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', (100 + Math.cos(a) * 84).toFixed(2));
      l.setAttribute('y1', (100 + Math.sin(a) * 84).toFixed(2));
      l.setAttribute('x2', (100 + Math.cos(a) * 95).toFixed(2));
      l.setAttribute('y2', (100 + Math.sin(a) * 95).toFixed(2));
      ticksG.appendChild(l);
      ticks.push(l);
    }
    var prog = 0, holding = false, done = false, raf = null, last = 0, shownN = -1;

    function paint() {
      var n = Math.floor(prog * N + 1e-6);
      if (n !== shownN) {
        var lo = Math.min(n, Math.max(0, shownN)), hi = Math.max(n, Math.max(0, shownN));
        if (shownN < 0) { lo = 0; hi = N; }
        for (var i = lo; i < hi; i++) ticks[i].classList.toggle('on', i < n);
        num.textContent = n;
        shownN = n;
      }
      btn.style.setProperty('--hp', prog.toFixed(3));
    }
    function complete() {
      done = true; holding = false; prog = 1; paint();
      btn.classList.remove('is-holding');
      btn.classList.add('is-done');
      ayuda.textContent = 'Reto aceptado. Ahora escribinos.';
      live.textContent = 'Reto aceptado. Tocá Quiero empezar para escribirnos por WhatsApp.';
      if (cta) cta.classList.add('is-ready');
    }
    function tick(now) {
      var dt = Math.min(64, now - (last || now));
      last = now;
      prog = clamp(prog + (holding ? dt / FILL_MS : -dt / DRAIN_MS), 0, 1);
      if (prog >= 1 && !done) { complete(); raf = null; last = 0; return; }
      paint();
      if (!done && (holding || prog > 0)) raf = requestAnimationFrame(tick);
      else { raf = null; last = 0; }
    }
    function press() {
      if (done) return;
      holding = true;
      btn.classList.add('is-holding');
      if (raf === null) raf = requestAnimationFrame(tick);
    }
    function release() {
      holding = false;
      btn.classList.remove('is-holding');
    }
    btn.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      try { btn.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
      press();
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { btn.addEventListener(ev, release); });
    btn.addEventListener('keydown', function (e) {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); press(); }
    });
    btn.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); release(); }
    });
    btn.addEventListener('blur', release);
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    // Arranca en 0 (sin JS se ve completo en 30/30)
    paint();
    return { complete: function () { if (!done) complete(); } };
  })();

  /* ---------- 12b. FORMULARIO "NUEVA RUTINA" (nueva-rutina.html) ----------
     No guarda nada ni lo manda a ningún servidor: arma un mensaje de WhatsApp con los datos
     y un ID de 12 caracteres para encontrar el pedido rápido en el chat. */
  (function () {
    var form = document.getElementById('form-rutina');
    if (!form) return;
    var listo = document.getElementById('form-listo');
    var resumen = document.getElementById('form-resumen');
    var avance = document.querySelector('.avance');
    var avanceBar = document.querySelector('.avance__bar');
    var avanceTxt = document.querySelector('.avance__txt');
    var $ = function (name) { return form.elements[name]; };

    // ID de pedido: 12 caracteres al azar (0-9 y a-f), como el formulario anterior
    function nuevoId() {
      var b = new Uint8Array(6);
      if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(b);
      else for (var i = 0; i < 6; i++) b[i] = Math.floor(Math.random() * 256);
      return Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    }
    function limpio(txt) { return String(txt || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim(); }
    function numero(el) { return el.value === '' ? NaN : Number(el.value); }
    function marcados(name) {
      return $all('input[name="' + name + '"]:checked', form).map(function (i) { return i.value; });
    }

    // --- Errores en pantalla ---
    function ponerError(el, errId, msg) {
      var p = document.getElementById(errId);
      if (el && el.setAttribute) el.setAttribute('aria-invalid', 'true');
      if (p) p.textContent = msg;
    }
    function sacarError(el, errId) {
      var p = document.getElementById(errId);
      if (el && el.removeAttribute) el.removeAttribute('aria-invalid');
      if (p) p.textContent = '';
    }

    function prendido(id) { return document.getElementById(id).checked; }

    // Cada regla: qué campo mira, dónde muestra el error y qué mensaje da si está mal.
    // "oblig: true" = dato obligatorio (cuenta para la barra de avance).
    var reglas = [
      { campo: 'nombre', err: 'e-nombre', oblig: true, ok: function () { return limpio($('nombre').value).split(/\s+/).length >= 2; },
        msg: 'Escribí tu nombre y apellido.' },
      { campo: 'edad', err: 'e-edad', oblig: true, ok: function () { var n = numero($('edad')); return n >= 10 && n <= 99 && n % 1 === 0; },
        msg: 'Poné tu edad en años (entre 10 y 99).' },
      { campo: 'peso', err: 'e-peso', oblig: true, ok: function () { var n = numero($('peso')); return n >= 25 && n <= 250; },
        msg: 'Poné tu peso en kilos (por ejemplo, 68).' },
      { campo: 'altura', err: 'e-altura', oblig: true, ok: function () { var n = numero($('altura')); return n >= 100 && n <= 230; },
        msg: function () { var n = numero($('altura')); return n > 0 && n < 3 ? 'Parece que la pusiste en metros: escribila en centímetros (por ejemplo, 176).' : 'Poné tu altura en centímetros (por ejemplo, 176).'; } },
      { campo: 'plan', err: 'e-plan', oblig: true, ok: function () { return marcados('plan').length === 1; },
        msg: 'Elegí tu plan.' },
      { campo: 'experiencia', err: 'e-exp', oblig: true, ok: function () { return marcados('experiencia').length === 1; },
        msg: 'Contanos cuánto hace que entrenás.' },
      { campo: 'tipo', err: 'e-tipo', oblig: true, ok: function () { return marcados('tipo').length === 1; },
        msg: 'Elegí si es tu primera rutina o un cambio.' },
      { campo: 'deportes', err: 'e-deportes', ok: function () { return !prendido('t-deportes') || limpio($('deportes').value).length >= 3; },
        msg: 'Contanos cuál, o marcá "No".' },
      { campo: 'objetivos', err: 'e-objetivos', oblig: true, ok: function () { return limpio($('objetivos').value).length >= 5; },
        msg: 'Contanos tu objetivo.' },
      { campo: 'preferencias', err: 'e-pref', oblig: true, ok: function () { return marcados('preferencias').length > 0; },
        msg: 'Elegí al menos una preferencia.' },
      { campo: 'lesiones', err: 'e-lesiones', ok: function () { return !document.getElementById('t-lesiones').checked || limpio($('lesiones').value).length >= 3; },
        msg: 'Contanos un poco más, o marcá "No".' },
      { campo: 'patologias', err: 'e-patologias', ok: function () { return !document.getElementById('t-patologias').checked || limpio($('patologias').value).length >= 3; },
        msg: 'Contanos un poco más, o marcá "No".' }
    ];
    // Elemento al que se le marca el error (para grupos de opciones, el primero)
    function elDe(r) {
      var el = $(r.campo);
      return el && el.length !== undefined && !el.tagName ? el[0] : el;
    }
    function revisar(r) {
      var bien = r.ok();
      var el = elDe(r);
      if (bien) sacarError(el, r.err);
      else ponerError(el, r.err, typeof r.msg === 'function' ? r.msg() : r.msg);
      return bien;
    }

    // --- Barra de avance (cuántos datos obligatorios ya están) ---
    var obligatorias = reglas.filter(function (r) { return r.oblig; });
    function actualizarAvance() {
      var hechos = obligatorias.filter(function (r) { return r.ok(); }).length;
      var pct = Math.round(hechos / obligatorias.length * 100);
      if (avanceBar) avanceBar.style.transform = 'scaleX(' + (pct / 100) + ')';
      if (avanceTxt) avanceTxt.textContent = pct + '% completo';
    }

    // --- Interruptores Sí/No de lesiones y patologías ---
    $all('[data-muestra]', form).forEach(function (sw) {
      var box = document.getElementById(sw.getAttribute('data-muestra'));
      var ta = box.querySelector('textarea');
      function sync() {
        box.hidden = !sw.checked;
        ta.required = sw.checked;
        if (!sw.checked) sacarError(ta, ta.getAttribute('aria-describedby'));
      }
      sw.addEventListener('change', function () { sync(); if (sw.checked) ta.focus(); });
      sync();
    });

    // --- Bloque que aparece al elegir una opción ("Cambio de rutina" muestra sus preguntas) ---
    $all('[data-muestra-radio]', form).forEach(function (radio) {
      var box = document.getElementById(radio.getAttribute('data-muestra-radio'));
      function sync() { box.hidden = !radio.checked; }
      $all('input[name="' + radio.name + '"]', form).forEach(function (r) { r.addEventListener('change', sync); });
      sync();
    });

    // Mientras completa: si un campo tenía error y ya está bien, se lo sacamos
    form.addEventListener('input', function (e) {
      actualizarAvance();
      reglas.forEach(function (r) {
        var el = elDe(r);
        if (el && el.getAttribute('aria-invalid') === 'true' && (e.target.name === r.campo)) revisar(r);
      });
    });
    form.addEventListener('change', function (e) {
      actualizarAvance();
      reglas.forEach(function (r) { if (e.target.name === r.campo && elDe(r).getAttribute('aria-invalid') === 'true') revisar(r); });
    });
    // Al salir de un campo con algo escrito, lo revisamos
    form.addEventListener('focusout', function (e) {
      var t = e.target;
      if (!t.name || t.type === 'radio' || t.type === 'checkbox' || t.value === '') return;
      reglas.forEach(function (r) { if (r.campo === t.name) revisar(r); });
    });

    // --- Armado del mensaje (mismo formato que el formulario anterior) ---
    function armarMensaje(id) {
      var pesoTxt = String(numero($('peso'))).replace('.', ',');
      var L = [
        '►►► ////// *SOLICITAR RUTINA* //////',
        '*ID:* ' + id,
        '',
        '_Este mensaje no debe modificarse._',
        '',
        '*Nombre:* ' + limpio($('nombre').value),
        '*Plan:* ' + marcados('plan')[0],
        '*Edad:* ' + numero($('edad')) + ' años',
        '*Altura:* ' + numero($('altura')) + ' cm',
        '*Peso:* ' + pesoTxt + ' kg',
        '',
        '*Experiencia:* ' + marcados('experiencia')[0],
        '*Rutina:* ' + marcados('tipo')[0]
      ];
      // Si es un cambio de rutina: cómo le fue con la anterior (opcional)
      if (marcados('tipo')[0] === 'Cambio de rutina') {
        var anterior = limpio($('anterior').value);
        if (anterior) L.push('', '*Sobre la rutina anterior:*', anterior);
      }
      if (prendido('t-deportes')) L.push('', '*Otros deportes:*', limpio($('deportes').value));
      L.push(
        '',
        '*Preferencias:* ' + marcados('preferencias').join(', '),
        '',
        '*Objetivos:*',
        limpio($('objetivos').value)
      );
      if (document.getElementById('t-lesiones').checked) L.push('', '*Lesiones:*', limpio($('lesiones').value));
      if (document.getElementById('t-patologias').checked) L.push('', '*Patologías:*', limpio($('patologias').value));
      return L.join('\n');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var malos = reglas.filter(function (r) { return !revisar(r); });
      if (malos.length) {
        resumen.hidden = false;
        resumen.textContent = malos.length === 1 ? 'Revisá el dato marcado en rojo.' : 'Revisá los ' + malos.length + ' datos marcados en rojo.';
        var primero = elDe(malos[0]);
        if (primero && primero.focus) primero.focus();
        return;
      }
      resumen.hidden = true;
      var id = nuevoId();
      var url = 'https://wa.me/' + WHATSAPP_RUTINAS + '?text=' + encodeURIComponent(armarMensaje(id));
      document.getElementById('listo-id').textContent = id;
      document.getElementById('listo-link').href = url;
      form.hidden = true;
      if (avance) avance.hidden = true;
      listo.hidden = false;
      listo.focus();
      window.scrollTo({ top: listo.getBoundingClientRect().top + window.scrollY - 120 });
      // Abrimos WhatsApp. Si el navegador bloquea la pestaña nueva, vamos en la misma.
      var w = window.open(url, '_blank');
      if (w) { try { w.opener = null; } catch (err) { /* nada */ } }
      else window.location.href = url;
    });

    document.getElementById('listo-otra').addEventListener('click', function () {
      listo.hidden = true;
      form.hidden = false;
      if (avance) avance.hidden = false;
      $('nombre').focus();
    });

    actualizarAvance();
  })();

  /* ---------- 13. PAUSAS Y MOVIMIENTO REDUCIDO ---------- */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });
  // Lo que tiene animaciones en bucle se pausa cuando sale de pantalla.
  if ('IntersectionObserver' in window) {
    var loopIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('is-off', !e.isIntersecting); });
    }, { rootMargin: '100px 0px' });
    $all('.lz').forEach(function (el) { loopIO.observe(el); });
  }

  // Todo a su estado final, quieto (cuando el usuario activa "reducir movimiento").
  function pinToFinalStates() {
    html.classList.remove('motion-ok');
    if (hero) hero.disable();
    if (bunker) bunker.reset();
    finishReveal();
    counters.forEach(counterFinal);
    fillsFinal();
    if (hold) hold.complete();
    if (window.__marquee) window.__marquee.unbuild();
    measureAll();
  }
  function enableMotion() {
    html.classList.add('motion-ok');
    if (hero) hero.enable();
    fills.forEach(function (f) { f.lit = -1; });
    if (window.__marquee) window.__marquee.build();
    measureAll();
  }

  if (motionOK()) {
    initReveal();
    if (hero) hero.enable();
  } else {
    finishReveal();
    fillsFinal();
    if (hold) hold.complete();
  }

  reduceMQ.addEventListener('change', function (e) {
    if (e.matches) pinToFinalStates(); else enableMotion();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  // Medimos de nuevo si cambia el ancho (o mucho el alto). La barra del navegador del celular no cuenta.
  var lastW = window.innerWidth, lastH = window.innerHeight, rz = null;
  window.addEventListener('resize', function () {
    var w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 140) return;
    lastW = w; lastH = h;
    cancelAnimationFrame(rz);
    rz = requestAnimationFrame(measureAll);
  });
  window.addEventListener('load', measureAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureAll);
  if ('ResizeObserver' in window) {
    var roT = null, lastDocH = 0;
    new ResizeObserver(function () {
      var h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastDocH) < 2) return;
      lastDocH = h;
      clearTimeout(roT);
      roT = setTimeout(measureAll, 120);
    }).observe(document.body);
  }
  measureAll();
})();
