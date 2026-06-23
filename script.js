// Splash Studios — small interactive touches.

document.addEventListener("DOMContentLoaded", () => {
  initConstellation();
  initHeroSplash();
  initButtonBounce();
  initWipToggle();
});

// Floating starfield with constellation lines between nearby stars.
function initConstellation() {
  const canvas = document.querySelector(".star-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let w, h, stars;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeStars() {
    const count = Math.max(55, Math.min(130, Math.round((w * h) / 11000)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.3 + 0.6,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function frame(time) {
    ctx.clearRect(0, 0, w, h);

    if (!reduceMotion) {
      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < -5) s.x = w + 5;
        if (s.x > w + 5) s.x = -5;
        if (s.y < -5) s.y = h + 5;
        if (s.y > h + 5) s.y = -5;
      }
    }

    const linkDist = Math.min(150, Math.max(95, w / 9));
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const a = stars[i];
        const b = stars[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          ctx.strokeStyle = `rgba(140, 170, 220, ${0.18 * (1 - dist / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const s of stars) {
      const twinkle = reduceMotion ? 0.7 : 0.5 + 0.4 * Math.sin(time / 900 + s.phase);
      ctx.beginPath();
      ctx.fillStyle = `rgba(235, 240, 255, ${Math.max(0.18, twinkle)})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  resize();
  makeStars();
  requestAnimationFrame(frame);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      makeStars();
      if (reduceMotion) frame(0);
    }, 200);
  });
}

// Click/tap inside the hero to throw a splash.
function initHeroSplash() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const colors = [
    "rgba(230, 41, 63, 0.55)",
    "rgba(25, 185, 168, 0.5)",
    "rgba(255, 84, 104, 0.45)",
  ];

  hero.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a, button")) return;

    const rect = hero.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = 60 + Math.random() * 90;
    const color = colors[Math.floor(Math.random() * colors.length)];

    const fx = document.createElement("div");
    fx.className = "splash-fx";
    fx.style.left = `${x}px`;
    fx.style.top = `${y}px`;
    fx.style.width = `${size}px`;
    fx.style.height = `${size}px`;
    fx.style.background = `radial-gradient(circle, ${color}, transparent 70%)`;

    hero.appendChild(fx);
    fx.addEventListener("animationend", () => fx.remove());
  });
}

// Give every button a little spring when pressed.
function initButtonBounce() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn");
    if (!btn) return;
    btn.classList.remove("bounce");
    requestAnimationFrame(() => btn.classList.add("bounce"));
  });
}

// Click (or Enter/Space) on a work-in-progress game tile to reveal its blurb.
function initWipToggle() {
  document.querySelectorAll(".game-tile.wip").forEach((tile) => {
    const toggle = () => {
      const isOpen = tile.classList.toggle("revealed");
      tile.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };
    tile.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      toggle();
    });
    tile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
}
