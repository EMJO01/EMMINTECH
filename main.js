document.addEventListener("DOMContentLoaded", () => {
  // ========== IMAGE MODAL (ZOOM-IN FEATURE) ==========
  const expandable = document.querySelectorAll("img.expandable");

  expandable.forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openImageModal(img));
  });

  function openImageModal(imgEl) {
    const isWorkPage =
      window.location.pathname.includes("work.html") ||
      document.title.toLowerCase().includes("my work");
    const modalWidth = isWorkPage ? "90%" : "65%";

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "image-modal";
    modal.style.width = modalWidth;

    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "✕";
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

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAll();
    });

    document.addEventListener("keydown", escHandler);

    function escHandler(e) {
      if (e.key === "Escape") closeAll();
    }

    function closeAll() {
      modal.classList.remove("show");
      overlay.classList.remove("show");
      document.removeEventListener("keydown", escHandler);
      setTimeout(() => overlay.remove(), 300);
    }
  }

  // ========== TESTIMONIAL SECTION ==========
  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  let current = 0;

  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle("active", i === index);
      dots[i]?.classList.toggle("active", i === index);
    });
  }

  // Show the first one by default
  showTestimonial(current);

  // Click anywhere on testimonials container to show next
  const testimonialsContainer = document.querySelector("#testimonials");
  if (testimonialsContainer) {
    testimonialsContainer.addEventListener("click", () => {
      current = (current + 1) % testimonials.length;
      showTestimonial(current);
    });
  }

  // Click on dots to navigate directly
  dots.forEach((dot, i) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      current = i;
      showTestimonial(current);
    });
  });
});
