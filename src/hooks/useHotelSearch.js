/**
 * useHotelSearch Hook
 * @module hooks/useHotelSearch
 *
 * Custom hook for hotel search functionality with filtering,
 * pagination, and state management.
 */

import { useState, useCallback, useEffect } from "react";
import { searchHotels, clearSearchCache } from "../api/hotelApi.js";
import { useDebounce } from "./useDebounce.js";

/**
 * @typedef {Object} SearchFilters
 * @property {string} location - Search location
 * @property {string} checkIn - Check-in date
 * @property {string} checkOut - Check-out date
 * @property {number} guests - Number of guests
 * @property {number} [minPrice] - Minimum price
 * @property {number} [maxPrice] - Maximum price
 * @property {number} [rating] - Minimum rating
 * @property {string[]} [amenities] - Required amenities
 * @property {string} [sortBy] - Sort order
 */

/**
 * @typedef {Object} UseHotelSearchReturn
 * @property {import('../api/mockData.js').Hotel[]} hotels - Search results
 * @property {boolean} loading - Loading state
 * @property {string|null} error - Error message
 * @property {number} total - Total matching hotels
 * @property {number} page - Current page
 * @property {boolean} hasMore - More results available
 * @property {SearchFilters} filters - Current filters
 * @property {(filters: Partial<SearchFilters>) => void} updateFilters - Update filters
 * @property {() => Promise<void>} search - Execute search
 * @property {() => Promise<void>} loadMore - Load next page
 * @property {() => void} reset - Reset to initial state
 */

/**
 * Initial filter state
 * @type {SearchFilters}
 */
const initialFilters = {
  location: "",
  checkIn: "",
  checkOut: "",
  guests: 2,
  minPrice: undefined,
  maxPrice: undefined,
  rating: undefined,
  amenities: [],
  sortBy: "price_asc",
};

/**
 * Custom hook for hotel search with pagination and filtering
 * @param {Partial<SearchFilters>} [defaultFilters={}] - Initial filter values
 * @returns {UseHotelSearchReturn} Search state and methods
 * @example
 * const { hotels, loading, search, loadMore, hasMore } = useHotelSearch();
 */
export const useHotelSearch = (defaultFilters = {}) => {
  // State
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFilters] = useState({
    ...initialFilters,
    ...defaultFilters,
  });

  // Debounce location input for auto-search (500ms delay to prevent rapid API calls)
  const debouncedLocation = useDebounce(filters.location, 500);

  /**
   * Update filter values
   * @param {Partial<SearchFilters>} newFilters - Filters to update
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    // Reset pagination and clear cache when filters change
    setPage(1);
    setHotels([]);
    clearSearchCache(); // Clear cache to force fresh API call
  }, []);

  /**
   * Execute hotel search
   * @returns {Promise<void>}
   */
  const search = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchHotels(filters, 1);
      setHotels(result.hotels);
      setTotal(result.total);
      setPage(1);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message || "Failed to search hotels");
      setHotels([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Load more results (next page)
   * @returns {Promise<void>}
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const result = await searchHotels(filters, nextPage);

      setHotels((prev) => [...prev, ...result.hotels]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message || "Failed to load more hotels");
    } finally {
      setLoading(false);
    }
  }, [filters, page, loading, hasMore]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setHotels([]);
    setLoading(false);
    setError(null);
    setTotal(0);
    setPage(1);
    setHasMore(false);
    setFilters({
      ...initialFilters,
      ...defaultFilters,
    });
    clearSearchCache(); // Clear cache for fresh data on next search
  }, [defaultFilters]);

  // Auto-search when debounced location changes (minimum 3 chars to ensure valid city names)
  useEffect(() => {
    if (debouncedLocation && debouncedLocation.length >= 3) {
      search();
    }
  }, [debouncedLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    hotels,
    loading,
    error,
    total,
    page,
    hasMore,
    filters,
    updateFilters,
    search,
    loadMore,
    reset,
  };
};

export default useHotelSearch;
