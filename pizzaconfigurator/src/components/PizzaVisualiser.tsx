import styles from "./PizzaVisualiser.module.css";
import type { PizzaConfig } from "../store/pizzaSlice";
import Tomato from "../pizzaoptions/Tomato";
import Pepperoni from "../pizzaoptions/Pepperoni";
import Mushrooms from "../pizzaoptions/Mushrooms";
import Oregano from "../pizzaoptions/Oregano";
import FiorDiLatte from "../pizzaoptions/FiorDiLatte";
import Bbq from "../pizzaoptions/Bbq";
import Pesto from "../pizzaoptions/Pesto";
import White from "../pizzaoptions/White";
import Mozzarella from "../pizzaoptions/Mozzarella";
import Vegan from "../pizzaoptions/Vegan";

export type CookStage = "raw" | "making" | "oven" | "ready";

type Props = {
  pizza: PizzaConfig;
  cookStage?: CookStage;
};

const MAKING_TOTAL_MS = 3000;

export default function PizzaVisualiser({ pizza, cookStage = "raw" }: Props) {
  const layers: React.ReactNode[] = [];

  // sauce
  if (pizza.sauce === "tomato") layers.push(<Tomato cookStage={cookStage} />);
  if (pizza.sauce === "bbq") layers.push(<Bbq cookStage={cookStage} />);
  if (pizza.sauce === "pesto") layers.push(<Pesto cookStage={cookStage} />);
  if (pizza.sauce === "white") layers.push(<White cookStage={cookStage} />);

  // cheese
  if (pizza.cheese === "fior di latte")
    layers.push(<FiorDiLatte cookStage={cookStage} />);
  if (pizza.cheese === "mozzarella")
    layers.push(<Mozzarella cookStage={cookStage} />);
  if (pizza.cheese === "vegan") layers.push(<Vegan cookStage={cookStage} />);

  // toppings
  if (pizza.toppings.includes("pepperoni"))
    layers.push(<Pepperoni cookStage={cookStage} />);
  if (pizza.toppings.includes("mushroom"))
    layers.push(<Mushrooms cookStage={cookStage} />);

  // herbs
  if (pizza.herbs.includes("oregano"))
    layers.push(<Oregano cookStage={cookStage} />);

  const count = layers.length;
  const stepMs = count > 0 ? MAKING_TOTAL_MS / count : 0;

  return (
    <>
      {cookStage === "ready" && <div className={styles.plate}></div>}

      <div className={`${styles.base} ${styles[cookStage]}`}>
        <div className={cookStage === "making" ? styles.makingLoop : ""}>
          {layers.map((node, i) => {
            const delayMs = cookStage === "making" ? i * stepMs : 0;

            return (
              <div
                //don't use index (but it shouldn't change so maybe it's okay?)
                key={i}
                className={`${styles.layer} ${
                  cookStage === "making" ? styles.makingLayer : ""
                }`}
                style={
                  cookStage === "making"
                    ? {
                        animationDelay: `${delayMs}ms`,
                        animationDuration: "500ms",
                      }
                    : undefined
                }
              >
                {node}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
