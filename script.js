/**
 * ERKAN ZEKI AR — ARTIST PORTFOLIO
 * Interactive script:
 * - Corner drawer & active section tracking
 * - Top scroll progress indicator
 * - Smooth foldable / collapsible editorial sections
 * - Scroll-reveal choreography (IntersectionObserver)
 * - Discography category filtering
 * - Stage lightbox with Prev/Next, counter, keyboard & touch swipe
 * - Bilingual press switcher (EN / DE)
 * - Anti-scraper email assembly & one-click clipboard copy
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. CORNER MENU & DRAWER TOGGLE
  // =========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    if (!navOverlay || !menuToggle) return;
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!navOverlay || !menuToggle) return;
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (navOverlay.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-backdrop')) {
        closeMenu();
      }
    });
  }


  // =========================================================================
  // 2. FOLDABLE / COLLAPSIBLE SECTIONS WITH SMOOTH MOTION
  // =========================================================================
  const foldableSections = document.querySelectorAll('.foldable-section');
  const toggleAllBtn = document.getElementById('toggle-all-sections-btn');

  function setSectionFolded(section, shouldFold) {
    if (!section) return;
    const header = section.querySelector('.section-header');
    const label = section.querySelector('.fold-btn-label');

    if (shouldFold) {
      section.classList.add('is-folded');
      if (header) header.setAttribute('aria-expanded', 'false');
      if (label) label.textContent = 'Expand';
    } else {
      section.classList.remove('is-folded');
      if (header) header.setAttribute('aria-expanded', 'true');
      if (label) label.textContent = 'Fold';
      // Ensure any reveal items inside unfolded section become visible
      section.querySelectorAll('.reveal-up').forEach((el) => {
        el.classList.add('is-visible');
      });
    }
    updateFoldAllButtonState();
  }

  function updateFoldAllButtonState() {
    if (!toggleAllBtn || foldableSections.length === 0) return;
    const allFolded = Array.from(foldableSections).every((sec) =>
      sec.classList.contains('is-folded')
    );
    toggleAllBtn.textContent = allFolded ? 'Expand All Sections' : 'Fold All Sections';
  }

  foldableSections.forEach((section) => {
    const header = section.querySelector('.section-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isCurrentlyFolded = section.classList.contains('is-folded');
      setSectionFolded(section, !isCurrentlyFolded);
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isCurrentlyFolded = section.classList.contains('is-folded');
        setSectionFolded(section, !isCurrentlyFolded);
      }
    });
  });

  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      const allFolded = Array.from(foldableSections).every((sec) =>
        sec.classList.contains('is-folded')
      );
      foldableSections.forEach((sec) => setSectionFolded(sec, !allFolded));
    });
  }

  // Automatically unfold target section when navigating via INDEX menu or CTA buttons
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('data-section');
      if (targetId) {
        const targetSec = document.getElementById(targetId);
        if (targetSec && targetSec.classList.contains('foldable-section')) {
          setSectionFolded(targetSec, false);
        }
      }
      closeMenu();
    });
  });

  document.querySelectorAll('[data-unfold-target]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-unfold-target');
      const targetSec = document.getElementById(targetId);
      if (targetSec && targetSec.classList.contains('foldable-section')) {
        setSectionFolded(targetSec, false);
      }
    });
  });


  // =========================================================================
  // 3. TOP SCROLL PROGRESS BAR & ACTIVE SECTION TRACKING
  // =========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const activeSectionLabel = document.getElementById('active-section-label');
  const trackedSections = document.querySelectorAll('section[id]');

  function updateScrollTelemetry() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Determine active section in viewport
    let currentSectionId = 'hero';
    let currentSectionTitle = '01 // HOME';
    const triggerOffset = window.innerHeight * 0.35;

    trackedSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= triggerOffset) {
        currentSectionId = sec.id;
        currentSectionTitle = sec.getAttribute('data-section-title') || currentSectionTitle;
      }
    });

    if (activeSectionLabel) {
      activeSectionLabel.textContent = currentSectionTitle;
    }

    navLinks.forEach((link) => {
      if (link.getAttribute('data-section') === currentSectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateScrollTelemetry, { passive: true });
  updateScrollTelemetry();


  // =========================================================================
  // 4. SCROLL-REVEAL CHOREOGRAPHY (INTERSECTION OBSERVER)
  // =========================================================================
  const revealItems = document.querySelectorAll('.reveal-up');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealItems.forEach((el, index) => {
      // Subtle stagger for sibling cards
      const delayMs = (index % 3) * 55;
      el.style.transitionDelay = `${delayMs}ms`;
      revealObserver.observe(el);
    });
  }


  // =========================================================================
  // 5. DISCOGRAPHY CATEGORY FILTER
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      workCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });


  // =========================================================================
  // 6. INTERACTIVE LIGHTBOX WITH PREV/NEXT, KEYBOARD & SWIPE
  // =========================================================================
  const mosaicItems = Array.from(document.querySelectorAll('.mosaic-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentPhotoIndex = 0;
  let touchStartX = 0;

  function renderLightboxSlide(index) {
    if (!lightbox || mosaicItems.length === 0) return;
    currentPhotoIndex = (index + mosaicItems.length) % mosaicItems.length;
    const item = mosaicItems[currentPhotoIndex];
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || '';
    const caption = item.getAttribute('data-caption') || '';

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title || 'Enlarged stage photograph';
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = caption;
    if (lightboxCounter) {
      const currentFormatted = String(currentPhotoIndex + 1).padStart(2, '0');
      const totalFormatted = String(mosaicItems.length).padStart(2, '0');
      lightboxCounter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }
  }

  function openLightboxAt(index) {
    if (!lightbox) return;
    renderLightboxSlide(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  mosaicItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightboxAt(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightboxAt(index);
      }
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxSlide(currentPhotoIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightboxSlide(currentPhotoIndex + 1);
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });

    // Touch swipe navigation on mobile
    lightbox.addEventListener(
      'touchstart',
      (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          touchStartX = e.changedTouches[0].screenX;
        }
      },
      { passive: true }
    );

    lightbox.addEventListener(
      'touchend',
      (e) => {
        if (e.changedTouches && e.changedTouches.length > 0) {
          const touchEndX = e.changedTouches[0].screenX;
          const deltaX = touchEndX - touchStartX;
          if (Math.abs(deltaX) > 45) {
            if (deltaX < 0) {
              renderLightboxSlide(currentPhotoIndex + 1);
            } else {
              renderLightboxSlide(currentPhotoIndex - 1);
            }
          }
        }
      },
      { passive: true }
    );
  }

  // Global keyboard shortcuts (ESC, ArrowLeft, ArrowRight)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navOverlay && navOverlay.classList.contains('open')) {
        closeMenu();
      }
      if (lightbox && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    } else if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'ArrowRight') {
        renderLightboxSlide(currentPhotoIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        renderLightboxSlide(currentPhotoIndex - 1);
      }
    }
  });


  // =========================================================================
  // 7. PRESS BILINGUAL TOGGLE (EN / DE)
  // =========================================================================
  const btnEn = document.getElementById('press-lang-en');
  const btnDe = document.getElementById('press-lang-de');
  const quoteBodies = document.querySelectorAll('.quote-body');

  function setPressLanguage(lang) {
    if (!btnEn || !btnDe) return;
    const isEnglish = lang === 'en';
    btnEn.classList.toggle('active', isEnglish);
    btnDe.classList.toggle('active', !isEnglish);

    quoteBodies.forEach((q) => {
      const quoteLang = q.getAttribute('data-lang');
      if (quoteLang === lang) {
        q.classList.remove('is-hidden');
      } else {
        q.classList.add('is-hidden');
      }
    });
  }

  if (btnEn && btnDe) {
    btnEn.addEventListener('click', () => setPressLanguage('en'));
    btnDe.addEventListener('click', () => setPressLanguage('de'));
  }


  // =========================================================================
  // 8. ANTI-SCRAPER EMAIL LINKS & ONE-CLICK CLIPBOARD COPY
  // =========================================================================
  const obfuscatedEmails = document.querySelectorAll('.obfuscated-email');
  obfuscatedEmails.forEach((link) => {
    const user = link.getAttribute('data-user');
    const domain = link.getAttribute('data-domain');
    if (user && domain) {
      const fullAddress = `${user}@${domain}`;
      link.textContent = fullAddress;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `mailto:${fullAddress}`;
      });
    }
  });

  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const user = btn.getAttribute('data-user');
      const domain = btn.getAttribute('data-domain');
      const fallbackCopy = btn.getAttribute('data-copy');
      const textToCopy = user && domain ? `${user}@${domain}` : fallbackCopy;

      if (navigator.clipboard && textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.background = '#22c55e';
          btn.style.color = '#000';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });


  // =========================================================================
  // 9. DYNAMIC COPYRIGHT YEAR
  // =========================================================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

});
