import { chains } from "@/pages/_app";
import type {
  NativeCurrency as BaseNativeCurrency,
  Token as BaseToken,
} from "reverse-mirage";

export type SupportedChainIDs = typeof chains[number]["id"];

export type Token = BaseToken & { logoURI?: string };

export type NativeCurrency = BaseNativeCurrency & { logoURI?: string };

export type Currency = Token | NativeCurrency;
