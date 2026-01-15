import type { SupabaseClient } from "@supabase/supabase-js";
import type { BasketItem } from "../store/basketSlice";

type Result =
  | { ok: true }
  | { ok: false; message: string };

export async function placeOrder(
  supabase: SupabaseClient,
  userId: string,
  items: BasketItem[]
): Promise<Result> {
  if (!userId) return { ok: false, message: "not signed in" };
  if (items.length === 0) return { ok: false, message: "basket is empty" };

  const rows = items.map((item) => ({
    user_id: userId,
    pizza: item.pizza,
  }));

  const { error } = await supabase.from("orders").insert(rows);

  if (error) return { ok: false, message: error.message };

  return { ok: true };
}