document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. SCROLL REVEAL (IntersectionObserver)
     ============================================ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================
     2. HERO DONUT — click sprinkle explosion
     ============================================ */
  const heroDonut = document.getElementById('hero-donut');

  heroDonut?.addEventListener('click', () => {
    const rect = heroDonut.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    heroDonut.classList.add('squeeze');
    setTimeout(() => heroDonut.classList.remove('squeeze'), 150);

    const count = 30 + Math.floor(Math.random() * 15);
    const colors = ['#FF2D9B', '#BFFF00', '#FFD600', '#00E5FF'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 120;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      createSprinkle(x, y, colors, centerX, centerY);
    }
  });

  function createSprinkle(startX, startY, colors, cx, cy) {
    const el = document.createElement('div');
    el.className = 'flying-sprinkle';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const w = 6 + Math.random() * 5;
    const h = 16 + Math.random() * 10;
    const outAngle = Math.atan2(startY - cy, startX - cx) + (Math.random() * 0.5 - 0.25);
    const vel = 80 + Math.random() * 180;
    const dur = 1 + Math.random() * 0.6;
    const rot0 = Math.random() * 360;
    const rot1 = rot0 + (Math.random() * 720 - 360);

    Object.assign(el.style, {
      width: w + 'px',
      height: h + 'px',
      backgroundColor: color,
      left: startX + 'px',
      top: startY + 'px',
      transform: `translate(-50%,-50%) rotate(${rot0}deg)`
    });

    document.body.appendChild(el);

    const vx = Math.cos(outAngle) * vel;
    const vy = Math.sin(outAngle) * vel;
    const g = 400;
    const steps = 50;
    const kf = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const elapsed = t * dur;
      const dx = vx * elapsed;
      const dy = vy * elapsed + 0.5 * g * elapsed * elapsed;
      const r = rot0 + (rot1 - rot0) * t;
      const o = 1 - Math.pow(t, 1.5);
      kf.push({
        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${r}deg)`,
        opacity: Math.max(0, o)
      });
    }

    el.animate(kf, { duration: dur * 1000, easing: 'linear' })
      .onfinish = () => el.remove();
  }

  /* ============================================
     3. MENU BUTTONS — pop comic effect
     ============================================ */
  document.querySelectorAll('.menu-card .neo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = btn.getAttribute('data-effect') || 'BOOM!';
      const pop = document.createElement('div');
      pop.className = 'pop-effect';
      pop.textContent = text;

      const rect = btn.getBoundingClientRect();
      pop.style.left = (rect.left + rect.width / 2 - 50) + 'px';
      pop.style.top = (rect.top - 50) + 'px';

      document.body.appendChild(pop);
      setTimeout(() => pop.remove(), 700);
    });
  });

  /* ============================================
     4. HERO CTA — smooth scroll to order
     ============================================ */
  document.getElementById('btn-hero')?.addEventListener('click', () => {
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ============================================
     5. ORDER FORM
     ============================================ */
  document.getElementById('order-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('.neo-btn');
    const original = btn.textContent;
    btn.textContent = 'ВЗРЫВ ОФОРМЛЕН!';
    btn.style.background = 'var(--c-secondary)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      e.target.reset();
    }, 2000);
  });

  /* ============================================
     6. THEME SWITCHER
     ============================================ */
  const themeBtns = document.querySelectorAll('.theme-btn');
  let currentTheme = '1';
  
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.body.className = theme === '1' ? '' : `theme-${theme}`;
      currentTheme = theme;
      
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if(ctx) {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      particles = [];
    });
  });

  /* ============================================
     7. CANVAS INTERACTIVE BACKGROUND
     ============================================ */
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
  let lastMouse = { x: -1000, y: -1000 };
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    lastMouse.x = mouse.x;
    lastMouse.y = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.vx = mouse.x - lastMouse.x;
    mouse.vy = mouse.y - lastMouse.y;
  });

  let particles = [];

  function draw() {
    requestAnimationFrame(draw);
    
    if (currentTheme === '1') {
      // Theme 1: Default neobrutalist geometric trail
      ctx.fillStyle = 'rgba(255, 248, 240, 0.2)'; // fade out matching #FFF8F0
      ctx.fillRect(0, 0, width, height);
      
      if (Math.abs(mouse.vx) > 1 || Math.abs(mouse.vy) > 1) {
        particles.push({
          x: mouse.x, y: mouse.y,
          size: Math.random() * 15 + 5,
          color: ['#FF2D9B', '#BFFF00', '#FFD600', '#00E5FF'][Math.floor(Math.random()*4)],
          life: 1
        });
      }
      
      particles.forEach((p, i) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        p.life -= 0.02;
        p.y += 1;
        if (p.life <= 0) particles.splice(i, 1);
      });
      
    } else if (currentTheme === '2') {
      // Theme 2: Comic Halftone zoom
      ctx.clearRect(0, 0, width, height);
      const spacing = 35;
      ctx.fillStyle = '#FFDE00';
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          let radius = 2.5;
          if (dist < 200) {
            radius = 2.5 + (200 - dist) * 0.06;
          }
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI*2);
          ctx.fill();
        }
      }
    } else if (currentTheme === '3') {
      // Theme 3: Grunge scratches
      ctx.fillStyle = 'rgba(234, 227, 210, 0.08)'; // fade out matching #EAE3D2
      ctx.fillRect(0, 0, width, height);
      
      if (Math.abs(mouse.vx) > 2 || Math.abs(mouse.vy) > 2) {
        ctx.beginPath();
        ctx.moveTo(lastMouse.x + (Math.random()*30-15), lastMouse.y + (Math.random()*30-15));
        ctx.lineTo(mouse.x + (Math.random()*30-15), mouse.y + (Math.random()*30-15));
        ctx.strokeStyle = ['#D35400', '#2C3E50', '#8E44AD'][Math.floor(Math.random()*3)];
        ctx.lineWidth = Math.random() * 4 + 1;
        ctx.stroke();
      }
    } else if (currentTheme === '4') {
      // Theme 4: Playful paint blobs
      ctx.fillStyle = 'rgba(253, 254, 254, 0.15)'; // fade out matching #FDFEFE
      ctx.fillRect(0, 0, width, height);
      
      if (Math.abs(mouse.vx) > 0.5 || Math.abs(mouse.vy) > 0.5) {
        if(Math.random() > 0.4) {
           particles.push({
            x: mouse.x, y: mouse.y,
            r: Math.random() * 25 + 10,
            color: ['#FF9A9E', '#A18CD1', '#FBC2EB'][Math.floor(Math.random()*3)],
            life: 1
          });
        }
      }
      
      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI*2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.life -= 0.015;
        p.y -= 0.5; // float up slightly
        p.x += Math.sin(p.life * 10) * 1.5; // wobble
        if (p.life <= 0) particles.splice(i, 1);
      });
    } else if (['5','6','7'].includes(currentTheme)) {
      // Variable fonts themes - floating shapes
      ctx.fillStyle = currentTheme === '5' ? 'rgba(240, 244, 255, 0.2)' : currentTheme === '6' ? 'rgba(255, 245, 245, 0.2)' : 'rgba(244, 240, 255, 0.2)';
      ctx.fillRect(0, 0, width, height);

      let pal = currentTheme === '5' ? ['#4A90E2', '#50E3C2', '#F5A623'] : currentTheme === '6' ? ['#E53E3E', '#ED8936', '#38B2AC'] : ['#9F7AEA', '#ED64A6', '#ECC94B'];
      
      if (Math.abs(mouse.vx) > 1 || Math.abs(mouse.vy) > 1) {
        particles.push({
          x: mouse.x, y: mouse.y,
          size: Math.random() * 20 + 5,
          color: pal[Math.floor(Math.random()*3)],
          life: 1,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.2
        });
      }
      
      particles.forEach((p, i) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(-p.size/2, p.size/2);
        ctx.lineTo(p.size/2, p.size/2);
        ctx.lineTo(0, -p.size/2);
        ctx.fill();
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        
        p.life -= 0.02;
        p.rot += p.vrot;
        p.y += 0.5;
        if (p.life <= 0) particles.splice(i, 1);
      });
    }
  }
  
  draw();

});