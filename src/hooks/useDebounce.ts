import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a value
 * Prevents excessive updates by delaying the value change until after a specified delay
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 400ms for NxtOwner Standard)
 * @returns The debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearch = useDebounce(searchTerm, 400);
 * // debouncedSearch will only update 400ms after searchTerm stops changing
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
