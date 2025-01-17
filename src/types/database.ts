import type { SupabaseClient } from '@supabase/supabase-js';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          userId: string;
          serviceId: string;
          scheduledAt: string;
          status: string;
          totalAmount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          userId: string;
          serviceId: string;
          scheduledAt: string;
          status?: string;
          totalAmount: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          userId?: string;
          serviceId?: string;
          scheduledAt?: string;
          status?: string;
          totalAmount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          duration: number;
          categoryId: string | null;
          isActive: boolean;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          duration: number;
          categoryId?: string | null;
          isActive?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          duration?: number;
          categoryId?: string | null;
          isActive?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      service_categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parentId: string | null;
          isActive: boolean;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parentId?: string | null;
          isActive?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parentId?: string | null;
          isActive?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      service_ratings: {
        Row: {
          id: string;
          bookingId: string;
          userId: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          bookingId: string;
          userId: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          bookingId?: string;
          userId?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          isActive: boolean;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          isActive?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          isActive?: boolean;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      team_members: {
        Row: {
          id: string;
          teamId: string;
          userId: string;
          role: string;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          teamId: string;
          userId: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          teamId?: string;
          userId?: string;
          role?: string;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      time_slots: {
        Row: {
          id: string;
          serviceId: string | null;
          technicianId: string | null;
          startTime: string;
          endTime: string;
          isAvailable: boolean;
          isPeakHour: boolean;
          priceMultiplier: number;
          status: string;
          blockReason: string | null;
          duration: number | null;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          serviceId?: string | null;
          technicianId?: string | null;
          startTime: string;
          endTime: string;
          isAvailable?: boolean;
          isPeakHour?: boolean;
          priceMultiplier?: number;
          status?: string;
          blockReason?: string | null;
          duration?: number | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          serviceId?: string | null;
          technicianId?: string | null;
          startTime?: string;
          endTime?: string;
          isAvailable?: boolean;
          isPeakHour?: boolean;
          priceMultiplier?: number;
          status?: string;
          blockReason?: string | null;
          duration?: number | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
      service_configs: {
        Row: {
          id: string;
          serviceId: string;
          enabled: boolean;
          apiKey: string | null;
          settings: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
          metadata: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          serviceId: string;
          enabled?: boolean;
          apiKey?: string | null;
          settings?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          serviceId?: string;
          enabled?: boolean;
          apiKey?: string | null;
          settings?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, unknown> | null;
        };
      };
    };
  };
}

export type DbClient = SupabaseClient<Database>; 