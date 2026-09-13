/**
 * Реестр фотографий Da Vinchi Hair.
 *
 * Пути — ключи из src/lib/images/blur-data.json.
 * Все изображения вставляются через компонент <Media path="..." />.
 *
 * ka заполнить при вычитке носителем (этап 9), сейчас фолбэк на ru.
 */

import type { ImagePath } from "@/lib/images";

export type ImageUsage =
  | 'hero'
  | 'technology'
  | 'product'
  | 'catalog'
  | 'guide'
  | 'brand'
  | 'gallery-only';

export interface ImageEntry {
  path: ImagePath;
  usage: ImageUsage[];
  alt: { ru: string; en: string; ka: string };
  note?: string;
}

export const IMAGES = {
  tapeClassicRolls: {
    path: '/images/technology/tape-classic-rolls.webp',
    usage: ['hero', 'technology', 'catalog'],
    alt: {
      ru: 'Ленты Tape-In с тёмно-русыми волосами, свёрнутые в рулон',
      en: 'Rolled Tape-In wefts in dark blonde hair',
      ka: 'Ленты Tape-In с тёмно-русыми волосами, свёрнутые в рулон', // TODO_I18N
    },
    note: 'Временный hero: самый графичный кадр на белом. Заменить на фото с моделью, когда снимем.',
  },

  tapeAttachmentCloseup: {
    path: '/images/technology/tape-attachment-closeup.webp',
    usage: ['technology'],
    alt: {
      ru: 'Крупный план крепления ленты Tape-In на светлых волосах',
      en: 'Close-up of a Tape-In attachment on light blonde hair',
      ka: 'Крупный план крепления ленты Tape-In на светлых волосах', // TODO_I18N
    },
    note: 'Единственный кадр на тёмном фоне. Использовать точечно, как крупное изображение на /technology/imitation, иначе выбивается из белой сетки.',
  },

  tapeAshBlonde: {
    path: '/images/products/tape-ash-blonde.webp',
    usage: ['product', 'catalog', 'hero'],
    alt: {
      ru: 'Ленты Tape-In пепельно-русого оттенка',
      en: 'Ash blonde Tape-In hair extensions',
      ka: 'Ленты Tape-In пепельно-русого оттенка', // TODO_I18N
    },
  },

  tapeGoldenBlonde: {
    path: '/images/products/tape-golden-blonde.webp',
    usage: ['product', 'catalog'],
    alt: {
      ru: 'Пряди Tape-In золотистого блонда с защитной плёнкой на лентах',
      en: 'Golden blonde Tape-In strands with protective film on the tapes',
      ka: 'Пряди Tape-In золотистого блонда с защитной плёнкой на лентах', // TODO_I18N
    },
  },

  invisibleTapeBlonde: {
    path: '/images/products/invisible-tape-blonde.webp',
    usage: ['product', 'catalog'],
    alt: {
      ru: 'Волосы Tape-In на прозрачной невидимой ленте',
      en: 'Tape-In hair on a clear invisible tape',
      ka: 'Волосы Tape-In на прозрачной невидимой ленте', // TODO_I18N
    },
  },

  careKit: {
    path: '/images/products/care-kit.webp',
    usage: ['product', 'catalog', 'guide'],
    alt: {
      ru: 'Набор для ухода и перестановки лент Da Vinchi: ремувер, лента, прядь',
      en: 'Da Vinchi care and re-taping kit: remover, tape, hair strand',
      ka: 'Набор для ухода и перестановки лент Da Vinchi', // TODO_I18N
    },
    note: 'Контакты прежнего магазина на упаковке заретушированы. Долгосрочно — пересъёмка с актуальной упаковкой.',
  },

  extensionTypes: {
    path: '/images/guides/extension-types.webp',
    usage: ['technology', 'guide'],
    alt: {
      ru: 'Сравнение способов наращивания: капсулы, ленты, тресс, клипсы',
      en: 'Comparison of extension methods: keratin bonds, tapes, weft, clip-ins',
      ka: 'Сравнение способов наращивания: капсулы, ленты, тресс, клипсы', // TODO_I18N
    },
  },

  tapeInHand: {
    path: '/images/guides/tape-in-hand.webp',
    usage: ['guide'],
    alt: {
      ru: 'Прядь Tape-In в руке мастера',
      en: 'A Tape-In strand held in a stylist’s hand',
      ka: 'Прядь Tape-In в руке мастера', // TODO_I18N
    },
  },

  colorSwatchCard: {
    path: '/images/brand/color-swatch-card.webp',
    usage: ['brand', 'guide'],
    alt: {
      ru: 'Образец пряди на фирменной карточке Da Vinchi Hair',
      en: 'Hair sample on a Da Vinchi Hair branded swatch card',
      ka: 'Образец пряди на фирменной карточке Da Vinchi Hair', // TODO_I18N
    },
    note: 'Эталон для съёмки всей палитры: один кадр на оттенок, тот же свет и ракурс.',
  },

  longHairBrunette: {
    path: '/images/gallery/long-hair-brunette.webp',
    usage: ['gallery-only'],
    alt: {
      ru: 'Длинные тёмно-каштановые волосы Tape-In',
      en: 'Long dark brown Tape-In hair',
      ka: 'Длинные тёмно-каштановые волосы Tape-In', // TODO_I18N
    },
    note: 'Зелёный фон — конфликтует с монохромом. Только /gallery.',
  },

  weftClipsBrunette: {
    path: '/images/gallery/weft-clips-brunette.webp',
    usage: ['gallery-only'],
    alt: {
      ru: 'Тресс из тёмных волос на клипсах',
      en: 'Dark hair weft with clips',
      ka: 'Тресс из тёмных волос на клипсах', // TODO_I18N
    },
    note: 'Зелёный фон — конфликтует с монохромом. Только /gallery.',
  },
} as const satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGES;
