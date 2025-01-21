import type { 
  Service,
  ServiceCategory,
  ServiceStatus
} from '@shared/types/service';

export interface Database {
  public: {
    Tables: {
      services: {
        Row: Service;
        Insert: {
          title: string;
          description: string;
          category: ServiceCategory;
          price: number;
          duration: number;
          status?: ServiceStatus;
          image_url?: string;
          technician_requirements?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: ServiceCategory;
          price?: number;
          duration?: number;
          status?: ServiceStatus;
          image_url?: string;
          technician_requirements?: string[];
          updated_at?: string;
        };
      };
    };
  };
}
