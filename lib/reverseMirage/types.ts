export type ReverseMirage<TRet = unknown, TParse = unknown> = {
  read: () => TRet | Promise<TRet>;
  parse: (data: TRet) => TParse;
};
