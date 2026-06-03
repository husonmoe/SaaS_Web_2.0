"use client";

import { CustomerCaseCard } from "@/components/sections/CustomerCaseCard";
import { CUSTOMER_CASES } from "@/components/sections/customerCasesContent";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/cn";

const SCROLL_ITEMS = [...CUSTOMER_CASES, ...CUSTOMER_CASES];

export function CustomerCasesScroller() {
  const { ref, isInView } = useInViewOnce(0.08);

  return (
    <div
      ref={ref}
      className={cn(
        "customer-cases-scroll-viewport h-full w-[384px] shrink-0",
        isInView && "customer-cases-scroll-viewport--entering",
      )}
    >
      <div className="customer-cases-scroll-track flex flex-col gap-3">
        {SCROLL_ITEMS.map((item, index) => (
          <CustomerCaseCard key={`${item.id}-${index}`} {...item} />
        ))}
      </div>
    </div>
  );
}
