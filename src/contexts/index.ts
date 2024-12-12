// Re-export everything from both contexts
export * from './BasicUserContext';
export * from './CombinedUserContext';

// Export the main useUser hook that should be used by components
export { useUser } from './CombinedUserContext';
