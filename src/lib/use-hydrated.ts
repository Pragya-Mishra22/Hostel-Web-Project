"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False during server rendering and until React has hydrated, true afterwards.
 * Forms use it to keep their submit button disabled until their handlers are
 * attached, so a very early click can never fall through to a plain browser
 * form submit (which would put the password in the URL).
 */
export function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
