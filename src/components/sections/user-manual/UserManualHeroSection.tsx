import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeroBgLayer } from "@/components/layout/PageHeroBgLayer";
import { USER_MANUAL_HERO } from "@/components/sections/user-manual/userManualContent";

/** 标题区；分类条在 PageContent 中与 Hero 同级，以便 sticky 包含块覆盖正文 */
export function UserManualHeroSection() {
  return (
    <section className="page-hero-section user-manual-hero-with-category-gap relative overflow-visible pt-[60px] pb-8">
      <PageHeroBgLayer />

      <PageContainer className="relative z-10 flex flex-col items-center gap-8">
        <header className="flex max-w-[1200px] flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-semibold leading-[38px] text-[var(--text-base)] md:text-[52px] md:leading-[68px]">
            {USER_MANUAL_HERO.title}
          </h1>
          <p className="text-lg leading-[26px] text-[var(--text-secondary)] md:text-xl">
            {USER_MANUAL_HERO.subtitle}
          </p>
        </header>
      </PageContainer>
    </section>
  );
}
