import { normalizeIndex } from "./utils.js";

export function createLightboxController({ elements, state }) {
  function open(index) {
    state.currentIndex = normalizeIndex(index, state.allImages.length);
    const image = state.allImages[state.currentIndex];

    elements.lightboxImage.src = image.src;
    elements.lightboxImage.alt = image.alt;
    elements.lightboxMeta.textContent = `${image.chapterLabel} - Foto ${String(image.photoNumber).padStart(2, "0")}`;
    elements.lightboxTitle.textContent = image.title;

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
