import type { User } from '@/types/user';

export const userValidation = {
  validateUserData: async (user: Partial<User>): Promise<User> => {
    try {
      // Basic validation
      if (!user.email || !user.phone || !user.firstName || !user.lastName) {
        throw new Error('Missing required user fields');
      }

      // Format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        throw new Error('Invalid email format');
      }

      // Phone validation (basic)
      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (!phoneRegex.test(user.phone)) {
        throw new Error('Invalid phone format');
      }

      // Create validated user object
      const validatedUser: User = {
        id: user.id || crypto.randomUUID(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role || 'customer',
        status: user.status || 'active',
        amcStatus: user.amcStatus || 'inactive',
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString()
      };

      return validatedUser;
    } catch (error) {
      throw new Error(`User validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};
