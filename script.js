/* ============================================================
   Data Cosmos — Portfolio JavaScript
   Sahib Dino | Data Analyst & Scientist
   ============================================================ */

'use strict';

// ── Particle System ────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .35;
      this.vy = (Math.random() - .5) * .35;
      this.r  = Math.random() * 1.8 + .4;
      this.alpha = Math.random() * .55 + .1;
      this.gold  = Math.random() < .15; // 15% are gold
    }
    update() {
      // Subtle mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx += (dx / dist) * force * .04;
        this.vy += (dy / dist) * force * .04;
      }
      // Speed cap
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > .8) { this.vx *= .95; this.vy *= .95; }

      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.gold
        ? `rgba(245,200,66,${this.alpha})`
        : `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.floor((W * H) / 15000);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${.08 * (1 - dist / maxDist)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  initParticles();
  loop();

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
})();

// ── Cursor Glow ────────────────────────────────────────────
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let cx = -999, cy = -999;
  let tx = -999, ty = -999;

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  });

  function animate() {
    cx += (tx - cx) * .1;
    cy += (ty - cy) * .1;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── Navbar scroll behavior ─────────────────────────────────
(function initNavbar() {
  const nav  = document.getElementById('navbar');
  if (!nav) return;
  const links = nav.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
    // Active link highlight
    const scrollY = window.scrollY + 120;
    document.querySelectorAll('section[id]').forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        links.forEach(l => l.classList.remove('active'));
        const active = nav.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { passive: true });
})();

// ── Mobile nav ─────────────────────────────────────────────
(function initMobileNav() {
  const burger   = document.getElementById('hamburger');
  const nav      = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileBackdrop');
  const closeBtn = document.getElementById('mobileClose');
  const mobLinks = document.querySelectorAll('.mob-link');
  if (!burger || !nav) return;

  function open() {
    burger.classList.add('open');
    nav.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    burger.classList.remove('open');
    nav.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => nav.classList.contains('open') ? close() : open());
  backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  mobLinks.forEach(l => l.addEventListener('click', close));
})();

// ── Scroll Reveal (AOS-like, no library) ──────────────────
(function initReveal() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const delays = {
    '0':   '0ms',
    '100': '100ms',
    '200': '200ms',
    '300': '300ms',
    '400': '400ms',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || '0';
        el.style.transitionDelay = delays[delay] || '0ms';
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ── Typing animation ───────────────────────────────────────
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Data Analyst & Scientist',
    'Physics Graduate',
    'Machine Learning Practitioner',
    'Automation Engineer',
    'Business Intelligence Analyst',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = phrase.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  setTimeout(type, 800);
})();

// ── Animated Counters ──────────────────────────────────────
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1400;
      const start  = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(ease * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();

// ── Photo fallback ─────────────────────────────────────────
(function initPhotoFallback() {
  const img = document.getElementById('heroPhoto');
  if (!img) return;

  img.addEventListener('error', () => {
    // Replace with styled initials avatar
    const parent = img.parentElement;
    img.remove();
    parent.style.background = 'linear-gradient(135deg, #0d2040, #1a3a5c)';
    parent.style.display = 'flex';
    parent.style.alignItems = 'center';
    parent.style.justifyContent = 'center';
    const av = document.createElement('span');
    av.textContent = 'SD';
    av.style.cssText = `
      font-family: 'Montserrat', sans-serif;
      font-size: 5rem;
      font-weight: 900;
      background: linear-gradient(135deg, #00d4ff, #f5c842);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      user-select: none;
    `;
    parent.appendChild(av);
  });
})();

// ── Smooth scroll for anchor links ────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── Project card tilt effect ───────────────────────────────
(function initTilt() {
  const cards = document.querySelectorAll('.proj-card, .glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - .5;
      const y = (e.clientY - rect.top)  / rect.height - .5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
