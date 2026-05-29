import {
  VERSION_TAG_STYLES,
  type CustomerCaseItem,
} from "@/components/sections/customerCasesContent";

export function CustomerCaseCard({
  location,
  version,
  versionLabel,
  quote,
}: CustomerCaseItem) {
  const tag = VERSION_TAG_STYLES[version];

  return (
    <article className="shrink-0 rounded-2xl bg-white px-6 py-5 shadow-[0_4px_24px_rgba(23,28,33,0.04)] md:px-8 md:py-6">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-medium leading-7 text-[var(--text-base)] md:text-xl">
          {location}
        </h3>
        <span
          className="inline-flex h-7 items-center rounded-full px-3 text-sm leading-[22px]"
          style={{ color: tag.color, backgroundColor: tag.bg }}
        >
          {versionLabel}
        </span>
      </div>
      <p className="mt-3 text-base leading-6 text-[var(--text-secondary)]">
        {quote}
      </p>
    </article>
  );
}
