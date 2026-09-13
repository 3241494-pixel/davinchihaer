import blurData from "./blur-data.json";

/**
 * Ключи blur-data.json как строковый литеральный union — опечатка в пути
 * не пройдёт tsc, а файл, который есть в реестре (src/content/images.ts),
 * но отсутствует в blur-data.json, будет пойман build-скриптом (см. п.5
 * задачи этапа 1A), а не всплывёт в рантайме на проде.
 */
export type ImagePath = keyof typeof blurData;

export interface ImageAsset {
  src: ImagePath;
  width: number;
  height: number;
  blurDataURL: string;
}

const IMAGE_PATHS = blurData as Record<ImagePath, { width: number; height: number; blurDataURL: string }>;

/**
 * Проверяет, что путь реально зарегистрирован в blur-data.json. Принимает
 * произвольную строку (а не ImagePath) специально — сегодня src/content/images.ts
 * типизирован так, что несовпадение ловится компилятором и эта проверка всегда
 * true, но остаётся настоящей рантайм-проверкой на день, когда путь придёт
 * из CMS и перестанет быть статическим литералом (см. CLAUDE.md про источник
 * данных). Используется в Media.tsx для фолбэка на заглушку.
 */
export function hasImage(path: string): path is ImagePath {
  return Object.prototype.hasOwnProperty.call(IMAGE_PATHS, path);
}

/** Данные для next/image по пути из public/images — размеры и blur-заглушка. */
export function getImage(path: ImagePath): ImageAsset {
  const entry = IMAGE_PATHS[path];
  return { src: path, width: entry.width, height: entry.height, blurDataURL: entry.blurDataURL };
}
