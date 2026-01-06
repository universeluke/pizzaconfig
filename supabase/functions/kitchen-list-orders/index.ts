import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
if (req.method === "OPTIONS") {
  return new Response(null, {headers: corsHeaders})
}

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response("Missing Authorization header", {
      status: 401,
      headers: corsHeaders,
    });
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await userClient.auth.getUser();

  if (userErr || !userData?.user) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }

  const userId = userData.user.id;
  const adminClient = createClient(supabaseUrl, serviceKey);
  const { data: profile, error: profErr } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profErr || !profile || profile.role !== "kitchen") {
    return new Response("Forbidden", { status: 403, headers: corsHeaders });
  }

  const { data: orders, error: ordersErr } = await adminClient
    .from("orders")
    .select("id,status,user_id,pizza,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (ordersErr) {
    return new Response(ordersErr.message, { status: 400, headers: corsHeaders });
  }
  
  return new Response(JSON.stringify(orders), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});