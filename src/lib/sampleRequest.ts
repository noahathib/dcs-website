import { useSyncExternalStore } from "react";

// Colors a visitor has flagged in the Color Guide, carried into the sample request form.
// In-memory only, for this page visit.
let picked: string[] = [];
const subs = new Set<() => void>();

export const sampleRequest = {
  toggle(no: string) {
    picked = picked.includes(no) ? picked.filter((x) => x !== no) : [...picked, no];
    subs.forEach((f) => f());
  },
  clear() {
    picked = [];
    subs.forEach((f) => f());
  },
};

export function usePicked() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => picked,
  );
}
