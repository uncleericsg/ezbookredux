import { supabaseClient } from '@server/config/supabase/client';
import { createApiError } from '@server/utils/apiResponse';
import { logger } from '@server/utils/logger';
import { User } from '@shared/types/user';

export class AuthService {
	async signIn(email: string, password: string) {
		try {
			const { data: { user }, error } = await supabaseClient.auth.signInWithPassword({
				email,
				password
			});

			if (error) throw error;
			if (!user) throw createApiError('Authentication failed', 'AUTH_ERROR');

			return user;
		} catch (error) {
			logger.error('Sign in error:', error);
			throw createApiError('Authentication failed', 'AUTH_ERROR');
		}
	}

	async signUp(email: string, password: string, userData: Partial<User>) {
		try {
			const { data: { user }, error } = await supabaseClient.auth.signUp({
				email,
				password,
				options: {
					data: userData
				}
			});

			if (error) throw error;
			if (!user) throw createApiError('Registration failed', 'AUTH_ERROR');

			return user;
		} catch (error) {
			logger.error('Sign up error:', error);
			throw createApiError('Registration failed', 'AUTH_ERROR');
		}
	}

	async resetPassword(email: string) {
		try {
			const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
			if (error) throw error;
		} catch (error) {
			logger.error('Password reset error:', error);
			throw createApiError('Password reset failed', 'AUTH_ERROR');
		}
	}

	async updatePassword(accessToken: string, newPassword: string) {
		try {
			const { error } = await supabaseClient.auth.updateUser({
				password: newPassword
			});

			if (error) throw error;
		} catch (error) {
			logger.error('Password update error:', error);
			throw createApiError('Password update failed', 'AUTH_ERROR');
		}
	}

	async verifySession(accessToken: string) {
		try {
			const { data: { user }, error } = await supabaseClient.auth.getUser(accessToken);
			
			if (error) throw error;
			if (!user) throw createApiError('Invalid session', 'AUTH_ERROR');

			return user;
		} catch (error) {
			logger.error('Session verification error:', error);
			throw createApiError('Session verification failed', 'AUTH_ERROR');
		}
	}
}

export const authService = new AuthService();