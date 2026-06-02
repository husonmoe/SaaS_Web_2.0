"use client";

import { useCallback, useEffect, useState } from "react";
import { CreateClinicBasicInfoStep } from "@/components/create-clinic/CreateClinicBasicInfoStep";
import { CreateClinicBindPhoneStep } from "@/components/create-clinic/CreateClinicBindPhoneStep";
import { CreateClinicHeader } from "@/components/create-clinic/CreateClinicHeader";
import { CreateClinicStepIndicator } from "@/components/create-clinic/CreateClinicStepIndicator";
import {
  CREATE_CLINIC_DEV_PRESET_KEY,
  CREATE_CLINIC_STEP_DEV_PRESET_KEY,
  INITIAL_CREATE_CLINIC_FORM,
  type CreateClinicFormData,
} from "@/components/create-clinic/createClinicConstants";

export function CreateClinicPageContent() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CreateClinicFormData>(INITIAL_CREATE_CLINIC_FORM);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get(CREATE_CLINIC_DEV_PRESET_KEY) !== "1") return;

    if (params.get(CREATE_CLINIC_STEP_DEV_PRESET_KEY) === "2") {
      setStep(2);
      setForm((prev) => ({
        ...prev,
        displayName: "李医生",
        phone: "13800138000",
        smsCode: "123456",
      }));
    }
  }, []);

  const patchForm = useCallback((patch: Partial<CreateClinicFormData>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleCreate = useCallback(() => {
    // TODO: 接入创建诊所接口
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--bg-shell)]">
      <CreateClinicHeader />

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div className="flex w-full flex-1 flex-col items-center gap-10 rounded-xl border border-[var(--border-light)] bg-white py-16 shadow-[var(--shadow-card)]">
          <h1 className="text-center text-2xl font-medium leading-8 text-[var(--text-base)]">
            只需2步，即可创建诊所
          </h1>

          <CreateClinicStepIndicator step={step} />

          {step === 1 ? (
            <CreateClinicBindPhoneStep
              form={form}
              onChange={patchForm}
              onNext={() => setStep(2)}
            />
          ) : (
            <CreateClinicBasicInfoStep
              form={form}
              onChange={patchForm}
              onBack={() => setStep(1)}
              onSubmit={handleCreate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
