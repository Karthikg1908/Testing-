// PRAVEEN & KAVYA — LUXURY WEDDING WEBSITE

const cover = document.getElementById("luxuryCover");
const openInvitation = document.getElementById("openInvitation");
const siteHeader = document.getElementById("siteHeader");
const siteNav = document.getElementById("siteNav");
const menuBtn = document.getElementById("menuBtn");
const backToTop = document.getElementById("backToTop");

// Keep the opening invitation in focus.
window.addEventListener("load", () => {
  document.body.classList.add("no-scroll");
});

// Premium open animation.
let isOpening = false;

function enterWedding() {
  if (isOpening) return;
  isOpening = true;

  cover.classList.add("is-opening");

  setTimeout(() => {
    cover.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 800);
}

if (openInvitation && cover) {
  openInvitation.addEventListener("click", enterWedding);
}

// Header and top button.
window.addEventListener("scroll", () => {
  if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 45);
  if (backToTop) backToTop.classList.toggle("show", window.scrollY > 520);
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Mobile menu.
if (menuBtn && siteNav) {
  menuBtn.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (siteNav) siteNav.classList.remove("open");
  });
});

// Countdown to Muhurtham — 02 December 2026 at 9:30 AM.
const muhurthamDate = new Date("December 2, 2026 09:30:00").getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = muhurthamDate - now;

  if (distance <= 0) {
    document.querySelector(".countdown").innerHTML = `
      <div class="count-card" style="grid-column:1/-1">
        <span>♥</span>
        <small>The celebration has begun</small>
      </div>
    `;
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal-on-scroll.
const revealItems = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach(item => revealObserver.observe(item));



// Save the Date premium reveal with celebration burst
const saveDateBtn = document.getElementById("saveDateBtn");
const saveDateCover = document.getElementById("saveDateCover");
const revealCelebration = document.getElementById("revealCelebration");
const royalDateFrame = document.querySelector(".royal-date-reveal");

function launchRevealCelebration() {
  if (!revealCelebration) return;

  revealCelebration.innerHTML = "";
  revealCelebration.classList.add("is-active");
  if (royalDateFrame) royalDateFrame.classList.add("celebrate-flash");

  // Expanding gold burst rings from the center.
  for (let r = 0; r < 3; r++) {
    const ring = document.createElement("span");
    ring.className = "celebration-ring";
    ring.style.setProperty("--ring-delay", `${r * 0.12}s`);
    revealCelebration.appendChild(ring);
  }

  const colors = ["#c9a25e", "#efd9b0", "#8b2634", "#ffffff", "#f7e6c1", "#b8893f"];
  const particleCount = window.innerWidth < 640 ? 44 : 68;

  for (let i = 0; i < particleCount; i++) {
    const piece = document.createElement("span");
    piece.className = i % 6 === 0 ? "celebration-spark" : "celebration-piece";

    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.26);
    const distance = 145 + Math.random() * (window.innerWidth < 640 ? 120 : 245);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - (35 + Math.random() * 100);
    const rot = `${(Math.random() * 760 - 380).toFixed(0)}deg`;
    const size = 7 + Math.random() * 11;

    piece.style.setProperty("--tx", `${dx.toFixed(0)}px`);
    piece.style.setProperty("--ty", `${dy.toFixed(0)}px`);
    piece.style.setProperty("--rot", rot);
    piece.style.setProperty("--delay", `${(Math.random() * 0.10).toFixed(2)}s`);
    piece.style.setProperty("--dur", `${(1.15 + Math.random() * 0.65).toFixed(2)}s`);
    piece.style.setProperty("--bg", colors[Math.floor(Math.random() * colors.length)]);
    piece.style.setProperty("--w", `${size}px`);
    piece.style.setProperty("--h", `${Math.max(9, size * 1.9)}px`);

    revealCelebration.appendChild(piece);
  }

  setTimeout(() => {
    revealCelebration.classList.remove("is-active");
    revealCelebration.innerHTML = "";
    if (royalDateFrame) royalDateFrame.classList.remove("celebrate-flash");
  }, 2100);
}

if (saveDateBtn && saveDateCover) {
  saveDateBtn.addEventListener("click", () => {
    launchRevealCelebration();
    saveDateCover.classList.add("open");
  });
}



// V21 premium interaction polish
function updatePremiumHeader() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 32);
}

updatePremiumHeader();
window.addEventListener("scroll", updatePremiumHeader, { passive: true });

// Gentle hero parallax on capable devices
const heroSection = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroSection && !reduceMotion && window.innerWidth > 768) {
  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY, window.innerHeight);
    heroSection.style.backgroundPosition = `center calc(50% + ${y * 0.08}px)`;
  }, { passive: true });
}

// Add slight reveal stagger to visible card groups
document.querySelectorAll(".countdown, .gallery-grid, .couple-grid").forEach(group => {
  [...group.children].forEach((child, index) => {
    if (child.classList.contains("reveal")) {
      child.style.transitionDelay = `${Math.min(index * 0.07, 0.28)}s`;
    }
  });
});
