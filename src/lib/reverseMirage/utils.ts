import { ReverseMirage } from "./types";

export const readAndParse = async <TRet, TParse>(
  reverseMirage: ReverseMirage<TRet, TParse>,
) => {
  return reverseMirage.parse(await reverseMirage.read());
};
