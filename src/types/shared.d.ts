declare module 'shared' {
  export * from '@/shared/types';
}

declare module '@shared/*' {
  const content: any;
  export default content;
}

declare module '@/shared/types' {
  export * from '@/types/booking';
  export * from '@/types/settings';
  export * from '@/types/holiday';
  export * from '@/types/error';
  export * from '@/types/admin';
}