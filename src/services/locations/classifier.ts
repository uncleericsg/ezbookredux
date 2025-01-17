import { logger } from '@/lib/logger';
import type { ErrorMetadata } from '@/types/error';

export interface Region {
  name: string;
  postalCodes: string[];
  boundaries: {
    center: {
      lat: number;
      lng: number;
    };
    radius: number;
  };
}

export type RegionKey = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'CENTRAL';

const REGIONS: Record<RegionKey, Region> = {
  NORTH: {
    name: 'North',
    postalCodes: ['65', '66', '67', '68', '69', '70', '71', '72', '73', '75', '76', '77', '78', '79', '80'],
    boundaries: {
      center: { lat: 1.429, lng: 103.836 },
      radius: 5
    }
  },
  SOUTH: {
    name: 'South',
    postalCodes: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
    boundaries: {
      center: { lat: 1.270, lng: 103.819 },
      radius: 3
    }
  },
  EAST: {
    name: 'East',
    postalCodes: ['42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52'],
    boundaries: {
      center: { lat: 1.352, lng: 103.940 },
      radius: 4
    }
  },
  WEST: {
    name: 'West',
    postalCodes: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
    boundaries: {
      center: { lat: 1.333, lng: 103.743 },
      radius: 6
    }
  },
  CENTRAL: {
    name: 'Central',
    postalCodes: ['31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41'],
    boundaries: {
      center: { lat: 1.364, lng: 103.833 },
      radius: 3
    }
  }
};

export function getRegionFromPostalCode(postalCode: string): RegionKey | null {
  try {
    if (!postalCode || postalCode.length < 2) {
      return null;
    }

    const prefix = postalCode.substring(0, 2);
    const region = Object.entries(REGIONS).find(([_, details]) => 
      details.postalCodes.includes(prefix)
    );

    return region ? (region[0] as RegionKey) : null;
  } catch (error) {
    logger.error('Failed to get region from postal code', {
      message: error instanceof Error ? error.message : String(error),
      details: error instanceof Error ? error.stack : undefined
    } as ErrorMetadata);
    return null;
  }
}

export function getRegionBoundaries(region: RegionKey): Region['boundaries'] | null {
  return REGIONS[region]?.boundaries || null;
}

export function isLocationInRegion(lat: number, lng: number, region: RegionKey): boolean {
  const boundaries = getRegionBoundaries(region);
  if (!boundaries) return false;

  const distance = getDistanceFromLatLonInKm(
    lat,
    lng,
    boundaries.center.lat,
    boundaries.center.lng
  );

  return distance <= boundaries.radius;
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}