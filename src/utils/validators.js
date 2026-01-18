/**
 * Input validation utilities
 * @module utils/validators
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result with errors
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || typeof password !== "string") {
    return { isValid: false, errors: ["Password is required"] };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validates that a date is not in the past
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if date is today or in the future
 */
export const isValidFutureDate = (date) => {
  try {
    const inputDate = date instanceof Date ? date : new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    return inputDate >= today;
  } catch {
    return false;
  }
};

/**
 * Validates check-in and check-out dates
 * @param {string|Date} checkIn - Check-in date
 * @param {string|Date} checkOut - Check-out date
 * @returns {{ isValid: boolean, error: string|null }} Validation result
 */
export const validateDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return {
      isValid: false,
      error: "Both check-in and check-out dates are required",
    };
  }

  const checkInDate = checkIn instanceof Date ? checkIn : new Date(checkIn);
  const checkOutDate = checkOut instanceof Date ? checkOut : new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return { isValid: false, error: "Invalid date format" };
  }

  if (!isValidFutureDate(checkInDate)) {
    return { isValid: false, error: "Check-in date cannot be in the past" };
  }

  if (checkOutDate <= checkInDate) {
    return {
      isValid: false,
      error: "Check-out date must be after check-in date",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validates guest count
 * @param {number} guests - Number of guests
 * @param {number} [maxGuests=10] - Maximum allowed guests
 * @returns {{ isValid: boolean, error: string|null }} Validation result
 */
export const validateGuestCount = (guests, maxGuests = 10) => {
  if (typeof guests !== "number" || isNaN(guests)) {
    return { isValid: false, error: "Invalid guest count" };
  }

  if (guests < 1) {
    return { isValid: false, error: "At least 1 guest is required" };
  }

  if (guests > maxGuests) {
    return { isValid: false, error: `Maximum ${maxGuests} guests allowed` };
  }

  return { isValid: true, error: null };
};

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
};
