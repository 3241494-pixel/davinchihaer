import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/content/mdx-components";

/**
 * Файл-конвенция Next.js (@next/mdx резолвит на него импорт
 * "next-mdx-import-source-file"). Без него подстановка компонентов падает на
 * @mdx-js/react и его React Context, который не работает в Server Components.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
