"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ICON_ADD_SRC,
  ICON_DELETE_SRC,
  ICON_PHOTO_SRC,
} from "@/components/create-clinic/createClinicConstants";
import { cn } from "@/lib/cn";

type ImageUploadTileProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  onInvalidFile?: (message: string) => void;
  validateFile?: (file: File) => string | null;
};

export function ImageUploadTile({
  value,
  onChange,
  accept = ".jpg,.jpeg,.png,.bmp,image/jpeg,image/png,image/bmp",
  disabled = false,
  error = false,
  label = "上传图片",
  onInvalidFile,
  validateFile,
}: ImageUploadTileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteHovered, setDeleteHovered] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const resetInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = () => {
    resetInput();
    onChange(null);
    setDeleteHovered(false);
  };

  const simulateUpload = (file: File) => {
    setUploading(true);
    setProgress(0);

    let current = 0;
    const intervalId = window.setInterval(() => {
      current = Math.min(99, current + 12 + Math.random() * 16);
      setProgress(Math.round(current));

      if (current >= 99) {
        window.clearInterval(intervalId);
        window.setTimeout(() => {
          setUploading(false);
          setProgress(0);
          onChange(file);
        }, 180);
      }
    }, 80);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile?.(file);
    if (validationError) {
      onInvalidFile?.(validationError);
      resetInput();
      return;
    }

    const validType =
      file.type.startsWith("image/") || /\.(jpe?g|png|bmp|webp)$/i.test(file.name);
    if (!validType) {
      onInvalidFile?.("文件格式不支持");
      resetInput();
      return;
    }

    simulateUpload(file);
  };

  const openPicker = () => {
    if (disabled || uploading || value) return;
    fileInputRef.current?.click();
  };

  const borderClass = error
    ? "border-[var(--text-error)]"
    : "border-[var(--border-light)]";

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || uploading}
        onChange={handleFileChange}
      />

      {disabled ? (
        <div
          className={cn(
            "flex h-[85px] w-[120px] shrink-0 items-center justify-center rounded-lg border bg-white",
            borderClass,
          )}
          aria-disabled
        >
          <Image
            src={ICON_PHOTO_SRC}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
            aria-hidden
            unoptimized
          />
        </div>
      ) : uploading ? (
        <div
          className={cn(
            "flex h-[85px] w-[120px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border bg-white",
            borderClass,
          )}
          aria-busy
          aria-live="polite"
        >
          <div
            className="size-6 shrink-0 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent"
            aria-hidden
          />
          <span className="text-xs leading-5 text-[var(--text-secondary)]">
            上传中 {progress}%
          </span>
        </div>
      ) : previewUrl ? (
        <div
          className={cn(
            "group relative h-[85px] w-[120px] shrink-0 cursor-pointer overflow-hidden rounded-lg border",
            borderClass,
          )}
          role="img"
          aria-label={value?.name ?? "已上传图片"}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt=""
            className="size-full object-cover"
          />
          <button
            type="button"
            className={cn(
              "absolute inset-x-0 bottom-0 flex h-6 items-center justify-center opacity-0 transition-[opacity,background-color] group-hover:opacity-100",
              deleteHovered
                ? "bg-[var(--text-error)]"
                : "bg-[rgba(23,28,33,0.6)]",
            )}
            aria-label="删除图片"
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
            onClick={(event) => {
              event.stopPropagation();
              handleDelete();
            }}
          >
            <Image
              src={ICON_DELETE_SRC}
              alt=""
              width={16}
              height={16}
              className="size-4 shrink-0"
              aria-hidden
              unoptimized
            />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            "flex h-[85px] w-[120px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border bg-white pt-1 transition-colors hover:border-[var(--color-primary)] hover:bg-white",
            borderClass,
          )}
          onClick={openPicker}
        >
          <Image
            src={ICON_ADD_SRC}
            alt=""
            width={24}
            height={24}
            className="size-6 shrink-0"
            aria-hidden
            unoptimized
          />
          <span className="text-sm leading-[22px] text-[var(--text-secondary)]">
            {label}
          </span>
        </button>
      )}
    </>
  );
}
