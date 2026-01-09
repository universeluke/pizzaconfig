import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BurgerMenu from "../components/BurgerMenu";

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("id,status,created_at")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      setOrders(data ?? []);
      setLoading(false);
    }

    loadOrders();
  }, []);

  return (
    <div>
      <BurgerMenu />
      <h2>order history</h2>

      {loading && <p>loading...</p>}

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <Link to={`/track/${order.id}`}>
              {order.status} — {order.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
