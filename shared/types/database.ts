/**
 * Database schema types
 */
export interface Tables {
  users: {
    Row: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      phone: string | null;
      role: 'admin' | 'user' | 'technician' | 'guest';
      status: 'active' | 'inactive' | 'suspended';
      createdAt: string;
      updatedAt: string;
    };
    Insert: Omit<Tables['users']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
    Update: Partial<Tables['users']['Insert']>;
  };
  bookings: {
    Row: {
      id: string;
      userId: string;
      serviceId: string;
      status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
      scheduledAt: string;
      notes: string | null;
      createdAt: string;
      updatedAt: string;
    };
    Insert: Omit<Tables['bookings']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
    Update: Partial<Tables['bookings']['Insert']>;
  };
  services: {
    Row: {
      id: string;
      title: string;
      description: string;
      price: number;
      duration: number;
      category: string;
      status: 'active' | 'inactive';
      createdAt: string;
      updatedAt: string;
    };
    Insert: Omit<Tables['services']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
    Update: Partial<Tables['services']['Insert']>;
  };
  payments: {
    Row: {
      id: string;
      bookingId: string;
      amount: number;
      currency: string;
      status: 'pending' | 'completed' | 'failed' | 'refunded';
      provider: 'stripe' | 'cash';
      providerPaymentId: string | null;
      createdAt: string;
      updatedAt: string;
    };
    Insert: Omit<Tables['payments']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
    Update: Partial<Tables['payments']['Insert']>;
  };
}

export interface Views {
  [key: string]: {
    Row: Record<string, unknown>;
  };
}

export interface Functions {
  [key: string]: {
    Args: Record<string, unknown>;
    Returns: unknown;
  };
}

export interface Enums {
  [key: string]: string[];
}

/**
 * Complete database interface
 */
export interface Database {
  public: {
    Tables: Tables;
    Views: Views;
    Functions: Functions;
    Enums: Enums;
  };
}
