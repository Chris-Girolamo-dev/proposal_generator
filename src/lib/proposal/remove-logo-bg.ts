// Auto-strip a solid background from an uploaded client logo so it reads clean on
// the proposal's paper or dark ground (no baked-in white/colored rectangle).
//
// Approach: corner-seeded flood fill. We sample the four corners; if they're a
// consistent opaque color, we treat that as the background and flood-fill it
// inward from every edge, turning matched pixels transparent. Because the fill
// only spreads through pixels *connected to the edge*, a background-colored
// region enclosed by the logo (e.g. the counter of an "O") is preserved — a
// plain color-key would wrongly punch those out. Logos that are already
// transparent, or that have busy/photographic corners, are returned untouched.

const CORNER_INSET = 2; // sample a few px in, past any 1px border artifact
const TOLERANCE = 40; // how close to the bg color counts as background (0-255 dist)
const CORNER_SPREAD_MAX = 28; // corners must agree within this, else: not a solid bg

function colorDistSq(data: Uint8ClampedArray, i: number, r: number, g: number, b: number) {
  const dr = data[i] - r;
  const dg = data[i + 1] - g;
  const db = data[i + 2] - b;
  return dr * dr + dg * dg + db * db;
}

/**
 * Returns a PNG File with the detected solid background removed, or the original
 * file unchanged if no solid background is detected or processing isn't possible.
 */
export async function removeLogoBackground(file: File): Promise<File> {
  if (typeof document === "undefined") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    if (!width || !height) return file;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0);

    const img = ctx.getImageData(0, 0, width, height);
    const data = img.data;

    const cornerIdx = [
      (CORNER_INSET * width + CORNER_INSET) * 4,
      (CORNER_INSET * width + (width - 1 - CORNER_INSET)) * 4,
      ((height - 1 - CORNER_INSET) * width + CORNER_INSET) * 4,
      ((height - 1 - CORNER_INSET) * width + (width - 1 - CORNER_INSET)) * 4,
    ];

    // Already has transparency at a corner → assume it's already a clean cutout.
    if (cornerIdx.some((i) => data[i + 3] < 200)) return file;

    let r = 0;
    let g = 0;
    let b = 0;
    for (const i of cornerIdx) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    r = Math.round(r / 4);
    g = Math.round(g / 4);
    b = Math.round(b / 4);

    // Corners must agree, else the image has no uniform background (photo, gradient) — leave it.
    const spread = Math.max(...cornerIdx.map((i) => Math.sqrt(colorDistSq(data, i, r, g, b))));
    if (spread > CORNER_SPREAD_MAX) return file;

    const tolSq = TOLERANCE * TOLERANCE;
    const isBg = (p: number) => data[p * 4 + 3] > 0 && colorDistSq(data, p * 4, r, g, b) <= tolSq;

    const visited = new Uint8Array(width * height);
    const stack: number[] = [];
    const seed = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return;
      const p = y * width + x;
      if (visited[p]) return;
      visited[p] = 1;
      if (isBg(p)) stack.push(p);
    };

    for (let x = 0; x < width; x++) {
      seed(x, 0);
      seed(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      seed(0, y);
      seed(width - 1, y);
    }

    let removed = 0;
    while (stack.length) {
      const p = stack.pop() as number;
      data[p * 4 + 3] = 0;
      removed++;
      const x = p % width;
      const y = (p - x) / width;
      seed(x + 1, y);
      seed(x - 1, y);
      seed(x, y + 1);
      seed(x, y - 1);
    }

    if (removed === 0) return file;

    // Feather: soften pixels that remain but sit near the removed background,
    // so edges don't look hard-cut.
    for (let p = 0; p < width * height; p++) {
      const a = p * 4 + 3;
      if (data[a] === 0) continue;
      const d = colorDistSq(data, p * 4, r, g, b);
      if (d <= tolSq * 4) {
        const ratio = Math.min(1, (Math.sqrt(d) - TOLERANCE) / TOLERANCE);
        data[a] = Math.round(data[a] * Math.max(0, ratio));
      }
    }

    ctx.putImageData(img, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((bl) => resolve(bl), "image/png"),
    );
    if (!blob) return file;

    const base = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${base}-transparent.png`, { type: "image/png" });
  } catch {
    return file; // any failure → upload the original untouched
  }
}
