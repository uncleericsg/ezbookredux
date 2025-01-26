declare module '@utils/cn' {
  import { ClassValue } from 'clsx';
  export function cn(...inputs: ClassValue[]): string;
  export default cn;
}