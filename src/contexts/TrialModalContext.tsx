"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TrialModalView = "form" | "success";

export type TrialModalOpenOptions = {
  view?: TrialModalView;
  phone?: string;
};

type TrialModalContextValue = {
  isOpen: boolean;
  openOptions: TrialModalOpenOptions;
  open: (options?: TrialModalOpenOptions) => void;
  close: () => void;
};

const TrialModalContext = createContext<TrialModalContextValue | null>(null);

export function TrialModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openOptions, setOpenOptions] = useState<TrialModalOpenOptions>({});

  const open = useCallback((options?: TrialModalOpenOptions) => {
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
    <TrialModalContext.Provider value={value}>
      {children}
    </TrialModalContext.Provider>
  );
}

export function useTrialModal() {
  const ctx = useContext(TrialModalContext);
  if (!ctx) {
    throw new Error("useTrialModal must be used within TrialModalProvider");
  }
  return ctx;
}
