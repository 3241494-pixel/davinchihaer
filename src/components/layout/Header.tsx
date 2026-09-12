import { getCategories } from "@/lib/content/products";
import { getTypedMessages } from "@/i18n/get-messages";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const ru = await getTypedMessages();
  const categories = getCategories().map((category) => ({
    value: category,
    label: ru.categories[category],
  }));

  return <HeaderClient categories={categories} />;
}
