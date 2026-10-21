export interface SiteAddress {
  city: string;
  country: string;
  /** Улица и дом — TODO_CLIENT, точный адрес не предоставлен. */
  street?: string;
}

export interface SiteConfig {
  name: string;
  /**
   * TODO_CLIENT: домен ещё не куплен (бриф, раздел 8). Рекомендация клиента —
   * davinchihair.com, используется как временное значение.
   */
  url: string;
  /**
   * Ссылка на аккаунт Telegram, куда уходят заявки: https://t.me/<username>.
   * Предзаполненный текст (?text=) работает для личного аккаунта, не для бота.
   */
  telegramBotUrl: string;
  instagramUrl: string;
  address: SiteAddress;
  /** TODO_CLIENT: резервный email для дублирования заявок не предоставлен. */
  email?: string;
  /** TODO_CLIENT: телефон не предоставлен. */
  phone?: string;
  /** Номер WhatsApp для wa.me-ссылок; в ссылку идут только цифры. */
  whatsappNumber?: string;
  /**
   * Метка «Демо» на карточках товаров с isPlaceholder. Выключить одной строкой,
   * когда каталог заполнится реальными данными.
   */
  showDemoBadge: boolean;
}

export const siteConfig: SiteConfig = {
  name: "Da Vinchi Hair",
  url: "https://davinchihair.com",
  // Рабочий контакт для заявок (Роман, 2026-10-20).
  telegramBotUrl: "https://t.me/svetlana_delyagina",
  instagramUrl: "https://www.instagram.com/da_vinchi.hair/",
  address: {
    city: "Тбилиси",
    country: "Грузия",
  },
  // Рабочий номер для заявок (Роман, 2026-10-20).
  whatsappNumber: "+380 63 807 8186",
  showDemoBadge: false,
};
