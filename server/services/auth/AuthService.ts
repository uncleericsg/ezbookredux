import { supabaseAdmin } from '@server/config/supabase/client';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import type { 
  User,
  Session,
  AuthToken,
  UserProfile,
  AuthService as IAuthService
} from '@shared/types/auth';
import type { User as AuthUser } from '@supabase/supabase-js';

export class AuthService implements IAuthService {
  async createUser(data: Partial<User>): Promise<User> {
    try {
      logger.info('Creating user', { email: data.email });

      const { data: { user }, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.passwordHash,
        email_confirm: true,
        user_metadata: {
          name: data.name,
          phone: data.phone,
          role: data.role || 'customer',
          status: data.status || 'active'
        }
      });

      if (error) {
        logger.error('User creation failed', { error, email: data.email });
        throw new ApiError('Failed to create user', 'VALIDATION_ERROR');
      }

      if (!user) {
        logger.error('User creation failed - no user returned', { email: data.email });
        throw new ApiError('Failed to create user', 'VALIDATION_ERROR');
      }

      logger.info('User created', { userId: user.id });
      return this.mapUser(user);
    } catch (error) {
      logger.error('User creation error', { error, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create user', 'VALIDATION_ERROR');
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    try {
      logger.info('Updating user', { userId: id });

      const { data: { user }, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        email: data.email,
        password: data.passwordHash,
        user_metadata: {
          name: data.name,
          phone: data.phone,
          role: data.role,
          status: data.status
        }
      });

      if (error) {
        logger.error('User update failed', { error, userId: id });
        throw new ApiError('Failed to update user', 'VALIDATION_ERROR');
      }

      if (!user) {
        logger.error('User update failed - no user returned', { userId: id });
        throw new ApiError('Failed to update user', 'VALIDATION_ERROR');
      }

      logger.info('User updated', { userId: id });
      return this.mapUser(user);
    } catch (error) {
      logger.error('User update error', { error, userId: id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update user', 'VALIDATION_ERROR');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      logger.info('Deleting user', { userId: id });

      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

      if (error) {
        logger.error('User deletion failed', { error, userId: id });
        throw new ApiError('Failed to delete user', 'VALIDATION_ERROR');
      }

      logger.info('User deleted', { userId: id });
    } catch (error) {
      logger.error('User deletion error', { error, userId: id });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete user', 'VALIDATION_ERROR');
    }
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      logger.info('Finding user by ID', { userId: id });

      const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(id);

      if (error) {
        logger.error('User lookup failed', { error, userId: id });
        throw new ApiError('Failed to find user', 'NOT_FOUND');
      }

      if (!user) {
        logger.info('User not found', { userId: id });
        return null;
      }

      logger.info('User found', { userId: id });
      return this.mapUser(user);
    } catch (error) {
      logger.error('User lookup error', { error, userId: id });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to find user', 'NOT_FOUND');
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      logger.info('Finding user by email', { email });

      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
        filters: { email }
      });

      if (error) {
        logger.error('User lookup failed', { error, email });
        throw new ApiError('Failed to find user', 'NOT_FOUND');
      }

      if (!users || users.length === 0) {
        logger.info('User not found', { email });
        return null;
      }

      logger.info('User found', { userId: users[0].id });
      return this.mapUser(users[0]);
    } catch (error) {
      logger.error('User lookup error', { error, email });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to find user', 'NOT_FOUND');
    }
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    try {
      logger.info('Finding user by phone', { phone });

      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
        filters: { phone }
      });

      if (error) {
        logger.error('User lookup failed', { error, phone });
        throw new ApiError('Failed to find user', 'NOT_FOUND');
      }

      if (!users || users.length === 0) {
        logger.info('User not found', { phone });
        return null;
      }

