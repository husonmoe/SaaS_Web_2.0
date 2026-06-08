import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeroBgLayer } from "@/components/layout/PageHeroBgLayer";
import { USER_MANUAL_HERO } from "@/components/sections/user-manual/userManualContent";

/** 标题区；分类条在 PageContent 中与 Hero 同级，以便 sticky 包含块覆盖正文 */
export function UserManualHeroSection() {
  return (
    <section className="page-hero-section user-manual-hero-with-category-gap relative overflow-visible pt-[60px] pb-0 lg:pt-[100px]">
      <PageHeroBgLayer />

      <PageContainer className="relative z-10 flex flex-col items-center pb-6">
        <header className="flex max-w-[1200px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-semibold leading-[38px] text-[var(--text-base)] md:text-[52px] md:leading-[68px]">
            {USER_MANUAL_HERO.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] md:text-xl lg:max-w-[888px] lg:text-2xl lg:leading-8">
            {USER_MANUAL_HERO.subtitle}
          </p>
        </header>
      </PageContainer>
    </section>
  );
}
