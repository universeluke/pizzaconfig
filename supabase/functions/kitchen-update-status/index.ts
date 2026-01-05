import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowed = new Set(["todo", "in_progress", "done"]);

Deno.serve(async (req) => {
  const kitchenKey = req.headers.get("x-kitchen-key");

  if (kitchenKey !== Deno.env.get("KITCHEN_KEY")) {
    return new Response("unauthorized", { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const orderId = body?.orderId;
  const status = body?.status;

  if (!orderId || !allowed.has(status)) {
    return new Response("bad request", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id,status")
    .single();

  if (error) return new Response(error.message, { status: 400 });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});