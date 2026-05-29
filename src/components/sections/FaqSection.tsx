import { PageContainer } from "@/components/layout/PageContainer";
import { FAQ_ITEMS, type FaqItem } from "@/components/sections/faqContent";
import Image from "next/image";

function FaqCard({ item }: { item: FaqItem }) {
  return (
    <article className="rounded-2xl bg-[var(--bg-shell)] px-6 py-6 md:px-8 md:py-7">
      <div className="flex gap-4">
        <span className="h-fit shrink-0 py-[2px]">
          <Image
            src={item.iconSrc}
            alt=""
            width={24}
            height={24}
            className="size-6"
            aria-hidden
            unoptimized
          />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold leading-7 text-[var(--text-base)]">
            {item.title}
          </h3>
          <p className="mt-2 text-base leading-6 text-[var(--text-secondary)]">
            {item.answer}
          </p>
        </div>
      </div>
    </article>
  );
}

export function FaqSection() {
  return (
    <section className="bg-white py-16 md:py-[100px]">
      <PageContainer className="flex flex-col items-center gap-10 md:gap-16">
        <h2 className="max-w-[1200px] text-center text-3xl font-semibold leading-tight text-[var(--text-base)] md:text-[44px] md:leading-[56px]">
          常见问题
        </h2>

        <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {FAQ_ITEMS.map((item) => (
            <FaqCard key={item.id} item={item} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
