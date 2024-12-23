/**
 * Converts a string to PascalCase
 * Example: "john doe" -> "John Doe"
 */
export const toPascalCase = (str: string): string => {
  if (!str) return str;
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
