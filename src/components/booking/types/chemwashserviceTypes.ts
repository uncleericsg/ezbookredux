import { ReactNode } from 'react';

export interface ChemWashService {
  id: string;
  title: string;
  units: number;
  price: number;
  duration: string;
  paddingBefore: number;
  paddingAfter: number;
  benefits: string[];
  icon: ReactNode;
}