import React from 'react';
import { ChemWashService } from '../types/chemwashserviceTypes';
import { Zap, Shield, Settings, Wind, Star, LucideIcon } from 'lucide-react';

const createIcon = (Icon: LucideIcon) => React.createElement(Icon, { size: 32 });

export const chemwashServices: ChemWashService[] = [
  {
    id: 'chemwash-1unit',
    title: '1 Unit',
    units: 1,
    price: 120,
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
    icon: createIcon(Zap),
    benefits: [
      'Removes 99.9% contaminants',
      'Restores airflow',
      'Improves efficiency'
    ]
  },
  {
    id: 'chemwash-2units',
    title: '2 Units',
    units: 2,
    price: 240,
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
    icon: createIcon(Shield),
    benefits: [
      'Kills mold spores',
      'Prevents regrowth',
      'Improves air quality'
    ]
  },
  {
    id: 'chemwash-3units',
    title: '3 Units',
    units: 3,
    price: 360,
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
    icon: createIcon(Settings),
    benefits: [
      'Comprehensive cleaning',
      'Includes all components',
      'Full system optimization'
    ]
  },
  {
    id: 'chemwash-4units',
    title: '4 Units',
    units: 4,
    price: 480,
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
    icon: createIcon(Wind),
    benefits: [
      'Increases airflow by 40%',
      'Reduces energy costs',
      'Improves comfort'
    ]
  },
  {
    id: 'chemwash-5units',
    title: '5 Units',
    units: 5,
    price: 600,
    duration: '1 hour',
    paddingBefore: 15,
    paddingAfter: 30,
    icon: createIcon(Star),
    benefits: [
      'Improves cooling efficiency',
      'Reduces strain on system',
      'Saves energy'
    ]
  }
];