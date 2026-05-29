"use client";

import { CustomerCaseCard } from "@/components/sections/CustomerCaseCard";
import { CUSTOMER_CASES } from "@/components/sections/customerCasesContent";

const SCROLL_ITEMS = [...CUSTOMER_CASES, ...CUSTOMER_CASES];

export function CustomerCasesScroller() {
  return (
    <div className="customer-cases-scroll-viewport h-full w-[384px] shrink-0">
      <div className="customer-cases-scroll-track flex flex-col gap-3">
        {SCROLL_ITEMS.map((item, index) => (
          <CustomerCaseCard key={`${item.id}-${index}`} {...item} />
        ))}
      </div>
    </div>
  );
}
