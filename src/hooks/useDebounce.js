/**
 * useDebounce Hook
 * @module hooks/useDebounce
 *
 * Custom hook for debouncing values, useful for search inputs
 * and other scenarios where you want to limit update frequency.
 */

import { useState, useEffect } from "react";

/**
 * Custom hook that returns a debounced version of the value
 * @template T
 * @param {T} value - Value to debounce
 * @param {number} [delay=500] - Delay in milliseconds
 * @returns {T} Debounced value
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // This will only run 300ms after user stops typing
 *   searchHotels(debouncedSearch);
 * }, [debouncedSearch]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
