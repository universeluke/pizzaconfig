import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Column from "./components/Column";

type Order = {
  id: string;
  status: "todo" | "in_progress" | "done" | "collected";
  pizza: any;
};

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>("");

  const [orders, setOrders] = useState<Order[]>([]);

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setUser(data.user);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
  }

  async function loadOrders() {
    const { data, error } = await supabase.functions.invoke(
      "kitchen-list-orders"
    );
    if (error) {
      alert(error.message);
      return;
    }
    setOrders(data);
  }

  async function updateStatus(id: string, status: Order["status"]) {
    const { error } = await supabase.functions.invoke("kitchen-update-status", {
      body: { orderId: id, status },
    });

    if (error) {
      alert(error.message);
      return;
    }
    loadOrders();
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!user) {
    return (
      <div>
        <h2>kitchen login</h2>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={signIn}>sign in</button>
      </div>
    );
  }

  const todo = orders.filter((order) => order.status === "todo");

  const inProgress = orders.filter((order) => order.status === "in_progress");

  const done = orders.filter((order) => order.status === "done");

  const collected = orders.filter((order) => order.status === "collected");

  return (
    <div>
      <h2>Kitchen</h2>
      <div>signed in as {user.email}</div>
      <button onClick={signOut}>sign out</button>
      <button onClick={loadOrders}>load orders/refresh</button>
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
        onNext={(id) => updateStatus(id, "collected")}
      />
      <Column
        title="Collected"
        orders={collected}
        onPrev={(id) => updateStatus(id, "done")}
      />
    </div>
  );
}
