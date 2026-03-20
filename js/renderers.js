import { dayLabel, heroShotTransform, plateTitle, resolveChapterLabel, shuffle, storyWhisper, tulipTone } from "./utils.js";

export function hydrateGalleryIndex(state, gallery) {
  state.allImages = gallery.albums.flatMap((album, albumIndex) =>
    album.images.map((image) => ({
      ...image,
      albumLabel: album.label,
      chapterLabel: resolveChapterLabel(album, albumIndex),
      title: plateTitle(resolveChapterLabel(album, albumIndex), image.photoNumber),
      alt: `${resolveChapterLabel(album, albumIndex)}, lamina ${String(image.photoNumber).padStart(2, "0")}`,
    })),
  );
}

function renderStoryCards(container, images, openLightboxById, startIndex = 0) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  images.forEach((image, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "story-card";
    card.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <div class="story-card-copy">
        <span class="story-card-meta">Parada ${String(startIndex + index + 1).padStart(2, "0")}</span>
        <strong>${image.chapterLabel}</strong>
        <p>${storyWhisper(startIndex + index)}</p>
      </div>
    `;
    card.addEventListener("click", () => openLightboxById(image.id));
    container.appendChild(card);
  });
}

function renderAlbumCards(container, albums, startIndex, elements, openLightboxById) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  albums.forEach((album, index) => {
    const node = elements.albumTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".album-card-button");
    const albumIndex = startIndex + index;
    const chapterLabel = resolveChapterLabel(album, albumIndex);

    node.querySelector(".album-card-cover").src = album.cover;
    node.querySelector(".album-card-cover").alt = `Portada de ${chapterLabel}`;
    node.querySelector(".album-card-index").textContent = dayLabel(albumIndex);
    node.querySelector(".album-card-kicker").textContent = tulipTone(startIndex + index);
    node.querySelector("h3").textContent = chapterLabel;
    node.querySelector(".album-card-count").textContent = `${album.count} fotos`;
    button.addEventListener("click", () => openLightboxById(album.images[0].id));
    container.appendChild(node);
  });
}

function renderMemoryCards(container, images, offset, openLightbox) {
  if (!container) {
    return;
  }

  container.innerHTML = "";

  images.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.shape = "standard";
    button.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <span>${image.chapterLabel}</span>
    `;
    button.addEventListener("click", () => openLightbox(offset + index));
    container.appendChild(button);
  });
}

function selectMemoryWallEntries(allImages, amount) {
  const groups = new Map();

  allImages.forEach((image, index) => {
    const key = image.chapterLabel || image.albumLabel || "archivo";
    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push({ image, index });
  });

  const chapters = [...groups.values()];
  const selection = [];
  let round = 0;

  while (selection.length < amount) {
    let addedInRound = 0;

    chapters.forEach((entries) => {
      if (selection.length >= amount) {
        return;
      }

      if (round < entries.length) {
        selection.push(entries[round]);
        addedInRound += 1;
      }
    });

    if (addedInRound === 0) {
      break;
    }

    round += 1;
  }

  return selection.slice(0, amount);
}

export function buildHeroStack(elements, gallery, openLightboxById) {
  const allImages = shuffle(
    gallery.albums.flatMap((album) => album.images.map((image) => ({ ...image, albumLabel: album.label }))),
  );
  const pool = allImages.slice(0, Math.min(18, allImages.length));
  let images = pool.slice(0, Math.min(5, pool.length));
  elements.heroStack.innerHTML = "";

  function applyStack(frontIndex) {
    const frames = [...elements.heroStack.querySelectorAll(".hero-shot")];
    const count = frames.length;

    frames.forEach((frame, index) => {
      const rank = (index - frontIndex + count) % count;
      const visualIndex = count - rank - 1;
      frame.style.transform = heroShotTransform(visualIndex);
      frame.style.zIndex = String(rank + 1);
      frame.classList.toggle("is-featured", rank === count - 1);
      frame.classList.toggle("is-recessive", rank < count - 2);
    });
  }

  function syncFrameContent(frame, image) {
    const img = frame.querySelector("img");
    img.src = image.src;
    img.alt = image.alt;
    frame.dataset.imageId = image.id;
  }

  images.forEach((image, index) => {
    const frame = document.createElement("button");
    const img = document.createElement("img");

    frame.type = "button";
    frame.className = "hero-shot";
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    frame.appendChild(img);
    frame.dataset.imageId = image.id;
    frame.addEventListener("click", () => openLightboxById(frame.dataset.imageId));
    elements.heroStack.appendChild(frame);
  });

  let frontIndex = 0;
  let poolOffset = images.length;
  applyStack(frontIndex);

  if (images.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      frontIndex = (frontIndex + 1) % images.length;
      if (frontIndex === 0 && pool.length > images.length) {
        images = images.map((currentImage, index) => pool[(poolOffset + index) % pool.length]);
        poolOffset = (poolOffset + images.length) % pool.length;

        [...elements.heroStack.querySelectorAll(".hero-shot")].forEach((frame, index) => {
          syncFrameContent(frame, images[index]);
        });
      }
      applyStack(frontIndex);
    }, 3200);
  }
}

