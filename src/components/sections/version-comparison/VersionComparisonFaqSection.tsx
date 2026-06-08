import { PageContainer } from "@/components/layout/PageContainer";
import {
  VERSION_COMPARISON_FAQ_ICON,
  VERSION_COMPARISON_FAQ_ITEMS,
  type VersionComparisonFaqItem,
} from "@/components/sections/version-comparison/versionComparisonFaqContent";
// import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import Image from "next/image";

function FaqCard({ item }: { item: VersionComparisonFaqItem }) {
  return (
    <article className="rounded-xl bg-[var(--bg-shell)] px-4 py-4 md:rounded-2xl md:px-4 md:py-6 lg:rounded-2xl lg:px-8 lg:py-7">
      <div className="flex gap-3 lg:gap-4">
        <span className="flex h-6 shrink-0 flex-col items-center justify-center py-[2px] md:block md:h-fit lg:block lg:h-fit">
          <Image
            src={VERSION_COMPARISON_FAQ_ICON}
            alt=""
            width={24}
            height={24}
            className="size-5 md:size-6 lg:size-6"
            aria-hidden
            unoptimized
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium leading-6 text-[var(--text-base)] lg:text-lg lg:font-semibold lg:leading-7">
            {item.title}
          </h3>
          <p className="mt-0.5 text-sm leading-[22px] text-[var(--text-secondary)] lg:mt-2 lg:text-base lg:leading-6">
            {item.answer}
          </p>
        </div>
      </div>
    </article>
  );
}

export function VersionComparisonFaqSection() {
  return (
    <section className="bg-[var(--bg-white)] py-[60px] md:py-[80px] lg:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-8 md:gap-10 lg:gap-16">
        {/* FadeInOnScroll 暂关 */}
        <div className="flex w-full flex-col items-center gap-8 md:gap-10 lg:gap-16">
          <h2 className="max-w-[1200px] text-center text-[28px] font-semibold leading-[36px] text-[var(--text-base)] md:text-[36px] md:leading-[48px] lg:text-[44px] lg:leading-[56px]">
            常见问题
          </h2>

          <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {VERSION_COMPARISON_FAQ_ITEMS.map((item) => (
              <FaqCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
