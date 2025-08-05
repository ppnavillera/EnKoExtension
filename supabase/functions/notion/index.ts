// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getErrorMessage } from "../_shared/utils.ts";
import { handleNotionRequest } from "../_shared/api/notion.ts";
import { UserService } from "../_shared/services/UserService.ts";

console.log(`Function "browser-with-cors" up and running!`);

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method === "POST") {
    try {
      const { data, userId } = await req.json();

      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      console.log("Current Supabase URL:", Deno.env.get("SUPABASE_URL"));
      console.log("Received data:", data);
      console.log("User ID:", userId);
      const userService = new UserService();
      const userConfig = await userService.getUserNotionConfig(userId);

      if (!userConfig) {
        return new Response(
          JSON.stringify({ error: "User Notion configuration not found" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          },
        );
      }

      // const result = userConfig;
      const result = await handleNotionRequest(data, userConfig, userId);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
  }
  return new Response("Not Found", {
    status: 404,
  });
});
