import type { User, Session } from '@supabase/supabase-js';

declare module '@supabase/supabase-js' {
  interface GoTrueAdminApi {
    /**
     * Create a new user
     */
    createUser(attributes: {
      email?: string;
      phone?: string;
      password?: string;
      email_confirm?: boolean;
      phone_confirm?: boolean;
      user_metadata?: Record<string, any>;
    }): Promise<{
      data: { user: User } | null;
      error: Error | null;
    }>;

    /**
     * Update a user
     */
    updateUserById(
      id: string,
      attributes: {
        email?: string;
        phone?: string;
        password?: string;
        email_confirm?: boolean;
        phone_confirm?: boolean;
        user_metadata?: Record<string, any>;
      }
    ): Promise<{
      data: { user: User } | null;
      error: Error | null;
    }>;

    /**
     * Delete a user
     */
    deleteUser(id: string): Promise<{
      data: null;
      error: Error | null;
    }>;

    /**
     * Get user by ID
     */
    getUserById(id: string): Promise<{
      data: { user: User } | null;
      error: Error | null;
    }>;

    /**
     * List users
     */
    listUsers(params?: PageParams): Promise<{
      data: { users: User[] };
      error: Error | null;
    }>;

    /**
     * Sign out user
     */
    signOut(token: string): Promise<{
      error: Error | null;
    }>;
  }

  interface User {
    id: string;
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      name?: string;
      role?: string;
      status?: string;
      [key: string]: any;
    };
    aud: string;
    email?: string;
    phone?: string;
    created_at: string;
    confirmed_at?: string;
    email_confirmed_at?: string;
    phone_confirmed_at?: string;
    last_sign_in_at?: string;
    role?: string;
    updated_at?: string;
  }

  interface Session {
    id: string;
    user_id: string;
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    expires_at?: number;
    user: User;
  }

  interface PageParams {
    page?: number;
    perPage?: number;
    query?: string;
    email?: string;
    phone?: string;
    filters?: Record<string, any>;
  }

  interface SupabaseAuthClient {
    /**
     * Get session
     */
    getSession(): Promise<{
      data: { session: Session | null };
      error: Error | null;
    }>;

    /**
     * Get user
     */
    getUser(token: string): Promise<{
      data: { user: User | null };
      error: Error | null;
    }>;

    /**
     * Refresh session
     */
    refreshSession(params: {
      refresh_token: string;
    }): Promise<{
      data: { session: Session | null };
      error: Error | null;
    }>;

    /**
     * Sign in with user ID
     */
    signInWithUserId(userId: string): Promise<{
      data: { session: Session | null };
      error: Error | null;
    }>;

    /**
     * Sign out
     */
    signOut(): Promise<{
      error: Error | null;
    }>;
  }
}
