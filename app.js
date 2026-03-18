const dataUrl = "./data/gallery-data.json";

const elements = {
  heroStack: document.querySelector("#hero-stack"),
  metricTotal: document.querySelector("#metric-total"),
  metricAlbums: document.querySelector("#metric-albums"),
  storyStrip: document.querySelector("#story-strip"),
  albumsGrid: document.querySelector("#albums-grid"),
  memoryGrid: document.querySelector("#memory-grid"),
  wallCaption: document.querySelector("#wall-caption"),
  jumpRandom: document.querySelector("#jump-random"),
  shuffleButton: document.querySelector("#shuffle-button"),
  lightbox: document.querySelector("#lightbox"),
  lightboxImage: document.querySelector("#lightbox-image"),
  lightboxMeta: document.querySelector("#lightbox-meta"),
  lightboxTitle: document.querySelector("#lightbox-title"),
  prevShot: document.querySelector("#prev-shot"),
  nextShot: document.querySelector("#next-shot"),
  albumTemplate: document.querySelector("#album-card-template"),
};

const state = {
  allImages: [],
  currentIndex: 0,
};

init();

async function init() {
  try {
    const response = await fetch(dataUrl);
    const gallery = await response.json();
    hydrateMetrics(gallery);
    buildHeroStack(gallery);
    buildStoryStrip(gallery);
    buildAlbums(gallery);
    buildMemoryWall(gallery);
    bindControls();
  } catch (error) {
    elements.wallCaption.textContent =
      "No pude cargar el catalogo de fotos. Ejecuta scripts/build-gallery-data.ps1 para regenerarlo.";
    console.error(error);
  }
}

function hydrateMetrics(gallery) {
  elements.metricTotal.textContent = gallery.totalImages;
  elements.metricAlbums.textContent = gallery.albums.length;
  elements.wallCaption.textContent = `${gallery.totalImages} recuerdos listos para abrir en grande.`;
}

function buildHeroStack(gallery) {
  renderHeroShots(sampleAcrossAlbums(gallery.albums, 6));
}

function renderHeroShots(images) {
  elements.heroStack.innerHTML = "";

  images.forEach((image, index) => {
    const frame = document.createElement("button");
    const img = document.createElement("img");
    frame.type = "button";
    frame.className = "hero-shot";
    frame.style.transform = `translate(-50%, -50%) rotate(${index % 2 === 0 ? -7 + index * 2 : 6 - index * 1.4}deg) translate(${(index - 2.5) * 12}px, ${(index % 3) * 10}px)`;
    frame.style.zIndex = String(index + 1);
    img.src = image.src;
    img.alt = image.alt;
    frame.appendChild(img);
    frame.addEventListener("click", () => openLightboxById(image.id));
    elements.heroStack.appendChild(frame);
  });
}

function buildStoryStrip(gallery) {
  const featured = gallery.albums.map((album, index) => {
    const image = album.images[Math.min(index % 3, album.images.length - 1)];
    return { ...image, albumLabel: album.label, chapterLabel: chapterName(index, album.label) };
  });

  elements.storyStrip.innerHTML = "";
  featured.forEach((image, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "story-card";
    card.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <span>Capitulo ${String(index + 1).padStart(2, "0")}</span>
      <strong>${image.chapterLabel}</strong>
    `;
    card.addEventListener("click", () => openLightboxById(image.id));
    elements.storyStrip.appendChild(card);
  });
}

function buildAlbums(gallery) {
  elements.albumsGrid.innerHTML = "";

  gallery.albums.forEach((album, index) => {
    const node = elements.albumTemplate.content.firstElementChild.cloneNode(true);
    const button = node.querySelector(".album-card-button");
    node.querySelector(".album-card-cover").src = album.cover;
    node.querySelector(".album-card-cover").alt = `Portada de ${album.label}`;
    node.querySelector(".album-card-index").textContent = `Album ${String(index + 1).padStart(2, "0")}`;
    node.querySelector(".album-card-kicker").textContent = tulipTone(index);
    node.querySelector("h3").textContent = chapterName(index, album.label);
    node.querySelector(".album-card-count").textContent = `${album.count} fotos`;
    button.addEventListener("click", () => openLightboxById(album.images[0].id));
    elements.albumsGrid.appendChild(node);
  });
}

function buildMemoryWall(gallery) {
  state.allImages = gallery.albums.flatMap((album, albumIndex) =>
    album.images.map((image) => ({
      ...image,
      albumLabel: album.label,
      chapterLabel: chapterName(albumIndex, album.label),
    })),
  );

  const shapePattern = ["feature", "standard", "standard", "wide", "standard", "tall"];
  elements.memoryGrid.innerHTML = "";

  state.allImages.forEach((image, index) => {
    const button = document.createElement("button");
    const shape = shapePattern[index % shapePattern.length];
    button.type = "button";
    button.className = "memory-card";
    button.dataset.shape = shape;
    button.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <span>${image.chapterLabel}</span>
    `;
    button.addEventListener("click", () => openLightbox(index));
    elements.memoryGrid.appendChild(button);
  });
}

function bindControls() {
  elements.jumpRandom.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * state.allImages.length);
    openLightbox(randomIndex);
  });

  elements.shuffleButton.addEventListener("click", () => {
    renderHeroShots(sampleAcrossAlbums(groupByAlbum(state.allImages), 6));
  });

  elements.prevShot.addEventListener("click", () => stepLightbox(-1));
  elements.nextShot.addEventListener("click", () => stepLightbox(1));

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

  window.addEventListener("keydown", (event) => {
    if (!elements.lightbox.open) {
      return;
    }

    if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });
}

function openLightbox(index) {
  state.currentIndex = normalizeIndex(index);
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
    openLightbox(index);
  }
}

function stepLightbox(direction) {
  openLightbox(state.currentIndex + direction);
}

function normalizeIndex(index) {
  return (index + state.allImages.length) % state.allImages.length;
}

function sampleAcrossAlbums(albums, amount) {
  const flattened = albums.flatMap((album, albumIndex) => {
    const image = album.images[(albumIndex * 2) % album.images.length];
    return { ...image, albumLabel: album.label };
  });

  return shuffle(flattened).slice(0, amount);
}

function groupByAlbum(images) {
  const map = new Map();
  images.forEach((image) => {
    if (!map.has(image.albumLabel)) {
      map.set(image.albumLabel, []);
    }
    map.get(image.albumLabel).push(image);
  });
  return [...map.entries()].map(([label, imgs]) => ({ label, images: imgs }));
}

function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

function chapterName(index, fallback) {
  const names = [
    "Tulipan de Medianoche",
    "Rojo Carmesi",
    "Petalos en Sombra",
    "Luz sobre Vino",
    "Negro Satin",
    "Calor de Invierno",
    "Velo Escarlata",
    "Jardin Nocturno",
  ];

  return names[index % names.length] || fallback;
}

function tulipTone(index) {
  const tones = [
    "Tulipan oscuro",
    "Rojo profundo",
    "Brillo carmesi",
    "Petalo nocturno",
  ];

  return tones[index % tones.length];
}
