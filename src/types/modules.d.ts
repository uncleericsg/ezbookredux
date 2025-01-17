declare module '@server/types/*' {
  export * from '../types/*';
}

declare module '@shared/types/*' {
  export * from '../types/*';
}

declare module '@/server/config/supabase/client' {
  export { supabaseClient, supabaseAdmin } from '../config/supabase/client';
}

declare module '@/types/database' {
  export * from '../types/database';
}

declare module '@/types/error' {
  export * from '../types/error';
}

declare module '@/server/utils/*' {
  export * from '../utils/*';
}

declare module '@/shared/utils/*' {
  export * from '../utils/*';
}

declare module '@/server/services/*' {
  export * from '../services/*';
}

declare module '@/shared/services/*' {
  export * from '../services/*';
}