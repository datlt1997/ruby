import { Controller } from "@hotwired/stimulus"
import consumer from "../channels/consumer"

export default class extends Controller {
  static targets = ["balls", "machine", "rig", "resultRandomNUmber", "prizeSelectUser", "prizeLabel"]

  connect() {
    this.BALL_COUNT = 10
    this.BALL_SIZE = 84
    this.SPIN_MS = 5000
    this.FRICTION = 0.995
    this.JITTER = 0.24
    this.RESTITUTION = 0.96

    this.balls = []
    this.raf = null
    this.running = false
    this.spinTimeout = null
    this.glassAngle = 0

    this.palette = [
      ['#fca5a5','#ef4444'], ['#fde68a','#f59e0b'], ['#86efac','#22c55e'],
      ['#93c5fd','#3b82f6'], ['#c4b5fd','#8b5cf6'], ['#f9a8d4','#ec4899'],
      ['#fcd34d','#eab308'], ['#7dd3fc','#0ea5e9'], ['#a7f3d0','#10b981'],
      ['#fda4af','#f43f5e']
    ]

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    this.createBalls()
    this.currentPrizeId = null
    this.subscription = consumer.subscriptions.create("ResultsChannel", {
      received: (data) => {
        this.spinAndReveal(data)
      }
    })
  }

  rect() {
    return this.ballsTarget.getBoundingClientRect()
  }

  center() {
    const r = this.rect()
    return { cx: r.width / 2, cy: r.height / 2, R: r.width / 2 }
  }

  createBalls() {
    this.ballsTarget.innerHTML = ''
    this.balls = []
    const { cx, cy, R } = this.center()
    for (let i = 0; i < this.BALL_COUNT; i++) {
      const [c1, c2] = this.palette[i % this.palette.length]
      const el = document.createElement('div')
      el.className = 'ball'
      el.style.width = el.style.height = this.BALL_SIZE + 'px'
      el.style.background = `radial-gradient(circle at 30% 30%, #fff 0%, ${c1} 35%, ${c2} 100%)`

      const left = document.createElement('div'); left.className = 'half left'
      const right = document.createElement('div'); right.className = 'half right'
      const shellL = document.createElement('div'); shellL.className = 'shell'
      shellL.style.background = `linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.12))`
      const shellR = shellL.cloneNode(false)
      left.appendChild(shellL); right.appendChild(shellR)
      el.appendChild(left); el.appendChild(right)

      const num = document.createElement('div')
      num.className = 'num'
      el.appendChild(num)

      let placed = false, x = 0, y = 0
      const r = this.BALL_SIZE / 2
      const innerR = R - r - 2
      let attempts = 0
      while (!placed && attempts++ < 200) {
        const ang = Math.random() * Math.PI * 2
        const rad = Math.sqrt(Math.random()) * innerR
        x = cx + Math.cos(ang) * rad
        y = cy + Math.sin(ang) * rad
        placed = this.balls.every(b => ((b.x - x) ** 2 + (b.y - y) ** 2) > (this.BALL_SIZE * this.BALL_SIZE * 1.05))
      }

      const vx = (Math.random() - .5) * 30
      const vy = (Math.random() - .5) * 30

      el.style.left = (x - r) + 'px'
      el.style.top = (y - r) + 'px'
      this.ballsTarget.appendChild(el)
      this.balls.push({ el, x, y, vx, vy, r, idx: i })
    }
  }

