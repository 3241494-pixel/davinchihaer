import { existsSync } from "fs";
import path from "path";

/** Только для серверных компонентов — проверяет наличие файла в /public. */
export function publicImageExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  return existsSync(path.join(process.cwd(), "public", src));
}
