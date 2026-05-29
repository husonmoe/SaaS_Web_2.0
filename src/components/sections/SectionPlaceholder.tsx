import { PageContainer } from "@/components/layout/PageContainer";

type SectionPlaceholderProps = {
  title: string;
  figmaNode?: string;
};

export function SectionPlaceholder({
  title,
  figmaNode,
}: SectionPlaceholderProps) {
  return (
    <section className="border-t border-[var(--border-light)] bg-white py-20">
      <PageContainer className="text-center">
        <h2 className="text-2xl font-semibold text-[var(--text-base)]">
          {title}
        </h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          区块开发中 · 将按 Figma 定稿继续实现
          {figmaNode ? ` (${figmaNode})` : ""}
        </p>
      </PageContainer>
    </section>
  );
}
