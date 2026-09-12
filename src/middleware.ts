import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Пропускаем статику, картинки и служебные файлы Next.js.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
