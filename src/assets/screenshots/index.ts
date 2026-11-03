/**
 * App screenshots, one folder per app language (fr/, en/, es/), same file name in each folder.
 * `screenshot(locale, name)` returns the shot in the page's language, or the French one when the
 * translation has not been supplied yet. See README.md in this folder for the expected names.
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('./*/*.{jpg,jpeg,png,webp}', { eager: true });
const extensions = ['jpg', 'jpeg', 'png', 'webp'];
const fallbackLocale = 'fr';

export function screenshot(locale: string, name: string): ImageMetadata {
  for (const folder of [locale, fallbackLocale]) {
    for (const ext of extensions) {
      const file = files[`./${folder}/${name}.${ext}`];
      if (file) return file.default;
    }
  }
  throw new Error(`Missing screenshot "${name}" (looked in ${locale}/ and ${fallbackLocale}/)`);
}
