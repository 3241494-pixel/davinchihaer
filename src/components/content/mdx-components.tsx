import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";

function MdxLink({ href = "", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} className="text-ink underline underline-offset-4 hover:text-ink-muted">
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink underline underline-offset-4 hover:text-ink-muted"
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Типографика MDX через переопределение компонентов, а не CSS-плагином
 * (@tailwindcss/typography не входит в стек — не добавлял новую зависимость).
 */
export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="font-heading text-4xl text-ink-strong" {...props} />,
  h2: (props) => (
    <h2 className="mt-10 font-heading text-2xl text-ink-strong first:mt-0" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-8 font-heading text-xl text-ink-strong first:mt-0" {...props} />
  ),
  h4: (props) => <h4 className="mt-6 font-medium text-ink-strong first:mt-0" {...props} />,
  p: (props) => <p className="mt-4 text-base leading-relaxed text-ink first:mt-0" {...props} />,
  ul: (props) => <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-ink" {...props} />,
  ol: (props) => <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-ink" {...props} />,
  li: (props) => <li className="pl-1 leading-relaxed" {...props} />,
  a: MdxLink,
  strong: (props) => <strong className="font-semibold text-ink-strong" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-4 border-l-2 border-border pl-4 text-ink-muted italic"
      {...props}
    />
  ),
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  table: (props) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="border-b border-border" {...props} />,
  th: (props) => (
    <th className="px-3 py-2 font-medium text-ink-strong" {...props} />
  ),
  td: (props) => <td className="border-b border-border px-3 py-2 text-ink-muted" {...props} />,
  tr: (props) => <tr {...props} />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element -- размеры markdown-картинок неизвестны заранее
    <img className="mt-4 h-auto w-full rounded-base border border-border" {...props} alt={props.alt ?? ""} />
  ),
  code: (props) => (
    <code className="rounded-base bg-surface px-1.5 py-0.5 text-sm text-ink-strong" {...props} />
  ),
};
