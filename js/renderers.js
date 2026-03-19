import { chapterName, heroShotTransform, plateTitle, sampleAcrossAlbums, storyWhisper, tulipTone } from "./utils.js";

export function hydrateGalleryIndex(state, gallery) {
  state.allImages = gallery.albums.flatMap((album, albumIndex) =>
    album.images.map((image) => ({
      ...image,
      albumLabel: album.label,
      chapterLabel: chapterName(albumIndex, album.label),
      title: plateTitle(chapterName(albumIndex, album.label), image.photoNumber),
      alt: `${chapterName(albumIndex, album.label)}, lamina ${String(image.photoNumber).padStart(2, "0")}`,
    })),
  );
}

export function buildHeroStack(elements, gallery, openLightboxById) {
  const images = sampleAcrossAlbums(gallery.albums, 5);
  elements.heroStack.innerHTML = "";

  images.forEach((image, index) => {
    const frame = document.createElement("button");
    const img = document.createElement("img");

    frame.type = "button";
    frame.className = "hero-shot";
    frame.style.transform = heroShotTransform(index);
    frame.style.zIndex = String(index + 1);
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    frame.appendChild(img);
    frame.addEventListener("click", () => openLightboxById(image.id));
    elements.heroStack.appendChild(frame);
  });
}

export function buildStoryStrip(elements, gallery, openLightboxById) {
  const featured = gallery.albums.map((album, index) => {
    const image = album.images[Math.min(index % 3, album.images.length - 1)];
    return { ...image, chapterLabel: chapterName(index, album.label) };
  });

  elements.storyStrip.innerHTML = "";

  featured.forEach((image, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "story-card";
    card.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <div class="story-card-copy">
        <span class="story-card-meta">Parada ${String(index + 1).padStart(2, "0")}</span>
        <strong>${image.chapterLabel}</strong>
        <p>${storyWhisper(index)}</p>
      </div>
    `;
    card.addEventListener("click", () => openLightboxById(image.id));
    elements.storyStrip.appendChild(card);
  });
}

export function buildAlbums(elements, gallery, openLightboxById) {
  elements.albumsGrid.innerHTML = "";

  gallery.albums.forEach((album, index) => {
    const node = elements.albumTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".album-card-button");

    node.querySelector(".album-card-cover").src = album.cover;
    node.querySelector(".album-card-cover").alt = `Portada de ${album.label}`;
    node.querySelector(".album-card-index").textContent = `Capitulo ${String(index + 1).padStart(2, "0")}`;
    node.querySelector(".album-card-kicker").textContent = tulipTone(index);
    node.querySelector("h3").textContent = chapterName(index, album.label);
    node.querySelector(".album-card-count").textContent = `${album.count} fotos`;
    button.addEventListener("click", () => openLightboxById(album.images[0].id));
    elements.albumsGrid.appendChild(node);
  });
}

export function buildMemoryWall(elements, state, openLightbox) {
  elements.memoryGrid.innerHTML = "";

  state.allImages.forEach((image, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memory-card";
    button.dataset.shape = "standard";
    button.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <span>${image.chapterLabel}</span>
    `;
    button.addEventListener("click", () => openLightbox(index));
    elements.memoryGrid.appendChild(button);
  });
}

export function buildTableOfContents(elements, gallery) {
  elements.tocPreview.innerHTML = "";

  gallery.albums.slice(0, 6).forEach((album, index) => {
    const item = document.createElement("div");
    item.className = "toc-item";
    item.innerHTML = `
      <p class="toc-item-index">${String(index + 1).padStart(2, "0")}</p>
      <strong>${chapterName(index, album.label)}</strong>
      <span>${album.count} laminas</span>
    `;
    elements.tocPreview.appendChild(item);
  });
}

export function buildArchiveStats(elements, gallery) {
  const stats = [
    {
      label: "Albumes",
      value: String(gallery.albums.length).padStart(2, "0"),
      copy: "capitulos reunidos en este volumen",
    },
    {
      label: "Recuerdos",
      value: String(gallery.totalImages).padStart(3, "0"),
      copy: "imagenes listas para volver a hojear",
    },
    {
      label: "Edicion",
      value: new Date(gallery.generatedAt).getFullYear().toString(),
      copy: "ultima compilacion del archivo",
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
