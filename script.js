// Splash Studios — tiny bit of interactivity.
// Click/tap inside the hero to throw a splash. That's it.

document.addEventListener("DOMContentLoaded", () => {
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
    // ignore clicks on buttons/links inside the hero
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
});
