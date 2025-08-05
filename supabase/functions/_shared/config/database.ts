// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// export function createSupabaseClient() {
//   const supabaseUrl = Deno.env.get("SUPABASE_URL");
//   const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

//   if (!supabaseUrl || !supabaseKey) {
//     throw new Error("Missing Supabase environment variables");
//   }

//   console.log("Creating Supabase client with URL:", supabaseUrl);
//   console.log("Using Supabase key:", supabaseKey);
//   return createClient(supabaseUrl, supabaseKey);
// }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  console.log("Creating Supabase client with URL:", supabaseUrl);
  console.log(
    "Using Supabase service role key:",
    supabaseServiceKey.substring(0, 20) + "...",
  );

  return createClient(supabaseUrl, supabaseServiceKey);
}
