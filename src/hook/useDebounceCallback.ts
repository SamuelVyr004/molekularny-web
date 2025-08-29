import { useEffect, useMemo, useRef, useCallback } from 'react';

/**
 * Vylepšený debounce hook, ktorý vracia [deboundovanú funkciu, flush funkciu].
 * `flush` okamžite vykoná posledné naplánované volanie.
 */
export function useDebounceCallback<A extends any[]>(
  callback: (...args: A) => void,
  wait: number,
  dependencies: readonly any[] = []
): [debounced: (...args: A) => void, flush: () => void] {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestArgsRef = useRef<A | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Upratovanie pri odpojení komponentu
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback((...args: A) => {
    latestArgsRef.current = args;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
      latestArgsRef.current = null;
    }, wait);
  }, [wait]);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (latestArgsRef.current) {
      callbackRef.current(...latestArgsRef.current);
      latestArgsRef.current = null;
    }
  }, []);

  // useMemo zaručí, že referencia na funkcie sa zmení len vtedy, keď je to nutné
  return useMemo(() => [debouncedCallback, flush], [debouncedCallback, flush, ...dependencies]);
}