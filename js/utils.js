export function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]];
  }
  return clone;
}

export function sampleAcrossAlbums(albums, amount) {
  const flattened = albums.flatMap((album, albumIndex) => {
    const image = album.images[(albumIndex * 2) % album.images.length];
    return { ...image, albumLabel: album.label };
  });

  return shuffle(flattened).slice(0, amount);
}

export function heroShotTransform(index) {
  const transforms = [
    "translate(-50%, -50%) rotate(-12deg) translate(-78px, 18px)",
    "translate(-50%, -50%) rotate(-6deg) translate(-38px, 8px)",
    "translate(-50%, -50%) rotate(0deg) translate(0px, 0px)",
    "translate(-50%, -50%) rotate(7deg) translate(38px, 8px)",
    "translate(-50%, -50%) rotate(13deg) translate(78px, 18px)",
  ];

  return transforms[index] || transforms[2];
}

export function isGenericAlbumLabel(label) {
  return /^capitulo\s*\d+$/i.test((label || "").trim());
}

export function chapterName(index, fallback) {
  const names = [
    "Patinaje en el hielo",
    "Experiencias en la aurora",
    "Relajación en la naturaleza",
    "Squid game :o",
    "San Valentin 💗",
    "Nieve, resonancia, y paz",
    "Bajo la Luna",
    "Fuegos artificiales en la playa",
    "Dia de relajacion",
    "One piece 👒",
    "My little Pony",
    "La pareja fugaz de hielo",
    "Velma y Sherlock",
    "David y goliath, de forma tierna"
  ];

  return names[index % names.length] || fallback;
}

export function resolveChapterLabel(album, index) {
  if (album?.label && !isGenericAlbumLabel(album.label)) {
    return album.label;
  }

  return chapterName(index, album?.label || `Capitulo ${String(index + 1).padStart(2, "0")}`);
}

export function dayLabel(index) {
  return `Dia ${String(index + 1).padStart(2, "0")}`;
}

export function tulipTone(index) {
  const tones = [
    "Tulipan rojo",
    "Profundo corazon",
    "Luna querida",
    "Sol radiante",
  ];

  return tones[index % tones.length];
}

export function plateTitle(chapterLabel, photoNumber) {
  return `${chapterLabel} · Lamina ${String(photoNumber).padStart(2, "0")}`;
}

export function storyWhisper(index) {
  const lines = [
    "Una escena breve para entrar en tono sin forzar la emocion.",
    "Una imagen que prepara la siguiente, como una respiracion suave.",
    "Una pausa luminosa para que el recuerdo encuentre su sitio.",
    "Una pequena estacion donde mirar con mas calma que prisa.",
    "Una lamina hecha para sostener el ritmo sereno del recorrido.",
    "Un gesto quieto, guardado para volver a el cuando haga falta.",
  ];

  return lines[index % lines.length];
}

export function normalizeIndex(index, length) {
  return (index + length) % length;
}
