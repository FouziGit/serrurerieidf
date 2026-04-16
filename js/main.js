// ============================================
// URGENCE SERRURES — Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // --- Scroll Animations (IntersectionObserver) ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // --- Smooth Scroll for Navigation ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Contact Form Handler (Resend via Netlify Function) ---
  const form = document.getElementById('contact-form');
  if (form) {
    let isSubmitting = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      isSubmitting = true;

      const btn = form.querySelector('.btn-submit');
      const originalText = btn.innerHTML;

      btn.innerHTML = 'Envoi en cours...';
      btn.disabled = true;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        const formData = {
          name: form.querySelector('#name').value,
          phone: form.querySelector('#phone').value,
          email: form.querySelector('#email').value,
          urgency: form.querySelector('#urgency').value,
          message: form.querySelector('#message').value,
        };

        const response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          btn.innerHTML = '✓ Message envoyé !';
          btn.style.background = 'var(--color-success)';
          form.reset();
        } else {
          btn.innerHTML = '✗ Erreur, réessayez';
          btn.style.background = '#e74c3c';
        }
      } catch (error) {
        clearTimeout(timeout);
        btn.innerHTML = '✗ Erreur, réessayez';
        btn.style.background = '#e74c3c';
      }

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        isSubmitting = false;
      }, 3000);
    });
  }

  // --- Modal Badge ---
  const modalOverlay = document.getElementById('badge-modal');
  const modalTrigger = document.getElementById('badge-modal-trigger');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (modalOverlay && modalTrigger) {
    modalTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // --- Department Card Filter (zones page) ---
  const deptCards = document.querySelectorAll('.dept-card');
  deptCards.forEach(card => {
    const header = card.querySelector('.dept-header');
    const cities = card.querySelector('.dept-cities');

    if (header && cities) {
      // Initially show first 8 cities, rest on click
      const allLinks = cities.querySelectorAll('a');
      if (allLinks.length > 8) {
        allLinks.forEach((link, i) => {
          if (i >= 8) link.style.display = 'none';
        });

        const showMore = document.createElement('button');
        showMore.textContent = `+ ${allLinks.length - 8} autres villes`;
        showMore.className = 'service-link';
        showMore.style.cssText = 'margin-top: 8px; cursor: pointer; font-size: 0.8rem;';
        showMore.addEventListener('click', () => {
          allLinks.forEach(link => link.style.display = '');
          showMore.remove();
        });
        cities.appendChild(showMore);
      }
    }
  });

  // Decorative particle backdrop for hero section. Pauses when scrolled out of view.
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) { console.warn('Canvas 2D context not available'); } else {
    const PARTICLE_DENSITY = 15000; // pixels per particle (higher = fewer)
    const MAX_PARTICLES = 60;
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(MAX_PARTICLES, Math.floor(canvas.width * canvas.height / PARTICLE_DENSITY));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 107, 53, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        particles.forEach((p2, j) => {
          if (j <= i) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 107, 53, ${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animFrameId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    // Pause particles when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animFrameId) drawParticles();
        } else {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      });
    });
    heroObserver.observe(canvas.parentElement);
    } // ctx check
  }

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.counter-value');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const isDecimal = el.dataset.decimal === 'true';
          const duration = 2000;
          const startTime = performance.now();

          function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
              el.textContent = current.toFixed(1);
            } else if (target >= 1000) {
              el.textContent = Math.floor(current).toLocaleString('fr-FR');
            } else {
              el.textContent = Math.floor(current);
            }

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            }
          }

          requestAnimationFrame(updateCount);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // --- Tilt Card Effect ---
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
