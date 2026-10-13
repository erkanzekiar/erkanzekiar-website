/**
 * ERKAN ZEKI AR — ARTIST PORTFOLIO
 * Interactive script: Corner drawer, filtering, lightbox, bilingual press, copy fields.
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. CORNER MENU & DRAWER TOGGLE
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
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

  // Close when clicking outside panel on backdrop
  if (navOverlay) {
    navOverlay.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-backdrop')) {
        closeMenu();
      }
    });
  }

  // Close menu after clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // ESC key listener for menu & lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navOverlay && navOverlay.classList.contains('open')) {
        closeMenu();
      }
      closeLightbox();
    }
  });


  // 2. DISCOGRAPHY CATEGORY FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      workCards.forEach(card => {
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


  // 3. LIGHTBOX MODAL FOR GALLERY MOSAIC
  const mosaicItems = document.querySelectorAll('.mosaic-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(imgSrc, title, caption) {
    if (!lightbox) return;
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title || '';
    lightboxDesc.textContent = caption || '';
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

  mosaicItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title');
      const caption = item.getAttribute('data-caption');
      if (img) {
        openLightbox(img.src, title, caption);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }


  // 4. PRESS BILINGUAL TOGGLE (EN / DE)
  const btnEn = document.getElementById('press-lang-en');
  const btnDe = document.getElementById('press-lang-de');
  const quoteBodies = document.querySelectorAll('.quote-body');

  function setPressLanguage(lang) {
    if (lang === 'en') {
      btnEn.classList.add('active');
      btnDe.classList.remove('active');
      quoteBodies.forEach(q => {
        if (q.getAttribute('data-lang') === 'en') {
          q.style.display = 'block';
        } else {
          q.style.display = 'none';
        }
      });
    } else {
      btnDe.classList.add('active');
      btnEn.classList.remove('active');
      quoteBodies.forEach(q => {
        if (q.getAttribute('data-lang') === 'de') {
          q.style.display = 'block';
        } else {
          q.style.display = 'none';
        }
      });
    }
  }

  if (btnEn && btnDe) {
    btnEn.addEventListener('click', () => setPressLanguage('en'));
    btnDe.addEventListener('click', () => setPressLanguage('de'));
  }


  // 5. ONE-CLICK CLIPBOARD COPY BUTTONS
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
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


  // 6. CONTACT FORM SUBMISSION
  const form = document.getElementById('portfolio-contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const topic = document.getElementById('topic').value;
      const message = document.getElementById('message').value;

      // Construct mailto link as direct fallback
      const subject = encodeURIComponent(`[Inquiry: ${topic}] from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPurpose: ${topic}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:erkanzekiar@gmail.com?subject=${subject}&body=${body}`;

      // Show immediate confirmation and trigger mail client
      feedback.style.display = 'block';
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `<strong>Thank you, ${name}!</strong> Opening your email client to dispatch this message directly to Erkan Zeki Ar...`;

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 700);

      form.reset();
    });
  }


  // 7. DYNAMIC YEAR
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
