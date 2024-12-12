// Types
// =========================================================

/**
 * Represents the steps in the booking process
 */
export type BookingStep = 'brand' | 'issues' | 'details' | 'schedule' | 'payment';

/**
 * Common interface for booking state management
 */
export interface BookingState {
  currentStep: BookingStep;
  selectedBrands: string[];
  selectedIssues: string[];
  customerData?: CustomerFormData;
  scheduleData?: {
    date: string;
    time: string;
  };
}

/**
 * Validation error structure for booking flow
 */
export interface ValidationErrors {
  brands?: string;
  issues?: string;
  customerInfo?: Record<string, string>;
}

// Constants
// =========================================================

/**
 * Defines the steps in the booking process
 */
export const BOOKING_STEPS = [
  { id: 'brand', label: 'AC Brand' },
  { id: 'issues', label: 'AC Issues' },
  { id: 'details', label: 'Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'payment', label: 'Payment' }
] as const;

// Component Exports
// =========================================================

/**
 * Main booking flow component that manages the entire booking process
 * @example
 * <BookingFlow onComplete={(data) => handleBookingComplete(data)} />
 */
export { default as BookingFlow } from './BookingFlow';

/**
 * Brand selection component for choosing AC brands
 * @example
 * <BrandSelection onSelect={(brand) => handleBrandSelect(brand)} />
 */
export { default as BrandSelection } from './BrandSelection';

/**
 * Issue selection component for specifying AC problems
 * @example
 * <IssueSelection onSelect={(issues) => handleIssueSelect(issues)} />
 */
export { default as IssueSelection } from './IssueSelection';

/**
 * Customer information form component
 * @example
 * <CustomerForm onSubmit={(data) => handleCustomerData(data)} />
 */
export { default as CustomerForm } from './CustomerForm';

/**
 * Booking progress indicator component
 * @example
 * <BookingProgress currentStep="details" steps={BOOKING_STEPS} />
 */
export { default as BookingProgress } from './BookingProgress';

// Type Exports
// =========================================================

// Component Props
export type { BookingFlowProps } from './BookingFlow';
export type { BrandSelectionProps } from './BrandSelection';
export type { IssueSelectionProps } from './IssueSelection';
export type { CustomerFormProps, CustomerFormData } from './CustomerForm';
export type { BookingProgressProps } from './BookingProgress';

// Utility Functions
// =========================================================

/**
 * Validates the booking data at each step
 */
export { validateBookingStep } from './utils/validation';

/**
 * Formats booking data for submission
 */
export { formatBookingData } from './utils/formatting';

// Sub-components
// =========================================================

/**
 * Individual brand selection card component
 */
export { BrandCard } from './BrandSelection';

/**
 * Individual issue selection card component
 */
export { IssueCard } from './IssueSelection';

/**
 * Step indicator component used in booking progress
 */
export { StepIndicator } from './BookingProgress';