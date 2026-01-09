import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BurgerMenu from "../components/BurgerMenu";

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("id,status,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      return;
    }

    setOrders(data);
  }

  loadOrders();

  return (
    <div>
      <BurgerMenu />
      <h2>order history</h2>

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
