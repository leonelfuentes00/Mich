import { dataUrl, bookChapters } from "./js/config.js";
import { elements } from "./js/dom.js";
import { createBookController } from "./js/book.js";
import { createLightboxController } from "./js/lightbox.js";
import {
  buildAlbums,
  buildArchiveStats,
  buildHeroStack,
  buildMemoryWall,
  buildStoryStrip,
  buildTableOfContents,
  hydrateGalleryIndex,
} from "./js/renderers.js";
import { state } from "./js/state.js";

init();

async function init() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${dataUrl}: ${response.status}`);
    }

    const gallery = await response.json();

    hydrateGalleryIndex(state, gallery);

    const lightbox = createLightboxController({ elements, state });
    const book = createBookController({ elements, state, chapters: bookChapters });

    populateBookMeta(gallery);
    buildHeroStack(elements, gallery, lightbox.openLightboxById);
    buildStoryStrip(elements, gallery, lightbox.openLightboxById);
    buildTableOfContents(elements, gallery);
    buildAlbums(elements, gallery, lightbox.openLightboxById);
    buildArchiveStats(elements, gallery);
    buildMemoryWall(elements, state, lightbox.open);
    book.build();
    applyPreviewState(book, urlParams);
    bindControls(book, lightbox);
  } catch (error) {
    elements.bookError.hidden = false;
    elements.bookCover.disabled = true;
    elements.bookCover.setAttribute("aria-disabled", "true");
    console.error(error);
  }
}

function bindControls(book, lightbox) {
  elements.bookCover.addEventListener("click", book.openBook);
  elements.openNextPage.addEventListener("click", () => book.goToPage(1));
  elements.bookPrev.addEventListener("click", () => book.goToPage(state.activePageIndex - 1));
  elements.bookNext.addEventListener("click", () => book.goToPage(state.activePageIndex + 1));

  lightbox.bind();

  window.addEventListener("keydown", (event) => {
    if (!state.bookOpened && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      book.openBook();
      return;
    }

    if (state.bookOpened && !elements.lightbox.open) {
      if (event.key === "ArrowRight") {
        book.goToPage(state.activePageIndex + 1);
        return;
      }

      if (event.key === "ArrowLeft") {
        book.goToPage(state.activePageIndex - 1);
        return;
      }
    }

    if (!elements.lightbox.open) {
      return;
    }

    if (event.key === "Escape") {
      elements.lightbox.close();
      return;
    }

    if (event.key === "ArrowLeft") {
      lightbox.step(-1);
    }

    if (event.key === "ArrowRight") {
      lightbox.step(1);
    }
  });
}

function applyPreviewState(book, urlParams) {
  if (urlParams.get("open") === "1") {
    book.openBook();
  }

  const pageId = urlParams.get("page");
  if (!pageId) {
    return;
  }

  const targetIndex = bookChapters.findIndex((chapter) => chapter.id === pageId);
  if (targetIndex >= 0) {
    book.openBook();
    book.goToPage(targetIndex, { immediate: true });
  }
}

function populateBookMeta(gallery) {
  const generatedAt = new Date(gallery.generatedAt);
  const formatted = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(generatedAt);

  elements.bookGeneratedAt.textContent = `Compilado el ${formatted}`;
}
