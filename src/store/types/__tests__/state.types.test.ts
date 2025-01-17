import { UserState } from '../redux';

describe('State Types', () => {
  const testUser = {
    user: null,
    isLoading: false,
    error: null,
    paymentStatus: 'idle' as const,
    verificationId: null,
    phone: null
  };

  it('should handle user state', () => {
    const state = {
      user: testUser
    };

    const { user, isLoading, error } = state.user;
    expect(user).toBeNull();
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });
});
