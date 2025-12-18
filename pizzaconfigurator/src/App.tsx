import styles from "./App.module.css";
import Pepperoni from "./components/Pepperoni";
import Cheese from "./components/Cheese";
import Tomato from "./components/Tomato";
import Mushrooms from "./components/Mushrooms";
import Oregano from "./components/Oregano";
import { useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  async function signIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log(error.message);
      return;
    }
    setUser(data.user);
  }

  async function placeOrder() {
    if (!user) return alert("not signedin");

    const pizza = {
      sauce: "tomato",
      cheese: "fior di latte",
      toppings: ["pepperoni"],
      oils: ["olive oil"],
      herbs: ["oregano"],
      dips: ["garlic mayo"],
      notes: "",
    };

    const { error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        pizza,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("order placed");
    }
  }

  async function loadOrders() {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      alert(error.message);
      return;
    }

    setOrders(data);
  }

  return (
    <>
      <div className={styles.base}>
        <div style={{ position: "absolute" }}>
          <Tomato />
        </div>
        <div style={{ position: "absolute" }}>
          <Cheese />
        </div>
        <div style={{ position: "absolute" }}>
          <Pepperoni />
        </div>
        <div style={{ position: "absolute" }}>
          <Mushrooms />
        </div>
        <div style={{ position: "absolute" }}>
          <Oregano />
        </div>
      </div>
      <div>
        {!user && (
          <>
            <input
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={signIn}>sign in</button>
          </>
        )}
        {user && (
          <>
            <p>signed in as {user.email}</p>
            <button onClick={placeOrder}>place test order</button>
            <button onClick={loadOrders}>load my orders</button>

            <ul>
              {orders.map((order) => (
                <li key={order.id}>
                  {order.id} - {order.status}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default App;
