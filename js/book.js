export function createBookController({ elements, state, chapters }) {
  let turnTimer;

  function build() {
    elements.bookTabs.innerHTML = "";

    chapters.forEach((chapter, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "book-tab";
      button.innerHTML = `
        <span class="book-tab-index">${String(index + 1).padStart(2, "0")}</span>
        <strong>${chapter.label}</strong>
      `;
      button.setAttribute("aria-label", `Ir a ${chapter.label}`);
      button.setAttribute("aria-current", "false");
      button.addEventListener("click", () => goToPage(index));
      elements.bookTabs.appendChild(button);
    });

    setClosedState("front");
    setActivePage(0);
  }

  function setClosedState(side) {
    state.bookOpened = false;
    state.bookSide = side;
    document.body.classList.remove("book-open");
    document.body.dataset.bookState = side === "back" ? "back-cover" : "front-cover";
    elements.bookShell.setAttribute("aria-hidden", "true");
    elements.bookCoverFront?.setAttribute("aria-expanded", side === "front" ? "false" : "true");
    elements.bookCoverBack?.setAttribute("aria-expanded", side === "back" ? "false" : "true");
  }

  function openBook({ side = "front", index } = {}) {
    state.bookOpened = true;
    state.bookSide = side;
    document.body.classList.add("book-open");
    document.body.dataset.bookState = "open";
    elements.bookShell.setAttribute("aria-hidden", "false");

    const targetIndex =
      typeof index === "number"
        ? index
        : side === "back"
          ? chapters.length - 1
          : Math.max(0, state.activePageIndex);

    setActivePage(targetIndex);

    window.requestAnimationFrame(() => {
      elements.bookShell.focus();
    });
  }

  function closeBook(side = "front") {
    setClosedState(side);
  }

  function setActivePage(index) {
    state.activePageIndex = Math.max(0, Math.min(index, chapters.length - 1));
    const active = chapters[state.activePageIndex];

    elements.bookPageTitle.textContent = active.label;
    elements.bookPageIndex.textContent = String(state.activePageIndex + 1).padStart(2, "0");
    elements.bookPageSummary.textContent = active.summary;
    elements.bookPrev.disabled = false;
    elements.bookNext.disabled = false;
    elements.bookPrev.textContent = state.activePageIndex === 0 ? "Cerrar" : "Anterior";
    elements.bookNext.textContent =
      state.activePageIndex === chapters.length - 1 ? "Cerrar" : "Siguiente";
    document.body.dataset.bookTone = active.tone;

    document.querySelectorAll(".book-page").forEach((page) => {
      page.classList.toggle("is-active", page.dataset.page === active.id);
    });

    document.querySelectorAll(".book-tab").forEach((tab, tabIndex) => {
      tab.classList.toggle("is-active", tabIndex === state.activePageIndex);
      tab.setAttribute("aria-current", tabIndex === state.activePageIndex ? "page" : "false");
    });
  }

  function goToPage(index, options = {}) {
    if (index < 0) {
      if (!state.bookOpened) {
        return;
      }

      playTurn("prev");
      window.clearTimeout(turnTimer);
      turnTimer = window.setTimeout(() => {
        closeBook("front");
      }, 220);
      return;
    }

    if (index >= chapters.length) {
      if (!state.bookOpened) {
        return;
      }

      playTurn("next");
      window.clearTimeout(turnTimer);
      turnTimer = window.setTimeout(() => {
        closeBook("back");
      }, 220);
      return;
    }

    const boundedIndex = Math.max(0, Math.min(index, chapters.length - 1));

    if (!state.bookOpened) {
      openBook({ side: state.bookSide, index: boundedIndex });
      return;
    }

    if (boundedIndex === state.activePageIndex) {
      return;
    }

    if (options.immediate) {
      setActivePage(boundedIndex);
      return;
    }

    playTurn(boundedIndex > state.activePageIndex ? "next" : "prev");

    window.clearTimeout(turnTimer);
    turnTimer = window.setTimeout(() => {
      setActivePage(boundedIndex);
    }, 220);
  }

  function playTurn(direction) {
    if (state.isTurningPage) {
      return;
    }

    state.isTurningPage = true;
    elements.bookTurn.classList.remove("is-next", "is-prev", "is-active");
    elements.bookTurn.classList.add(direction === "prev" ? "is-prev" : "is-next");
    void elements.bookTurn.offsetWidth;
    elements.bookTurn.classList.add("is-active");

    window.setTimeout(() => {
      elements.bookTurn.classList.remove("is-active", "is-next", "is-prev");
      state.isTurningPage = false;
    }, 720);
  }

  return { build, closeBook, goToPage, openBook };
}
