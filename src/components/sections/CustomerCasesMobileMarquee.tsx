"use client";

import { CustomerCaseCard } from "@/components/sections/CustomerCaseCard";
import {
  CUSTOMER_CASES,
  type CustomerCaseItem,
} from "@/components/sections/customerCasesContent";
import { cn } from "@/lib/cn";

/** 上行按原顺序，下行错位起始，两行错位拼出砖墙式排布 */
const ROW_ONE = CUSTOMER_CASES;
const ROW_TWO = [...CUSTOMER_CASES.slice(2), ...CUSTOMER_CASES.slice(0, 2)];

/** 复制一份内容实现 translateX(-50%) 的无缝循环 */
function MarqueeRow({
  items,
  offset = false,
}: {
  items: CustomerCaseItem[];
  offset?: boolean;
}) {
  const loop = [...items, ...items];

  return (
    <div className="customer-cases-marquee flex">
      <div
        className={cn(
          "customer-cases-marquee-track flex w-max items-end gap-2",
          offset && "customer-cases-marquee-track--offset",
        )}
      >
        {loop.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="mr-3 flex w-[300px] shrink-0 items-end"
          >
            <CustomerCaseCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomerCasesMobileMarquee() {
  return (
    <div className="customer-cases-marquee-bleed flex flex-col gap-6 lg:hidden">
      <MarqueeRow items={ROW_ONE} />
      <MarqueeRow items={ROW_TWO} offset />
    </div>
  );
}
