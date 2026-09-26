// PRAVEEN & KAVYA — LUXURY WEDDING WEBSITE

const cover = document.getElementById("luxuryCover");
const openInvitation = document.getElementById("openInvitation");
const siteHeader = document.getElementById("siteHeader");
const siteNav = document.getElementById("siteNav");
const menuBtn = document.getElementById("menuBtn");
const backToTop = document.getElementById("backToTop");
const petalLayer = document.getElementById("petalLayer");

// Keep the opening invitation in focus.
window.addEventListener("load", () => {
  document.body.classList.add("no-scroll");
});

// Premium open animation.
let isOpening = false;

function enterWedding() {
  if (isOpening) return;
  isOpening = true;

  cover.classList.add("cinematic-opening", "is-opening");

  setTimeout(() => {
    cover.classList.add("is-hidden");
    cover.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    window.scrollTo({ top: 0, behavior: "auto" });

    launchOpeningPetals();

    // Remove the full-screen cover completely after the fade.
    setTimeout(() => {
      cover.style.display = "none";
    }, 430);
  }, 1080);
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
    const isOpen = siteNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".site-nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (siteNav) siteNav.classList.remove("open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  });
});

// Countdown to Muhurtham — 02 December 2026 at 9:30 AM.
const muhurthamDate = new Date("2026-12-02T09:30:00+05:30").getTime();

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



// ---------------------------------------------------------
// Flower petals — brief only, not a continuous effect
// ---------------------------------------------------------
function launchOpeningPetals() {
  if (!petalLayer) return;

  petalLayer.innerHTML = "";
  petalLayer.classList.add("active");

  const petalCount = window.innerWidth < 640 ? 16 : 24;
  const petalTypes = ["rose", "jasmine", "champagne"];

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement("span");
    const type = petalTypes[i % petalTypes.length];
    petal.className = `flower-petal ${type}`;

    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--delay", `${(Math.random() * 1.4).toFixed(2)}s`);
    petal.style.setProperty("--duration", `${(3.1 + Math.random() * 1.8).toFixed(2)}s`);
    petal.style.setProperty("--drift", `${(-75 + Math.random() * 150).toFixed(0)}px`);
    petal.style.setProperty("--spin", `${(180 + Math.random() * 520).toFixed(0)}deg`);
    petal.style.setProperty("--scale", `${(0.65 + Math.random() * 0.65).toFixed(2)}`);

    petalLayer.appendChild(petal);
  }

  setTimeout(() => {
    petalLayer.classList.remove("active");
    petalLayer.innerHTML = "";
  }, 5300);
}


// ---------------------------------------------------------
// Premium photo lightbox with keyboard + mobile swipe
// ---------------------------------------------------------
const galleryItems = [...document.querySelectorAll(".gallery .lightbox-item")];
const photoLightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentPhotoIndex = 0;
let lightboxTouchStartX = 0;
let lightboxTouchEndX = 0;

