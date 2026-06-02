"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ClinicSelectItem = {
  id: string;
  name: string;
  lastLoginLabel: string;
  imageSrc?: string;
};

export type ClinicSelectModalOpenOptions = {
  clinics?: ClinicSelectItem[];
  selectedClinicId?: string;
};

type ClinicSelectModalContextValue = {
  isOpen: boolean;
  openOptions: ClinicSelectModalOpenOptions;
  open: (options?: ClinicSelectModalOpenOptions) => void;
  close: () => void;
};

const ClinicSelectModalContext =
  createContext<ClinicSelectModalContextValue | null>(null);

export function ClinicSelectModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openOptions, setOpenOptions] = useState<ClinicSelectModalOpenOptions>(
    {},
  );

  const open = useCallback((options?: ClinicSelectModalOpenOptions) => {
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
    <ClinicSelectModalContext.Provider value={value}>
      {children}
    </ClinicSelectModalContext.Provider>
  );
}

export function useClinicSelectModal() {
  const ctx = useContext(ClinicSelectModalContext);
  if (!ctx) {
    throw new Error(
      "useClinicSelectModal must be used within ClinicSelectModalProvider",
    );
  }
  return ctx;
}
