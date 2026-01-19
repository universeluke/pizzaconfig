import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BurgerMenu from "../components/BurgerMenu";
import PizzaVisualiser from "../components/PizzaVisualiser";

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
        () => load(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return (
    <div>
      <BurgerMenu />
      <h2>TRACK ORDER</h2>
      {!order ? (
        <div>loading...</div>
      ) : (
        <>
          {order.status === "todo" && (
            <>
              <div>YOUR ORDER IS IN THE QUEUE</div>
            </>
          )}
          {order.status === "in_progress" && (
            <>
              <div>YOUR ORDER IS BEING MADE</div>
              <PizzaVisualiser pizza={order.pizza} cookStage="making" />
            </>
          )}
          {order.status === "cooking" && (
            <>
              <div>YOUR ORDER IS IN THE OVEN</div>
              <PizzaVisualiser pizza={order.pizza} cookStage="oven" />
            </>
          )}
          {order.status === "done" && (
            <>
              <div>YOUR ORDER IS READY FOR COLLECTION!</div>

              <PizzaVisualiser pizza={order.pizza} cookStage="ready" />
            </>
          )}
        </>
      )}
    </div>
  );
}
