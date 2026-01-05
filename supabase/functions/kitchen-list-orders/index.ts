import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const kitchenKey = req.headers.get("x-kitchen-key");

  if (kitchenKey !== Deno.env.get("KITCHEN_KEY")) {
    return new Response("unauthorized", { status: 401 });
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

  if (error) return new Response(error.message, { status: 400 });
  
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});