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
    const gallery = await loadGalleryData();

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
    elements.bookCoverFront?.setAttribute("aria-disabled", "true");
    elements.bookCoverBack?.setAttribute("aria-disabled", "true");
    if (elements.bookCoverFront) {
      elements.bookCoverFront.disabled = true;
    }
    if (elements.bookCoverBack) {
      elements.bookCoverBack.disabled = true;
    }
    console.error(error);
  }
}

async function loadGalleryData() {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${dataUrl}: ${response.status}`);
    }

    return await response.json();
  } catch (fetchError) {
    if (window.__MICH_GALLERY__) {
      return window.__MICH_GALLERY__;
    }

    throw fetchError;
  }
}

function bindControls(book, lightbox) {
  elements.bookCoverFront?.addEventListener("click", () => book.openBook({ side: "front", index: 0 }));
  elements.bookCoverBack?.addEventListener("click", () =>
    book.openBook({ side: "back", index: bookChapters.length - 1 }),
  );
  if (elements.openNextPage) {
    elements.openNextPage.addEventListener("click", () => book.goToPage(1));
  }

  if (elements.bookPrev) {
    elements.bookPrev.addEventListener("click", () => book.goToPage(state.activePageIndex - 1));
  }

  if (elements.bookNext) {
    elements.bookNext.addEventListener("click", () => book.goToPage(state.activePageIndex + 1));
  }

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
    book.openBook({ side: "front", index: 0 });
  }

  if (urlParams.get("back") === "1") {
    book.closeBook("back");
    return;
  }

  const pageId = urlParams.get("page");
  if (!pageId) {
    return;
  }

  const targetIndex = bookChapters.findIndex((chapter) => chapter.id === pageId);
  if (targetIndex >= 0) {
    book.openBook({ side: "front", index: targetIndex });
  }
}

function populateBookMeta(gallery) {
  if (!elements.bookGeneratedAt) {
    return;
  }

  const generatedAt = new Date(gallery.generatedAt);
  const formatted = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(generatedAt);

  elements.bookGeneratedAt.textContent = `Reunido el ${formatted}`;
}
