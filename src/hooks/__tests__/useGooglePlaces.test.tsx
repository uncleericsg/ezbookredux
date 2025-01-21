import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useGooglePlaces } from '../useGooglePlaces';
import { initGoogleMaps, isGoogleMapsLoaded } from '@/services/googleMaps';
import { APIError } from '@/utils/apiErrors';

// Mock Google Maps API
const mockAutocompleteService = {
  getPlacePredictions: vi.fn()
};

const mockPlacesService = {
  getDetails: vi.fn()
};

const mockGeocoder = {
  geocode: vi.fn()
};

vi.mock('@/services/googleMaps', () => ({
  initGoogleMaps: vi.fn(),
  isGoogleMapsLoaded: vi.fn(),
  mapPrediction: vi.fn(pred => ({
    placeId: pred.place_id,
    description: pred.description,
    mainText: pred.structured_formatting.main_text,
    secondaryText: pred.structured_formatting.secondary_text,
    types: pred.types
  })),
  mapPlaceResult: vi.fn(result => ({
    placeId: result.place_id,
    formattedAddress: result.formatted_address,
    components: {}
  }))
}));

// Mock Google Maps global object
global.google = {
  maps: {
    places: {
      AutocompleteService: vi.fn(() => mockAutocompleteService),
      PlacesService: vi.fn(() => mockPlacesService),
      PlacesServiceStatus: {
        OK: 'OK',
        ZERO_RESULTS: 'ZERO_RESULTS',
        ERROR: 'ERROR'
      }
    },
    Geocoder: vi.fn(() => mockGeocoder),
    GeocoderStatus: {
      OK: 'OK',
      ZERO_RESULTS: 'ZERO_RESULTS',
      ERROR: 'ERROR'
    }
  }
} as any;

describe('useGooglePlaces', () => {
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (isGoogleMapsLoaded as jest.Mock).mockReturnValue(true);
  });

  it('initializes Google Places service', async () => {
    const { result } = renderHook(() => useGooglePlaces({ onError: mockOnError }));

    expect(result.current.isInitialized).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('handles initialization error', async () => {
    const error = new Error('Init failed');
    (initGoogleMaps as jest.Mock).mockRejectedValueOnce(error);
    (isGoogleMapsLoaded as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useGooglePlaces({ onError: mockOnError }));

    expect(result.current.isInitialized).toBe(false);
    expect(result.current.error).toBeInstanceOf(APIError);
    expect(mockOnError).toHaveBeenCalled();
  });

  it('searches for addresses', async () => {
    const mockPredictions = [
      {
        place_id: '1',
        description: 'Test Address 1',
        structured_formatting: {
          main_text: 'Test Address',
          secondary_text: '1'
        },
        types: ['address']
      }
    ];

    mockAutocompleteService.getPlacePredictions.mockImplementation((request, callback) => {
      callback(mockPredictions, 'OK');
    });

    const { result } = renderHook(() => useGooglePlaces());

    await act(async () => {
      await result.current.searchAddress('test');
    });

    expect(result.current.suggestions).toHaveLength(1);
    expect(result.current.suggestions[0].placeId).toBe('1');
    expect(result.current.isLoading).toBe(false);
  });

  it('handles search error', async () => {
    mockAutocompleteService.getPlacePredictions.mockImplementation((request, callback) => {
      callback(null, 'ERROR');
    });

    const { result } = renderHook(() => useGooglePlaces({ onError: mockOnError }));

    await act(async () => {
      await result.current.searchAddress('test');
    });

    expect(result.current.suggestions).toHaveLength(0);
    expect(result.current.error).toBeInstanceOf(APIError);
    expect(mockOnError).toHaveBeenCalled();
  });

  it('gets place details', async () => {
    const mockPlace = {
      place_id: '1',
      formatted_address: 'Test Address',
      geometry: {
        location: {
          lat: () => 1.23,
          lng: () => 4.56
        }
      },
      address_components: [
        {
          long_name: '123456',
          types: ['postal_code']
        }
      ]
    };

    mockPlacesService.getDetails.mockImplementation((request, callback) => {
      callback(mockPlace, 'OK');
    });

    const { result } = renderHook(() => useGooglePlaces());

    const details = await act(async () => {
      return await result.current.getPlaceDetails('1');
    });

    expect(details).toBeTruthy();
    expect(details?.placeId).toBe('1');
    expect(details?.formattedAddress).toBe('Test Address');
  });

  it('gets postal code', async () => {
    const mockResults = [{
      address_components: [
        {
          long_name: '123456',
          types: ['postal_code']
        }
      ]
    }];

    mockGeocoder.geocode.mockImplementation((request, callback) => {
      callback(mockResults, 'OK');
    });

    const { result } = renderHook(() => useGooglePlaces());

    const postalCode = await act(async () => {
      return await result.current.getPostalCode('Test Address');
    });

    expect(postalCode).toBe('123456');
  });

  it('handles missing postal code', async () => {
    const mockResults = [{
      address_components: []
    }];

    mockGeocoder.geocode.mockImplementation((request, callback) => {
      callback(mockResults, 'OK');
    });

    const { result } = renderHook(() => useGooglePlaces());

    const postalCode = await act(async () => {
      return await result.current.getPostalCode('Test Address');
    });

    expect(postalCode).toBeNull();
  });
});