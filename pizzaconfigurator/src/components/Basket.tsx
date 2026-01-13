import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useState } from "react";
import { clearBasket, removeFromBasket } from "../store/basketSlice";
import { supabase } from "../supabaseClient";
import styles from "./Basket.module.css";
import BasketIcon from "../icons/BasketIcon";
import { customerTestIds } from "../test/customerTestIds";

export default function Basket() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const basket = useSelector((state: RootState) => state.basket);
  const [closing, setClosing] = useState(false);

  function openMenu() {
    setIsOpen(true);
    setClosing(false);
  }

  function closeMenu() {
    setClosing(true);
  }

  function handleAnimationEnd() {
    if (closing) {
      setIsOpen(false);
      setClosing(false);
    }
  }

  async function placeOrder() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      //TODO make into toast
      alert("not signed in");
      return;
    }

    if (basket.items.length === 0) return alert("basket is empty");

    const rows = basket.items.map((item) => ({
      user_id: user.id,
      pizza: item.pizza,
    }));

    const { error } = await supabase.from("orders").insert(rows);

    if (error) alert(error.message);
    //TODO make into toast
    else {
      dispatch(clearBasket());
      setIsOpen(false);
      alert("order placed");
    }
  }

  if (basket.items.length === 0) {
    return null;
  }

  return !isOpen ? (
    <button
      data-testid={customerTestIds.basket.openBasketButton}
      className={styles.openButton}
      onClick={openMenu}
    >
      <BasketIcon />
    </button>
  ) : (
    <div className={styles.overlay} onClick={closeMenu}>
      <div
        className={`${styles.panel} ${closing ? styles.closing : styles.open}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <button className={styles.closeButton} onClick={closeMenu}>
          ×
        </button>

        <div className={styles.title}>
          <BasketIcon />
        </div>

        <div className={styles.list}>
          {basket.items.map((item) => (
            <div className={styles.item} key={item.id}>
              <span>{item.pizza.cheese}</span>
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

        <div className={styles.footer}>
          <button className={styles.placeOrderButton} onClick={placeOrder}>
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}
