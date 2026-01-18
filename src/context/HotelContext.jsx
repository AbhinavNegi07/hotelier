import { createContext, useContext, useMemo, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { STORAGE_KEYS, MAX_COMPARISON_ITEMS } from "../utils/constants.js";

/**
 * @typedef {Object} HotelContextValue
 * @property {import('../api/mockData.js').Hotel[]} comparisonList - Hotels in comparison
 * @property {number} comparisonCount - Number of hotels in comparison
 * @property {boolean} isInComparison - Check if hotel is in comparison
 * @property {(hotel: import('../api/mockData.js').Hotel) => boolean} addToComparison - Add hotel
 * @property {(hotelId: string) => void} removeFromComparison - Remove hotel
 * @property {() => void} clearComparison - Clear all hotels
 * @property {boolean} canAddMore - Whether more hotels can be added
 */

/**
 * Hotel Context for comparison functionality
 * @type {React.Context<HotelContextValue>}
 */
export const HotelContext = createContext(undefined);

/**
 * Hotel Provider Component
 * Manages hotel comparison state with localStorage persistence
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const HotelProvider = ({ children }) => {
  const [comparisonList, setComparisonList] = useLocalStorage(
    STORAGE_KEYS.COMPARISON_LIST,
    [],
  );

  /**
   * Check if a hotel is in the comparison list
   * @param {string} hotelId - Hotel ID to check
   * @returns {boolean} True if hotel is in comparison
   */
  const isInComparison = useCallback(
    (hotelId) => {
      return comparisonList.some((hotel) => hotel.id === hotelId);
    },
    [comparisonList],
  );

  /**
   * Check if more hotels can be added
   * @type {boolean}
   */
  const canAddMore = comparisonList.length < MAX_COMPARISON_ITEMS;

  /**
   * Add a hotel to comparison list
   * @param {import('../api/mockData.js').Hotel} hotel - Hotel to add
   * @returns {boolean} True if successfully added
   */
  const addToComparison = useCallback(
    (hotel) => {
      if (isInComparison(hotel.id)) {
        console.warn(`Hotel ${hotel.id} is already in comparison`);
        return false;
      }

      if (!canAddMore) {
        console.warn(`Maximum ${MAX_COMPARISON_ITEMS} hotels can be compared`);
        return false;
      }

      setComparisonList((prev) => [...prev, hotel]);
      return true;
    },
    [isInComparison, canAddMore, setComparisonList],
  );

  /**
   * Remove a hotel from comparison list
   * @param {string} hotelId - Hotel ID to remove
   */
  const removeFromComparison = useCallback(
    (hotelId) => {
      setComparisonList((prev) => prev.filter((hotel) => hotel.id !== hotelId));
    },
    [setComparisonList],
  );

  /**
   * Clear all hotels from comparison
   */
  const clearComparison = useCallback(() => {
    setComparisonList([]);
  }, [setComparisonList]);

  /**
   * Toggle hotel in comparison list
   * @param {import('../api/mockData.js').Hotel} hotel - Hotel to toggle
   * @returns {boolean} New state (true if added, false if removed)
   */
  const toggleComparison = useCallback(
    (hotel) => {
      if (isInComparison(hotel.id)) {
        removeFromComparison(hotel.id);
        return false;
      } else {
        return addToComparison(hotel);
      }
    },
    [isInComparison, addToComparison, removeFromComparison],
  );

  // Memoize context value
  const value = useMemo(
    () => ({
      comparisonList,
      comparisonCount: comparisonList.length,
      isInComparison,
      addToComparison,
      removeFromComparison,
      clearComparison,
      toggleComparison,
      canAddMore,
      maxItems: MAX_COMPARISON_ITEMS,
    }),
    [
      comparisonList,
      isInComparison,
      addToComparison,
      removeFromComparison,
      clearComparison,
      toggleComparison,
      canAddMore,
    ],
  );

  return (
    <HotelContext.Provider value={value}>{children}</HotelContext.Provider>
  );
};

/**
 * Custom hook to access hotel comparison context
 * @returns {HotelContextValue} Hotel context value
 * @throws {Error} If used outside of HotelProvider
 */
export const useHotelContext = () => {
  const context = useContext(HotelContext);

  if (context === undefined) {
    throw new Error("useHotelContext must be used within a HotelProvider");
  }

  return context;
};

export default HotelProvider;