export function buildStoryStrip(elements, gallery, openLightboxById) {
  const featured = gallery.albums.slice(0, 6).map((album, index) => {
    const image = album.images[Math.min(index % 3, album.images.length - 1)];
    return { ...image, chapterLabel: resolveChapterLabel(album, index) };
  });

  renderStoryCards(elements.storyStrip, featured.slice(0, 3), openLightboxById, 0);
  renderStoryCards(elements.storyStripSecondary, featured.slice(3, 6), openLightboxById, 3);
}

export function buildAlbums(elements, gallery, openLightboxById) {
  const featuredAlbums = gallery.albums.slice(0, 6);
  renderAlbumCards(elements.albumsGrid, featuredAlbums.slice(0, 2), 0, elements, openLightboxById);
  renderAlbumCards(elements.albumsGridSecondary, featuredAlbums.slice(2, 4), 2, elements, openLightboxById);
  renderAlbumCards(elements.albumsGridTertiary, featuredAlbums.slice(4, 6), 4, elements, openLightboxById);
}

export function buildMemoryWall(elements, state, openLightbox) {
  const visibleEntries = selectMemoryWallEntries(state.allImages, 40);
  const firstPage = visibleEntries.slice(0, 20);
  const secondPage = visibleEntries.slice(20, 40);

  renderMemoryCards(
    elements.memoryGrid,
    firstPage.map((entry) => entry.image),
    0,
    (localIndex) => openLightbox(firstPage[localIndex].index),
  );

  renderMemoryCards(
    elements.memoryGridSecondary,
    secondPage.map((entry) => entry.image),
    0,
    (localIndex) => openLightbox(secondPage[localIndex].index),
  );
}

export function buildTableOfContents(elements, gallery) {
  elements.tocPreview.innerHTML = "";

  gallery.albums.slice(0, 14).forEach((album, index) => {
    const item = document.createElement("div");
    item.className = "toc-item";
    item.innerHTML = `
      <p class="toc-item-index">${dayLabel(index)}</p>
      <strong>${resolveChapterLabel(album, index)}</strong>
      <span>${album.count} Fotos</span>
    `;
    elements.tocPreview.appendChild(item);
  });
}

export function buildArchiveStats(elements, gallery) {
  const stats = [
    {
      label: "Albumes",
      value: String(gallery.albums.length).padStart(2, "0"),
      copy: "capitulos enlazados en este volumen",
    },
    {
      label: "Recuerdos",
      value: String(gallery.totalImages).padStart(3, "0"),
      copy: "imagenes guardadas para volver a ellas",
    },
  ];

  elements.archiveStats.innerHTML = "";

  stats.forEach((stat) => {
    const node = document.createElement("article");
    node.className = "archive-stat";
    node.innerHTML = `
      <p>${stat.label}</p>
      <strong>${stat.value}</strong>
      <span>${stat.copy}</span>
    `;
    elements.archiveStats.appendChild(node);
  });
}

export function buildGalleryBrowser(elements, gallery, openLightboxById) {
  if (!elements.galleryBrowserContent) {
    return;
  }

  elements.galleryBrowserContent.innerHTML = "";

  gallery.albums.forEach((album, index) => {
    const section = document.createElement("section");
    section.className = "gallery-browser-section";

    const chapterLabel = resolveChapterLabel(album, index);
    section.innerHTML = `
      <div class="gallery-browser-section-head">
        <p>${dayLabel(index)}</p>
        <div>
          <strong>${chapterLabel}</strong>
          <span>${album.count} imagenes de este dia</span>
        </div>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "gallery-browser-grid";

    album.images.forEach((image) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-browser-card";
      button.innerHTML = `
        <img src="${image.src}" alt="${chapterLabel}, foto ${String(image.photoNumber).padStart(2, "0")}" loading="lazy" />
        <span>Foto ${String(image.photoNumber).padStart(2, "0")}</span>
      `;
      button.addEventListener("click", () => openLightboxById(image.id));
      grid.appendChild(button);
    });

    section.appendChild(grid);
    elements.galleryBrowserContent.appendChild(section);
  });
}
