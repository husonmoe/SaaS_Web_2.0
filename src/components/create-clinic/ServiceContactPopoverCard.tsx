import Image from "next/image";

const SERVICE_AVATAR_SRC = "/assets/avatar_service.png";
const SERVICE_CARD_BG_SRC = "/assets/pop_serviceCard_bg.png";
const SERVICE_QR_SRC = "/assets/modal/login_qrcode.png";

/** Figma pop_serviceCard · node 407:126115 */
export function ServiceContactPopoverCard() {
  return (
    <div className="w-[300px] rounded-xl shadow-[0px_8px_24px_0px_rgba(15,47,76,0.08)]">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white px-10 py-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[180px] overflow-hidden"
          aria-hidden
        >
          <div className="relative size-full">
            <Image
              src={SERVICE_CARD_BG_SRC}
              alt=""
              fill
              className="object-cover object-top"
              sizes="300px"
              aria-hidden
              unoptimized
            />
          </div>
        </div>

        <div className="relative flex w-[200px] items-center gap-2">
          <div className="size-14 shrink-0 overflow-hidden rounded-full">
            <Image
              src={SERVICE_AVATAR_SRC}
              alt=""
              width={56}
              height={56}
              className="size-full object-cover"
              aria-hidden
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-[26px] text-[var(--text-base)]">
              专属私享客服
            </p>
            <p className="text-xs leading-5 text-[var(--text-tertiary)]">
              1v1服务 · 7x12小时
            </p>
          </div>
        </div>

        <div className="relative flex size-[200px] items-center justify-center overflow-hidden rounded-xl border border-[var(--border-light)] bg-white">
          <Image
            src={SERVICE_QR_SRC}
            alt="企业微信客服二维码"
            width={200}
            height={200}
            className="size-[200px] object-cover"
            unoptimized
          />
        </div>

        <div className="relative w-[200px] text-center">
          <p className="text-sm leading-[22px] text-[var(--text-secondary)]">
            遇到问题？请联系我们
          </p>
          <p className="mt-0.5 text-base font-medium leading-6 text-[var(--text-base)]">
            195-2103-1618
          </p>
        </div>
      </div>
    </div>
  );
}
