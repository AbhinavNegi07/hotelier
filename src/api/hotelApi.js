/**
 * Hotel API Service
 * @module api/hotelApi
 *
 * Handles all hotel-related API calls with Amadeus API integration.
 * Falls back to mock data when API is unavailable or in demo mode.
 */

import { mockHotels, getUniqueCities } from "./mockData.js";
import { HOTELS_PER_PAGE, API_ENDPOINTS } from "../utils/constants.js";

// Amadeus token cache
let amadeusToken = null;
let tokenExpiresAt = 0;

// Search results cache - stores fetched hotels to avoid redundant API calls
// Cache is keyed by search parameters (location, filters)
let searchCache = {
  key: null, // Cache key based on search params
  hotels: [], // All fetched hotels for current search
  timestamp: 0, // When cache was created
  ttl: 5 * 60 * 1000, // Cache TTL: 5 minutes
};

/**
 * Generates a cache key from search filters
 * @param {SearchFilters} filters - Search filters
 * @returns {string} Cache key
 */
const getCacheKey = (filters) => {
  return JSON.stringify({
    location: filters.location || "",
    checkIn: filters.checkIn || "",
    checkOut: filters.checkOut || "",
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    rating: filters.rating,
    amenities: filters.amenities || [],
    sortBy: filters.sortBy || "price_asc",
  });
};

/**
 * Checks if cache is valid for given filters
 * @param {SearchFilters} filters - Search filters
 * @returns {boolean} True if cache is valid
 */
const isCacheValid = (filters) => {
  const key = getCacheKey(filters);
  const now = Date.now();
  return (
    searchCache.key === key &&
    searchCache.hotels.length > 0 &&
    now - searchCache.timestamp < searchCache.ttl
  );
};

/**
 * Clears the search cache
 */
export const clearSearchCache = () => {
  searchCache = {
    key: null,
    hotels: [],
    timestamp: 0,
    ttl: 5 * 60 * 1000,
  };
};

/**
 * @typedef {Object} SearchFilters
 * @property {string} [location] - City or destination name
 * @property {string} [checkIn] - Check-in date (YYYY-MM-DD)
 * @property {string} [checkOut] - Check-out date (YYYY-MM-DD)
 * @property {number} [guests] - Number of guests
 * @property {number} [minPrice] - Minimum price per night
 * @property {number} [maxPrice] - Maximum price per night
 * @property {number} [rating] - Minimum star rating
 * @property {string[]} [amenities] - Required amenities
 * @property {string} [sortBy] - Sort field and order
 */

/**
 * @typedef {Object} SearchResult
 * @property {import('./mockData.js').Hotel[]} hotels - Array of hotels
 * @property {number} total - Total number of matching hotels
 * @property {number} page - Current page number
 * @property {boolean} hasMore - Whether more results are available
 */

/**
 * Determines if the API should use mock data
 * @returns {boolean} True if mock mode is enabled
 */
const shouldUseMockData = () => {
  const apiMode = import.meta.env.VITE_API_MODE;
  const hasCredentials =
    import.meta.env.VITE_AMADEUS_CLIENT_ID &&
    import.meta.env.VITE_AMADEUS_CLIENT_SECRET;
  return apiMode !== "live" || !hasCredentials;
};

/**
 * Simulates network delay for realistic mock behavior
 * @param {number} [ms=500] - Delay in milliseconds
 * @returns {Promise<void>}
 */
