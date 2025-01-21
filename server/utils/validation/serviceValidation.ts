import { z } from 'zod';
import type { 
  CreateServiceParams,
  UpdateServiceParams,
  ServiceValidation,
  ServiceCategory,
  ServiceStatus
} from '@shared/types/service';

const serviceCategories: ServiceCategory[] = [
  'maintenance',
  'repair',
  'installation',
  'inspection',
  'cleaning',
  'consultation'
];

const serviceStatuses: ServiceStatus[] = [
  'active',
  'inactive',
  'archived'
];

const baseServiceSchema = {
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum(serviceCategories as [ServiceCategory, ...ServiceCategory[]]),
  price: z.number().min(0),
  duration: z.number().min(15).max(480), // 15 min to 8 hours
  status: z.enum(serviceStatuses as [ServiceStatus, ...ServiceStatus[]]).optional(),
  image_url: z.string().url().optional(),
  technician_requirements: z.array(z.string()).optional()
};

const createServiceSchema = z.object(baseServiceSchema);

const updateServiceSchema = z.object({
  ...Object.entries(baseServiceSchema).reduce((acc, [key, schema]) => ({
    ...acc,
    [key]: schema.optional()
  }), {})
});

interface ValidationErrors {
  title: string[];
  description: string[];
  category: string[];
  price: string[];
  duration: string[];
  status: string[];
  general: string[];
}

export function validateServiceData(
  data: CreateServiceParams | UpdateServiceParams,
  isUpdate = false
): ServiceValidation {
  try {
    const schema = isUpdate ? updateServiceSchema : createServiceSchema;
    schema.parse(data);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {
        title: [],
        description: [],
        category: [],
        price: [],
        duration: [],
        status: [],
        general: []
      };
      
      error.errors.forEach(err => {
        const path = err.path[0] as keyof ValidationErrors;
        if (path in errors) {
          errors[path].push(err.message);
        } else {
          errors.general.push(err.message);
        }
      });

      const filteredErrors = Object.fromEntries(
        Object.entries(errors).filter(([_, messages]) => messages.length > 0)
      ) as ServiceValidation['errors'];

      return {
        isValid: false,
        errors: filteredErrors
      };
    }

    return {
      isValid: false,
      errors: {
        general: ['Invalid service data']
      }
    };
  }
}

export function validateServiceId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
