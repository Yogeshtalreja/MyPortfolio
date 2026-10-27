// ── LOADING SCREEN ──
setTimeout(() => {
  const l = document.getElementById('loading');
  l.classList.add('fade-out');
  setTimeout(() => l.style.display = 'none', 800);
}, 2200);

// ── HERO CANVAS — LINE WAVES ──
(function() {
  const c = document.getElementById('hero-canvas');
  const ctx = c.getContext('2d');
  let w, h, mx = 0.5, my = 0.5;

  function resize() {
    const s = c.parentElement;
    w = c.width = s.clientWidth;
    h = c.height = s.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
  });

  function draw(t) {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, w, h);
    const time = t * 0.0005;
    const lines = 40;
    ctx.globalAlpha = 0.12;

    for (let i = 0; i < lines; i++) {
      const yBase = (i / lines) * h;
      ctx.beginPath();
      ctx.strokeStyle = '#1DCD9F';
      ctx.lineWidth = 1;

      for (let x = 0; x < w; x += 4) {
        const nx = x / w;
        const distMouse = Math.sqrt((nx - mx) ** 2 + ((yBase / h) - my) ** 2);
        const mouseWarp = Math.exp(-distMouse * distMouse * 8) * 60;

        const y = yBase
          + Math.sin(nx * 6 + time * 2 + i * 0.3) * 25
          + Math.sin(nx * 3 + time * 1.5) * 15
          + Math.cos(nx * 8 + time * 3 + i * 0.5) * 10
          + mouseWarp * Math.sin(time * 4 + i);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  requestAnimationFrame(draw);
})();

// ── PARTICLES (SERVICES SECTION) ──
(function() {
  const c = document.getElementById('particles-canvas');
  const ctx = c.getContext('2d');
  let w, h;
  const particles = [];

  function resize() {
    const p = c.parentElement;
    w = c.width = p.clientWidth;
    h = c.height = p.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      r: Math.random() * 2.5 + 1
    });
  }

  function draw() {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Lines between close particles
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) {
          ctx.globalAlpha = 1 - d / 150;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(draw);
})();

// ── SCROLL PROGRESS ──
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('scroll-indicator').style.height = pct + '%';
}, { passive: true });

// ── BACK TO TOP ──
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  btt.classList.toggle('show', window.scrollY > 400);
}, { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── SCROLL REVEAL ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .timeline-card, .skill-grid').forEach(el => revealObs.observe(el));