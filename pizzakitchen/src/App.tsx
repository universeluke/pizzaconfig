import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Column from "./components/Column";

type Order = {
  id: string;
  status: "todo" | "in_progress" | "done";
  pizza: any;
};

const KITCHEN_KEY = import.meta.env.VITE_KITCHEN_KEY;

export default function App() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadOrders() {
    const { data, error } = await supabase.functions.invoke(
      "kitchen-list-orders",
      {
        headers: { "x-kitchen-key": KITCHEN_KEY },
      }
    );
    if (error) {
      alert(error.message);
      return;
    }
    setOrders(data);
  }

  async function updateStatus(id: string, status: Order["status"]) {
    const { error } = await supabase.functions.invoke("kitchen-update-status", {
      headers: { "x-kitchen-key": KITCHEN_KEY },
      body: { orderId: id, status },
    });

    if (error) {
      alert(error.message);
      return;
    }
    loadOrders();
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const todo = orders.filter((order) => order.status === "todo");

  const inProgress = orders.filter((order) => order.status === "in_progress");

  const done = orders.filter((order) => order.status === "done");

  return (
    <div>
      <h2>Kitchen</h2>
      <button onClick={loadOrders}>Refresh</button>
      <Column
        title="To do"
        orders={todo}
        onNext={(id) => updateStatus(id, "in_progress")}
      />
      <Column
        title="In progress"
        orders={inProgress}
        onPrev={(id) => updateStatus(id, "todo")}
        onNext={(id) => updateStatus(id, "done")}
      />
      <Column
        title="Done"
        orders={done}
        onPrev={(id) => updateStatus(id, "in_progress")}
      />
    </div>
  );
}
