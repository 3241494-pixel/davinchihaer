import { founderSchema } from "./schemas";
import type { ContentSource } from "./source/content-source";
import { fileContentSource } from "./source/file-source";
import type { Founder } from "./types";

export function parseFounder(raw: unknown): Founder {
  const result = founderSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `content/founder.json: невалидная история основателя: ${result.error.message}`,
    );
  }
  const { name, role, intro, timeline, quote } = result.data;
  for (let i = 1; i < timeline.length; i++) {
    if (timeline[i].year < timeline[i - 1].year) {
      throw new Error(
        `content/founder.json: года в timeline идут не по порядку (${timeline[i - 1].year} → ${timeline[i].year})`,
      );
    }
  }
  return { name, role, intro, timeline, quote };
}

export function createFounderApi(source: ContentSource) {
  let cache: Founder | null = null;
  return function getFounder(): Founder {
    cache ??= parseFounder(source.getFounderRaw());
    return cache;
  };
}

export const getFounder = createFounderApi(fileContentSource);
