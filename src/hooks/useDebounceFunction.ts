import { MutableRefObject, useRef } from "react";

export const useDebounceFunction = (
  action: (...args: any[]) => void,
  delay = 500
) => {
  const timerRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const debouncedAction = (...args: any[]) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      action(...args);
    }, delay);
  };

  return debouncedAction;
};
