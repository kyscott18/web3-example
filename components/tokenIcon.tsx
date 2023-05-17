import type { WrappedTokenInfo } from "@/lib/wrappedTokenInfo";
import { clsx } from "clsx";
import Image from "next/image";

export default function TokenIcon({
  tokenInfo,
  size,
  className,
}: {
  tokenInfo: WrappedTokenInfo;
  size: number;
  className?: string;
}) {
  return tokenInfo.logoURI ? (
    <Image
      className={clsx("flex overflow-hidden rounded-[50%]", className)}
      height={size}
      width={size}
      src={tokenInfo.logoURI}
      alt="token icon"
    />
  ) : (
    <div className="border-1 flex overflow-hidden rounded-[100%] border-dashed border-gray-200" />
  );
}
