import { reviewsSchema } from "./schemas";
import type { ContentSource } from "./source/content-source";
import { fileContentSource } from "./source/file-source";
import type { Review } from "./types";

export function parseReviews(raw: unknown): Review[] {
  const result = reviewsSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `content/reviews.json: невалидные отзывы: ${result.error.message}`,
    );
  }
  const ids = new Set<string>();
  for (const review of result.data.reviews) {
    if (ids.has(review.id)) {
      throw new Error(`content/reviews.json: повторяется id "${review.id}"`);
    }
    ids.add(review.id);
  }
  return result.data.reviews.map(({ id, text }) => ({ id, text }));
}

export function createReviewsApi(source: ContentSource) {
  let cache: Review[] | null = null;
  return function getReviews(): Review[] {
    cache ??= parseReviews(source.getReviewsRaw());
    return cache;
  };
}

export const getReviews = createReviewsApi(fileContentSource);
