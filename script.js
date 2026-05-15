const copyButton = document.querySelector("[data-copy-target]");
const copyStatus = document.querySelector(".copy-status");

function fallbackCopy(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-1000px";
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

async function copyCitation() {
  if (!copyButton) return;

  const targetId = copyButton.getAttribute("data-copy-target");
  const target = targetId ? document.getElementById(targetId) : null;
  const text = target?.innerText.trim();

  if (!text) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else if (!fallbackCopy(text)) {
      throw new Error("Clipboard copy failed");
    }
    copyStatus.textContent = "BibTeX copied.";
    window.setTimeout(() => {
      copyStatus.textContent = "";
    }, 2200);
  } catch {
    copyStatus.textContent = fallbackCopy(text)
      ? "BibTeX copied."
      : "Select the BibTeX text and copy it manually.";
  }
}

copyButton?.addEventListener("click", copyCitation);

/* Case study carousel */
(function initCarousel() {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const track = carousel.querySelector("[data-carousel-track]");
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector("[data-carousel-prev]");
  const nextBtn = carousel.querySelector("[data-carousel-next]");
  const dotsWrap = document.querySelector("[data-carousel-dots]");
  const counter = document.querySelector("[data-carousel-counter]");
  let index = 0;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Go to case ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(dot);
    return dot;
  });

  function goTo(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    slides.forEach((slide, i) => slide.setAttribute("aria-hidden", String(i !== index)));
    if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  });

  let touchStartX = 0;
  let touching = false;
  carousel.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
      touching = true;
    },
    { passive: true }
  );
  carousel.addEventListener("touchend", (event) => {
    if (!touching) return;
    touching = false;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 40) goTo(index + (deltaX < 0 ? 1 : -1));
  });

  goTo(0);

  /* Lightbox */
  const lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector("[data-lightbox-close]");

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.removeAttribute("src");
    };

    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      img?.addEventListener("click", () => {
        lightboxImg.src = img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });

    closeBtn?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLightbox();
    });
  }
})();
