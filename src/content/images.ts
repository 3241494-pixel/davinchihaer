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

  hero: {
    path: '/images/hero/hero.webp',
    usage: ['hero'],
    alt: {
      ru: 'Волосы Da Vinchi: светлый блонд, золотистый и тёмный оттенки, ленты в рулонах',
      en: 'Da Vinchi hair: light blonde, golden and dark shades with rolled tapes',
      ka: 'Da Vinchi-ს თმა: ღია ქერა, ოქროსფერი და მუქი ელფერები', // TODO_I18N
    },
    note: 'Основной hero главной (общая.PNG). Предметное фото; кадр с моделью всё ещё нужен.',
  },

  paletteWide1: {
    path: '/images/brand/palette-wide-1.webp',
    usage: ['brand', 'guide'],
    alt: {
      ru: 'Палитра оттенков Da Vinchi: пряди от тёмного до платинового блонда',
      en: 'Da Vinchi shade palette: strands from dark to platinum blonde',
      ka: 'Da Vinchi-ს ელფერების პალიტრა: მუქიდან პლატინისფერ ქერამდე', // TODO_I18N
    },
  },

  tapeRed: {
    path: '/images/materials/tape-red.webp',
    usage: ['product', 'catalog'],
    alt: {
      ru: 'Красный скотч Da Vinchi для ленточного наращивания',
      en: 'Da Vinchi red tape for tape-in extensions',
      ka: 'Da Vinchi-ს წითელი სკოჩი ლენტური დაგრძელებისთვის', // TODO_I18N
    },
    note: 'На упаковке хендлы @davinchi.hairshop / davinchi.hair — на сайте используем только da_vinchi.hair.',
  },

  tapeYellow: {
    path: '/images/materials/tape-yellow.webp',
    usage: ['product', 'catalog'],
    alt: {
      ru: 'Жёлтый скотч Da Vinchi для биолент',
      en: 'Da Vinchi yellow tape for bio-tapes',
      ka: 'Da Vinchi-ს ყვითელი სკოჩი ბიოლენტებისთვის', // TODO_I18N
    },
  },

  primer: {
    path: '/images/materials/primer.webp',
    usage: ['product', 'catalog'],
    alt: {
      ru: 'Праймер Da Vinchi 15 мл',
      en: 'Da Vinchi primer, 15 ml',
      ka: 'Da Vinchi-ს პრაიმერი, 15 მლ', // TODO_I18N
    },
  },

  remover: {
    path: '/images/materials/remover.webp',
    usage: ['product', 'catalog', 'guide'],
    alt: {
      ru: 'Ремувер Da Vinchi 100 мл',
      en: 'Da Vinchi remover, 100 ml',
      ka: 'Da Vinchi-ს რიმუვერი, 100 მლ', // TODO_I18N
    },
  },

  paletteWide2: {
    path: '/images/brand/palette-wide-2.webp',
    usage: ['brand', 'guide'],
    alt: {
      ru: 'Палитра оттенков Da Vinchi на стеллаже',
      en: 'Da Vinchi shade palette on a shelf',
      ka: 'Da Vinchi-ს ელფერების პალიტრა', // TODO_I18N
    },
  },

  techClassic1: {
    path: '/images/technology/classic-1.webp',
    usage: ['technology', 'product'],
    alt: {
      ru: 'Классические ленты Tape-In, светлый оттенок',
      en: 'Classic Tape-In wefts, light shade',
      ka: 'კლასიკური Tape-In ლენტები, ღია ელფერი', // TODO_I18N
    },
  },

  techImitation1: {
    path: '/images/technology/imitation-1-1.webp',
    usage: ['technology', 'product'],
    alt: {
      ru: 'Лента с имитацией роста 1.0',
      en: 'Root imitation 1.0 tape',
      ka: 'ზრდის იმიტაციის ლენტი 1.0', // TODO_I18N
    },
  },

  techImitation2: {
    path: '/images/technology/imitation-2-1.webp',
    usage: ['technology', 'product'],
    alt: {
      ru: 'Прядь с имитацией роста 2.0 на фирменной карточке',
      en: 'Root imitation 2.0 strand on a branded card',
      ka: 'ზრდის იმიტაცია 2.0 ფირმულ ბარათზე', // TODO_I18N
    },
  },

  techBio1: {
    path: '/images/technology/bio-1.webp',
    usage: ['technology', 'product'],
    alt: {
      ru: 'Биоленты в рулонах, тёмно-русый оттенок',
      en: 'Rolled bio-tapes, dark blonde shade',
      ka: 'ბიოლენტები რულონებში', // TODO_I18N
    },
  },

  techBio2: {
    path: '/images/technology/bio-2.webp',
    usage: ['technology', 'product'],
    alt: {
      ru: 'Биолента на светлых волосах крупным планом',
      en: 'Close-up of a bio-tape on light hair',
      ka: 'ბიოლენტი ღია თმაზე ახლო ხედით', // TODO_I18N
    },
  },

  techRingstar4: {
    path: '/images/technology/ringstar-4.webp',
    usage: ['technology', 'product'],
    alt: {
      ru: 'Волосы Ring Star, светлый блонд',
      en: 'Ring Star hair, light blonde',
      ka: 'Ring Star თმა, ღია ქერა', // TODO_I18N
    },
    note: 'Тёмно-бирюзовый фон: только страница Ring Star и её карточки, не на главной.',
  },

  posterHeroLoop1: {
    path: '/images/video/hero-loop-1-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Волосы Da Vinchi трёх оттенков',
      en: 'Da Vinchi hair in three shades',
      ka: 'Da Vinchi-ს თმა სამ ელფერში', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterTapePeel: {
    path: '/images/video/video-tape-peel-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Снятие защитной плёнки с ленты',
      en: 'Peeling the protective film off a tape',
      ka: 'ლენტიდან დამცავი აპკის მოხსნა', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterTapeWidth: {
    path: '/images/video/video-tape-width-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Ширина ленты, замер сантиметром',
      en: 'Measuring the tape width',
      ka: 'ლენტის სიგანის გაზომვა', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterBio1: {
    path: '/images/video/bio-video-1-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Биоленты на волнистых волосах',
      en: 'Bio-tapes on wavy hair',
      ka: 'ბიოლენტები ტალღოვან თმაზე', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterBio2: {
    path: '/images/video/bio-video-2-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Биоленты, платиновый блонд',
      en: 'Bio-tapes, platinum blonde',
      ka: 'ბიოლენტები, პლატინისფერი ქერა', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterRingstar1: {
    path: '/images/video/ringstar-video-1-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Волосы Ring Star',
      en: 'Ring Star hair',
      ka: 'Ring Star თმა', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterInstallOnModel: {
    path: '/images/video/guide-install-on-model-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Установка лент на модели',
      en: 'Installing tapes on a model',
      ka: 'ლენტების დაყენება მოდელზე', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterDarkPiece1: {
    path: '/images/video/video-dark-piece-1-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Тёмные волосы крупным планом',
      en: 'Dark hair close-up',
      ka: 'მუქი თმა ახლო ხედით', // TODO_I18N
    },
    note: 'Постер видео.',
  },

  posterDarkPiece2: {
    path: '/images/video/video-dark-piece-2-teal-poster.webp',
    usage: ['technology'],
    alt: {
      ru: 'Тёмные волосы на бирюзовом фоне',
      en: 'Dark hair on a teal background',
      ka: 'მუქი თმა ფირუზისფერ ფონზე', // TODO_I18N
    },
    note: 'Постер видео.',
  },
} as const satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof IMAGES;
