import { REGION_CENTERS, type Region } from './regions';
import { z } from 'zod';
import { LRUCache } from 'lru-cache';
import { toast } from 'sonner';

// Validation schemas
const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  postalCode: z.string().regex(/^[0-9]{6}$/, 'Invalid postal code format'),
  unit: z.string().optional(),
  building: z.string().optional()
});

type Address = z.infer<typeof addressSchema>;

// LRU Cache configuration
const cache = new LRUCache<string, Region>({
  max: 500, // Store up to 500 entries
  ttl: 1000 * 60 * 60, // 1 hour TTL
  updateAgeOnGet: true,
  allowStale: true
});

const REGION_KEYWORDS = {
  west: ['jurong', 'clementi', 'bukit batok', 'choa chu kang', 'boon lay'],
  north: ['yishun', 'woodlands', 'sembawang', 'admiralty', 'marsiling'],
  central: ['novena', 'toa payoh', 'bishan', 'ang mo kio', 'thomson'],
  northeast: ['hougang', 'sengkang', 'punggol', 'serangoon', 'kovan'],
  east: ['tampines', 'pasir ris', 'bedok', 'changi', 'simei']
} as const;

// Extended postal code ranges
const POSTAL_RANGES: Record<Region, Array<[number, number]>> = {
  west: [[60, 64], [65, 68]],
  north: [[72, 73], [75, 76], [77, 78]],
  central: [[20, 23], [24, 27], [28, 30]],
  northeast: [[53, 55], [56, 57], [82, 83]],
  east: [[46, 52], [81, 81], [48, 51]]
};

class RegionClassificationError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_ADDRESS' | 'INVALID_POSTAL' | 'REGION_NOT_FOUND'
  ) {
    super(message);
    this.name = 'RegionClassificationError';
  }
}

const validateAddress = (address: string): Address => {
  try {
    // Extract postal code
    const postalCode = extractPostalCode(address);
    if (!postalCode) {
      throw new RegionClassificationError(
        'No valid postal code found in address',
        'INVALID_POSTAL'
      );
    }

    // Basic address parsing
    const street = address.replace(/singapore\s*\d{6}/i, '').trim();
    
    return addressSchema.parse({
      street,
      postalCode,
      unit: extractUnit(address),
      building: extractBuilding(address)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new RegionClassificationError(
        'Invalid address format',
        'INVALID_ADDRESS'
      );
    }
    throw error;
  }
};

export const determineRegion = (address: string): Region => {
  try {
    // Check cache first
    const cacheKey = address.toLowerCase().trim();
    const cachedRegion = cache.get(cacheKey);
    if (cachedRegion) {
      return cachedRegion;
    }

    // Validate address
    const validatedAddress = validateAddress(address);
    const addressLower = address.toLowerCase();
    
    // Check for exact keyword matches first
    for (const [region, keywords] of Object.entries(REGION_KEYWORDS)) {
      if (keywords.some(keyword => addressLower.includes(keyword))) {
        cache.set(cacheKey, region as Region);
        return region as Region;
      }
    }
    
    // Use postal code for region determination
    const region = getRegionFromPostalCode(validatedAddress.postalCode);
    if (region) {
      cache.set(cacheKey, region);
      return region;
    }
    
    throw new RegionClassificationError(
      'Could not determine region',
      'REGION_NOT_FOUND'
    );
  } catch (error) {
    console.error('Region determination failed:', error);
    if (error instanceof RegionClassificationError) {
      toast.error(error.message);
    }
    return 'northeast'; // Fallback to northeast
  }
};

const extractPostalCode = (address: string): string => {
  const match = address.match(/\b\d{6}\b/);
  if (!match) {
    throw new RegionClassificationError(
      'No valid postal code found',
      'INVALID_POSTAL'
    );
  }
  return match[0];
};

const extractUnit = (address: string): string | undefined => {
  const match = address.match(/#\d+-\d+|#\d+/);
  return match?.[0];
};

const extractBuilding = (address: string): string | undefined => {
  // Extract text before unit number or postal code
  const match = address.match(/([^#\d]+)(?:#|$|\d{6})/);
  return match?.[1]?.trim();
};

const getRegionFromPostalCode = (postalCode: string): Region | null => {
  const prefix = parseInt(postalCode.slice(0, 2));
  
  for (const [region, ranges] of Object.entries(POSTAL_RANGES)) {
    if (ranges.some(([start, end]) => prefix >= start && prefix <= end)) {
      return region as Region;
    }
  }
  
  return null;
};