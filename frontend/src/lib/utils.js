import moment from 'moment';

/**
 * Formats a number as Kenyan Shillings (Ksh)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., 'Ksh 1,234')
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `Ksh ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Formats a date string using moment.js
 * @param {string|Date} dateString - The date to format
 * @param {string} [format='LLL'] - The format string (defaults to 'LLL' - e.g., "February 12, 2021 2:30 PM")
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, format = 'lll') => {
  if (!dateString) return 'N/A';
  return moment(dateString).format(format);
};

// Common format presets
formatDate.presets = {
  short: 'L', // 02/12/2021
  medium: 'll', // Feb 12, 2021
  long: 'LL', // February 12, 2021
  full: 'LLLL', // Friday, February 12, 2021 2:30 PM
  time: 'LT', // 2:30 PM
  dateTime: 'lll', // Feb 12, 2021 2:30 PM
  iso: 'YYYY-MM-DDTHH:mm:ssZ', // 2021-02-12T14:30:00+03:00
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (str, n) => {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};
