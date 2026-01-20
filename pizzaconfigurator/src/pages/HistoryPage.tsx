import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BurgerMenu from "../components/BurgerMenu";
import styles from "./HistoryPage.module.css";
import PizzaVisualiser from "../components/PizzaVisualiser";

export default function HistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("id,status,created_at,pizza")
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
      <h2 className={styles.title}>
        <span className={styles.titleGreen}>YOUR</span>
        <br />
        <span className={styles.titleRed}>PIE</span>

        <br />
        <span className={styles.titleGreen}>HISTORY</span>
      </h2>

      {loading && <p>loading...</p>}

      <ul className={styles.list}>
        {orders.map((order) => (
          <li className={styles.item} key={order.id}>
            <Link to={`/track/${order.id}`}>
              <div className={styles.itemWrapper}>
                <div className={styles.optionsList}>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span>{order.pizza.sauce} sauce</span>
                  <span>
                    {order.pizza.cheese === "none" ? "no" : order.pizza.cheese}{" "}
                    cheese
                  </span>
                  <span>
                    {order.pizza.toppings.map((topping: string | null) => (
                      <div key={topping}>{topping}</div>
                    ))}
                  </span>
                  <span>
                    {order.pizza.oils.map((oil: string | null) => (
                      <div key={oil}>{oil}</div>
                    ))}
                  </span>
                  <span>
                    {order.pizza.herbs.map((herb: string | null) => (
                      <div key={herb}>{herb}</div>
                    ))}
                  </span>
                  <span>
                    {order.pizza.dips.map((dip: string | null) => (
                      <div key={dip}>{dip} dip</div>
                    ))}
                  </span>
                </div>
                <PizzaVisualiser pizza={order.pizza} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
