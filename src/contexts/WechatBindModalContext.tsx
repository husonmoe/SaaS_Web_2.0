"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WechatBindModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const WechatBindModalContext =
  createContext<WechatBindModalContextValue | null>(null);

export function WechatBindModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, open, close }),
    [isOpen, open, close],
  );

  return (
    <WechatBindModalContext.Provider value={value}>
      {children}
    </WechatBindModalContext.Provider>
  );
}

export function useWechatBindModal() {
  const ctx = useContext(WechatBindModalContext);
  if (!ctx) {
    throw new Error(
      "useWechatBindModal must be used within WechatBindModalProvider",
    );
  }
  return ctx;
}
