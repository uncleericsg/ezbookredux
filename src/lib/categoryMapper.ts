interface AppointmentType {
  id: string;
  name: string;
  duration: string;
  price: number | null;
  calendarId?: string;
  description?: string;
}

interface CategoryMap {
  [key: string]: AppointmentType;
}

// Define appointment types for different service categories
const appointmentTypes: CategoryMap = {
  regular: {
    id: 'regular-service',
    name: 'Regular Maintenance',
    duration: '1-2 hours',
    price: 60,
    calendarId: 'regular-maintenance',
    description: 'Standard aircon servicing and maintenance'
  },
  repair: {
    id: 'repair-service',
    name: 'Repair Service',
    duration: '2-4 hours',
    price: 120,
    calendarId: 'repair-service',
    description: 'Diagnostic and repair service for faulty units'
  },
  amc: {
    id: 'amc-service',
    name: 'AMC Service Visit',
    duration: '1-2 hours',
    price: null, // Free for AMC customers
    calendarId: 'amc-service',
    description: 'Scheduled maintenance visit for AMC package holders'
  },
  chemical: {
    id: 'chemical-wash',
    name: 'Chemical Wash',
    duration: '3-4 hours',
    price: 160,
    calendarId: 'chemical-wash',
    description: 'Deep cleaning service using chemical solutions'
  },
  installation: {
    id: 'installation',
    name: 'New Installation',
    duration: '4-6 hours',
    price: 350,
    calendarId: 'installation',
    description: 'Installation service for new air conditioning units'
  }
};

class CategoryMapper {
  // Get appointment type details based on category ID
  getAppointmentTypeDetails(categoryId: string): AppointmentType | undefined {
    return appointmentTypes[categoryId];
  }

  // Get duration in minutes (for scheduling)
  getDurationInMinutes(categoryId: string): number {
    const appointmentType = this.getAppointmentTypeDetails(categoryId);
    if (!appointmentType) return 60; // Default to 1 hour

    // Parse duration string (e.g., "1-2 hours" -> take the maximum value)
    const durationMatch = appointmentType.duration.match(/(\d+)-?(\d+)?\s*hours?/i);
    if (!durationMatch) return 60;

    const maxDuration = durationMatch[2] || durationMatch[1];
    return parseInt(maxDuration) * 60;
  }

  // Check if a category requires pre-inspection
  requiresPreInspection(categoryId: string): boolean {
    return ['installation', 'repair'].includes(categoryId);
  }

  // Get base price for a category
  getBasePrice(categoryId: string): number | null {
    const appointmentType = this.getAppointmentTypeDetails(categoryId);
    return appointmentType?.price || null;
  }

  // Get all available categories
  getAllCategories(): AppointmentType[] {
    return Object.values(appointmentTypes);
  }

  // Check if a category is available for AMC customers
  isAmcEligible(categoryId: string): boolean {
    return categoryId === 'amc' || categoryId === 'regular';
  }
}

// Export a singleton instance
export const categoryMapper = new CategoryMapper();
