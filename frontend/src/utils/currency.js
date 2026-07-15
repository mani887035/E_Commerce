/**
 * Format a number as Indian Rupee currency
 * Uses Indian numbering system: ₹1,00,000 etc.
 * @param {number} amount
 * @returns {string}
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};

export const CURRENCY = '₹';
