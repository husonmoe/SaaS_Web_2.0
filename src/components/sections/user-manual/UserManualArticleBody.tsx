import type {
  UserManualArticle,
  UserManualContentBlock,
} from "@/components/sections/user-manual/userManualContent";
import Image from "next/image";

function ContentBlock({ block }: { block: UserManualContentBlock }) {
  if (block.type === "text") {
    return (
      <p className="text-lg leading-8 text-[var(--text-base)]">{block.text}</p>
    );
  }

  if (block.type === "link") {
    const label = block.href.replace(/^https?:\/\//, "");
    return (
      <a
        href={block.href}
        target={block.external ? "_blank" : undefined}
        rel={block.external ? "noopener noreferrer" : undefined}
        className="break-all text-lg leading-8 text-[var(--color-primary)] underline"
      >
        {label}
      </a>
    );
  }

  return (
    <div
      className="relative w-full max-w-[600px] overflow-hidden border border-[var(--border-light)]"
      style={{ aspectRatio: `${block.width} / ${block.height}` }}
    >
      <Image
        src={block.src}
        alt={block.alt ?? ""}
        fill
        className="object-cover"
        sizes="(min-width: 768px) 600px, 100vw"
        unoptimized
      />
    </div>
  );
}

type UserManualArticleBodyProps = {
  article: UserManualArticle;
};

export function UserManualArticleBody({ article }: UserManualArticleBodyProps) {
  return (
    <article className="flex min-w-0 flex-1 flex-col gap-16">
      <header className="flex flex-col gap-6">
        <h2 className="text-[28px] font-semibold leading-tight text-[var(--text-base)] md:text-[40px] md:leading-[52px]">
          {article.title}
        </h2>
        <div className="flex flex-col gap-3">
          <p className="text-base leading-6 text-[var(--text-base)]">
            {article.intro}
          </p>
          <p className="text-sm leading-[22px] text-[var(--text-tertiary)]">
            {article.terminals}
          </p>
        </div>
      </header>

      <hr className="border-[var(--border-light)]" />

      <div className="flex flex-col gap-20">
        {article.sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-8">
            <h3 className="text-2xl font-semibold leading-9 text-[var(--text-base)]">
              {section.heading}
            </h3>
            <div className="flex flex-col gap-8">
              {section.blocks.map((block, index) => (
                <ContentBlock key={`${section.id}-${index}`} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
