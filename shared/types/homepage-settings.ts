/**
 * Homepage settings types
 */

/**
 * Service category type
 */
export type ServiceType = 'maintenance' | 'repair' | 'amc';

/**
 * Visibility type
 */
export type VisibilityType = 'all' | 'amc';

/**
 * Service category
 */
export interface ServiceCategory {
  /**
   * Category ID
   */
  id: string;

  /**
   * Category name
   */
  name: string;

  /**
   * Category description
   */
  description: string;

  /**
   * Service type
   */
  type: ServiceType;

  /**
   * Base price (null for variable pricing)
   */
  price: number | null;

  /**
   * Icon name
   */
  icon?: string;

  /**
   * Parent category ID
   */
  parentId?: string;

  /**
   * Visibility flag
   */
  visible: boolean;

  /**
   * Display order
   */
  order?: number;

  /**
   * Visibility type
   */
  visibilityType?: VisibilityType;

  /**
   * Associated appointment type ID
   */
  appointmentTypeId?: string;
}

/**
 * Service category with children
 */
export interface CategoryWithChildren extends ServiceCategory {
  /**
   * Child categories
   */
  children?: CategoryWithChildren[];
}

/**
 * Card settings
 */
export interface CardSettings {
  /**
   * Card ID
   */
  id: string;

  /**
   * Card title
   */
  title: string;

  /**
   * Card description
   */
  description: string;

  /**
   * Call to action text
   */
  ctaText: string;

  /**
   * Call to action link
   */
  ctaLink: string;

  /**
   * Display order
   */
  order: number;

  /**
   * Visibility flag
   */
  visible: boolean;

  /**
   * Visibility type
   */
  visibilityType: VisibilityType;

  /**
   * Card image URL
   */
  imageUrl?: string;

  /**
   * Associated appointment type ID
   */
  appointmentTypeId?: string;
}

/**
 * Homepage settings
 */
export interface HomepageSettings {
  /**
   * Service categories
   */
  categories: ServiceCategory[];

  /**
   * Homepage cards
   */
  cards: CardSettings[];
}

/**
 * Category mapping modal props
 */
export interface CategoryMappingModalProps {
  /**
   * Category to map
   */
  category: ServiceCategory;

  /**
   * Available appointment types
   */
  appointmentTypes: Array<{
    id: string;
    name: string;
    duration: number;
  }>;

  /**
   * Close modal callback
   */
  onClose: () => void;

  /**
   * Save mapping callback
   */
  onSave: (appointmentTypeId: string) => void;
}
