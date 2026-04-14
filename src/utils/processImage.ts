import sharp from "sharp";

/**
 * Presets de redimensionamiento según el tipo de imagen.
 * Mantiene aspect ratio con `fit: 'cover'` para recortar al centro.
 */
const PRESETS = {
  logo: { width: 400, height: 400, quality: 80 },
  banner: { width: 1280, height: 720, quality: 80 },
  menu: { width: 800, height: 800, quality: 75 },
} as const;

type ImagePreset = keyof typeof PRESETS;

/**
 * Procesa una imagen con Sharp: resize + conversión a WebP.
 * Devuelve un Buffer optimizado listo para subir a Supabase Storage.
 */
export async function processImage(
  inputBuffer: Buffer,
  preset: ImagePreset
): Promise<Buffer> {
  const config = PRESETS[preset];

  return sharp(inputBuffer)
    .resize(config.width, config.height, {
      fit: "cover",
      position: "centre",
      withoutEnlargement: true,
    })
    .webp({ quality: config.quality })
    .toBuffer();
}

/**
 * Genera un nombre de archivo único para evitar colisiones en Storage.
 */
export function generateFileName(preset: ImagePreset): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${preset}_${timestamp}_${random}.webp`;
}

export { PRESETS, type ImagePreset };
