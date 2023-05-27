export type ReverseMirage<
  TRet extends unknown = unknown,
  TParse extends unknown = unknown,
> = {
  read: () => TRet | Promise<TRet>;
  parse: (data: TRet) => TParse;
};
