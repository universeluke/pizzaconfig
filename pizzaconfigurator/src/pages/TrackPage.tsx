import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BurgerMenu from "../components/BurgerMenu";
import PizzaVisualiser from "../components/PizzaVisualiser";
import styles from "./TrackPage.module.css";

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
      <h2 className={styles.title}>
        <span className={styles.titleGreen}>TRACK</span>
        <br />
        <span className={styles.titleGreen}>YOUR</span>

        <br />
        <span className={styles.titleRed}>PIE</span>
      </h2>
      {!order ? (
        <div>loading...</div>
      ) : (
        <>
          {order.status === "todo" && (
            <div className={styles.trackContainer}>
              <h3 className={styles.orderMessage}>YOUR PIE IS IN THE QUEUE</h3>
            </div>
          )}
          {order.status === "in_progress" && (
            <div className={styles.trackContainer}>
              <PizzaVisualiser pizza={order.pizza} cookStage="making" />
              <h3 className={styles.orderMessage}>YOUR PIE IS BEING MADE</h3>
            </div>
          )}
          {order.status === "cooking" && (
            <div className={styles.trackContainer}>
              <PizzaVisualiser pizza={order.pizza} cookStage="oven" />
              <h3 className={styles.orderMessage}>YOUR PIE IS IN THE OVEN</h3>
            </div>
          )}
          {order.status === "done" && (
            <div className={styles.trackContainer}>
              <PizzaVisualiser pizza={order.pizza} cookStage="ready" />
              <h3 className={styles.orderMessage}>
                YOUR PIE IS READY FOR COLLECTION!
              </h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}
