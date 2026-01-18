/**
 * Currency formatting utilities
 * @module utils/formatCurrency
 */

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - The currency code (ISO 4217)
 * @param {string} [locale='en-US'] - The locale for formatting
 * @returns {string} Formatted currency string
 * @example
 * formatCurrency(1234.56) // Returns "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE') // Returns "1.234,56 €"
 */
export const formatCurrency = (amount, currency = "USD", locale = "en-US") => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "$0.00";
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Currency formatting error:", error);
    return `$${amount.toFixed(2)}`;
  }
};

/**
 * Formats a price range
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @param {string} [currency='USD'] - The currency code
 * @returns {string} Formatted price range string
 * @example
 * formatPriceRange(100, 500) // Returns "$100 - $500"
 */
export const formatPriceRange = (min, max, currency = "USD") => {
  const formattedMin = formatCurrency(min, currency);
  const formattedMax = formatCurrency(max, currency);
  return `${formattedMin} - ${formattedMax}`;
};

/**
 * Formats price per night with label
 * @param {number} price - The price per night
 * @param {string} [currency='USD'] - The currency code
 * @returns {string} Formatted price with "per night" label
 */
export const formatPricePerNight = (price, currency = "USD") => {
  return `${formatCurrency(price, currency)} / night`;
};
