/**
 * Format a price value to a currency string
 * @param price The price value to format
 * @param currency The currency code (default: 'SGD')
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'SGD'): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Format a percentage value
 * @param value The value to format as percentage
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with commas
 * @param value The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-SG').format(value);
}

/**
 * Format a phone number
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +65 XXXX XXXX
  if (cleaned.length === 8) {
    return `+65 ${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  }
  
  // Return original if not 8 digits
  return phone;
}

/**
 * Format a postal code
 * @param code The postal code to format
 * @returns Formatted postal code
 */
export function formatPostalCode(code: string): string {
  // Remove all non-digits
  const cleaned = code.replace(/\D/g, '');
  
  // Return cleaned 6-digit code
  if (cleaned.length === 6) {
    return cleaned;
  }
  
  // Return original if not 6 digits
  return code;
}
