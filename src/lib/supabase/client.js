import { createBrowserClient } from "@supabase/ssr";

// Frontend (browser) ke liye Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}