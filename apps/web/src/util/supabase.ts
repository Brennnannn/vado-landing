/**
 * Supabase client for the public site. Anonymous only - no auth, no sessions. It only inserts
 * diagnostic requests (RLS allows insert, nothing else) and resolves public storage URLs.
 *
 * Null when the env vars aren't set, so the site still runs locally before the project exists;
 * callers decide how to degrade.
 */
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && publishableKey
    ? createClient(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

/** Public URL for an object in the `public-assets` bucket, e.g. `founders/brennan.jpg` */
export function publicAssetUrl(path: string) {
    return supabase?.storage.from("public-assets").getPublicUrl(path).data.publicUrl ?? null;
}
