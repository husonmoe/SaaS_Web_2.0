import { PageContainer } from "@/components/layout/PageContainer";
import { FAQ_ITEMS, type FaqItem } from "@/components/sections/faqContent";
import { FadeInOnScroll } from "@/components/ui/FadeInOnScroll";
import Image from "next/image";

function FaqCard({ item }: { item: FaqItem }) {
  return (
    <article className="h-full rounded-xl bg-[var(--bg-shell)] px-4 py-4 md:rounded-2xl md:px-6 md:py-7">
      <div className="flex gap-3 md:gap-4">
        <span className="flex h-6 shrink-0 flex-col items-center justify-center py-[2px] md:block md:h-fit">
          <Image
            src={item.iconSrc}
            alt=""
            width={24}
            height={24}
            className="size-5 md:size-6"
            aria-hidden
            unoptimized
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-medium leading-6 text-[var(--text-base)] md:text-lg md:font-semibold md:leading-7">
            {item.title}
          </h3>
          <p className="mt-0.5 text-sm leading-[22px] text-[var(--text-secondary)] md:text-base md:leading-6">
            {item.answer}
          </p>
        </div>
      </div>
    </article>
  );
}

export function FaqSection() {
  return (
    <section className="bg-white py-[60px] md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-8 md:gap-16">
        <FadeInOnScroll
          as="h2"
          className="max-w-[1200px] text-center text-[28px] font-medium leading-9 text-[var(--text-base)] md:text-[44px] md:font-semibold md:leading-[56px]"
        >
          常见问题
        </FadeInOnScroll>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {FAQ_ITEMS.map((item) => (
            <FadeInOnScroll key={item.id} as="div" className="h-full">
              <FaqCard item={item} />
            </FadeInOnScroll>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
