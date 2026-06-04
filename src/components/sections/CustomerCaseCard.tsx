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
    <article className="flex shrink-0 flex-col rounded-lg bg-white px-4 py-3 shadow-[0_4px_24px_rgba(23,28,33,0.04)] md:px-8 md:py-6 lg:rounded-2xl">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-medium leading-[22px] text-[var(--text-base)] md:text-xl md:leading-7">
          {location}
        </h3>
        <span
          className="inline-flex h-[18px] items-center rounded-md border px-1.5 text-xs leading-[18px] md:h-7 md:text-sm md:leading-[22px]"
          style={{
            color: tag.color,
            borderColor: tag.border,
          }}
        >
          {versionLabel}
        </span>
      </div>
      <p className="mt-0.5 break-words text-xs leading-5 text-[var(--text-secondary)] md:mt-3 md:text-base md:leading-6">
        {quote}
      </p>
    </article>
  );
}
