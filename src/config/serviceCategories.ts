import { AirVent, Wrench, ShieldCheck } from 'lucide-react';
import { ServiceCategory } from '../types/serviceCategory';

export const BASE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'regular',
    name: 'Return Customers Booking',
    description: 'Quick and easy booking for our valued returning customers',
    icon: AirVent,
    rating: 4.8,
    reviewCount: 1250,
    popular: true
  },
  {
    id: 'powerjet-chemical',
    name: 'PowerJet Chemical Wash',
    description: 'Signature powerjet service with deep cleaning using coil chemicals',
    icon: Wrench,
    rating: 4.9,
    reviewCount: 850
  },
  {
    id: 'gas-leak',
    name: 'Gas Check & Leakage Issues',
    description: 'Frequent gas top-up & leakage issues inspection service',
    icon: ShieldCheck,
    rating: 4.9,
    reviewCount: 680
  }
];

export const AMC_CATEGORY: ServiceCategory = {
  id: 'amc',
  name: 'AMC Service Visit',
  description: 'Premium maintenance service included in your AMC package',
  icon: ShieldCheck,
  rating: 4.9,
  reviewCount: 320
};
