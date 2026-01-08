import styles from "./BuildPage.module.css";
import Pepperoni from "../components/Pepperoni";
import Cheese from "../components/Cheese";
import Tomato from "../components/Tomato";
import Mushrooms from "../components/Mushrooms";
import Oregano from "../components/Oregano";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import AccordionSection from "../components/AccordionSection";
import {
  resetPizza,
  setCheese,
  setNotes,
  setSauce,
  toggleDip,
  toggleHerb,
  toggleOil,
  toggleTopping,
} from "../store/pizzaSlice";
import BurgerMenu from "../components/BurgerMenu";

function BuildPage() {
  const [orders, setOrders] = useState<any[]>([]);

  const dispatch = useDispatch();
  const pizza = useSelector((state: RootState) => state.pizza);

  const OPTIONS = {
    sauce: ["tomato", "basil pesto", "white", "monthly special"],
    cheese: ["fior di latte", "mozzarella", "vegan", "none"],
    toppings: ["pepperoni", "mushroom", "onion", "ham"],
    oils: ["olive oil", "chilli oil"],
    herbs: ["oregano", "basil"],
    dips: ["garlic mayo", "bbq"],
  };

  async function logout() {
    await supabase.auth.signOut();
  }

  async function placeOrder() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("not signed in");
      return;
    }

    const { error } = await supabase.from("orders").insert([
      {
        user_id: user.id,
        pizza,
      },
    ]);

    if (error) alert(error.message);
    else alert("order placed");
  }

  async function loadOrders() {
    const { data, error } = await supabase.from("orders").select("*");

    if (error) {
      alert(error.message);
      return;
    }

    setOrders(data);
  }

  //adding a channel to subscribe to changes https://supabase.com/docs/reference/javascript/subscribe
  useEffect(() => {
    let channel: any;

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;

      channel = supabase
        .channel("my-orders")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "orders" },
          () => loadOrders()
        )
        .subscribe();
    });

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <BurgerMenu />

      <button onClick={logout}>logout</button>
      <h2 className={styles.title}>
        <span className={styles.titleGreen}>DESIGN</span>
        <br />
        <span className={styles.titleGreen}>YOUR</span>

        <br />
        <span className={styles.titleRed}>PIE</span>
      </h2>
      <div className={styles.base}>
        <div className={styles.layer}>
          <Tomato />
        </div>
        <div className={styles.layer}>
          <Cheese />
        </div>
        <div className={styles.layer}>
          <Pepperoni />
        </div>
        <div className={styles.layer}>
          <Mushrooms />
        </div>
        <div className={styles.layer}>
          <Oregano />
        </div>
      </div>
      <button onClick={placeOrder}>place current order</button>
      <button onClick={loadOrders}>load my orders</button>

      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.id} - {order.status}
          </li>
        ))}
      </ul>
      <div>
        <AccordionSection
          title="SAUCE"
          options={OPTIONS.sauce}
          mode="single"
          value={pizza.sauce}
          values={[]}
          onSelect={(opt) => dispatch(setSauce(opt))}
        />

        <AccordionSection
          title="CHEESE"
          options={OPTIONS.cheese}
          mode="single"
          value={pizza.cheese}
          values={[]}
          onSelect={(opt) => dispatch(setCheese(opt))}
        />

        <AccordionSection
          title="TOPPINGS"
          options={OPTIONS.toppings}
          mode="multi"
          value={null}
          values={pizza.toppings}
          onSelect={(opt) => dispatch(toggleTopping(opt))}
        />

        <AccordionSection
          title="OILS"
          options={OPTIONS.oils}
          mode="multi"
          value={null}
          values={pizza.oils}
          onSelect={(opt) => dispatch(toggleOil(opt))}
        />

        <AccordionSection
          title="HERBS"
          options={OPTIONS.herbs}
          mode="multi"
          value={null}
          values={pizza.herbs}
          onSelect={(opt) => dispatch(toggleHerb(opt))}
        />

        <AccordionSection
          title="DIPS"
          options={OPTIONS.dips}
          mode="multi"
          value={null}
          values={pizza.dips}
          onSelect={(opt) => dispatch(toggleDip(opt))}
        />

        <div>
          <h3>Notes</h3>
          <textarea
            value={pizza.notes}
            onChange={(e) => dispatch(setNotes(e.target.value))}
          />
        </div>

        <button onClick={() => dispatch(resetPizza())}>Reset</button>

        <h3>Current config</h3>
        <pre>{JSON.stringify(pizza, null, 2)}</pre>
      </div>
    </>
  );
}

export default BuildPage;
