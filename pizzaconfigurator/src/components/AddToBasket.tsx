import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { addToBasket } from "../store/basketSlice";
import { resetPizza } from "../store/pizzaSlice";
import { customerTestIds } from "../test/customerTestIds";
import styles from "./AddToBasket.module.css";
import { useNotification } from "../hooks/useNotification";

export default function AddToBasket() {
  const dispatch = useDispatch();
  const pizza = useSelector((state: RootState) => state.pizza);
  const notify = useNotification();

  function validatePizza(pizza: any) {
    if (!pizza.sauce) return "pick a sauce";
    if (!pizza.cheese) return "pick a cheese";
    return null;
  }

  function addCurrentPizzaToBasket() {
    const msg = validatePizza(pizza);
    if (msg) return notify(msg, { kind: "error", timeout: 3000 });
    dispatch(addToBasket(pizza));
    dispatch(resetPizza());
    notify("added to basket", { kind: "success", timeout: 3000 });
  }

  return (
    <button
      className={styles.addButton}
      data-testid={customerTestIds.basket.addToBasketButton}
      onClick={addCurrentPizzaToBasket}
    >
      add to basket
    </button>
  );
}
