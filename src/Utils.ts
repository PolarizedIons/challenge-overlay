// TS thinks its funny
export const ObjectEntries = <TKey extends string | number | symbol, TValue>(
  items: Record<TKey, TValue>
) => {
  return Object.entries(items) as [TKey, TValue][];
};
