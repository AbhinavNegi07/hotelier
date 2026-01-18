/**
 * Date formatting utilities
 * @module utils/formatDate
 */

/**
 * Formats a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 * @example
 * formatDate(new Date()) // Returns "January 17, 2026"
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
};

/**
 * Formats a date for input fields (YYYY-MM-DD)
 * @param {Date|string} date - The date to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "";
    }
    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Date formatting error:", error);
    return "";
  }
};

/**
 * Formats a date range
 * @param {Date|string} startDate - The start date
 * @param {Date|string} endDate - The end date
 * @returns {string} Formatted date range
 * @example
 * formatDateRange('2026-01-15', '2026-01-20') // Returns "Jan 15 - Jan 20, 2026"
 */
export const formatDateRange = (startDate, endDate) => {
  try {
    const start = startDate instanceof Date ? startDate : new Date(startDate);
    const end = endDate instanceof Date ? endDate : new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid date range";
    }

    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();

    const startFormat = {
      month: "short",
      day: "numeric",
      ...(sameYear ? {} : { year: "numeric" }),
    };

    const endFormat = {
      month: sameMonth ? undefined : "short",
      day: "numeric",
      year: "numeric",
    };

    const formattedStart = new Intl.DateTimeFormat("en-US", startFormat).format(
      start,
    );
    const formattedEnd = new Intl.DateTimeFormat("en-US", endFormat).format(
      end,
    );

    return `${formattedStart} - ${formattedEnd}`;
  } catch (error) {
    console.error("Date range formatting error:", error);
    return "Invalid date range";
  }
};

/**
 * Calculates the number of nights between two dates
 * @param {Date|string} checkIn - Check-in date
 * @param {Date|string} checkOut - Check-out date
 * @returns {number} Number of nights
 */
export const calculateNights = (checkIn, checkOut) => {
  try {
    const start = checkIn instanceof Date ? checkIn : new Date(checkIn);
    const end = checkOut instanceof Date ? checkOut : new Date(checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch (error) {
    console.error("Night calculation error:", error);
    return 0;
  }
};

/**
 * Gets today's date formatted for input fields
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayForInput = () => {
  return formatDateForInput(new Date());
};

/**
 * Gets tomorrow's date formatted for input fields
 * @returns {string} Tomorrow's date in YYYY-MM-DD format
 */
export const getTomorrowForInput = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDateForInput(tomorrow);
};
