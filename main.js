document.addEventListener("DOMContentLoaded", () => {
  // Select all expandable images
  const expandable = document.querySelectorAll("img.expandable");

  // If none found, still safe to run
  expandable.forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openImageModal(img));
  });

  function openImageModal(imgEl) {
    // determine width based on page
    const isWorkPage = window.location.pathname.includes("work.html") || document.title.toLowerCase().includes("my work");
    const modalWidth = isWorkPage ? "90%" : "65%";

    // create overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    // create modal
    const modal = document.createElement("div");
    modal.className = "image-modal";
    modal.style.width = modalWidth;

    // create close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "close-btn";
    closeBtn.innerHTML = "✕";
    closeBtn.addEventListener("click", closeAll);

    // create image element (use same src but set alt)
    const bigImg = document.createElement("img");
    // Prefer data-src if you have high-res images; otherwise use same src
    bigImg.src = imgEl.dataset.full || imgEl.src;
    bigImg.alt = imgEl.alt || "Expanded image";

    // append elements
    modal.appendChild(closeBtn);
    modal.appendChild(bigImg);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // show with small timeout for transitions
    requestAnimationFrame(() => {
      overlay.classList.add("show");
      modal.classList.add("show");
    });

    // close when clicking outside the modal (overlay area)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeAll();
    });

    // Esc key to close
    function escHandler(e) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("keydown", escHandler);

    function closeAll() {
      modal.classList.remove("show");
      overlay.classList.remove("show");
      document.removeEventListener("keydown", escHandler);
      setTimeout(() => {
        overlay.remove();
      }, 300);
    }
  }
});
