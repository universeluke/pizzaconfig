import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { removeFromBasket } from "../store/basketSlice";
import { customerTestIds } from "../test/customerTestIds";
import styles from "./BasketItems.module.css";

export default function BasketItems() {
  const basket = useSelector((state: RootState) => state.basket);
  const dispatch = useDispatch();
  let x = 1;

  return (
    <div
      className={styles.list}
      data-testid={customerTestIds.basketItems.itemsList}
    >
      {basket.items.map((item) => (
        <div className={styles.item} key={item.id}>
          <span>PIE {x++}</span>
          <div className={styles.optionsList}>
            <span>{item.pizza.sauce} sauce</span>
            <span>
              {item.pizza.cheese === "none" ? "no" : item.pizza.cheese} cheese
            </span>
            <span>
              {item.pizza.toppings.map((topping) => (
                <div key={topping}>{topping}</div>
              ))}
            </span>
            <span>
              {item.pizza.oils.map((oil) => (
                <div key={oil}>{oil}</div>
              ))}
            </span>
            <span>
              {item.pizza.herbs.map((herb) => (
                <div key={herb}>{herb}</div>
              ))}
            </span>
            <span>
              {item.pizza.dips.map((dip) => (
                <div key={dip}>{dip} dip</div>
              ))}
            </span>
          </div>

          <button
            data-testid={customerTestIds.basket.removeItemButton(item.id)}
            className={styles.removeButton}
            onClick={() => dispatch(removeFromBasket(item.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
