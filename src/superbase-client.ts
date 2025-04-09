import { createClient } from "@supabase/supabase-js";

const superbaseURL = "https://yvfxngyvtxtdtglimpit.supabase.co"
const superbaseAnonKey = import.meta.env.VITE_SUPERBASE_ANON_KEY as string;

export const superbase = createClient(superbaseURL, superbaseAnonKey);