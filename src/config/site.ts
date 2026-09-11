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
  /** TODO_CLIENT: бот и супергруппа с темами ещё не созданы (бриф, раздел 11). */
  telegramBotUrl: string;
  instagramUrl: string;
  address: SiteAddress;
  /** TODO_CLIENT: резервный email для дублирования заявок не предоставлен. */
  email?: string;
  /** TODO_CLIENT: телефон не предоставлен. */
  phone?: string;
  /** TODO_CLIENT: номер WhatsApp для wa.me-ссылок не предоставлен. */
  whatsappNumber?: string;
}

export const siteConfig: SiteConfig = {
  name: "Da Vinchi Hair",
  url: "https://davinchihair.com",
  telegramBotUrl: "https://t.me/TODO_CLIENT_bot",
  instagramUrl: "https://instagram.com/da_vinchi.hair",
  address: {
    city: "Тбилиси",
    country: "Грузия",
  },
};
