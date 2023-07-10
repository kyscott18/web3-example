import { setupConfig } from "./utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { Config, WagmiConfig } from "wagmi";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent Jest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
});

type Props = { config?: Config } & {
  children?: // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactNode;
};
export function wrapper({
  config = setupConfig({ queryClient }),
  children,
}: Props = {}) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  );
}
