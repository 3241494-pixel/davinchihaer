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
   * TODO_CLIENT: username не предоставлен.
   */
  telegramBotUrl: string;
  instagramUrl: string;
  address: SiteAddress;
  /** TODO_CLIENT: резервный email для дублирования заявок не предоставлен. */
  email?: string;
  /** TODO_CLIENT: телефон не предоставлен. */
  phone?: string;
  /** TODO_CLIENT: номер WhatsApp для wa.me-ссылок не предоставлен. */
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
  // Тестовый контакт по номеру телефона (Роман, 2026-10-02). TODO_CLIENT: заменить
  // на https://t.me/<username> — ссылка по номеру открывает чат, только если в
  // настройках приватности Telegram номер виден всем, и может не подставить текст.
  telegramBotUrl: "https://t.me/+491603241494",
  instagramUrl: "https://www.instagram.com/da_vinchi.hair/",
  address: {
    city: "Тбилиси",
    country: "Грузия",
  },
  // Тестовый номер (Роман, 2026-10-02), TODO_CLIENT: подтвердить рабочий номер.
  whatsappNumber: "+49 160 3241494",
  showDemoBadge: true,
};
