// ============================================================
// Water Sort Puzzle - Bubble Particle System
// ============================================================

class BubbleParticle {
  constructor(w, h) {
    this.init(w, h, true);
  }

  init(w, h, randomY) {
    this.x = Math.random() * w;
    this.y = randomY ? Math.random() * h : h + Math.random() * 50;
    this.r = 5 + Math.random() * 25;
    this.speed = 0.3 + Math.random() * 1.5;
    this.opacity = 0.3 + Math.random() * 0.7;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = (Math.random() - 0.5) * 0.02;
  }

  update(w, h) {
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.3;
    if (this.y + this.r < 0) {
      this.init(w, h, false);
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
  }
}

GameGlobal.BubbleParticle = BubbleParticle;
