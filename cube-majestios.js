/* Cube 3D de la page d'accueil MajestiOS — test (branche test-cube-3d) */
(() => {
  const stage = document.getElementById('mj-cube-stage');
  const cube = document.getElementById('mj-cube');
  if (!stage || !cube) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let rx = -22, ry = 30;          // angles (degrés)
  let vx = 0, vy = 0;             // vitesses actuelles (°/s)
  let tvx = 0, tvy = 0;           // vitesses visées (dérive aléatoire)
  let nextPick = 0, idleUntil = 0, hover = false;
  let goal = null, drag = null, suppress = false, last = 0;

  const sign = () => (Math.random() < .5 ? -1 : 1);
  function pick(now) {
    tvy = sign() * (7 + Math.random() * 9);
    tvx = sign() * (2 + Math.random() * 5);
    nextPick = now + 4000 + Math.random() * 4000;
  }

  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000 || 0);
    last = now;
    if (goal) {
      const dy = ((goal.y - ry + 540) % 360) - 180;
      rx += (goal.x - rx) * Math.min(1, dt * 5);
      ry += dy * Math.min(1, dt * 5);
      if (Math.abs(dy) < .4 && Math.abs(goal.x - rx) < .4) goal = null;
      vx = vy = 0;
    } else if (!drag) {
      if (now > nextPick) pick(now);
      const k = reduce || now < idleUntil ? 0 : hover ? .2 : 1;
      const e = Math.min(1, dt * 1.5);
      vx += (tvx * k - vx) * e;
      vy += (tvy * k - vy) * e;
      rx += vx * dt;
      ry += vy * dt;
      if ((rx > 45 && tvx > 0) || (rx < -45 && tvx < 0)) tvx = -tvx;
    }
    rx = Math.max(-80, Math.min(80, rx));
    cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    requestAnimationFrame(frame);
  }

  stage.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    goal = null;
    drag = { x: e.clientX, y: e.clientY, t: e.timeStamp, dist: 0 };
    stage.classList.add('dragging');
  });
  window.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    const dtm = Math.max(1, e.timeStamp - drag.t);
    drag.dist += Math.hypot(dx, dy);
    ry += dx * .45;
    rx -= dy * .45;
    vy = Math.max(-240, Math.min(240, (dx * .45 / dtm) * 1000));
    vx = Math.max(-240, Math.min(240, (-dy * .45 / dtm) * 1000));
    drag.x = e.clientX; drag.y = e.clientY; drag.t = e.timeStamp;
  });
  function endDrag(e) {
    if (!drag) return;
    if (drag.dist > 6) { suppress = true; setTimeout(() => (suppress = false), 0); }
    drag = null;
    idleUntil = e.timeStamp + 3500;
    stage.classList.remove('dragging');
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Un glissement ne doit pas déclencher l'ouverture d'une rubrique.
  stage.addEventListener('click', e => {
    if (suppress) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; });
  stage.addEventListener('pointerleave', () => { hover = false; });

  // Au clavier : la face qui reçoit le focus vient se placer devant.
  stage.addEventListener('focusin', e => {
    const a = e.target.closest('[data-angle]');
    if (!a) return;
    goal = { x: -10, y: -Number(a.dataset.angle) };
    idleUntil = performance.now() + 8000;
  });

  pick(performance.now());
  requestAnimationFrame(frame);
})();
