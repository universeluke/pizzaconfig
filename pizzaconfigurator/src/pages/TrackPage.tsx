import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BurgerMenu from "../components/BurgerMenu";

export default function TrackPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);

  async function load() {
    if (!orderId) return;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setOrder(data);
  }

  useEffect(() => {
    if (!orderId) return;

    load();

    const channel = supabase
      .channel(`track-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <div>
      <BurgerMenu />
      <h2>track order</h2>

      {!order ? (
        <div>loading...</div>
      ) : (
        <>
          <div>order: {order.id}</div>
          <div>status: {order.status}</div>
        </>
      )}
    </div>
  );
}