const simulateDelay = (ms = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Gets Amadeus OAuth2 access token
 * Caches token until expiration
 * @returns {Promise<string>} Access token
 */
const getAmadeusToken = async () => {
  // Return cached token if still valid
  if (amadeusToken && Date.now() < tokenExpiresAt) {
    return amadeusToken;
  }

  const clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;
  const baseUrl = API_ENDPOINTS.AMADEUS_BASE;

  const response = await fetch(`${baseUrl}/security/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Amadeus auth failed:", errorText);
    throw new Error("Failed to authenticate with Amadeus API");
  }

  const data = await response.json();
  amadeusToken = data.access_token;
  // Set expiration with 60 second buffer
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  return amadeusToken;
};

/**
 * Fetches hotel offers with detailed content including images
 * Uses the Hotel Offers Search API (v3) for richer data
 * @param {string[]} hotelIds - Array of hotel IDs to fetch offers for
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {Promise<Object[]>} Array of hotel offers with details
 */
const fetchHotelOffers = async (hotelIds, checkIn, checkOut) => {
  if (!hotelIds.length) return [];

  const token = await getAmadeusToken();
  // Use v3 Hotel Offers endpoint for richer data
  const baseUrl = API_ENDPOINTS.AMADEUS_BASE.replace("/v1", "");

  // Limit to first 10 hotels to avoid rate limiting
  const limitedIds = hotelIds.slice(0, 10);

  try {
    const url = new URL(`${baseUrl}/v3/shopping/hotel-offers`);
    url.searchParams.set("hotelIds", limitedIds.join(","));
    url.searchParams.set("adults", "2");

    // Set dates (default to tomorrow and day after if not provided)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    url.searchParams.set(
      "checkInDate",
      checkIn || tomorrow.toISOString().split("T")[0],
    );
    url.searchParams.set(
      "checkOutDate",
      checkOut || dayAfter.toISOString().split("T")[0],
    );

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.warn("Hotel Offers API returned:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.warn("Failed to fetch hotel offers:", error.message);
    return [];
  }
};

/**
 * Generates hotel image URLs using a reliable image service
 * Since Amadeus test API has limited images, we use curated hotel images
 * @param {string} hotelId - Hotel ID for consistent image generation
 * @param {string} hotelName - Hotel name for variety
 * @returns {string[]} Array of image URLs
 */
const generateHotelImages = (hotelId, hotelName) => {
  // Use Unsplash's collection of hotel/travel images with deterministic selection
  const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    "https://images.unsplash.com/photo-1587213811864-46e59f6873b1?w=800&q=80",
  ];

  // Use hotel ID hash to pick consistent images for each hotel
  const hash = (hotelId || hotelName || "").split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const startIndex = Math.abs(hash) % hotelImages.length;
  return [
    hotelImages[startIndex],
    hotelImages[(startIndex + 1) % hotelImages.length],
    hotelImages[(startIndex + 2) % hotelImages.length],
  ];
};

/**
 * Maps Amadeus hotel data to our Hotel model
 * @param {Object} item - Amadeus hotel object
 * @param {number} index - Index for generating fallback values
 * @param {Object} [offerData] - Optional offer data with richer content
 * @returns {import('./mockData.js').Hotel} Mapped hotel
 */
const mapAmadeusHotel = (item, index, offerData = null) => {
  const hotel = item.hotel || item;
  const offer = offerData?.offers?.[0] || item.offers?.[0];
  const hotelId = hotel.hotelId || hotel.dupeId || `amadeus-${index}`;

  // Try to get images from offer data, then from hotel data, then generate
  let images = [];
  if (offerData?.hotel?.media?.length) {
    images = offerData.hotel.media.map((m) => m.uri);
  } else if (hotel.media?.length) {
    images = hotel.media.map((m) => m.uri);
  }

  // If no real images, generate consistent placeholder images
  if (!images.length) {
    images = generateHotelImages(hotelId, hotel.name);
  }

  return {
    id: hotel.hotelId || hotel.dupeId || `amadeus-${index}`,
    name: hotel.name || "Hotel",
    description:
      hotel.description?.text ||
      `A quality hotel in ${hotel.cityCode || "this city"}`,
    rating: parseInt(hotel.rating) || Math.floor(Math.random() * 2) + 3,
    userRating: parseFloat((7 + Math.random() * 2.5).toFixed(1)),
    reviewCount: Math.floor(100 + Math.random() * 900),
    pricePerNight: offer?.price?.total
      ? parseFloat(offer.price.total)
      : Math.floor(100 + Math.random() * 400),
    currency: offer?.price?.currency || "USD",
    location: {
      city: hotel.cityCode || hotel.address?.cityName || "Unknown",
      country: hotel.address?.countryCode || "Unknown",
      address: hotel.address?.lines?.join(", ") || "Address not available",
      latitude: hotel.geoCode?.latitude || hotel.latitude,
      longitude: hotel.geoCode?.longitude || hotel.longitude,
    },
    images,
    amenities: hotel.amenities?.slice(0, 6) || ["WIFI", "AIR_CONDITIONING"],
    roomType: offer?.room?.typeEstimated?.category || "Standard Room",
    freeCancellation:
      offer?.policies?.cancellations?.length > 0 || Math.random() > 0.5,
    breakfastIncluded:
      hotel.amenities?.includes("BREAKFAST") || Math.random() > 0.7,
  };
};

/**
 * Filters hotels based on search criteria
 * @param {import('./mockData.js').Hotel[]} hotels - Hotels to filter
 * @param {SearchFilters} filters - Search filters
 * @returns {import('./mockData.js').Hotel[]} Filtered hotels
 */
const filterHotels = (hotels, filters) => {
  return hotels.filter((hotel) => {
    // Location filter (case-insensitive partial match)
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase().trim();
      const cityMatch = hotel.location.city.toLowerCase().includes(searchTerm);
      const countryMatch = hotel.location.country
        .toLowerCase()
        .includes(searchTerm);
      if (!cityMatch && !countryMatch) {
        return false;
      }
    }

    // Price range filter
    if (filters.minPrice && hotel.pricePerNight < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && hotel.pricePerNight > filters.maxPrice) {
      return false;
    }

    // Star rating filter
    if (filters.rating && hotel.rating < filters.rating) {
      return false;
    }

    // Amenities filter (hotel must have all required amenities)
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        hotel.amenities.includes(amenity),
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sorts hotels based on sort criteria
 * @param {import('./mockData.js').Hotel[]} hotels - Hotels to sort
 * @param {string} [sortBy='price_asc'] - Sort field and order
 * @returns {import('./mockData.js').Hotel[]} Sorted hotels
 */
const sortHotels = (hotels, sortBy = "price_asc") => {
  const sorted = [...hotels];

  switch (sortBy) {
    case "price_asc":
      return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "price_desc":
      return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "rating_desc":
      return sorted.sort((a, b) => b.userRating - a.userRating);
    case "name_asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
};

/**
 * City code mapping for common cities
 */
const CITY_CODES = {
  "new york": "NYC",
  nyc: "NYC",
  paris: "PAR",
  london: "LON",
  tokyo: "TYO",
  dubai: "DXB",
  bangkok: "BKK",
  singapore: "SIN",
  "los angeles": "LAX",
  miami: "MIA",
  rome: "ROM",
  barcelona: "BCN",
  amsterdam: "AMS",
  delhi: "DEL",
  mumbai: "BOM",
};

/**
 * Gets IATA city code from location string
 * Only returns valid codes for known cities or proper IATA codes
 * @param {string} location - City name or code
 * @returns {string|null} IATA city code, "NYC" as default for empty, or null if invalid
 */
const getCityCode = (location) => {
  // Return NYC as default for empty location (initial load)
  if (!location || location.trim().length === 0) return "NYC";

  const normalized = location.toLowerCase().trim();

  // For very short inputs (1-2 chars), only accept known matches
  if (normalized.length < 3) {
    // Check for exact partial match in known cities
    const exactMatch = Object.entries(CITY_CODES).find(([city]) =>
      city.startsWith(normalized),
    );
    return exactMatch ? null : null; // Still return null to prevent API calls during typing
  }

  // Check if it's already a valid IATA code (exactly 3 letters)
  if (/^[a-z]{3}$/i.test(normalized)) {
    return normalized.toUpperCase();
  }

  // Look up in our mapping - only return if we have a known match
  const knownCode = CITY_CODES[normalized];
  if (knownCode) {
    return knownCode;
  }

  // Check for partial matches (e.g., "del" should match "delhi")
  const partialMatch = Object.entries(CITY_CODES).find(
    ([city]) => city.startsWith(normalized) || normalized.startsWith(city),
  );
  if (partialMatch) {
    return partialMatch[1];
  }

  // Return null for unknown locations - let caller handle fallback
  return null;
};

/**
 * Search hotels with filters and pagination
 * @param {SearchFilters} [filters={}] - Search filters
 * @param {number} [page=1] - Page number (1-indexed)
 * @returns {Promise<SearchResult>} Search results with pagination info
 * @throws {Error} If API call fails
 */
export const searchHotels = async (filters = {}, page = 1) => {
  try {
    // Use mock data if not in live mode
    if (shouldUseMockData()) {
      await simulateDelay(300 + Math.random() * 400);

      let results = filterHotels(mockHotels, filters);
      results = sortHotels(results, filters.sortBy);

      const total = results.length;
      const startIndex = (page - 1) * HOTELS_PER_PAGE;
      const endIndex = startIndex + HOTELS_PER_PAGE;
      const paginatedResults = results.slice(startIndex, endIndex);

      return {
        hotels: paginatedResults,
        total,
        page,
        hasMore: endIndex < total,
      };
    }

    // === LIVE AMADEUS API ===
    const cityCode = getCityCode(filters.location);

    // If we can't determine a valid city code, fallback to mock data
    if (!cityCode) {
      console.log(`Unknown location "${filters.location}", using mock data`);
      let results = filterHotels(mockHotels, filters);
      results = sortHotels(results, filters.sortBy);
      const total = results.length;
      const startIndex = (page - 1) * HOTELS_PER_PAGE;
      const endIndex = startIndex + HOTELS_PER_PAGE;
      return {
        hotels: results.slice(startIndex, endIndex),
        total,
        page,
        hasMore: endIndex < total,
      };
    }

    // Check if we have valid cached results for this search
    if (isCacheValid(filters)) {
      console.log(`Using cached results for page ${page}`);
      const cachedHotels = searchCache.hotels;
      const total = cachedHotels.length;
      const startIndex = (page - 1) * HOTELS_PER_PAGE;
      const endIndex = startIndex + HOTELS_PER_PAGE;

      return {
        hotels: cachedHotels.slice(startIndex, endIndex),
        total,
        page,
        hasMore: endIndex < total,
      };
    }

    // Cache miss - make API call to fetch hotels
    console.log(
      `Searching Amadeus for hotels in: ${cityCode} (fresh API call)`,
    );

    const token = await getAmadeusToken();
    const baseUrl = API_ENDPOINTS.AMADEUS_BASE;

    // Use Hotels by City endpoint with strict filters to limit response size
    // Note: This endpoint doesn't support pageLimit, so we use radius and ratings
    const url = new URL(`${baseUrl}/reference-data/locations/hotels/by-city`);
    url.searchParams.set("cityCode", cityCode);
    url.searchParams.set("radius", "5"); // Very small radius = fewer results (~50-100)
    url.searchParams.set("radiusUnit", "KM");
    url.searchParams.set("ratings", "3,4,5"); // Only 3-5 star hotels
    url.searchParams.set("hotelSource", "ALL");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Amadeus search failed:", response.status, errorText);

      // Fallback to mock data on API error
      console.log("Falling back to mock data");
      let results = filterHotels(mockHotels, filters);
      results = sortHotels(results, filters.sortBy);
      return {
        hotels: results.slice(0, HOTELS_PER_PAGE),
        total: results.length,
        page: 1,
        hasMore: results.length > HOTELS_PER_PAGE,
      };
    }

    const data = await response.json();

    // Deduplicate hotels by hotelId (API can return same hotel from different sources)
    const seenIds = new Set();
    const uniqueHotels = (data.data || []).filter((hotel) => {
      if (seenIds.has(hotel.hotelId)) return false;
      seenIds.add(hotel.hotelId);
      return true;
    });

    // Cap results at 50 hotels max for performance
    const hotelList = uniqueHotels.slice(0, 50);
    console.log(
      `Got ${data.data?.length || 0} hotels, ${uniqueHotels.length} unique, processing first ${hotelList.length}`,
    );

    // Extract hotel IDs for fetching offers (which may include images and real prices)
    const hotelIds = hotelList
      .slice(0, 15)
      .map((h) => h.hotelId)
      .filter(Boolean);

    // Fetch hotel offers for richer data (images, real prices)
    let offersMap = {};
    if (hotelIds.length > 0) {
      console.log(`Fetching offers for ${hotelIds.length} hotels...`);
      try {
        const offers = await fetchHotelOffers(
          hotelIds,
          filters.checkIn,
          filters.checkOut,
        );
        offers.forEach((offer) => {
          if (offer.hotel?.hotelId) {
            offersMap[offer.hotel.hotelId] = offer;
          }
        });
        console.log(
          `Got offers with content for ${Object.keys(offersMap).length} hotels`,
        );
      } catch (err) {
        console.warn(
          "Could not fetch hotel offers, using basic data:",
          err.message,
        );
      }
    }

    // Map hotels with offer data for richer content
    let mappedHotels = hotelList.map((item, index) => {
      const hotelId = item.hotelId;
      const offerData = offersMap[hotelId] || null;
      return mapAmadeusHotel(item, index, offerData);
    });

    // Apply client-side filters
    mappedHotels = filterHotels(mappedHotels, {
      ...filters,
      location: undefined,
    }); // Already filtered by city code
    mappedHotels = sortHotels(mappedHotels, filters.sortBy);

    // Cache the results for subsequent page requests
    searchCache = {
      key: getCacheKey(filters),
      hotels: mappedHotels,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000,
    };
    console.log(`Cached ${mappedHotels.length} hotels for pagination`);

    // Paginate and return first page
    const total = mappedHotels.length;
    const startIndex = (page - 1) * HOTELS_PER_PAGE;
    const endIndex = startIndex + HOTELS_PER_PAGE;

    return {
      hotels: mappedHotels.slice(startIndex, endIndex),
      total,
      page,
      hasMore: endIndex < total,
    };
  } catch (error) {
    console.error("Hotel search error:", error);

    // Fallback to mock data on any error
    console.log("Error occurred, falling back to mock data");
    let results = filterHotels(mockHotels, filters);
    results = sortHotels(results, filters.sortBy);

    return {
      hotels: results.slice(0, HOTELS_PER_PAGE),
      total: results.length,
      page: 1,
      hasMore: results.length > HOTELS_PER_PAGE,
    };
  }
};

/**
 * Get hotel details by ID
 * @param {string} hotelId - Hotel ID
 * @returns {Promise<import('./mockData.js').Hotel|null>} Hotel details or null if not found
 * @throws {Error} If API call fails
 */
export const getHotelById = async (hotelId) => {
  try {
    if (shouldUseMockData()) {
      await simulateDelay(200);
      const hotel = mockHotels.find((h) => h.id === hotelId);
      return hotel || null;
    }

    // For live mode, try to find in mock data as fallback
    // (Amadeus doesn't have a simple get-by-ID endpoint in free tier)
    const hotel = mockHotels.find((h) => h.id === hotelId);
    return hotel || null;
  } catch (error) {
    console.error("Get hotel error:", error);
    throw new Error(error.message || "Failed to fetch hotel details.");
  }
};

/**
 * Get available destinations/cities
 * @returns {Promise<string[]>} Array of city names
 */
export const getDestinations = async () => {
  try {
    if (shouldUseMockData()) {
      await simulateDelay(100);
      return getUniqueCities();
    }

    // Return supported cities for live mode
    return Object.keys(CITY_CODES).map(
      (city) => city.charAt(0).toUpperCase() + city.slice(1),
    );
  } catch (error) {
    console.error("Get destinations error:", error);
    throw new Error(error.message || "Failed to fetch destinations.");
  }
};

/**
 * Get multiple hotels by IDs
 * @param {string[]} hotelIds - Array of hotel IDs
 * @returns {Promise<import('./mockData.js').Hotel[]>} Array of hotels
 */
export const getHotelsByIds = async (hotelIds) => {
  try {
    if (shouldUseMockData()) {
      await simulateDelay(200);
      return mockHotels.filter((hotel) => hotelIds.includes(hotel.id));
    }

    // Fallback to mock data for now
    return mockHotels.filter((hotel) => hotelIds.includes(hotel.id));
  } catch (error) {
    console.error("Get hotels by IDs error:", error);
    throw new Error(error.message || "Failed to fetch hotels.");
  }
};

export default {
  searchHotels,
  getHotelById,
  getDestinations,
  getHotelsByIds,
  clearSearchCache,
};
