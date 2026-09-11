import { getCategories } from "@/lib/content/products";
import { ru } from "@/i18n/messages";
import { HeaderClient } from "./HeaderClient";

export function Header() {
  const categories = getCategories().map((category) => ({
    value: category,
    label: ru.categories[category],
  }));

  return <HeaderClient categories={categories} />;
}
