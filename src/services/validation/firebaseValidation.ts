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
        role: user.role || 'user',
        status: user.status || 'active',
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString()
      };

      return validatedUser;
    } catch (error) {
      throw new Error(`User validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};
