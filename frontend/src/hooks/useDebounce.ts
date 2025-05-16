import { useMemo } from "react";
import { debounce } from "lodash-es";
import { useLatest } from "./useLatest";

export function useDebounce(callback, delay) {
  const latestCallback = useLatest(callback);

  return useMemo(
    () =>
      debounce((...args) => {
        latestCallback.current(...args);
      }, delay),
    [delay, latestCallback]
  );
}
