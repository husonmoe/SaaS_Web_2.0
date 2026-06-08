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
    <article className="flex h-[94px] w-full shrink-0 flex-col rounded-lg bg-white px-4 py-3 shadow-[0_4px_24px_rgba(23,28,33,0.04)] md:h-fit md:rounded-xl md:px-6 md:py-4 lg:h-auto lg:rounded-2xl">
      <div className="flex min-w-0 flex-nowrap items-center gap-3 md:w-fit lg:flex-wrap">
        <h3 className="min-w-0 flex-1 truncate text-base font-medium leading-6 text-[var(--text-base)] md:w-fit md:flex-none md:text-lg md:leading-[26px] lg:truncate-none">
          {location}
        </h3>
        <span
          className="inline-flex h-[18px] shrink-0 items-center rounded-md border px-1.5 text-xs leading-[18px] md:h-7 md:text-sm md:leading-[22px]"
          style={{
            color: tag.color,
            borderColor: tag.border,
          }}
        >
          {versionLabel}
        </span>
      </div>
      <p className="mt-0.5 line-clamp-2 text-sm leading-[22px] text-[var(--text-secondary)] md:mt-2 lg:mt-3 lg:text-base lg:leading-6 lg:line-clamp-none lg:break-words">
        {quote}
      </p>
    </article>
  );
}
