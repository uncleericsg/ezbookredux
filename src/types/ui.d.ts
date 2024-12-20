/**
 * UI component declarations
 */

/**
 * Base UI component props interface
 */
export interface UIComponentProps {
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Optional children elements
   */
  children?: React.ReactNode;
}

/**
 * Service contract interface
 */
export interface ServiceContract {
  /**
   * Contract ID
   */
  id: string;
  /**
   * Customer name
   */
  customerName: string;
  /**
   * Contract type
   */
  contractType: string;
  /**
   * Contract status
   */
  status: string;
  /**
   * Contract start date
   */
  startDate: Date;
  /**
   * Contract end date
   */
  endDate: Date;
  /**
   * Number of completed services
   */
  servicesCompleted: number;
  /**
   * Total number of services
   */
  servicesTotal: number;
  /**
   * Customer contact number
   */
  contactNumber: string;
  /**
   * Customer email
   */
  email: string;
  /**
   * Service location
   */
  location: string;
}

/**
 * Declare UI component modules
 */
declare module '@/components/ui/*' {
  import { UIComponentProps } from '@/types/ui';
  
  /**
   * Generic UI component type
   */
  const Component: React.FC<UIComponentProps>;
  
  /**
   * Set component display name
   */
  Component.displayName = 'UIComponent';
  
  export default Component;
  export { Component };
}

/**
 * Declare contract types module
 */
declare module '@/types/contracts' {
  import { ServiceContract } from '@/types/ui';
  export { ServiceContract };
}