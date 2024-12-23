export interface ServiceOption {
  id: string;
  title: string;
  price: number;
  duration: string;
  description?: string;
  isPromo?: boolean;
  promoLabel?: string;
  isSignature?: boolean;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2
  }).format(price);
};

export const formatServicePrice = (service: ServiceOption): string => {
  return formatPrice(service.price);
};

export const validateService = (service: ServiceOption): boolean => {
  return !!(
    service &&
    service.id &&
    service.title &&
    typeof service.price === 'number' &&
    service.duration
  );
};

export const DEFAULT_SERVICE_DURATION = '2 hours';