      logger.info('User found', { userId: users[0].id });
      return this.mapUser(users[0]);
    } catch (error) {
      logger.error('User lookup error', { error, phone });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to find user', 'NOT_FOUND');
    }
  }

  async createSession(userId: string, data: Partial<Session>): Promise<Session> {
    try {
      logger.info('Creating session', { userId });

      // Use signInWithUserId instead of createSession
      const { data: { session }, error } = await supabaseAdmin.auth.signInWithUserId(userId);

      if (error) {
        logger.error('Session creation failed', { error, userId });
        throw new ApiError('Failed to create session', 'VALIDATION_ERROR');
      }

      if (!session) {
        logger.error('Session creation failed - no session returned', { userId });
        throw new ApiError('Failed to create session', 'VALIDATION_ERROR');
      }

      logger.info('Session created', { sessionId: session.id });
      return this.mapSession(session);
    } catch (error) {
      logger.error('Session creation error', { error, userId, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create session', 'VALIDATION_ERROR');
    }
  }

  async updateSession(id: string, data: Partial<Session>): Promise<Session> {
    try {
      logger.info('Updating session', { sessionId: id });

      // Supabase doesn't provide direct session update
      // We'll need to revoke and create new session
      await this.revokeToken(id);
      const session = await this.createSession(data.userId!, data);

      logger.info('Session updated', { sessionId: session.id });
      return session;
    } catch (error) {
      logger.error('Session update error', { error, sessionId: id, data });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update session', 'VALIDATION_ERROR');
    }
  }

  async deleteSession(id: string): Promise<void> {
    try {
      logger.info('Deleting session', { sessionId: id });

      // Use signOut instead of deleteSession
      const { error } = await supabaseAdmin.auth.signOut();

      if (error) {
        logger.error('Session deletion failed', { error, sessionId: id });
        throw new ApiError('Failed to delete session', 'VALIDATION_ERROR');
      }

      logger.info('Session deleted', { sessionId: id });
    } catch (error) {
      logger.error('Session deletion error', { error, sessionId: id });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete session', 'VALIDATION_ERROR');
    }
  }

  async findSessionById(id: string): Promise<Session | null> {
    try {
      logger.info('Finding session by ID', { sessionId: id });

      // Use getSession without ID
      const { data: { session }, error } = await supabaseAdmin.auth.getSession();

      if (error) {
        logger.error('Session lookup failed', { error, sessionId: id });
        throw new ApiError('Failed to find session', 'NOT_FOUND');
      }

      if (!session) {
        logger.info('Session not found', { sessionId: id });
        return null;
      }

      logger.info('Session found', { sessionId: session.id });
      return this.mapSession(session);
    } catch (error) {
      logger.error('Session lookup error', { error, sessionId: id });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to find session', 'NOT_FOUND');
    }
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    try {
      logger.info('Finding session by token');

      const { data: { session }, error } = await supabaseAdmin.auth.getSession();

      if (error) {
        logger.error('Session lookup failed', { error });
        throw new ApiError('Failed to find session', 'NOT_FOUND');
      }

      if (!session) {
        logger.info('Session not found');
        return null;
      }

      logger.info('Session found', { sessionId: session.id });
      return this.mapSession(session);
    } catch (error) {
      logger.error('Session lookup error', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to find session', 'NOT_FOUND');
    }
  }

  async createToken(user: User, session: Session): Promise<AuthToken> {
    try {
      logger.info('Creating token', { userId: user.id });

      // Use signInWithUserId instead of createSession
      const { data: { session: newSession }, error } = await supabaseAdmin.auth.signInWithUserId(user.id);

      if (error) {
        logger.error('Token creation failed', { error, userId: user.id });
        throw new ApiError('Failed to create token', 'VALIDATION_ERROR');
      }

      if (!newSession) {
        logger.error('Token creation failed - no session returned', { userId: user.id });
        throw new ApiError('Failed to create token', 'VALIDATION_ERROR');
      }

      logger.info('Token created', { userId: user.id });
      return {
        accessToken: newSession.access_token,
        refreshToken: newSession.refresh_token!,
        tokenType: 'Bearer',
        expiresIn: 3600
      };
    } catch (error) {
      logger.error('Token creation error', { error, userId: user.id });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create token', 'VALIDATION_ERROR');
    }
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      logger.info('Verifying token');

      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

      if (error) {
        logger.error('Token verification failed', { error });
        throw new ApiError('Invalid token', 'UNAUTHORIZED');
      }

      if (!user) {
        logger.error('Token verification failed - no user found');
        throw new ApiError('Invalid token', 'UNAUTHORIZED');
      }

      logger.info('Token verified', { userId: user.id });
      return {
        id: user.id,
        email: user.email!,
        role: (user.user_metadata?.role || 'customer') as User['role'],
        permissions: []
      };
    } catch (error) {
      logger.error('Token verification error', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Token verification failed', 'UNAUTHORIZED');
    }
  }

  async verifyApiKey(apiKey: string): Promise<UserProfile> {
    try {
      logger.info('Verifying API key');

      // Implement API key verification logic
      throw new ApiError('API key verification not implemented', 'UNAUTHORIZED');
    } catch (error) {
      logger.error('API key verification error', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('API key verification failed', 'UNAUTHORIZED');
    }
  }

  async verifySession(sessionId: string): Promise<UserProfile> {
    try {
      logger.info('Verifying session', { sessionId });

      const { data: { session }, error } = await supabaseAdmin.auth.getSession();

      if (error) {
        logger.error('Session verification failed', { error, sessionId });
        throw new ApiError('Invalid session', 'UNAUTHORIZED');
      }

      if (!session) {
        logger.error('Session verification failed - no session found', { sessionId });
        throw new ApiError('Invalid session', 'UNAUTHORIZED');
      }

      const user = await this.findUserById(session.user.id);
      if (!user) {
        logger.error('Session verification failed - no user found', { sessionId });
        throw new ApiError('Invalid session', 'UNAUTHORIZED');
      }

      logger.info('Session verified', { sessionId, userId: user.id });
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: []
      };
    } catch (error) {
      logger.error('Session verification error', { error, sessionId });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Session verification failed', 'UNAUTHORIZED');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      logger.info('Refreshing token');

      const { data: { session }, error } = await supabaseAdmin.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        logger.error('Token refresh failed', { error });
        throw new ApiError('Failed to refresh token', 'UNAUTHORIZED');
      }

      if (!session) {
        logger.error('Token refresh failed - no session returned');
        throw new ApiError('Failed to refresh token', 'UNAUTHORIZED');
      }

      logger.info('Token refreshed');
      return {
        accessToken: session.access_token,
        refreshToken: session.refresh_token!,
        tokenType: 'Bearer',
        expiresIn: 3600
      };
    } catch (error) {
      logger.error('Token refresh error', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Token refresh failed', 'UNAUTHORIZED');
    }
  }

  async revokeToken(token: string): Promise<void> {
    try {
      logger.info('Revoking token');

      const { error } = await supabaseAdmin.auth.signOut();

      if (error) {
        logger.error('Token revocation failed', { error });
        throw new ApiError('Failed to revoke token', 'VALIDATION_ERROR');
      }

      logger.info('Token revoked');
    } catch (error) {
      logger.error('Token revocation error', { error });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Token revocation failed', 'VALIDATION_ERROR');
    }
  }

  private mapUser(authUser: AuthUser): User {
    return {
      id: authUser.id,
      email: authUser.email!,
      name: authUser.user_metadata?.name || '',
      phone: authUser.phone || undefined,
      role: (authUser.user_metadata?.role || 'customer') as User['role'],
      status: (authUser.user_metadata?.status || 'active') as User['status'],
      emailVerified: !!authUser.email_confirmed_at,
      phoneVerified: !!authUser.phone_confirmed_at,
      lastLoginAt: authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : undefined,
      createdAt: new Date(authUser.created_at),
      updatedAt: authUser.updated_at ? new Date(authUser.updated_at) : new Date(authUser.created_at)
    };
  }

  private mapSession(authSession: any): Session {
    return {
      id: authSession.id,
      userId: authSession.user.id,
      token: authSession.access_token,
      provider: 'email',
      method: 'password',
      ipAddress: '',
      userAgent: '',
      expiresAt: new Date(Date.now() + 3600 * 1000),
      lastActivityAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

export const authService = new AuthService();
