"use client";

import { Button } from "@/components/ui/Button";
import { useLoginModal } from "@/contexts/LoginModalContext";
import type { ComponentProps } from "react";

type LoginModalButtonProps = ComponentProps<typeof Button>;

/** 点击后打开登录弹窗 */
export function LoginModalButton(props: LoginModalButtonProps) {
  const { open } = useLoginModal();

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
