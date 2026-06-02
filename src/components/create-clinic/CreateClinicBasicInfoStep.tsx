"use client";

import Image from "next/image";
import { useState } from "react";
import {
  CreateClinicFieldHint,
  CreateClinicFormRow,
} from "@/components/create-clinic/CreateClinicFormRow";
import { ImageUploadTile } from "@/components/create-clinic/ImageUploadTile";
import {
  INPUT_CLASS,
  ICON_TRIANGLE_DOWN_SRC,
  type CreateClinicFormData,
} from "@/components/create-clinic/createClinicConstants";
import {
  validateAddressDetail,
  validateClinicName,
} from "@/components/create-clinic/createClinicValidation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ACCEPTED_LICENSE_TYPES = ["image/jpeg", "image/png", "image/bmp"];
const MAX_LICENSE_SIZE_BYTES = 10 * 1024 * 1024;

type CreateClinicBasicInfoStepProps = {
  form: CreateClinicFormData;
  onChange: (patch: Partial<CreateClinicFormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export function CreateClinicBasicInfoStep({
  form,
  onChange,
  onBack,
  onSubmit,
}: CreateClinicBasicInfoStepProps) {
  const [clinicNameError, setClinicNameError] = useState<string | null>(null);
  const [regionError, setRegionError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [licenseError, setLicenseError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nameError = validateClinicName(form.clinicName);
    const regionValidationError = form.region.trim()
      ? null
      : "请选择所在省份、城市、县区、街道/乡镇";
    const detailError = validateAddressDetail(form.addressDetail);
    const licenseValidationError = form.licenseFile
      ? null
      : "请上传营业执照";

    setClinicNameError(nameError);
    setRegionError(regionValidationError);
    setAddressError(detailError);
    setLicenseError(licenseValidationError);

    if (nameError || regionValidationError || detailError || licenseValidationError) {
      return;
    }

    onSubmit();
  };

  const validateLicenseFile = (file: File) => {
    if (
      !ACCEPTED_LICENSE_TYPES.includes(file.type) &&
      !/\.(jpe?g|png|bmp)$/i.test(file.name)
    ) {
      return "支持 jpg / jpeg / png / bmp 格式，≤10M";
    }

    if (file.size > MAX_LICENSE_SIZE_BYTES) {
      return "支持 jpg / jpeg / png / bmp 格式，≤10M";
    }

    return null;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[480px] flex-col gap-10"
      noValidate
    >
      <div className="flex flex-col gap-6">
        <CreateClinicFormRow label="诊所名称">
          <div className="flex flex-col gap-1">
            <input
              id="create-clinic-name"
              type="text"
              value={form.clinicName}
              onChange={(event) => {
                onChange({ clinicName: event.target.value });
                if (clinicNameError) setClinicNameError(null);
              }}
              placeholder="建议与营业执照保持一致"
              aria-invalid={clinicNameError ? true : undefined}
              className={cn(
                INPUT_CLASS,
                clinicNameError && "border-[var(--text-error)]",
              )}
            />
            <CreateClinicFieldHint error={Boolean(clinicNameError)}>
              {clinicNameError ?? "创建后不支持修改，限 3-20 个中文字符"}
            </CreateClinicFieldHint>
          </div>
        </CreateClinicFormRow>

        <CreateClinicFormRow label="诊所地址">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <select
                  id="create-clinic-region"
                  value={form.region}
                  onChange={(event) => {
                    onChange({ region: event.target.value });
                    if (regionError) setRegionError(null);
                  }}
                  aria-invalid={regionError ? true : undefined}
                  className={cn(
                    INPUT_CLASS,
                    "appearance-none pr-10",
                    !form.region && "text-[var(--text-quaternary)]",
                    regionError && "border-[var(--text-error)]",
                  )}
                >
                  <option value="">所在省份、城市、县区、街道\乡镇</option>
                  <option value="广东省/广州市/海珠区/赤岗街道">
                    广东省 / 广州市 / 海珠区 / 赤岗街道
                  </option>
                  <option value="广东省/广州市/天河区/猎德街道">
                    广东省 / 广州市 / 天河区 / 猎德街道
                  </option>
                </select>
                <Image
                  src={ICON_TRIANGLE_DOWN_SRC}
                  alt=""
                  width={14}
                  height={14}
                  className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2"
                  aria-hidden
                  unoptimized
                />
              </div>
              <input
                id="create-clinic-address-detail"
                type="text"
                value={form.addressDetail}
                onChange={(event) => {
                  onChange({ addressDetail: event.target.value });
                  if (addressError) setAddressError(null);
                }}
                placeholder="填写详细地址"
                aria-invalid={addressError ? true : undefined}
                className={cn(
                  INPUT_CLASS,
                  addressError && "border-[var(--text-error)]",
                )}
              />
            </div>
            <CreateClinicFieldHint
              error={Boolean(regionError || addressError)}
            >
              {regionError ??
                addressError ??
                "输入详细地址，限 1-30 字符，支持中文，英文，数字"}
            </CreateClinicFieldHint>
          </div>
        </CreateClinicFormRow>

        <CreateClinicFormRow label="营业执照">
          <div className="relative">
            <div className="flex items-center gap-3">
              <ImageUploadTile
                value={form.licenseFile}
                onChange={(file) => {
                  setLicenseError(null);
                  onChange({ licenseFile: file });
                }}
                error={Boolean(licenseError)}
                label="上传营业执照"
                validateFile={validateLicenseFile}
                onInvalidFile={setLicenseError}
              />
              <p className="w-[146px] text-sm leading-[22px] text-[var(--text-tertiary)]">
                支持 jpg / jpeg / png / bmp 格式，≤10M
              </p>
            </div>
            {licenseError ? (
              <CreateClinicFieldHint error overlay>
                {licenseError}
              </CreateClinicFieldHint>
            ) : null}
          </div>
        </CreateClinicFormRow>
      </div>

      <CreateClinicFormRow label="">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 min-h-10 w-32 rounded-lg px-4 text-sm leading-[22px]"
            onClick={onBack}
          >
            上一步
          </Button>
          <Button
            type="submit"
            className="h-10 min-h-10 w-32 rounded-lg px-4 text-sm leading-[22px]"
          >
            创建诊所
          </Button>
        </div>
      </CreateClinicFormRow>
    </form>
  );
}
