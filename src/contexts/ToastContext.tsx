"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ToastViewport } from "@/components/ui/Toast";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const timerRef = useRef<number>();

  const showToast = useCallback((msg: string) => {
    window.clearTimeout(timerRef.current);
    setMessage(msg);
    timerRef.current = window.setTimeout(
      () => setMessage(null),
      TOAST_DURATION_MS,
    );
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && message ? <ToastViewport message={message} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
