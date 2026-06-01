import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeroBgLayer } from "@/components/layout/PageHeroBgLayer";
import type { OperationsGuideArticleDetail } from "@/components/sections/operations-guide/operationsGuideDetailContent";
import Image from "next/image";

type OperationsGuideDetailSectionProps = {
  article: OperationsGuideArticleDetail;
};

export function OperationsGuideDetailSection({
  article,
}: OperationsGuideDetailSectionProps) {
  return (
    <section className="operations-guide-detail-section relative isolate overflow-visible pt-[100px] pb-16 md:pb-[100px]">
      <PageHeroBgLayer />

      <PageContainer className="relative z-10">
        <div className="mx-auto flex w-full max-w-[792px] flex-col gap-16">
          <header className="flex flex-col gap-6">
            <h1 className="text-[28px] font-semibold leading-tight text-[var(--text-base)] md:text-[40px] md:leading-[52px]">
              {article.title}
            </h1>
            <div className="flex flex-col gap-3">
              <p className="text-lg leading-[26px] text-[var(--text-secondary)]">
                {article.summary}
              </p>
              <p className="text-sm leading-[22px] text-[var(--text-tertiary)]">
                {article.authorMeta}
              </p>
            </div>
          </header>

          <hr className="border-[var(--border-light)]" />

          <div className="flex flex-col gap-20">
            {article.sections.map((section) => (
              <section
                key={section.id}
                className="flex flex-col items-center gap-8"
              >
                <h2 className="w-full text-center text-2xl font-semibold leading-9 text-[var(--text-base)]">
                  {section.heading}
                </h2>

                <div className="flex w-full flex-col gap-3 text-lg leading-8 text-[var(--text-base)]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.imageSrc ? (
                  <div className="relative aspect-[640/360] w-full max-w-[640px] overflow-hidden border border-[var(--border-light)]">
                    <Image
                      src={section.imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 640px, 100vw"
                      unoptimized
                    />
                  </div>
                ) : null}
              </section>
            ))}

            <div className="flex flex-col gap-0 text-lg leading-8 text-[var(--text-base)]">
              {article.closingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
