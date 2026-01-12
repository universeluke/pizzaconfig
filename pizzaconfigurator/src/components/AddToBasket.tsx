import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { addToBasket } from "../store/basketSlice";
import { resetPizza } from "../store/pizzaSlice";
import { customerTestIds } from "../test/customerTestIds";

export default function AddToBasket() {
  const dispatch = useDispatch();
  const pizza = useSelector((state: RootState) => state.pizza);

  function validatePizza(pizza: any) {
    if (!pizza.sauce) return "Pick a sauce";
    if (!pizza.cheese) return "Pick a cheese";
    return null;
  }

  function addCurrentPizzaToBasket() {
    const msg = validatePizza(pizza);
    if (msg) return alert(msg);
    dispatch(addToBasket(pizza));
    dispatch(resetPizza());
  }

  return (
    <button
      data-testid={customerTestIds.basket.addToBasketButton}
      onClick={addCurrentPizzaToBasket}
    >
      add to basket
    </button>
  );
}
