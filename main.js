document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // IMAGE MODAL
  // ============================================================
  document.querySelectorAll("img.expandable").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openImageModal(img));
  });

  function openImageModal(imgEl) {
    const isWorkPage = window.location.pathname.includes("work.html") ||
                       document.title.toLowerCase().includes("my work");
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    const modal   = document.createElement("div");
    modal.className = "image-modal";
    modal.style.width = isWorkPage ? "90%" : "65%";
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "✕";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.addEventListener("click", closeAll);
    const bigImg = document.createElement("img");
    bigImg.src = imgEl.dataset.full || imgEl.src;
    bigImg.alt = imgEl.alt || "Expanded image";
    modal.append(closeBtn, bigImg);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.classList.add("show");
      modal.classList.add("show");
    });
    overlay.addEventListener("click", e => { if (e.target === overlay) closeAll(); });
    document.addEventListener("keydown", escHandler);
    function escHandler(e) { if (e.key === "Escape") closeAll(); }
    function closeAll() {
      modal.classList.remove("show");
      overlay.classList.remove("show");
      document.removeEventListener("keydown", escHandler);
      setTimeout(() => overlay.remove(), 300);
    }
  }

  // ============================================================
  // TESTIMONIALS — arrows + dots + auto-advance + pause on hover
  // ============================================================
  const testimonials = document.querySelectorAll(".testimonial");
  const dots         = document.querySelectorAll(".dot");
  let current    = 0;
  let autoTimer  = null;

  function showTestimonial(idx) {
    testimonials.forEach((t, i) => t.classList.toggle("active", i === idx));
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    current = idx;
  }

  function next() { showTestimonial((current + 1) % testimonials.length); }
  function prev() { showTestimonial((current - 1 + testimonials.length) % testimonials.length); }

  function startAuto() { autoTimer = setInterval(next, 4500); }
  function stopAuto()  { clearInterval(autoTimer); autoTimer = null; }
  function resetAuto() { stopAuto(); startAuto(); }

  if (testimonials.length) {
    showTestimonial(0);
    startAuto();

    // Arrows (FIXED — were dead before, now wired up)
    document.getElementById("tPrev")?.addEventListener("click", e => { e.stopPropagation(); prev(); resetAuto(); });
    document.getElementById("tNext")?.addEventListener("click", e => { e.stopPropagation(); next(); resetAuto(); });

    // Dots
    dots.forEach((dot, i) => {
      dot.addEventListener("click", e => { e.stopPropagation(); showTestimonial(i); resetAuto(); });
    });

    // Click image to advance
    document.querySelector(".testimonials-stage")
      ?.addEventListener("click", () => { next(); resetAuto(); });

    // Pause on hover
    const section = document.querySelector("#testimonials");
    if (section) {
      section.addEventListener("mouseenter", stopAuto);
      section.addEventListener("mouseleave", startAuto);
    }
  }

  // ============================================================
  // HEADER SCROLL SHRINK
  // ============================================================
  const mainHeader = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    mainHeader?.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });

  // ============================================================
  // ACTIVE NAV HIGHLIGHT
  // ============================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  window.addEventListener("scroll", () => {
    let cur = "";
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  }, { passive: true });

  // ============================================================
  // MOBILE NAV — exposed to window for inline onclick in HTML
  // ============================================================
  const hamburger  = document.getElementById("hamburger");
  const mobileNav  = document.getElementById("mobileNav");
  const navOverlay = document.getElementById("navOverlay");

  window.openMobileNav = function() {
    mobileNav?.classList.add("open");
    navOverlay?.classList.add("open");
    hamburger?.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  window.closeMobileNav = function() {
    mobileNav?.classList.remove("open");
    navOverlay?.classList.remove("open");
    hamburger?.classList.remove("open");
    document.body.style.overflow = "";
  };

  hamburger?.addEventListener("click", window.openMobileNav);
  document.getElementById("mobileClose")?.addEventListener("click", window.closeMobileNav);
  document.addEventListener("keydown", e => { if (e.key === "Escape") window.closeMobileNav(); });

  // ============================================================
  // TYPING ANIMATION — single instance only (FIXED: removed duplicate)
  // ============================================================
  (function() {
    const roles = [
      "Web Developer",
      "Tech Innovator",
      "Financial Analyst",
      "Founder of Nexua",
      "Frontend Developer",
      "Graphics Designer"
    ];
    const el = document.getElementById("typing-text");
    if (!el) return;
    let ri = 0, ci = 0, del = false;
    function type() {
      const cur = roles[ri];
      if (!del) {
        el.textContent = cur.slice(0, ++ci);
        if (ci === cur.length) { del = true; setTimeout(type, 1800); return; }
      } else {
        el.textContent = cur.slice(0, --ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(type, del ? 55 : 90);
    }
    type();
  })();

  // ============================================================
  // SCROLL-REVEAL via IntersectionObserver
  // ============================================================
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in-view"); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(el => ro.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("in-view"));
  }

  // ============================================================
  // SKILL BARS — animate only when scrolled into view
  // ============================================================
  const skillBars = document.querySelector(".skill-bars");
  if (skillBars && "IntersectionObserver" in window) {
    const bo = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("bars-animated"); bo.unobserve(e.target); } });
    }, { threshold: 0.2 });
    bo.observe(skillBars);
  } else if (skillBars) {
    skillBars.classList.add("bars-animated");
  }

  // ============================================================
  // BACK TO TOP BUTTON
  // ============================================================
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });
    backToTop.addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  // ============================================================
  // DYNAMIC COPYRIGHT YEAR
  // ============================================================
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});