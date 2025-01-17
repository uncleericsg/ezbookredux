import { supabaseClient } from '@/config/supabase/client';

export class DB {
  private client = supabaseClient;

  get notifications() {
    return this.client.from('notifications');
  }

  get users() {
    return this.client.from('users');
  }

  get bookings() {
    return this.client.from('bookings');
  }

  get serviceVisits() {
    return this.client.from('service_visits');
  }

  get teams() {
    return this.client.from('teams');
  }

  get teamMembers() {
    return this.client.from('team_members');
  }

  get teamAssignments() {
    return this.client.from('team_assignments');
  }

  get holidays() {
    return this.client.from('holidays');
  }

  get timeSlots() {
    return this.client.from('time_slots');
  }
}

export const db = new DB(); 