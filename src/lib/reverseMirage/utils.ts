import { ReverseMirage } from "./types";

export const readAndParse = async <
  TRet extends unknown,
  TParse extends unknown,
>(
  reverseMirage: ReverseMirage<TRet, TParse>,
) => {
  return reverseMirage.parse(await reverseMirage.read());
};
