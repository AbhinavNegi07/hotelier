/**
 * Application constants
 * Centralized configuration values used across the application
 */

/** Maximum number of hotels that can be compared at once */
export const MAX_COMPARISON_ITEMS = 4;

/** Number of hotels to fetch per page */
export const HOTELS_PER_PAGE = 12;

/** LocalStorage keys */
export const STORAGE_KEYS = {
  COMPARISON_LIST: "otelier_comparison_list",
  THEME: "otelier_theme",
  RECENT_SEARCHES: "otelier_recent_searches",
};

/** API endpoints (for future use with real APIs) */
export const API_ENDPOINTS = {
  AMADEUS_BASE: "https://test.api.amadeus.com/v1",
  AMADEUS_HOTELS: "/reference-data/locations/hotels/by-city",
};

/** Hotel rating labels */
export const RATING_LABELS = {
  1: "Economy",
  2: "Budget",
  3: "Standard",
  4: "Superior",
  5: "Luxury",
};

/** Amenity icons mapping */
export const AMENITY_ICONS = {
  wifi: "📶",
  pool: "🏊",
  gym: "💪",
  spa: "🧖",
  restaurant: "🍽️",
  parking: "🅿️",
  airConditioning: "❄️",
  petFriendly: "🐕",
  roomService: "🛎️",
  bar: "🍸",
  concierge: "👨‍💼",
  laundry: "👔",
};

/** Chart colors for comparison */
export const CHART_COLORS = {
  primary: "#f59e0b",
  secondary: "#14b8a6",
  tertiary: "#8b5cf6",
  quaternary: "#ec4899",
  background: "#1e293b",
  grid: "#334155",
  text: "#94a3b8",
};

/** Filter options */
export const GUEST_OPTIONS = [
  { value: 1, label: "1 Guest" },
  { value: 2, label: "2 Guests" },
  { value: 3, label: "3 Guests" },
  { value: 4, label: "4 Guests" },
  { value: 5, label: "5+ Guests" },
];

export const SORT_OPTIONS = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
];
