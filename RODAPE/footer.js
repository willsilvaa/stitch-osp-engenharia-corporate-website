// Supply verified company profiles here before publishing. No guessed accounts.
const socialProfiles = [
  { name: 'Instagram', icon: 'instagram', url: '' },
  { name: 'TikTok', icon: 'tiktok', url: '' },
  { name: 'YouTube', icon: 'youtube', url: '' },
  { name: 'LinkedIn', icon: 'linkedin', url: '' },
  { name: 'Facebook', icon: 'facebook', url: '' },
];

document.querySelectorAll('[data-social-list]').forEach((list) => {
  const iconsOnly = list.hasAttribute('data-icons-only');
  socialProfiles.forEach(({ name, icon, url }) => {
    const item = document.createElement('li');
    const link = document.createElement(url ? 'a' : 'span');
    if (url) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', `OSP no ${name}`);
    } else {
      link.className = 'social-unconfigured';
      link.setAttribute('aria-label', `${name} — perfil em breve`);
      link.title = `${name} — perfil em breve`;
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `assets/icons.svg#${icon}`);
    svg.append(use);
    link.append(svg);
    if (!iconsOnly) link.append(document.createTextNode(name));
    item.append(link);
    list.append(item);
  });
});

const stage = document.getElementById('osp-stage');
if (stage) {
  const revealLetters = [...stage.querySelectorAll('.osp-reveal .osp-letter')];
  let letterBounds = [];
  let activeLetterIndex = -1;
  const trail = Array.from({ length: 12 }, () => ({ x: 0, y: 0 }));
  const target = { x: 0, y: 0 };
  let frame = 0;
  let lastTime = 0;
  let entered = false;
  let contactPointerId = null;
  const paintHoldMs = 2000;
  const paintFadeMs = 1400;
  const maxPaintDabs = 180;
  let paintDabs = [];
  let lastDab = null;
  const brushScale = () => window.innerWidth < 768 ? .48 : window.innerWidth <= 1024 ? .82 : 1;
  const gradient = (point, radius, opacity) => {
    const alpha = opacity.toFixed(3);
    return `radial-gradient(circle ${radius.toFixed(1)}px at calc(${point.x.toFixed(2)}px - var(--letter-x)) calc(${point.y.toFixed(2)}px - var(--letter-y)), rgba(255,255,255,${alpha}) 0%, rgba(255,255,255,${alpha}) 32%, rgba(255,255,255,${(opacity * .55).toFixed(3)}) 66%, transparent 100%)`;
  };
  const depositPaint = (x, y) => {
    const now = performance.now();
    const spacing = 14 * brushScale();
    const sameStroke = lastDab && lastDab.letter === activeLetterIndex;
    const distance = sameStroke ? Math.hypot(x - lastDab.x, y - lastDab.y) : 0;
    if (sameStroke && distance < spacing && now - lastDab.time < 120) return;
    const steps = sameStroke ? Math.min(20, Math.max(1, Math.ceil(distance / spacing))) : 1;
    const start = sameStroke ? lastDab : { x, y };
    for (let i = 1; i <= steps; i++) {
      paintDabs.push({ x: start.x + (x - start.x) * i / steps, y: start.y + (y - start.y) * i / steps, time: now, letter: activeLetterIndex, radius: 58 * brushScale() });
    }
    lastDab = { x, y, time: now, letter: activeLetterIndex };
    if (paintDabs.length > maxPaintDabs) paintDabs.splice(0, paintDabs.length - maxPaintDabs);
  };

  // Overlapping soft dabs form a tapered brush, all clipped to the active glyph.
  const paintTrail = (time = performance.now()) => {
    paintDabs = paintDabs.filter(dab => time - dab.time < paintHoldMs + paintFadeMs);
    const byLetter = revealLetters.map(() => []);
    paintDabs.forEach(dab => {
      const progress = Math.max(0, (time - dab.time - paintHoldMs) / paintFadeMs);
      const opacity = 1 - progress * progress * (3 - 2 * progress);
      byLetter[dab.letter].push(gradient(dab, dab.radius, opacity));
    });
    if (entered && activeLetterIndex >= 0) trail.forEach((point, index) => {
      const taper = 1 - index / trail.length;
      byLetter[activeLetterIndex].push(gradient(point, (10 + 48 * taper) * brushScale(), .25 + .75 * taper));
    });
    revealLetters.forEach((letter, index) => {
      const layers = byLetter[index];
      letter.style.setProperty('--brush-fill', layers.length ? layers.join(',') : 'none');
      letter.classList.toggle('is-active', layers.length > 0);
    });
    stage.style.setProperty('--reveal-opacity', entered || paintDabs.length ? '1' : '0');
  };

  const animateTrail = (time) => {
    frame = 0;
    const elapsed = lastTime ? Math.min(40, time - lastTime) : 16.67;
    lastTime = time;
    let moving = false;
    trail.forEach((point, index) => {
      const leader = index === 0 ? target : trail[index - 1];
      const follow = 1 - Math.pow(index === 0 ? .38 : .70, elapsed / 16.67);
      point.x += (leader.x - point.x) * follow;
      point.y += (leader.y - point.y) * follow;
      // Bound the spacing so fast mouse movements do not break the brush apart.
      const distance = Math.hypot(leader.x - point.x, leader.y - point.y);
      const maxDistance = index === 0 ? 20 : 16;
      if (distance > maxDistance) {
        point.x = leader.x + (point.x - leader.x) * maxDistance / distance;
        point.y = leader.y + (point.y - leader.y) * maxDistance / distance;
      }
      if (Math.hypot(leader.x - point.x, leader.y - point.y) > .15) moving = true;
    });
    paintTrail(time);
    if ((moving && entered) || paintDabs.length) frame = requestAnimationFrame(animateTrail);
    else lastTime = 0;
  };

  const moveBrush = (x, y) => {
    target.x = x;
    target.y = y;
    if (!entered) {
      trail.forEach(point => { point.x = x; point.y = y; });
    }
    entered = true;
    depositPaint(x, y);
    paintTrail();
    if (!frame) frame = requestAnimationFrame(animateTrail);
  };
  // Cache offsets after layout/font changes. Both typography layers share the
  // same spans; subtract their offsets from stage-relative pointer coordinates.
  const measureLetters = () => {
    const stageRect = stage.getBoundingClientRect();
    letterBounds = revealLetters.map((letter) => {
      const rect = letter.getBoundingClientRect();
      letter.style.setProperty('--letter-x', `${rect.left - stageRect.left}px`);
      letter.style.setProperty('--letter-y', `${rect.top - stageRect.top}px`);
      return { left: rect.left - stageRect.left, right: rect.right - stageRect.left };
    });
  };
  measureLetters();
  document.fonts.ready.then(measureLetters);
  const layoutObserver = new ResizeObserver(measureLetters);
  layoutObserver.observe(stage);
  const hideReveal = () => {
    entered = false;
    lastDab = null;
    paintTrail();
    if (paintDabs.length && !frame) frame = requestAnimationFrame(animateTrail);
    if (!paintDabs.length) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }
  };
  const clearPaint = () => {
    paintDabs = [];
    contactPointerId = null;
    hideReveal();
  };
  const trackPointer = (event) => {
    if (event.isPrimary === false) return;
    if (event.pointerType !== 'mouse' && event.pointerId !== contactPointerId) return;
    const rect = stage.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      hideReveal();
      return;
    }
    const letterIndex = letterBounds.findIndex((letter, index) => {
      const next = letterBounds[index + 1];
      const boundary = next ? (letter.right + next.left) / 2 : letter.right;
      return x >= letterBounds[0].left && x <= boundary;
    });
    if (letterIndex === -1) {
      hideReveal();
      return;
    }
    // New dabs belong only to this glyph. Earlier glyphs retain their own paint.
    activeLetterIndex = letterIndex;
    moveBrush(x, y);
    stage.style.setProperty('--reveal-opacity', '1');
  };
  const endContact = (event) => {
    if (event && event.pointerId !== contactPointerId) return;
    contactPointerId = null;
    hideReveal();
  };
  stage.addEventListener('pointerdown', (event) => {
    if (event.isPrimary === false || event.pointerType === 'mouse') return;
    contactPointerId = event.pointerId;
    trackPointer(event);
  }, { passive: true });
  stage.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') trackPointer(event);
  });
  stage.addEventListener('pointermove', trackPointer, { passive: true });
  window.addEventListener('pointerup', endContact, { passive: true });
  window.addEventListener('pointercancel', endContact, { passive: true });
  stage.addEventListener('pointerleave', hideReveal);
  stage.addEventListener('pointercancel', hideReveal);
  window.addEventListener('blur', () => endContact());
  window.addEventListener('resize', clearPaint);
  window.addEventListener('scroll', hideReveal, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearPaint();
  });
}
