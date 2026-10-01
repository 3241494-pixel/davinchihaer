import type {
  AttachmentType,
  HairColorGroup,
  HairOrigin,
  HairStructure,
  MaterialType,
} from "./types";

/**
 * Канонические значения и порядок вывода. Отдельно от schemas.ts, чтобы
 * клиентские компоненты (фильтры) не тянули zod в бандл.
 */
export const ATTACHMENTS = [
  "tape-classic",
  "imitation-1",
  "imitation-2",
  "bio-tape",
  "ring-star",
] as const satisfies readonly AttachmentType[];

export const ORIGINS = ["slavic", "india", "vietnam", "china"] as const satisfies readonly HairOrigin[];

export const STRUCTURES = [
  "porous",
  "straight",
  "wavy",
  "curly",
] as const satisfies readonly HairStructure[];

export const MATERIAL_TYPES = ["tape", "primer", "remover"] as const satisfies readonly MaterialType[];

export const COLOR_GROUPS = [
  "dark",
  "brown",
  "blonde",
  "ash",
  "ombre",
] as const satisfies readonly HairColorGroup[];
