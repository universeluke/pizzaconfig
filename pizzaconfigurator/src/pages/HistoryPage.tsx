import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BurgerMenu from "../components/BurgerMenu";
import styles from "./HistoryPage.module.css";
import PizzaVisualiser from "../components/PizzaVisualiser";
import type { PizzaConfig } from "../store/pizzaSlice";
import { customerTestIds } from "../test/customerTestIds";

type Order = {
  id: string;
  status: string;
  created_at: string;
  pizza: PizzaConfig;
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
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

  const inProgressOrders = orders.filter(
    (order) => order.status !== "collected",
  );

  const completedOrders = orders.filter(
    (order) => order.status === "collected",
  );

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
        <h3 className={styles.sectionTitle}>IN PROGRESS</h3>

        {inProgressOrders.length === 0 ? (
          <p>No active orders.</p>
        ) : (
          inProgressOrders.map((order) => (
            <li className={styles.item} key={order.id}>
              <Link to={`/track/${order.id}`} className={styles.itemLink}>
                <PizzaVisualiser pizza={order.pizza} size="medium" />

                <div className={styles.itemWrapper}>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span
                    data-testid={customerTestIds.history.sauce(
                      order.id,
                      order.pizza.sauce,
                    )}
                  >
                    {order.pizza.sauce} sauce
                  </span>
                  <span
                    data-testid={customerTestIds.history.cheese(
                      order.id,
                      order.pizza.cheese,
                    )}
                  >
                    {order.pizza.cheese === "none" ? "no" : order.pizza.cheese}{" "}
                    cheese
                  </span>

                  <span>
                    {order.pizza.toppings.map((topping: string) => (
                      <div
                        key={topping}
                        data-testid={customerTestIds.history.topping(
                          order.id,
                          topping,
                        )}
                      >
                        {topping}
                      </div>
                    ))}
                  </span>

                  <span>
                    {order.pizza.oils.map((oil: string) => (
                      <div
                        data-testid={customerTestIds.history.oil(order.id, oil)}
                        key={oil}
                      >
                        {oil}
                      </div>
                    ))}
                  </span>

                  <span>
                    {order.pizza.herbs.map((herb: string) => (
                      <div
                        data-testid={customerTestIds.history.herb(
                          order.id,
                          herb,
                        )}
                        key={herb}
                      >
                        {herb}
                      </div>
                    ))}
                  </span>

                  <span>
                    {order.pizza.dips.map((dip: string) => (
                      <div
                        data-testid={customerTestIds.history.dip(order.id, dip)}
                        key={dip}
                      >
                        {dip} dip
                      </div>
                    ))}
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}

        <h3 className={styles.sectionTitle}>COMPLETED</h3>

        {completedOrders.length === 0 ? (
          <p>No completed orders yet.</p>
        ) : (
          completedOrders.map((order) => (
            <li className={styles.item} key={order.id}>
              <Link to={`/track/${order.id}`} className={styles.itemLink}>
                <PizzaVisualiser pizza={order.pizza} size="medium" />

                <div className={styles.itemWrapper}>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span>{order.pizza.sauce} sauce</span>
                  <span>
                    {order.pizza.cheese === "none" ? "no" : order.pizza.cheese}{" "}
                    cheese
                  </span>

                  <span>
                    {order.pizza.toppings.map((topping: string) => (
                      <div key={topping}>{topping}</div>
                    ))}
                  </span>

                  <span>
                    {order.pizza.oils.map((oil: string) => (
                      <div key={oil}>{oil}</div>
                    ))}
                  </span>

                  <span>
                    {order.pizza.herbs.map((herb: string) => (
                      <div key={herb}>{herb}</div>
                    ))}
                  </span>

                  <span>
                    {order.pizza.dips.map((dip: string) => (
                      <div key={dip}>{dip} dip</div>
                    ))}
                  </span>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
