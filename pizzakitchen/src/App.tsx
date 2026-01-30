import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Column from "./components/Column";
import styles from "./App.module.css";
import {
  loadOrdersApi,
  sendStatusPush,
  signInWithEmail,
  signOutApi,
  updateOrderStatus,
} from "./utils/kitchenApi";
import type { OrderLite } from "../../types/types";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>("");

  const [orders, setOrders] = useState<OrderLite[]>([]);

  async function signIn() {
    try {
      const user = await signInWithEmail(supabase, email, password);
      setUser(user);
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function signOut() {
    try {
      await signOutApi(supabase);
      setUser(null);
      setOrders([]);
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function loadOrders() {
    try {
      const data = await loadOrdersApi(supabase);
      setOrders(data);
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function updateStatus(order: OrderLite, status: OrderLite["status"]) {
    try {
      await updateOrderStatus(supabase, order.id, status);
      await sendStatusPush(order.user_id, status);
      await loadOrders();
    } catch (e: any) {
      alert(e.message);
    }
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
