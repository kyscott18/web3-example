import { config } from "../constants";
import { useChainID } from "../hooks/useChain";
import { createContainer } from "unstated-next";

const useEnvironmentInternal = () => {
  const chain = useChainID();
  return config[chain];
};

export const { Provider: EnvironmentProvider, useContainer: useEnvironment } =
  createContainer(useEnvironmentInternal);
