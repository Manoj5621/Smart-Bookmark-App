// Lazy load supabase only on client side
// This file must only be imported in client components
let supabaseClient: any = null;

export const getSupabaseClient = async () => {
  // Guard against SSR - return null if not in browser context
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }
  
  if (!supabaseClient) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (supabaseUrl && supabaseAnonKey) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
      }
    } catch (error) {
      console.error('Failed to load Supabase client:', error);
      return null;
    }
  }
  return supabaseClient;
};
