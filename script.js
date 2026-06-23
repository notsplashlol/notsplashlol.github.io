// Constellation Logo Animation Engine
document.addEventListener("DOMContentLoaded", () => {
  initLogoConstellation("logoCanvas");
  initLogoConstellation("footerLogoCanvas");
});

function initLogoConstellation(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const stars = [];
  const starCount = 12;
  const maxDistance = 14;

  // Track if motion reduction is active
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  class LogoStar {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = reduceMotion ? 0 : (Math.random() - 0.5) * 0.35;
      this.vy = reduceMotion ? 0 : (Math.random() - 0.5) * 0.35;
    }
    update() {
      if (reduceMotion) return;
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = "#ffffff";
      // Draw 1x1 pixelated star points
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), 1, 1);
    }
  }

  for (let i = 0; i < starCount; i++) {
    stars.push(new LogoStar());
  }

  function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // 1. Draw outer pixelated circle frame border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 29, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Animate and draw constellation linking stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();

      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - dist / maxDistance})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(Math.floor(stars[i].x), Math.floor(stars[i].y));
          ctx.lineTo(Math.floor(stars[j].x), Math.floor(stars[j].y));
          ctx.stroke();
        }
      }
    }

    // 3. Render pixelated drop signature matching image template parameters
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(cx - 3, cy - 7, 6, 2);
    ctx.fillRect(cx - 5, cy - 5, 10, 2);
    ctx.fillRect(cx - 7, cy - 3, 14, 6);
    ctx.fillRect(cx - 5, cy + 3, 10, 2);
    ctx.fillRect(cx - 3, cy + 5, 6, 1);
    
    // Accompanying pixel detail accents
    ctx.fillRect(cx + 5, cy - 4, 2, 2);
    ctx.fillRect(cx - 9, cy + 2, 2, 2);
    
    // Negative spacing dropout accent
    ctx.fillStyle = "#0a0a0e"; 
    ctx.fillRect(cx + 1, cy + 1, 2, 1);

    requestAnimationFrame(renderLoop);
  }

  renderLoop();
}