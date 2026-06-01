import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeroBgLayer } from "@/components/layout/PageHeroBgLayer";
import { USER_MANUAL_HERO } from "@/components/sections/user-manual/userManualContent";

/** 标题区；分类条在 PageContent 中与 Hero 同级，以便 sticky 包含块覆盖正文 */
export function UserManualHeroSection() {
  return (
    <section className="page-hero-section user-manual-hero-with-category-gap relative overflow-visible pt-[100px] pb-0">
      <PageHeroBgLayer />

      <PageContainer className="relative z-10 flex flex-col items-center pb-6">
        <header className="flex max-w-[1200px] flex-col items-center gap-4 text-center">
          <h1 className="text-[36px] font-semibold leading-tight text-[var(--text-base)] md:text-[52px] md:leading-[68px]">
            {USER_MANUAL_HERO.title}
          </h1>
          <p className="max-w-[888px] text-lg text-[var(--text-secondary)] md:text-2xl md:leading-8">
            {USER_MANUAL_HERO.subtitle}
          </p>
        </header>
      </PageContainer>
    </section>
  );
}