function renderLightboxPhoto(direction = 0) {
  if (!lightboxImage || !galleryItems.length) return;

  const source = galleryItems[currentPhotoIndex].querySelector("img");
  if (!source) return;

  lightboxImage.classList.remove("slide-next", "slide-prev");
  void lightboxImage.offsetWidth;

  if (direction > 0) lightboxImage.classList.add("slide-next");
  if (direction < 0) lightboxImage.classList.add("slide-prev");

  lightboxImage.src = source.currentSrc || source.src;
  lightboxImage.alt = source.alt || "Wedding memory";

  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${galleryItems.length}`;
  }
}

function openLightbox(index) {
  if (!photoLightbox) return;

  currentPhotoIndex = index;
  renderLightboxPhoto();
  photoLightbox.classList.add("open");
  photoLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
}

function closeLightbox() {
  if (!photoLightbox) return;

  photoLightbox.classList.remove("open");
  photoLightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

function moveLightbox(step) {
  if (!galleryItems.length) return;

  currentPhotoIndex = (currentPhotoIndex + step + galleryItems.length) % galleryItems.length;
  renderLightboxPhoto(step);
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));

  item.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));

photoLightbox?.querySelectorAll("[data-lightbox-close]").forEach(el => {
  el.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", event => {
  if (!photoLightbox?.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

photoLightbox?.addEventListener("touchstart", event => {
  lightboxTouchStartX = event.changedTouches[0].screenX;
}, { passive: true });

photoLightbox?.addEventListener("touchend", event => {
  lightboxTouchEndX = event.changedTouches[0].screenX;
  const distance = lightboxTouchEndX - lightboxTouchStartX;

  if (Math.abs(distance) < 45) return;
  if (distance < 0) moveLightbox(1);
  if (distance > 0) moveLightbox(-1);
}, { passive: true });


// ---------------------------------------------------------
// Scroll progress ornament
// ---------------------------------------------------------
const scrollProgress = document.getElementById("scrollProgress");
const scrollProgressFill = document.getElementById("scrollProgressFill");
const scrollProgressFlower = document.getElementById("scrollProgressFlower");

function updateScrollProgress() {
  if (!scrollProgress || !scrollProgressFill || !scrollProgressFlower) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

  scrollProgressFill.style.transform = `scaleY(${progress})`;
  scrollProgressFlower.style.top = `${progress * 100}%`;
  scrollProgress.classList.toggle("visible", window.scrollY > 120);
}

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

// ---------------------------------------------------------
// Final thank-you animation
// ---------------------------------------------------------
const finalThankYou = document.getElementById("finalThankYou");

if (finalThankYou) {
  const thankYouObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          finalThankYou.classList.add("thankyou-visible");
          thankYouObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  thankYouObserver.observe(finalThankYou);
}


// ---------------------------------------------------------
// V32 premium lavender parallax
// ---------------------------------------------------------
const premiumParallaxFlorals = [...document.querySelectorAll("[data-parallax]")];

function updatePremiumParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  premiumParallaxFlorals.forEach(layer => {
    const parent = layer.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const speed = Number(layer.dataset.parallax || 0.08);
    const viewportCenter = window.innerHeight / 2;
    const sectionCenter = rect.top + rect.height / 2;
    const offset = (sectionCenter - viewportCenter) * speed;

    layer.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
  });
}

updatePremiumParallax();
window.addEventListener("scroll", updatePremiumParallax, { passive: true });
window.addEventListener("resize", updatePremiumParallax);

// Save the Date soft reveal glow
const signatureRevealShell = document.getElementById("eventsRevealShell");
const signatureRevealButton = document.getElementById("saveDateBtn");

signatureRevealButton?.addEventListener("click", () => {
  if (!signatureRevealShell) return;

  signatureRevealShell.classList.remove("reveal-complete");
  void signatureRevealShell.offsetWidth;
  signatureRevealShell.classList.add("reveal-complete");

  setTimeout(() => signatureRevealShell.classList.remove("reveal-complete"), 1800);
});


// ---------------------------------------------------------
// V33 — event depth interaction for touch devices
// ---------------------------------------------------------
const premiumEventTimeline = document.querySelector(".royal-date-timeline");
const premiumEventCards = [...document.querySelectorAll(".royal-date-item")];

premiumEventCards.forEach(card => {
  card.addEventListener("click", event => {
    if (event.target.closest(".calendar-add-btn")) return;

    const isTouchLike = window.matchMedia("(hover: none)").matches;
    if (!isTouchLike || !premiumEventTimeline) return;

    const wasFocused = card.classList.contains("is-focused");
    premiumEventCards.forEach(item => item.classList.remove("is-focused"));

    if (wasFocused) {
      premiumEventTimeline.classList.remove("has-mobile-focus");
      return;
    }

    card.classList.add("is-focused");
    premiumEventTimeline.classList.add("has-mobile-focus");
  });
});

document.addEventListener("click", event => {
  if (!premiumEventTimeline) return;
  if (event.target.closest(".royal-date-item")) return;

  premiumEventCards.forEach(item => item.classList.remove("is-focused"));
  premiumEventTimeline.classList.remove("has-mobile-focus");
});
