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

    setActivePage(0);
  }

  function openBook() {
    if (state.bookOpened) {
      return;
    }

    state.bookOpened = true;
    document.body.classList.add("book-open");
    elements.bookCover.setAttribute("aria-expanded", "true");
    elements.bookShell.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => {
      elements.bookShell.focus();
    });
  }

  function setActivePage(index) {
    state.activePageIndex = Math.max(0, Math.min(index, chapters.length - 1));
    const active = chapters[state.activePageIndex];

    elements.bookPageTitle.textContent = active.label;
    elements.bookPageIndex.textContent = String(state.activePageIndex + 1).padStart(2, "0");
    elements.bookPageSummary.textContent = active.summary;
    elements.bookPrev.disabled = state.activePageIndex === 0;
    elements.bookNext.disabled = state.activePageIndex === chapters.length - 1;
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
    const boundedIndex = Math.max(0, Math.min(index, chapters.length - 1));
    if (boundedIndex === state.activePageIndex) {
      openBook();
      return;
    }

    openBook();

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

  return { build, openBook, goToPage };
}
