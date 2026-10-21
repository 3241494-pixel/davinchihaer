/**
 * Пары фото «до/после» для слайдера сравнения. Оба кадра одной пары снимаются
 * с одного ракурса, при одном свете и в одном кадрировании (вертикально 8:15),
 * иначе разделитель показывает разницу в съёмке, а не в волосах.
 *
 * Фото добавляются в реестр src/content/images.ts (как остальные), здесь только ключи.
 * Первая пара показывается при загрузке.
 */

import type { ImageKey } from "@/content/images";
import type { I18nString } from "@/lib/content/types";

export interface BeforeAfterPair {
  id: string;
  before: ImageKey;
  after: ImageKey;
  /** Подпись под слайдером: техника · длина · оттенок. Без подписи строка не выводится. */
  caption?: I18nString;
}

// TODO_CLIENT: техника, длина и граммы по каждой работе — для подписей под слайдером.
export const BEFORE_AFTER_PAIRS: BeforeAfterPair[] = [
  { id: "pair-01", before: "baPair01Before", after: "baPair01After" },
  { id: "pair-02", before: "baPair02Before", after: "baPair02After" },
  { id: "pair-03", before: "baPair03Before", after: "baPair03After" },
  { id: "pair-04", before: "baPair04Before", after: "baPair04After" },
  { id: "pair-05", before: "baPair05Before", after: "baPair05After" },
  { id: "pair-06", before: "baPair06Before", after: "baPair06After" },
  { id: "pair-07", before: "baPair07Before", after: "baPair07After" },
  { id: "pair-08", before: "baPair08Before", after: "baPair08After" },
];
