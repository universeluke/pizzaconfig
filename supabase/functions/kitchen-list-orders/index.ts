import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-kitchen-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
if (req.method === "OPTIONS") {
  return new Response(null, {headers: corsHeaders})
}

  const kitchenKey = req.headers.get("x-kitchen-key");

  if (kitchenKey !== Deno.env.get("KITCHEN_KEY")) {
    return new Response("unauthorized", { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase
    .from("orders")
    .select("id,status,user_id,pizza,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return new Response(error.message, { status: 400, headers: corsHeaders });
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});