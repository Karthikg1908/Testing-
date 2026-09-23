// PRAVEEN & KAVYA — LUXURY WEDDING WEBSITE

const cover = document.getElementById("luxuryCover");
const openInvitation = document.getElementById("openInvitation");
const siteHeader = document.getElementById("siteHeader");
const siteNav = document.getElementById("siteNav");
const menuBtn = document.getElementById("menuBtn");
const backToTop = document.getElementById("backToTop");
const bgMusic = document.getElementById("bgMusic");

// Keep the opening invitation in focus.
window.addEventListener("load", () => {
  document.body.classList.add("no-scroll");
});

// Premium open animation.
let isOpening = false;

function enterWedding() {
  if (isOpening) return;
  isOpening = true;

  // The opening click is a user gesture, so browsers allow audio to begin here.
  if (bgMusic) {
    bgMusic.volume = 0.38;
    bgMusic.play().catch(() => {
      // Some browsers may still block audio until another user interaction.
    });
  }

  cover.classList.add("is-opening");

  setTimeout(() => {
    cover.classList.add("is-hidden");
    document.body.classList.remove("no-scroll");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 800);
}

openInvitation.addEventListener("click", enterWedding);

// Header and top button.
window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 45);
  backToTop.classList.toggle("show", window.scrollY > 520);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Mobile menu.
menuBtn.addEventListener("click", () => {
  siteNav.classList.toggle("open");
});

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => siteNav.classList.remove("open"));
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



// Save the Date royal-card reveal
const saveDateBtn = document.getElementById("saveDateBtn");
const saveDateCover = document.getElementById("saveDateCover");

if (saveDateBtn && saveDateCover) {
  saveDateBtn.addEventListener("click", () => {
    saveDateCover.classList.add("open");
  });
}

