import type { SupabaseClient } from "@supabase/supabase-js";
import type { Order } from "../../../types/types";
import type { OrderStatus } from "../../../types/types";

export function statusMessage(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    todo: "Your order is in the queue",
    in_progress: "Your pizza is being prepared!",
    cooking: "Your pizza is in the oven!",
    done: "Your pizza is ready for collection!",
    collected: "Enjoy your pizza!",
  };
  return messages[status];
}

export async function signInWithEmail(
  supabase: SupabaseClient,
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

export async function signOutApi(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadOrdersApi(supabase: SupabaseClient): Promise<Order[]> {
  const { data, error } = await supabase.functions.invoke("kitchen-list-orders");
  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  orderId: string,
  status: OrderStatus,
) {
  const { error } = await supabase.functions.invoke("kitchen-update-status", {
    body: { orderId, status },
  });
  if (error) throw error;
}

export async function sendStatusPush(
  userId: string,
  status: OrderStatus,
  pushServerBaseUrl = "http://localhost:3001",
) {
  await fetch(`${pushServerBaseUrl}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      title: "pizza update",
      body: statusMessage(status),
    }),
  });
}