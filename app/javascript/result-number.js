(() => {
  const BALL_COUNT = 10;
  const BALL_SIZE = 84;
  const SPIN_MS = 5000;
  const FRICTION = 0.995;
  const JITTER = 0.24;
  const RESTITUTION = 0.96;

  const ballsWrap = document.getElementById('balls');
  const machine = document.getElementById('machine');
  const rig = document.getElementById('rig');
  const lever = document.getElementById('lever');

  const rect = () => ballsWrap.getBoundingClientRect();
  const center = () => ({ cx: rect().width/2, cy: rect().height/2, R: rect().width/2 });

  const palette = [ ['#fca5a5','#ef4444'], ['#fde68a','#f59e0b'], ['#86efac','#22c55e'], ['#93c5fd','#3b82f6'], ['#c4b5fd','#8b5cf6'], ['#f9a8d4','#ec4899'], ['#fcd34d','#eab308'], ['#7dd3fc','#0ea5e9'], ['#a7f3d0','#10b981'], ['#fda4af','#f43f5e'] ];

  let balls = [];
  let raf = null;
  let running = false;
  let spinTimeout = null;
  let glassAngle = 0;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function clickSound(freq = 900, time = 0.06){
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'square'; o.frequency.value = freq; g.gain.value = 0.0001;
    o.connect(g); g.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.08, now + 0.005);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + time);
    o.stop(now + time + 0.02);
  }

  function createBalls(){
    ballsWrap.innerHTML = '';
    balls = [];
    const {cx, cy, R} = center();
    for(let i=0;i<BALL_COUNT;i++){
      const [c1,c2] = palette[i % palette.length];
      const el = document.createElement('div'); el.className = 'ball';
      el.style.width = el.style.height = BALL_SIZE + 'px';
      el.style.background = `radial-gradient(circle at 30% 30%, #fff 0%, ${c1} 35%, ${c2} 100%)`;

      const left = document.createElement('div'); left.className='half left';
      const right = document.createElement('div'); right.className='half right';
      const shellL = document.createElement('div'); shellL.className='shell'; shellL.style.background = `linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.12))`;
      const shellR = shellL.cloneNode(false);
      left.appendChild(shellL); right.appendChild(shellR);
      el.appendChild(left); el.appendChild(right);

      const num = document.createElement('div'); num.className='num'; el.appendChild(num);

      let placed=false, x=0,y=0; const r = BALL_SIZE/2; const innerR = R - r - 2;
      let attempts = 0;
      while(!placed && attempts++ < 200){
        const ang = Math.random()*Math.PI*2;
        const rad = Math.sqrt(Math.random())*innerR;
        x = cx + Math.cos(ang)*rad; y = cy + Math.sin(ang)*rad;
        placed = balls.every(b => ((b.x - x)**2 + (b.y - y)**2) > (BALL_SIZE*BALL_SIZE*1.05));
      }

      const vx = (Math.random()-.5)*30;
      const vy = (Math.random()-.5)*30;

      el.style.left = (x - r) + 'px'; el.style.top  = (y - r) + 'px';
      ballsWrap.appendChild(el);
      balls.push({el, x, y, vx, vy, r, idx:i});
    }
  }

  function step(){
    const {cx, cy, R} = center();
    const inner = R - 2;

    if(running){ for(const b of balls){ b.vx += (Math.random()-.5)*JITTER; b.vy += (Math.random()-.5)*JITTER; } }

    for(const b of balls){ b.vx *= FRICTION; b.vy *= FRICTION; b.x += b.vx; b.y += b.vy; const dx = b.x - cx, dy = b.y - cy; const dist = Math.hypot(dx,dy); const maxDist = inner - b.r; if(dist > maxDist){ const nx = dx / dist, ny = dy / dist; b.x = cx + nx * maxDist; b.y = cy + ny * maxDist; const vdotn = b.vx*nx + b.vy*ny; b.vx -= (1+RESTITUTION) * vdotn * nx; b.vy -= (1+RESTITUTION) * vdotn * ny; } }

    for(let i=0;i<balls.length;i++){
      for(let j=i+1;j<balls.length;j++){
        const a = balls[i], c = balls[j]; const dx = c.x - a.x, dy = c.y - a.y; const dist = Math.hypot(dx,dy); const minDist = a.r + c.r; if(dist < minDist && dist > 0){ const nx = dx/dist, ny = dy/dist; const overlap = (minDist - dist) / 2; a.x -= nx*overlap; a.y -= ny*overlap; c.x += nx*overlap; c.y += ny*overlap; const va = a.vx*nx + a.vy*ny; const vc = c.vx*nx + c.vy*ny; const diff = vc - va; a.vx += diff*nx; a.vy += diff*ny; c.vx -= diff*nx; c.vy -= diff*ny; } } }

    for(const b of balls){ b.el.style.left = (b.x - b.r) + 'px'; b.el.style.top  = (b.y - b.r) + 'px'; }

    let totalSpeed = 0;
    for (const b of balls) {
      totalSpeed += Math.hypot(b.vx, b.vy);
    }

    glassAngle += totalSpeed * 0.09;

    if (glassAngle > 360) glassAngle -= 360;

    const glassEl = document.querySelector('.cage .glass');
    if (glassEl) {
      glassEl.style.transform = `rotate(${glassAngle}deg)`;
    }
    raf = requestAnimationFrame(step);
  }

  function stopAnim(){ if(raf){ cancelAnimationFrame(raf); raf=null; } }

  function animateExit(ball, numberToShow) {
    return new Promise(resolve => {
      ball.el.style.transition = 'none';
      ball.el.style.transform = `translate(0px, 0px)`;

      requestAnimationFrame(() => {
        const fallY = window.innerHeight - (ball.el.getBoundingClientRect().top + 40);
        ball.el.style.transition = 'transform 1.8s cubic-bezier(.15,.85,.3,1)';
        ball.el.style.transform = `translateY(${fallY}px) rotate(420deg)`;

        setTimeout(() => {
          clickSound(700, 0.06);

          rig.classList.add('faded');
          const cloneBall = ball.el.cloneNode(true);
          cloneBall.style.position = 'absolute';
          cloneBall.style.left = '50%';
          cloneBall.style.top = '50%';
          cloneBall.style.transform = 'translate(-50%, -50%) scale(0)';
          cloneBall.style.zIndex = '999';
          cloneBall.querySelector('.num').textContent = '';

          rig.appendChild(cloneBall);

          setTimeout(() => {
            cloneBall.style.transition = 'transform .9s cubic-bezier(.2,.8,.2,1)';
            cloneBall.style.transform = 'translate(-50%, -50%) scale(6)';

            setTimeout(() => {
              cloneBall.classList.add('opened');
              const numEl = cloneBall.querySelector('.num');
              numEl.textContent = numberToShow;
              setTimeout(() => numEl.classList.add('show'), 120);
              clickSound(1200, 0.12);
              resolve();
            }, 500);

          }, 300);

        }, 700);
      });
    });
  }
  async function spinAndReveal(numberToShow){
    reset();
    running = true; step();

    clickSound(700,0.08);
    clearTimeout(spinTimeout);
    spinTimeout = setTimeout(async () => {
      running = false;
      const idx = Math.floor(Math.random()*balls.length);
      const chosen = balls[idx];
      stopAnim();
      await animateExit(chosen, numberToShow);
    }, SPIN_MS);
  }

  function reset(){
    const clone = document.querySelector('.ball.opened');
    if (clone) clone.remove();
    stopAnim(); running=false; machine.classList.remove('faded'); createBalls(); step();
    for(const b of balls){ b.el.style.transition=''; b.el.style.transform=''; b.el.classList.remove('opened'); const num = b.el.querySelector('.num'); num.classList.remove('show'); num.textContent=''; }
    stopAnim();
  }

  let isPulled = false;
  lever.addEventListener('pointerdown', (e)=>{
    e.preventDefault(); lever.setPointerCapture(e.pointerId);
    lever.classList.add('pulled'); isPulled = true; clickSound(1000,0.06);
  });
  lever.addEventListener('pointerup', (e)=>{
    lever.releasePointerCapture(e.pointerId); lever.classList.remove('pulled');
    if(isPulled){ isPulled=false;

      if(audioCtx.state === 'suspended') audioCtx.resume();
      spinAndReveal(Math.floor(Math.random()*90)+1);
    }
  });

  window.spinAndReveal = spinAndReveal;
  window.resetLotto = reset;
  createBalls();

})();