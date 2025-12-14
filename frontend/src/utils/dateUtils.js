/**
 * Formats the current date in a human-readable format
 * @returns {string} Formatted date string (e.g., "December 8, 2024")
 */
export const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Returns the current year as a string
 * @returns {string} Current year (e.g., "2024")
 */
export const getCurrentYear = () => {
  return new Date().getFullYear().toString();
};
