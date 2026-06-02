"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LoginModalTab = "wechat" | "sms" | "password";

export type LoginModalOpenOptions = {
  tab?: LoginModalTab;
};

type LoginModalContextValue = {
  isOpen: boolean;
  openOptions: LoginModalOpenOptions;
  open: (options?: LoginModalOpenOptions) => void;
  close: () => void;
};

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openOptions, setOpenOptions] = useState<LoginModalOpenOptions>({});

  const open = useCallback((options?: LoginModalOpenOptions) => {
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
    <LoginModalContext.Provider value={value}>
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error("useLoginModal must be used within LoginModalProvider");
  }
  return ctx;
}
