import Image from "next/image";
import Link from "next/link";
import { CreateClinicServiceContactButton } from "@/components/create-clinic/CreateClinicServiceContactButton";
import { LOGO_SRC } from "@/components/create-clinic/createClinicConstants";
import { PATHS } from "@/lib/paths";

export function CreateClinicHeader() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center justify-between">
      <div className="flex h-16 w-[300px] items-center px-6">
        <Link href={PATHS.home} className="flex items-center" aria-label="光谱云诊">
          <Image
            src={LOGO_SRC}
            alt="光谱云诊"
            width={87}
            height={24}
            className="h-6 w-auto"
            unoptimized
          />
        </Link>
      </div>
      <div className="flex h-16 w-[300px] items-center justify-end px-6">
        <CreateClinicServiceContactButton />
      </div>
    </header>
  );
}
