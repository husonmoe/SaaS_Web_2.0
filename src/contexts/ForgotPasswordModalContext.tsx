"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ForgotPasswordModalOpenOptions = {
  phone?: string;
};

type ForgotPasswordModalContextValue = {
  isOpen: boolean;
  openOptions: ForgotPasswordModalOpenOptions;
  open: (options?: ForgotPasswordModalOpenOptions) => void;
  close: () => void;
};

const ForgotPasswordModalContext =
  createContext<ForgotPasswordModalContextValue | null>(null);

export function ForgotPasswordModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openOptions, setOpenOptions] = useState<ForgotPasswordModalOpenOptions>(
    {},
  );

  const open = useCallback((options?: ForgotPasswordModalOpenOptions) => {
    setOpenOptions(options ?? {});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setOpenOptions({});
  }, []);

  const value = useMemo(
    () => ({ isOpen, openOptions, open, close }),
    [isOpen, openOptions, open, close],
  );

  return (
    <ForgotPasswordModalContext.Provider value={value}>
      {children}
    </ForgotPasswordModalContext.Provider>
  );
}

export function useForgotPasswordModal() {
  const ctx = useContext(ForgotPasswordModalContext);
  if (!ctx) {
    throw new Error(
      "useForgotPasswordModal must be used within ForgotPasswordModalProvider",
    );
  }
  return ctx;
}
