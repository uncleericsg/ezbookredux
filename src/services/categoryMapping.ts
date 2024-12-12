import { z } from 'zod';
import type { ServiceCategory } from '../types';
import { toast } from 'sonner';
import { addMinutes } from 'date-fns';

// Validation schema for appointment type
const appointmentTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number(),
  price: z.number().nullable(),
  category: z.string(),
  description: z.string().optional(),
  active: z.boolean(),
  maxCapacity: z.number(),
  minInterval: z.number(),
  availability: z.object({
    startTime: z.string(),
    endTime: z.string(),
    daysOfWeek: z.array(z.number())
  }).optional()
});

export type AppointmentType = z.infer<typeof appointmentTypeSchema>;

interface CategoryMap {
  categoryId: string;
  appointmentTypeId: string;
  inheritFromParent?: boolean;
}

class CategoryMapper {
  private static instance: CategoryMapper;
  private mappings: Map<string, string>;
  private parentMappings: Map<string, string>;
  private appointmentTypes: Map<string, AppointmentType>;

  private constructor() {
    this.mappings = new Map();
    this.parentMappings = new Map();
    this.appointmentTypes = new Map();

    // Set up default mappings for development mode
    if (import.meta.env.MODE === 'development') {
      // Default appointment types
      const defaultTypes: AppointmentType[] = [
        {
          id: 'regular-maintenance',
          name: 'Regular Maintenance',
          duration: 60,
          price: 60,
          category: 'regular',
          active: true,
          maxCapacity: 1,
          minInterval: 0
        },
        {
          id: 'repair-service',
          name: 'Repair Service',
          duration: 120,
          price: 120,
          category: 'repair',
          active: true,
          maxCapacity: 1,
          minInterval: 0
        },
        {
          id: 'amc-service',
          name: 'AMC Service Visit',
          duration: 60,
          price: null,
          category: 'amc',
          active: true,
          maxCapacity: 1,
          minInterval: 75
        }
      ];

      // Add appointment types
      defaultTypes.forEach(type => {
        this.appointmentTypes.set(type.id, type);
        this.mappings.set(type.category, type.id);
      });
    }
  }

  public static getInstance(): CategoryMapper {
    if (!CategoryMapper.instance) {
      CategoryMapper.instance = new CategoryMapper();
    }
    return CategoryMapper.instance;
  }

  public mapCategoryToAppointmentType(
    category: ServiceCategory,
    appointmentType: AppointmentType
  ): void {
    try {
      // Validate appointment type
      appointmentTypeSchema.parse(appointmentType);
      
      // Store appointment type details
      this.appointmentTypes.set(appointmentType.id, appointmentType);

      // Store mapping
      this.mappings.set(category.id, appointmentType.id);

      // If category has parent, store parent mapping
      if (category.parentId) {
        this.parentMappings.set(category.id, category.parentId);
      }
    } catch (error) {
      console.error('Invalid appointment type:', error);
      toast.error('Failed to map category to appointment type');
    }
  }

  public getAppointmentTypeId(categoryId: string): string | null {
    // Check direct mapping first
    const directMapping = this.mappings.get(categoryId);
    if (directMapping) return directMapping;

    // Check parent mapping if exists
    const parentId = this.parentMappings.get(categoryId);
    if (parentId) {
      return this.mappings.get(parentId) || null;
    }

    return null;
  }

  public getAppointmentTypeDetails(categoryId: string): AppointmentType | null {
    const appointmentTypeId = this.getAppointmentTypeId(categoryId);
    return appointmentTypeId ? this.appointmentTypes.get(appointmentTypeId) || null : null;
  }

  public validateMapping(categoryId: string): boolean {
    const appointmentTypeId = this.getAppointmentTypeId(categoryId);
    if (!appointmentTypeId) {
      console.warn(`No appointment type mapped for category ${categoryId}`);
      return false;
    }
    return true;
  }

  public clearMapping(categoryId: string): void {
    this.mappings.delete(categoryId);
    this.parentMappings.delete(categoryId);
  }

  public getAllMappings(): Array<CategoryMap> {
    return Array.from(this.mappings.entries()).map(([categoryId, appointmentTypeId]) => ({
      categoryId,
      appointmentTypeId,
      inheritFromParent: this.parentMappings.has(categoryId)
    }));
  }
}

export const categoryMapper = CategoryMapper.getInstance();

export const mapCategory = async (
  category: ServiceCategory,
  appointmentType: AppointmentType
): Promise<void> => {
  try {
    categoryMapper.mapCategoryToAppointmentType(category, appointmentType);
    toast.success('Category mapped successfully');
  } catch (error) {
    console.error('Failed to map category:', error);
    toast.error('Failed to map category');
    throw error;
  }
};

export const getAppointmentType = (categoryId: string): string | null => {
  return categoryMapper.getAppointmentTypeId(categoryId);
};

export const validateCategoryMapping = (categoryId: string): boolean => {
  return categoryMapper.validateMapping(categoryId);
};