  step = () => {
    const { cx, cy, R } = this.center()
    const inner = R - 2

    if (this.running) {
      for (const b of this.balls) {
        b.vx += (Math.random() - .5) * this.JITTER
        b.vy += (Math.random() - .5) * this.JITTER
      }
    }

    for (const b of this.balls) {
      b.vx *= this.FRICTION
      b.vy *= this.FRICTION
      b.x += b.vx
      b.y += b.vy

      const dx = b.x - cx, dy = b.y - cy
      const dist = Math.hypot(dx, dy)
      const maxDist = inner - b.r
      if (dist > maxDist) {
        const nx = dx / dist, ny = dy / dist
        b.x = cx + nx * maxDist
        b.y = cy + ny * maxDist
        const vdotn = b.vx * nx + b.vy * ny
        b.vx -= (1 + this.RESTITUTION) * vdotn * nx
        b.vy -= (1 + this.RESTITUTION) * vdotn * ny
      }
    }

    // ball collisions
    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const a = this.balls[i], c = this.balls[j]
        const dx = c.x - a.x, dy = c.y - a.y
        const dist = Math.hypot(dx, dy)
        const minDist = a.r + c.r
        if (dist < minDist && dist > 0) {
          const nx = dx / dist, ny = dy / dist
          const overlap = (minDist - dist) / 2
          a.x -= nx * overlap
          a.y -= ny * overlap
          c.x += nx * overlap
          c.y += ny * overlap
          const va = a.vx * nx + a.vy * ny
          const vc = c.vx * nx + c.vy * ny
          const diff = vc - va
          a.vx += diff * nx
          a.vy += diff * ny
          c.vx -= diff * nx
          c.vy -= diff * ny
        }
      }
    }

    for (const b of this.balls) {
      b.el.style.left = (b.x - b.r) + 'px'
      b.el.style.top = (b.y - b.r) + 'px'
    }

    let totalSpeed = 0
    for (const b of this.balls) {
      totalSpeed += Math.hypot(b.vx, b.vy)
    }

    this.glassAngle += totalSpeed * 0.09
    if (this.glassAngle > 360) this.glassAngle -= 360

    const glassEl = this.machineTarget.querySelector('.cage .glass')
    if (glassEl) {
      glassEl.style.transform = `rotate(${this.glassAngle}deg)`
    }

    this.raf = requestAnimationFrame(this.step)
  }

  spinAndReveal(data) {
    const numberToShow = data.number ?? 0
    this.reset()
    this.running = true
    this.step()
    clearTimeout(this.spinTimeout)
    this.spinTimeout = setTimeout(async () => {
      this.running = false
      const idx = Math.floor(Math.random() * this.balls.length)
      const chosen = this.balls[idx]
      cancelAnimationFrame(this.raf)
      await this.animateExit(chosen, numberToShow)
      if (data.id) {
        this.addRow(data)
      }

      setTimeout(async () => {
        this.prizeLabelTarget.textContent = data.prizeNext.name + " - " + data.prizeNext.description
      }, 1000);
    }, this.SPIN_MS)
  }

  removePrizeFromSelect(prizeId) {
    const option = this.prizeSelectUserTarget.querySelector(`option[value="${prizeId}"]`)
    if (option) option.remove()
  }

  addRow(winner) {
    const row = document.createElement('div');
    row.classList.add('card', 'card-winner');
    row.innerHTML = `
      <div class="card-winner-number">${winner.number}</div>
      <div class="card-winner-user-name">${winner.name}</div>
      <div class="card-winner-prize">${winner.prize}</div>
    `
    this.resultRandomNUmberTarget.appendChild(row)
  }

  reset() {
    const clone = document.querySelector('.ball.opened');
    if (clone) clone.remove();
    cancelAnimationFrame(this.raf)
    this.running = false
    this.machineTarget.classList.remove('faded')
    this.createBalls()
  }

  animateExit(ball, numberToShow) {
    return new Promise(resolve => {
      ball.el.style.transition = 'none';
      ball.el.style.transform = `translate(0px, 0px)`;

      requestAnimationFrame(() => {
        const fallY = window.innerHeight - (ball.el.getBoundingClientRect().top + 40);
        ball.el.style.transition = 'transform 1.8s cubic-bezier(.15,.85,.3,1)';
        ball.el.style.transform = `translateY(${fallY}px) rotate(420deg)`;

        setTimeout(() => {

          this.rigTarget.classList.add('faded');
          const cloneBall = ball.el.cloneNode(true);
          cloneBall.style.position = 'absolute';
          cloneBall.style.left = '50%';
          cloneBall.style.top = '50%';
          cloneBall.style.transform = 'translate(-50%, -50%) scale(0)';
          cloneBall.style.zIndex = '999';
          cloneBall.querySelector('.num').textContent = '';

          this.rigTarget.appendChild(cloneBall);

          setTimeout(() => {
            cloneBall.style.transition = 'transform .9s cubic-bezier(.2,.8,.2,1)';
            cloneBall.style.transform = 'translate(-50%, -50%) scale(6)';

            setTimeout(() => {
              cloneBall.classList.add('opened');
              const numEl = cloneBall.querySelector('.num');
              numEl.textContent = numberToShow;
              setTimeout(() => numEl.classList.add('show'), 120);
              resolve();
            }, 500);

          }, 300);

        }, 700);
      });
    });
  }

  disconnect() {
    consumer.subscriptions.remove(this.subscription)
  }
}
