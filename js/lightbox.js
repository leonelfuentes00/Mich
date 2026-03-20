import { normalizeIndex } from "./utils.js";

export function createLightboxController({ elements, state }) {
  function renderThumbs() {
    if (!elements.lightboxThumbs) {
      return;
    }

    elements.lightboxThumbs.innerHTML = "";

    if (!state.allImages.length) {
      return;
    }

    const total = state.allImages.length;
    const span = Math.min(total, 7);
    const half = Math.floor(span / 2);

    for (let offset = -half; offset <= half; offset += 1) {
      if (elements.lightboxThumbs.childElementCount >= span) {
        break;
      }

      const index = normalizeIndex(state.currentIndex + offset, total);
      const image = state.allImages[index];
      const button = document.createElement("button");

      button.type = "button";
      button.className = "lightbox-thumb";
      button.setAttribute("aria-label", `Abrir ${image.title}`);
      button.setAttribute("aria-pressed", index === state.currentIndex ? "true" : "false");
      button.innerHTML = `<img src="${image.src}" alt="${image.alt}" loading="lazy" />`;
      button.addEventListener("click", () => open(index));
      elements.lightboxThumbs.appendChild(button);
    }
  }

  function open(index) {
    state.currentIndex = normalizeIndex(index, state.allImages.length);
    const image = state.allImages[state.currentIndex];

    elements.lightboxImage.src = image.src;
    elements.lightboxImage.alt = image.alt;
    elements.lightboxMeta.textContent = `${image.chapterLabel} - Foto ${String(image.photoNumber).padStart(2, "0")}`;
    elements.lightboxTitle.textContent = image.title;
    if (elements.lightboxCounter) {
      elements.lightboxCounter.textContent = `${String(state.currentIndex + 1).padStart(2, "0")} / ${String(state.allImages.length).padStart(2, "0")}`;
    }
    renderThumbs();

    if (!elements.lightbox.open) {
      elements.lightbox.showModal();
    }
  }

  function openLightboxById(id) {
    const index = state.allImages.findIndex((image) => image.id === id);
    if (index >= 0) {
      open(index);
    }
  }

  function step(direction) {
    open(state.currentIndex + direction);
  }

  function bind() {
    elements.prevShot.addEventListener("click", () => step(-1));
    elements.nextShot.addEventListener("click", () => step(1));

    elements.lightbox.addEventListener("click", (event) => {
      const rect = elements.lightbox.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        elements.lightbox.close();
      }
    });

    elements.lightbox.addEventListener("cancel", () => {
      elements.lightbox.close();
    });
  }

  return { bind, open, openLightboxById, step };
}
