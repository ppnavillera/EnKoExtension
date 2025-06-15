// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { getErrorMessage } from "../_shared/utils.ts";
import { handleDictionaryRequest } from "../_shared/api/dictionary.ts";
import { handleGeminiRequest } from "../_shared/api/gemini.ts";
console.log(`Function "browser-with-cors" up and running!`);

async function handleNotionPost(req: Request): Promise<Response> {
    try {
        const request = await req.json();
        const newWord = request.word;

        const result = await handleDictionaryRequest(newWord);

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

async function handleGeminiPost(req: Request): Promise<Response> {
    try {
        const request = await req.json();
        const newWord = request.word;

        const result = await handleGeminiRequest(newWord);

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

Deno.serve(async (req) => {
    // This is needed if you're planning to invoke your function from a browser.
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (req.method === "POST") {
        const url = new URL(req.url);
        if (url.pathname === "/notion") {
            return await handleNotionPost(req);
        } else if (url.pathname === "/gemini") {
            return await handleGeminiPost(req);
        }
    }
    return new Response("Not Found", {
        status: 404,
    });
});
