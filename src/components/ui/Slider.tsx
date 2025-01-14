'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from '@utils/cn';

export type SliderProps;

/** Minimum value */
min?: number;
/** Maximum value */
max?: number;
/** Step value */
step?: number;
/** Default value */
defaultValue?: number[];
/** Value */
value?: number[];
/** Callback when value changes */
onValueChange?: (value: number[]) => void;
};

/**
 * Slider component for selecting numeric values
 * @example
 * <Slider defaultValue={[50]} min={0} max={100} step={1} />
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track 
      className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
      aria-label="Slider track"
    >
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      aria-label="Slider thumb"
    />
  </SliderPrimitive.Root>
));

// Add displayName
Slider.displayName = 'Slider';

// Both named and default exports at the bottom
export { Slider };

undefined.displayName = 'undefined';