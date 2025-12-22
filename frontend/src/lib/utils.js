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

export const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
