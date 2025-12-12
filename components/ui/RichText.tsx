import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

// Types for Sanity Portable Text
interface SanityImageValue {
  _type: "image";
  asset: {
    _ref: string;
    url?: string;
  };
  alt?: string;
  caption?: string;
}

interface SanityLinkValue {
  _type: "link";
  href: string;
  blank?: boolean;
}

// Custom components for Portable Text rendering
const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold text-brand-white mt-8 mb-4 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-bold text-brand-white mt-8 mb-4 first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-bold text-brand-white mt-6 mb-3 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl font-semibold text-brand-white mt-6 mb-3 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-semibold text-brand-white mt-4 mb-2 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-semibold text-brand-white mt-4 mb-2 first:mt-0">
        {children}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="text-brand-off-white mb-4 last:mb-0 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-green pl-4 my-6 text-neutral-light italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono bg-neutral-darker px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const linkValue = value as SanityLinkValue;
      const target = linkValue?.blank ? "_blank" : undefined;
      return (
        <Link
          href={linkValue?.href || "#"}
          target={target}
          rel={target ? "noopener noreferrer" : undefined}
          className="text-brand-green hover:text-brand-green-light underline transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-2 text-brand-off-white">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-2 text-brand-off-white">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    image: ({ value }: { value: SanityImageValue }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={value.asset.url || ""}
            alt={value.alt || ""}
            width={800}
            height={450}
            className="rounded-lg w-full"
          />
          {value.caption && (
            <figcaption className="text-center text-neutral-light text-sm mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }: { value: { code: string; language?: string } }) => (
      <pre className="bg-neutral-darker rounded-lg p-4 my-6 overflow-x-auto">
        <code className="font-mono text-sm text-brand-off-white">{value.code}</code>
      </pre>
    ),
  },
};

interface RichTextProps {
  value: Parameters<typeof PortableText>[0]["value"];
  className?: string;
}

export default function RichText({ value, className }: RichTextProps) {
  return (
    <div className={clsx("rich-text", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}

