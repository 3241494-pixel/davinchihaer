export type ClassValue = string | false | null | undefined;

/** Простое объединение classNames без сторонних зависимостей. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
