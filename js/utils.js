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
    "translate(-50%, -50%) rotate(-10deg) translate(-44px, 24px)",
    "translate(-50%, -50%) rotate(-5deg) translate(-18px, -12px)",
    "translate(-50%, -50%) rotate(0deg) translate(0px, 0px)",
    "translate(-50%, -50%) rotate(6deg) translate(22px, 10px)",
    "translate(-50%, -50%) rotate(12deg) translate(48px, 26px)",
  ];

  return transforms[index] || transforms[2];
}

export function chapterName(index, fallback) {
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

export function tulipTone(index) {
  const tones = [
    "Tulipan oscuro",
    "Rojo profundo",
    "Brillo carmesi",
    "Petalo nocturno",
  ];

  return tones[index % tones.length];
}

export function plateTitle(chapterLabel, photoNumber) {
  return `${chapterLabel} · Lamina ${String(photoNumber).padStart(2, "0")}`;
}

export function storyWhisper(index) {
  const lines = [
    "Una escena breve para entrar en tono sin forzar la emocion.",
    "Una imagen que deja la siguiente preparada, como una respiracion.",
    "Una pausa luminosa para que el recuerdo tenga espacio.",
    "Una pequena estacion donde mirar un poco mas despacio.",
    "Una lamina para sostener el ritmo suave del recorrido.",
    "Un gesto quieto, guardado para volver cuando haga falta.",
  ];

  return lines[index % lines.length];
}

export function normalizeIndex(index, length) {
  return (index + length) % length;
}
