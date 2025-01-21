declare module 'server' {
  export * from '@/server/types';
}

declare module '@server/*' {
  const content: any;
  export default content;
}