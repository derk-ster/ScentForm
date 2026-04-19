export type SmellsLike = {
  name: string;
  brand: string;
  note: string;
};

/**
 * Optional resemblance hints for PDPs — keyed by product handle.
 * ALLURA 7 is an independent house; any entries are shopper guidance only.
 */
export const smellsLikeByHandle: Record<string, SmellsLike> = {};

export function getSmellsLike(handle: string): SmellsLike | undefined {
  return smellsLikeByHandle[handle];
}
