"use client";

import { Button } from "@/components/ui/Button";
import { useTrialModal } from "@/contexts/TrialModalContext";
import type { ComponentProps } from "react";

type TrialModalButtonProps = ComponentProps<typeof Button>;

/** 点击后打开免费试用弹窗 */
export function TrialModalButton(props: TrialModalButtonProps) {
  const { open } = useTrialModal();

  return (
    <Button
      type="button"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        if (!event.defaultPrevented) open();
      }}
    />
  );
}
