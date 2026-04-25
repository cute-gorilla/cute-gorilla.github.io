// =========================================================
// Theme toggle (persists in localStorage)
// =========================================================
const root = document.documentElement;
const stored = localStorage.getItem("theme");
if (stored) root.setAttribute("data-theme", stored);

document.querySelector(".theme-toggle")?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

// =========================================================
// Reveal on scroll (IntersectionObserver)
// =========================================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// =========================================================
// Hero scroll progress — drives light intensity / spread via --scroll
// =========================================================
(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  let raf = null;
  const update = () => {
    const total = hero.offsetHeight - window.innerHeight;
    const scrolled = -hero.getBoundingClientRect().top;
    const progress = Math.max(0, Math.min(1, scrolled / total));
    hero.style.setProperty("--scroll", progress.toFixed(3));
  };

  window.addEventListener("scroll", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

// =========================================================
// Hero cursor parallax — very subtle shift of the light direction
// =========================================================
(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  let raf = null;
  hero.addEventListener("mousemove", (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      hero.style.setProperty("--cursor-x", x.toFixed(3));
      hero.style.setProperty("--cursor-y", y.toFixed(3));
    });
  });
  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--cursor-x", 0);
    hero.style.setProperty("--cursor-y", 0);
  });
})();


// =========================================================
// Card spotlight: track mouse for radial glow
// =========================================================
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

