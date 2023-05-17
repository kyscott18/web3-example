import TokenIcon from "./tokenIcon";
import type { WrappedTokenInfo } from "@/lib/wrappedTokenInfo";
import { clsx } from "clsx";

export default function TokenInfo({
  token,
  size,
}: {
  token: WrappedTokenInfo;
  size?: number;
}) {
  return (
    <div className={clsx("flex items-center", "space-x-2")}>
      <TokenIcon tokenInfo={token} size={size ?? 32} />
      <div className="">
        <p className="p1">{token.symbol}</p>
      </div>
    </div>
  );
}
