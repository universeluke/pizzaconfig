import styles from "./PizzaVisualiser.module.css";
import type { PizzaConfig } from "../store/pizzaSlice";
import Tomato from "../pizzaoptions/Tomato";
import Pepperoni from "../pizzaoptions/Pepperoni";
import Mushrooms from "../pizzaoptions/Mushrooms";
import Oregano from "../pizzaoptions/Oregano";
import FiorDiLatte from "../pizzaoptions/FiorDiLatte";

export type CookStage = "raw" | "oven" | "ready";

type Props = {
  pizza: PizzaConfig;
  cookStage?: CookStage;
};

export default function PizzaVisualiser({ pizza, cookStage = "raw" }: Props) {
  return (
    <div className={`${styles.base} ${styles[cookStage]}`}>
      {pizza.sauce === "tomato" && (
        <div className={styles.layer}>
          <Tomato cookStage={cookStage} />
        </div>
      )}

      {pizza.cheese === "fior di latte" && (
        <div className={styles.layer}>
          <FiorDiLatte cookStage={cookStage} />
        </div>
      )}

      {pizza.toppings.includes("pepperoni") && (
        <div className={styles.layer}>
          <Pepperoni cookStage={cookStage} />
        </div>
      )}

      {pizza.toppings.includes("mushroom") && (
        <div className={styles.layer}>
          <Mushrooms cookStage={cookStage} />
        </div>
      )}

      {pizza.herbs.includes("oregano") && (
        <div className={styles.layer}>
          <Oregano cookStage={cookStage} />
        </div>
      )}
    </div>
  );
}
