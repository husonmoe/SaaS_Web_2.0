"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  CLINIC_SELECT_DEV_PRESET_KEY,
  DEFAULT_CLINIC_IMAGE_SRC,
  MOCK_CLINIC_SELECT_ITEMS,
} from "@/components/modals/clinicSelectMockData";
import { ModalShell } from "@/components/modals/ModalShell";
import {
  useClinicSelectModal,
  type ClinicSelectItem,
} from "@/contexts/ClinicSelectModalContext";
import { useLoginModal } from "@/contexts/LoginModalContext";
import { handoffModal } from "@/lib/modalHandoff";
import { MODAL_LOGIN_PANEL_BG_SRC } from "@/lib/modalPanelAssets";
import { PATHS } from "@/lib/paths";

const ICON_CHEVRON_LEFT_SRC = "/assets/icon_chervon_right_s.svg";

function ClinicSelectCard({
  clinic,
  onSelect,
}: {
  clinic: ClinicSelectItem;
  onSelect: () => void;
}) {
  const imageSrc = clinic.imageSrc ?? DEFAULT_CLINIC_IMAGE_SRC;

  return (
    <button
      type="button"
      className="flex w-full gap-3 rounded-xl border-[1.5px] border-[var(--border-light)] bg-white p-3 text-left transition-[border-color,background-color] hover:border-[var(--color-primary)] hover:bg-[#ebf6ff] active:border-[var(--color-primary)] active:bg-[#ebf6ff]"
      onClick={onSelect}
    >
      <div className="size-[52px] shrink-0 overflow-hidden rounded-md">
        <Image
          src={imageSrc}
          alt=""
          width={156}
          height={156}
          className="size-full object-cover"
          aria-hidden
          unoptimized
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium leading-6 text-[var(--text-base)]">
          {clinic.name}
        </p>
        <p className="mt-1.5 truncate text-sm leading-[22px] text-[var(--text-tertiary)]">
          {clinic.lastLoginLabel}
        </p>
      </div>
    </button>
  );
}

export function ClinicSelectModal() {
  const { isOpen, close, open, openOptions } = useClinicSelectModal();
  const { open: openLoginModal } = useLoginModal();
  const router = useRouter();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const clinics = useMemo(
    () =>
      openOptions.clinics && openOptions.clinics.length > 0
        ? openOptions.clinics
        : MOCK_CLINIC_SELECT_ITEMS,
    [openOptions.clinics],
  );

  const handleSelectClinic = useCallback((clinicId: string) => {
    void clinicId;
    // TODO: 接入选择诊所并进入系统的接口
    close();
  }, [close]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (new URLSearchParams(window.location.search).get(CLINIC_SELECT_DEV_PRESET_KEY) === "1") {
      open();
    }
  }, [open]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, isOpen]);

  const handleClose = useCallback(() => {
    close();
  }, [close]);

  const handleSwitchToSmsLogin = useCallback(() => {
    handoffModal(
      () => openLoginModal({ tab: "sms" }),
      close,
    );
  }, [close, openLoginModal]);

  const handleCreateClinic = useCallback(() => {
    close();
    router.push(PATHS.createClinic);
  }, [close, router]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <ModalShell
      titleId={titleId}
      dialogRef={dialogRef}
      panelBgSrc={MODAL_LOGIN_PANEL_BG_SRC}
      onClose={handleClose}
      zIndex={202}
    >
      <button
        type="button"
        className="absolute left-6 top-6 flex h-10 items-center gap-1 rounded-lg border border-[var(--border-light)] bg-white py-2.5 pl-3 pr-4 text-sm leading-[22px] text-[var(--text-base)] transition-colors hover:bg-[var(--btn-outline-hover)]"
        onClick={handleSwitchToSmsLogin}
      >
        <Image
          src={ICON_CHEVRON_LEFT_SRC}
          alt=""
          width={16}
          height={16}
          className="size-4 shrink-0 rotate-180"
          aria-hidden
          unoptimized
        />
        切换至手机号登录
      </button>

      <div className="flex w-full max-w-[380px] flex-1 flex-col items-center gap-8">
        <div className="flex w-full flex-col items-center gap-2 pt-6 text-center">
          <p className="text-base leading-6 text-[var(--text-secondary)]">
            欢迎回来！
          </p>
          <h2
            id={titleId}
            className="text-2xl font-medium leading-8 text-[var(--text-base)]"
          >
            您已经加入以下诊所
          </h2>
        </div>

        <div className="h-[300px] w-full overflow-hidden rounded-xl bg-[var(--bg-shell)]">
          <div className="h-full overflow-y-auto p-4 [scrollbar-color:var(--border-heavy)_transparent] [scrollbar-width:thin]">
            <div className="flex flex-col gap-4">
              {clinics.map((clinic) => (
                <ClinicSelectCard
                  key={clinic.id}
                  clinic={clinic}
                  onSelect={() => handleSelectClinic(clinic.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="text-sm leading-[22px] text-[var(--color-primary)] transition-opacity hover:opacity-80"
          onClick={handleCreateClinic}
        >
          创建新诊所
        </button>
      </div>
    </ModalShell>,
    document.body,
  );
}
