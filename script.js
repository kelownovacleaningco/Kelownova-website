/* ============================================================
   Kelownova Cleaning Co. — Site scripts
   Plain JS, no dependencies, no build step.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the mobile menu after a nav link is chosen
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  /* ---------- Scroll-reveal animation ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && revealEls.length && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // No IntersectionObserver support, or reduced motion requested: show immediately
    revealEls.forEach(function (el) {
      el.classList.add('in-view');
    });
  }

  /* ---------- Quote form handling ----------
     Submits to Formspree via fetch so the visitor stays on this page
     and sees a confirmation message here instead of being redirected
     to a generic Formspree page. */
  var quoteForm = document.getElementById('quote-form');
  var formStatus = document.getElementById('form-status');

  if (quoteForm && formStatus) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      var submitBtn = quoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      fetch(quoteForm.action, {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            formStatus.textContent = "Thanks! Your quote request has been sent. We'll get back to you as soon as we can.";
            formStatus.className = 'form-status visible success';
            quoteForm.reset();
          } else {
            formStatus.textContent = 'Sorry, something went wrong sending your request. Please try again, or email us directly.';
            formStatus.className = 'form-status visible error';
          }
        })
        .catch(function () {
          formStatus.textContent = 'Sorry, something went wrong sending your request. Please try again, or email us directly.';
          formStatus.className = 'form-status visible error';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request My Free Quote';
          }
          formStatus.setAttribute('tabindex', '-1');
          formStatus.focus();
          formStatus.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
        });
    });
  }

});
