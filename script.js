// Splash Studios — small interactive touches.

document.addEventListener("DOMContentLoaded", () => {
  initStars();
  initHeroSplash();
  initButtonBounce();
  initWipToggle();
});

// Scatter a quiet starfield across the page (infinite-craft-dark-mode style).
function initStars(count = 140) {
  const field = document.querySelector(".star-field");
  if (!field) return;

  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "star";
    const size = (Math.random() * 2 + 1).toFixed(2);
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
    star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
    star.style.opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
    star.style.animationDuration = `${(Math.random() * 3 + 2).toFixed(2)}s`;
    star.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
    frag.appendChild(star);
  }
  field.appendChild(frag);
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
