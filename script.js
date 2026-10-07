(() => {
  "use strict";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  const cover = qs("#luxuryCover");
  const openInvitation = qs("#openInvitation");
  const openingFrameShell = qs("#openingFrameShell");
  const siteHeader = qs("#siteHeader");
  const siteNav = qs("#siteNav");
  const menuBtn = qs("#menuBtn");
  const backToTop = qs("#backToTop");
  const petalLayer = qs("#petalLayer");
  const pageLoader = qs("#pageLoader");
  const backgroundMusic = qs("#backgroundMusic");
  const musicToggle = qs("#musicToggle");
  const videoInviteSection = qs("#video-invite");
  const weddingVideo = qs(".wedding-video");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // -------------------------------------------------------
  // FAST ESSENTIAL-ASSET LOADER
  // Shows only until the opening/hero has a usable image and fonts are ready.
  // A short timeout prevents slow external networks from holding the guest.
  // -------------------------------------------------------
  function dismissPageLoader() {
    if (!pageLoader || pageLoader.classList.contains("is-ready")) return;
    pageLoader.classList.add("is-ready");
    window.setTimeout(() => pageLoader.remove(), prefersReducedMotion ? 0 : 420);
  }

  function waitForImage(src) {
    if (!src) return Promise.resolve();
    return new Promise(resolve => {
      const probe = new Image();
      let settled = false;

      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      probe.onload = finish;
      probe.onerror = finish;
      probe.decoding = "async";
      probe.src = src;

      if (probe.complete) finish();
    });
  }

  function delay(ms) {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }

  const heroPreload = qs('link[data-v40-hero-preload="true"]');
  const remoteHeroReady = waitForImage(heroPreload?.href);
  const localFallbackReady = waitForImage("assets/image-fallback.webp");
  const fastFontsReady = document.fonts?.ready
    ? Promise.race([document.fonts.ready, delay(480)])
    : Promise.resolve();

  const essentialVisualsReady = Promise.all([
    localFallbackReady,
    Promise.race([remoteHeroReady, delay(720)]),
    fastFontsReady
  ]);

  Promise.race([
    essentialVisualsReady,
    delay(1250)
  ]).then(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(dismissPageLoader);
    });
  });

  // -------------------------------------------------------
  // BACKGROUND MUSIC
  // Starts from the seal click, fades around Video Invitation,
  // and resumes after the video ends or the guest scrolls away.
  // -------------------------------------------------------
  const MUSIC_VOLUME = 0.28;
  const MUSIC_FADE_MS = prefersReducedMotion ? 0 : 720;

  let musicEnabled = true;
  let musicUnlocked = false;
  let videoSectionActive = false;
  let videoPlaybackCompleted = false;
  let musicFadeFrame = 0;
  let musicFadeToken = 0;

  function refreshMusicButton() {
    if (!musicToggle || !backgroundMusic) return;

    const playing = !backgroundMusic.paused && !backgroundMusic.ended;
    musicToggle.classList.toggle("is-playing", playing);
    musicToggle.classList.toggle("is-muted", !musicEnabled);
    musicToggle.setAttribute("aria-pressed", String(!musicEnabled));
    musicToggle.setAttribute(
      "aria-label",
      musicEnabled ? "Mute background music" : "Play background music"
    );
    musicToggle.title = musicEnabled ? "Mute background music" : "Play background music";
  }

  function cancelMusicFade() {
    musicFadeToken += 1;
    if (musicFadeFrame) cancelAnimationFrame(musicFadeFrame);
    musicFadeFrame = 0;
  }

  function fadeMusicTo(targetVolume, duration = MUSIC_FADE_MS, onComplete) {
    if (!backgroundMusic) return;

    cancelMusicFade();
    const token = musicFadeToken;
    const startVolume = backgroundMusic.volume;
    const target = Math.max(0, Math.min(1, targetVolume));

    if (duration <= 0 || Math.abs(startVolume - target) < 0.005) {
      backgroundMusic.volume = target;
      onComplete?.();
      refreshMusicButton();
      return;
    }

    const startedAt = performance.now();

    const step = now => {
      if (token !== musicFadeToken) return;

      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      backgroundMusic.volume = startVolume + (target - startVolume) * eased;

      if (progress < 1) {
        musicFadeFrame = requestAnimationFrame(step);
      } else {
        musicFadeFrame = 0;
        backgroundMusic.volume = target;
        onComplete?.();
        refreshMusicButton();
      }
    };

    musicFadeFrame = requestAnimationFrame(step);
  }

  function shouldBackgroundMusicPlay() {
    if (!backgroundMusic || !musicUnlocked || !musicEnabled || document.hidden) {
      return false;
    }

    const videoCurrentlyPlaying =
      weddingVideo &&
      !weddingVideo.paused &&
      !weddingVideo.ended;

    if (videoCurrentlyPlaying) return false;
    if (videoSectionActive && !videoPlaybackCompleted) return false;

    return true;
  }

  function fadeOutAndPauseMusic() {
    if (!backgroundMusic || backgroundMusic.paused) {
      refreshMusicButton();
      return;
    }

    fadeMusicTo(0, MUSIC_FADE_MS, () => {
      backgroundMusic.pause();
      backgroundMusic.volume = 0;
      refreshMusicButton();
    });
  }

  function fadeInBackgroundMusic() {
    if (!backgroundMusic || !shouldBackgroundMusicPlay()) return;

    cancelMusicFade();
    backgroundMusic.volume = 0;

    const playPromise = backgroundMusic.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => fadeMusicTo(MUSIC_VOLUME))
        .catch(refreshMusicButton);
    } else {
      fadeMusicTo(MUSIC_VOLUME);
    }
  }

  function syncBackgroundMusic() {
    if (!backgroundMusic) return;

    if (!shouldBackgroundMusicPlay()) {
      fadeOutAndPauseMusic();
      return;
    }

    if (backgroundMusic.paused) {
      fadeInBackgroundMusic();
    } else {
      fadeMusicTo(MUSIC_VOLUME);
    }
  }

  function unlockAndStartBackgroundMusic() {
    if (!backgroundMusic) return;

    musicUnlocked = true;
    musicEnabled = true;
    cancelMusicFade();
    backgroundMusic.volume = prefersReducedMotion ? MUSIC_VOLUME : 0.06;

    const playPromise = backgroundMusic.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          refreshMusicButton();
          fadeMusicTo(MUSIC_VOLUME, prefersReducedMotion ? 0 : 700);
        })
        .catch(refreshMusicButton);
    } else {
      refreshMusicButton();
      fadeMusicTo(MUSIC_VOLUME, prefersReducedMotion ? 0 : 700);
    }
  }

  if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener("click", () => {
      musicEnabled = !musicEnabled;

      if (musicEnabled) {
        musicUnlocked = true;
        syncBackgroundMusic();
      } else {
        cancelMusicFade();
        fadeOutAndPauseMusic();
      }

      refreshMusicButton();
    });

    backgroundMusic.addEventListener("play", refreshMusicButton);
    backgroundMusic.addEventListener("pause", refreshMusicButton);
  }

  if (videoInviteSection && "IntersectionObserver" in window) {
    const videoMusicObserver = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        videoSectionActive =
          entry.isIntersecting && entry.intersectionRatio >= 0.28;

        if (!videoSectionActive && weddingVideo?.ended) {
          videoPlaybackCompleted = true;
        }

        syncBackgroundMusic();
      },
      {
        threshold: [0, 0.28, 0.55]
      }
    );

    videoMusicObserver.observe(videoInviteSection);
  }

  function setVideoFocus(active) {
    videoInviteSection?.classList.toggle("is-video-playing", Boolean(active));
  }

  if (weddingVideo) {
    weddingVideo.addEventListener("play", () => {
      videoPlaybackCompleted = false;
      setVideoFocus(true);
      syncBackgroundMusic();
    });

    weddingVideo.addEventListener("ended", () => {
      videoPlaybackCompleted = true;
      setVideoFocus(false);
      syncBackgroundMusic();
    });

    weddingVideo.addEventListener("pause", () => {
      setVideoFocus(false);
      syncBackgroundMusic();
    });
  }

  document.addEventListener("visibilitychange", syncBackgroundMusic);

  // -------------------------------------------------------
  // OPENING
  // -------------------------------------------------------
  let isOpening = false;

  function finishOpening() {
    if (!cover) return;

    cover.classList.add("is-hidden");
    cover.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    document.body.classList.add("opening-complete");
    window.scrollTo(0, 0);

    launchOpeningPetals();

    window.setTimeout(() => {
      cover.style.display = "none";
    }, prefersReducedMotion ? 0 : 520);
  }

  function enterWedding() {
    if (isOpening) return;
    isOpening = true;

    if (!cover || !openingFrameShell) {
      finishOpening();
      return;
    }

    openingFrameShell.classList.add("split-ready");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        openingFrameShell.classList.add("is-splitting");
        cover.classList.add("opening-frame-splitting");
      });
    });

    window.setTimeout(
      finishOpening,
      prefersReducedMotion ? 120 : 1320
    );
  }

  if (openInvitation) {
    openInvitation.addEventListener("click", () => {
      unlockAndStartBackgroundMusic();
      enterWedding();
    });
  } else {
    document.body.classList.remove("no-scroll");
    document.body.classList.add("opening-complete");
  }

  // -------------------------------------------------------
  // HEADER / MENU / BACK TO TOP / PROGRESS
  // -------------------------------------------------------
  const scrollProgress = qs("#scrollProgress");
  const scrollProgressFill = qs("#scrollProgressFill");
  const scrollProgressFlower = qs("#scrollProgressFlower");
  let scrollTicking = false;

  function updateScrollUI() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;

    siteHeader?.classList.toggle("scrolled", y > 40);
    backToTop?.classList.toggle("show", y > 520);

    if (scrollProgress && scrollProgressFill && scrollProgressFlower) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

      scrollProgressFill.style.transform = `scaleY(${progress})`;
      scrollProgressFlower.style.top = `${progress * 100}%`;
      scrollProgress.classList.toggle("visible", y > 120);
    }

    scrollTicking = false;
  }

  function requestScrollUIUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollUI);
  }

  updateScrollUI();
  window.addEventListener("scroll", requestScrollUIUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUIUpdate, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  if (menuBtn && siteNav) {
    menuBtn.addEventListener("click", () => {
      const open = siteNav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    qsa("a", siteNav).forEach(link => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // -------------------------------------------------------
  // COUNTDOWN
  // -------------------------------------------------------
  const countdownRoot = qs(".countdown");
  const countdownNodes = {
    days: qs("#days"),
    hours: qs("#hours"),
    minutes: qs("#minutes"),
    seconds: qs("#seconds")
  };

  const muhurthamTime = new Date("2026-12-02T09:30:00+05:30").getTime();
  let countdownTimer = null;

  function updateCountdown() {
    if (!countdownRoot) return;

    const distance = muhurthamTime - Date.now();

    if (distance <= 0) {
      countdownRoot.innerHTML = `
        <div class="count-card countdown-complete" style="grid-column:1/-1">
          <span>♥</span>
          <small>The celebration has begun</small>
        </div>`;
      if (countdownTimer) window.clearInterval(countdownTimer);
      return;
    }

    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor(distance / 3600000) % 24,
      minutes: Math.floor(distance / 60000) % 60,
      seconds: Math.floor(distance / 1000) % 60
    };

    Object.entries(values).forEach(([key, value]) => {
      if (countdownNodes[key]) {
        countdownNodes[key].textContent = String(value).padStart(2, "0");
      }
    });
  }

  updateCountdown();
  if (countdownRoot) {
    countdownTimer = window.setInterval(updateCountdown, 1000);
  }

  // -------------------------------------------------------
  // REVEAL ON SCROLL
  // -------------------------------------------------------
  const revealItems = qsa(".reveal, .reveal-left, .reveal-right");

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // -------------------------------------------------------
  // BRIEF OPENING PETALS
  // -------------------------------------------------------
  function launchOpeningPetals() {
    if (!petalLayer || prefersReducedMotion) return;

    petalLayer.replaceChildren();
    petalLayer.classList.add("active");

    const count = window.innerWidth < 640 ? 12 : 20;
    const types = ["rose", "jasmine", "champagne"];

    for (let index = 0; index < count; index += 1) {
      const petal = document.createElement("span");
      petal.className = `flower-petal ${types[index % types.length]}`;
      petal.style.setProperty("--left", `${Math.random() * 100}%`);
      petal.style.setProperty("--delay", `${(Math.random() * 1.1).toFixed(2)}s`);
      petal.style.setProperty("--duration", `${(3 + Math.random() * 1.5).toFixed(2)}s`);
      petal.style.setProperty("--drift", `${(-65 + Math.random() * 130).toFixed(0)}px`);
      petal.style.setProperty("--spin", `${(180 + Math.random() * 460).toFixed(0)}deg`);
      petal.style.setProperty("--scale", `${(0.7 + Math.random() * 0.5).toFixed(2)}`);
      petalLayer.appendChild(petal);
    }

    window.setTimeout(() => {
      petalLayer.classList.remove("active");
      petalLayer.replaceChildren();
    }, 5000);
  }

  // -------------------------------------------------------
  // GALLERY LIGHTBOX
  // -------------------------------------------------------
  const galleryItems = qsa(".gallery .lightbox-item");
  const photoLightbox = qs("#photoLightbox");
  const lightboxImage = qs("#lightboxImage");
  const lightboxCounter = qs("#lightboxCounter");
  const lightboxClose = qs("#lightboxClose");
  const lightboxPrev = qs("#lightboxPrev");
  const lightboxNext = qs("#lightboxNext");

  let currentPhotoIndex = 0;
  let touchStartX = 0;
  let previouslyFocusedElement = null;

  function renderLightboxPhoto(direction = 0) {
    if (!lightboxImage || galleryItems.length === 0) return;

    const source = qs("img", galleryItems[currentPhotoIndex]);
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
    if (!photoLightbox || galleryItems.length === 0) return;

    previouslyFocusedElement = document.activeElement;
    currentPhotoIndex = index;
    renderLightboxPhoto();

    photoLightbox.classList.add("open");
    photoLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightboxClose?.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!photoLightbox) return;

    photoLightbox.classList.remove("open");
    photoLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    if (lightboxImage) {
      lightboxImage.classList.remove("slide-next", "slide-prev");
    }

    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus({ preventScroll: true });
    }
  }

  function moveLightbox(step) {
    if (galleryItems.length === 0) return;
    currentPhotoIndex = (currentPhotoIndex + step + galleryItems.length) % galleryItems.length;
    renderLightboxPhoto(step);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
    item.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox(index);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
  lightboxNext?.addEventListener("click", () => moveLightbox(1));

  photoLightbox?.addEventListener("click", event => {
    if (event.target instanceof Element && event.target.hasAttribute("data-lightbox-close")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", event => {
    if (!photoLightbox?.classList.contains("open")) return;

    if (event.key === "Escape") closeLightbox();
    else if (event.key === "ArrowLeft") moveLightbox(-1);
    else if (event.key === "ArrowRight") moveLightbox(1);
  });

  photoLightbox?.addEventListener(
    "touchstart",
    event => {
      touchStartX = event.changedTouches[0]?.clientX ?? 0;
    },
    { passive: true }
  );

  photoLightbox?.addEventListener(
    "touchend",
    event => {
      const endX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = endX - touchStartX;

      if (Math.abs(distance) < 45) return;
      moveLightbox(distance < 0 ? 1 : -1);
    },
    { passive: true }
  );

  // -------------------------------------------------------
  // TOUCH EVENT CARD FOCUS — one implementation only
  // -------------------------------------------------------
  const eventTimeline = qs(".royal-date-timeline");
  const eventCards = qsa(".royal-date-item");

  function clearEventFocus() {
    eventCards.forEach(card => card.classList.remove("is-focused"));
    eventTimeline?.classList.remove("has-mobile-focus");
  }

  if (window.matchMedia("(hover: none)").matches) {
    eventCards.forEach(card => {
      card.addEventListener("click", () => {
        const alreadyFocused = card.classList.contains("is-focused");
        clearEventFocus();

        if (!alreadyFocused) {
          card.classList.add("is-focused");
          eventTimeline?.classList.add("has-mobile-focus");
        }
      });
    });

    document.addEventListener("click", event => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".royal-date-item")) return;
      clearEventFocus();
    });
  }
  // -------------------------------------------------------
  // HOSTED-PAGE RELIABILITY
  // -------------------------------------------------------
  qsa('img[data-remote-image="true"]').forEach(img => {
    const markLoaded = () => img.classList.add("image-loaded");

    img.addEventListener("load", markLoaded, { once: true });

    img.addEventListener("error", () => {
      img.classList.add("image-load-error");
      const parent = img.parentElement;
      if (parent) parent.classList.add("has-image-error");

      const fallback = img.dataset.fallbackSrc;
      if (fallback && img.src !== new URL(fallback, document.baseURI).href) {
        img.removeAttribute("data-remote-image");
        img.src = fallback;
      }
    }, { once: true });

    if (img.complete && img.naturalWidth > 0) markLoaded();
  });

  // Close the mobile navigation with Escape.
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if (siteNav?.classList.contains("open")) {
      siteNav.classList.remove("open");
      menuBtn?.setAttribute("aria-expanded", "false");
      menuBtn?.focus({ preventScroll: true });
    }
  });

  // Restore UI correctly after browser back/forward cache navigation.
  window.addEventListener("pageshow", requestScrollUIUpdate);

  // -------------------------------------------------------
  // MINI NAV ACTIVE SECTION
  // -------------------------------------------------------
  const miniNavLinks = qsa("#siteNav .mini-nav-link");
  const miniNavTargets = miniNavLinks
    .map(link => {
      const selector = link.getAttribute("href");
      return selector && selector.startsWith("#")
        ? document.querySelector(selector)
        : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && miniNavTargets.length) {
    const navObserver = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        miniNavLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.02, 0.15, 0.35]
      }
    );

    miniNavTargets.forEach(section => navObserver.observe(section));
  }

})();