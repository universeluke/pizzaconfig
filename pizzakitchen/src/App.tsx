import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Column from "./components/Column";
import styles from "./App.module.css";

type Order = {
  id: string;
  user_id: string;
  status: "todo" | "in_progress" | "cooking" | "done" | "collected";
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
      //TODO make into toast
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
      "kitchen-list-orders",
    );
    if (error) {
      //TODO make into toast
      alert(error.message);
      return;
    }
    setOrders(data);
  }

  async function updateStatus(order: Order, status: Order["status"]) {
    const { error } = await supabase.functions.invoke("kitchen-update-status", {
      body: { orderId: order.id, status },
    });

    const messages: Record<Order["status"], string> = {
      todo: "Your order is in the queue",
      in_progress: "Your pizza is being prepared!",
      cooking: "Your pizza is in the oven!",
      done: "Your pizza is ready for collection!",
      collected: "Enjoy your pizza!",
    };

    if (error) {
      alert(error.message);
      return;
    }

    await fetch("http://localhost:3001/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: order.user_id,
        title: "pizza update",
        body: messages[status],
      }),
    });

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
        },
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

  const cooking = orders.filter((order) => order.status === "cooking");

  const done = orders.filter((order) => order.status === "done");

  const collected = orders.filter((order) => order.status === "collected");

  return (
    <div>
      <button onClick={signOut}>sign out</button>
      <button onClick={loadOrders}>load orders/refresh</button>
      <div className={styles.columnContainer}>
        <Column
          title="To do"
          orders={todo}
          onNext={(order) => updateStatus(order, "in_progress")}
        />
        <Column
          title="In progress"
          orders={inProgress}
          onPrev={(order) => updateStatus(order, "todo")}
          onNext={(order) => updateStatus(order, "cooking")}
        />
        <Column
          title="Cooking"
          orders={cooking}
          onPrev={(order) => updateStatus(order, "in_progress")}
          onNext={(order) => updateStatus(order, "done")}
        />
        <Column
          title="Done"
          orders={done}
          onPrev={(order) => updateStatus(order, "cooking")}
          onNext={(order) => updateStatus(order, "collected")}
        />
        <Column
          title="Collected"
          orders={collected}
          onPrev={(order) => updateStatus(order, "done")}
        />
      </div>
    </div>
  );
}
