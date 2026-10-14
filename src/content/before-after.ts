/**
 * Пары фото «до/после» для слайдера сравнения. Оба кадра одной пары снимаются
 * с одного ракурса, при одном свете и в одном кадрировании (вертикально 4:5),
 * иначе разделитель показывает разницу в съёмке, а не в волосах.
 *
 * Фото добавляются в реестр src/content/images.ts (как остальные), здесь только ключи.
 * TODO_CLIENT: реальных пар пока нет — без них слайдер показывает заглушку.
 */

import type { ImageKey } from "@/content/images";

export interface BeforeAfterPair {
  id: string;
  before: ImageKey;
  after: ImageKey;
  /** Подпись под слайдером: техника · длина · оттенок. */
  caption: { ru: string; en: string; ka: string };
}

export const BEFORE_AFTER_PAIRS: BeforeAfterPair[] = [];
