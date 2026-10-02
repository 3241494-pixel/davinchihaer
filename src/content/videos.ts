/**
 * Реестр видео. Файлы — public/videos, без звука, faststart.
 * Вставка только через <Video name="..." /> (src/components/ui/Video.tsx).
 */

import type { ImageKey } from "@/content/images";
import type { AttachmentType, MaterialType } from "@/lib/content/types";

export interface VideoEntry {
  src: string;
  /** Ключ постера в реестре изображений: первый кадр, пока видео не загрузилось. */
  poster: ImageKey;
}

export const VIDEOS = {
  heroLoop1: { src: "/videos/hero-loop-1.mp4", poster: "posterHeroLoop1" },
  tapePeel: { src: "/videos/video-tape-peel.mp4", poster: "posterTapePeel" },
  tapeWidth: { src: "/videos/video-tape-width.mp4", poster: "posterTapeWidth" },
  bio1: { src: "/videos/bio-video-1.mp4", poster: "posterBio1" },
  bio2: { src: "/videos/bio-video-2.mp4", poster: "posterBio2" },
  ringstar1: { src: "/videos/ringstar-video-1.mp4", poster: "posterRingstar1" },
  installOnModel: { src: "/videos/guide-install-on-model.mp4", poster: "posterInstallOnModel" },
  darkPiece1: { src: "/videos/video-dark-piece-1.mp4", poster: "posterDarkPiece1" },
  darkPiece2: { src: "/videos/video-dark-piece-2-teal.mp4", poster: "posterDarkPiece2" },
} as const satisfies Record<string, VideoEntry>;

export type VideoKey = keyof typeof VIDEOS;

/**
 * Ролики к товару по способу крепления. Имитация роста ставится на ту же ленту,
 * поэтому показывает ролики с лентой. Бирюзовый фон — съёмка Ring Star, только для неё.
 */
export const ATTACHMENT_VIDEOS: Record<AttachmentType, VideoKey[]> = {
  "tape-classic": ["tapePeel", "tapeWidth", "installOnModel"],
  "imitation-1": ["installOnModel", "tapePeel", "darkPiece1"],
  "imitation-2": ["installOnModel", "darkPiece1", "tapeWidth"],
  "bio-tape": ["bio1", "bio2", "heroLoop1"],
  "ring-star": ["ringstar1", "darkPiece2", "heroLoop1"],
};

/** Ролики к материалам: для скотча есть съёмка, для праймера и ремувера пока нет. */
export const MATERIAL_VIDEOS: Record<MaterialType, VideoKey[]> = {
  tape: ["tapePeel", "tapeWidth"],
  primer: [],
  remover: [],
};
