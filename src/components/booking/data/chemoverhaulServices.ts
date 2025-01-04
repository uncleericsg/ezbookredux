import React from 'react';
import { ChemOverhaulService } from '../types/chemoverhaulTypes';
import { Zap, Shield, Settings, Wind, Star, LucideIcon } from 'lucide-react';

const createIcon = (Icon: LucideIcon) => React.createElement(Icon, { size: 32 });

export const chemoverhaulServices: ChemOverhaulService[] = [
  {
    id: 'overhaul-1unit',
    title: '1 Unit',
    units: 1,
    price: 160,
    regularPrice: 180,
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
    icon: createIcon(Zap),
    benefits: [
      'Deep chemical cleaning process',
      'Component disassembly',
      'Full system inspection'
    ]
  },
  {
    id: 'overhaul-2units',
    title: '2 Units',
    units: 2,
    price: 300,
    regularPrice: 360,
    duration: '1 hour',
    paddingBefore: 0,
    paddingAfter: 30,
    icon: createIcon(Shield),
    benefits: [
      'Complete unit overhaul',
      'Parts replacement check',
      'Performance optimization'
    ]
  },
  {
    id: 'overhaul-3units',
    title: '3 Units',
    units: 3,
    price: 420,
    regularPrice: 540,
    duration: '2 hours',
    paddingBefore: 0,
    paddingAfter: 30,
    icon: createIcon(Settings),
    benefits: [
      'Thorough system cleaning',
      'Comprehensive maintenance',
      'Efficiency restoration'
    ]
  },
  {
    id: 'overhaul-4units',
    title: '4 Units',
    units: 4,
    price: 560,
    regularPrice: 720,
    duration: '3 hours',
    paddingBefore: 0,
    paddingAfter: 30,
    icon: createIcon(Wind),
    benefits: [
      'Multi-unit overhaul',
      'System synchronization',
      'Performance tuning'
    ]
  },
  {
    id: 'overhaul-5units',
    title: '5 Units',
    units: 5,
    price: 700,
    regularPrice: 900,
    duration: '4 hours',
    paddingBefore: 0,
    paddingAfter: 30,
    icon: createIcon(Star),
    benefits: [
      'Complete system overhaul',
      'Full unit restoration',
      'Extended maintenance'
    ]
  }
];