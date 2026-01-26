import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import PizzaVisualiser from "./PizzaVisualiser";
import type { PizzaConfig } from "../store/pizzaSlice";
import styles from "./RecentPizzaTrack.module.css";

type OrderLite = {
  id: string;
  status: string;
  created_at: string;
  pizza: PizzaConfig;
};

export default function RecentPizzaTrack() {
  const [orders, setOrders] = useState<OrderLite[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        if (!cancelled) {
          setOrders([]);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("id,status,pizza,created_at")
        .eq("user_id", user.id)
        .neq("status", "collected")
        .order("created_at", { ascending: false })
        .limit(10);

      if (cancelled) return;

      if (error) {
        alert(error.message);
        setOrders([]);
        setLoading(false);
        return;
      }

      setOrders(data ?? []);
      setLoading(false);
    }

    loadOrders();

    const channel = supabase
      .channel("recent-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => loadOrders(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  if (!loading && orders.length === 0) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>ORDERS IN PROGRESS</h2>
      {loading && <p>CHECKING YOUR CURRENT ORDERS...</p>}
      {orders.map((o) => (
        <Link key={o.id} to={`/track/${o.id}`}>
          <div className={styles.item}>
            <PizzaVisualiser pizza={o.pizza} size={"small"} />
            <span className={styles.message}>TAP TO VIEW THIS ORDER</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
