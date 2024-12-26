const commonDomains = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'msn.com',
  'singnet.com.sg',
  'yahoo.com.sg'
];

const secondLevelDomains = [
  'gmail',
  'yahoo',
  'hotmail',
  'outlook',
  'live',
  'msn',
  'singnet'
];

const topLevelDomains = [
  'com',
  'net',
  'org',
  'edu',
  'gov',
  'sg',
  'com.sg'
];

interface EmailSuggestion {
  address: string;
  domain: string;
  full: string;
}

const findEmailTypo = (email: string): EmailSuggestion | null => {
  if (!email || !email.includes('@')) return null;

  const [address, domain] = email.toLowerCase().split('@');
  if (!domain) return null;

  // Find closest matching domain
  const closestDomain = findClosestString(domain, commonDomains);
  if (closestDomain && closestDomain !== domain) {
    return {
      address,
      domain: closestDomain,
      full: `${address}@${closestDomain}`
    };
  }

  // If no direct match found, try to match parts
  const domainParts = domain.split('.');
  if (domainParts.length >= 2) {
    const secondLevel = findClosestString(domainParts[0], secondLevelDomains);
    const topLevel = findClosestString(domainParts.slice(1).join('.'), topLevelDomains);
    
    if (secondLevel && topLevel && `${secondLevel}.${topLevel}` !== domain) {
      const suggestedDomain = `${secondLevel}.${topLevel}`;
      return {
        address,
        domain: suggestedDomain,
        full: `${address}@${suggestedDomain}`
      };
    }
  }

  return null;
};

// Levenshtein distance calculation
const getEditDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Find closest matching string
const findClosestString = (str: string, candidates: string[]): string | null => {
  let minDistance = Infinity;
  let closestMatch = null;

  for (const candidate of candidates) {
    const distance = getEditDistance(str.toLowerCase(), candidate.toLowerCase());
    // Only suggest if the distance is small enough relative to the string length
    if (distance < minDistance && distance <= Math.ceil(str.length / 3)) {
      minDistance = distance;
      closestMatch = candidate;
    }
  }

  return closestMatch;
};

// Export types and functions
export type { EmailSuggestion };
export { findEmailTypo };
