import type { CatalogSection } from "@/lib/content/types";
import { getTypedMessages } from "@/i18n/get-messages";
import { HeaderClient } from "./HeaderClient";

const CATALOG_SECTIONS: CatalogSection[] = ["hair", "materials"];

export async function Header() {
  const ru = await getTypedMessages();
  const categories = CATALOG_SECTIONS.map((section) => ({
    value: section,
    label: ru.catalogSections[section],
  }));

  return <HeaderClient categories={categories} />;
}
