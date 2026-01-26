import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useState } from "react";
import { clearBasket } from "../store/basketSlice";
import { supabase } from "../supabaseClient";
import styles from "./Basket.module.css";
import BasketIcon from "../icons/BasketIcon";
import { customerTestIds } from "../test/customerTestIds";
import { placeOrder } from "../utils/placeOrder";
import BasketItems from "./BasketItems";

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

  async function handlePlaceOrder() {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id ?? "";

    const result = await placeOrder(supabase, userId, basket.items);

    if (!result.ok) {
      alert(result.message);
      return;
    }

    dispatch(clearBasket());
    setIsOpen(false);
    alert("order placed");
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

        <BasketItems />

        <div className={styles.footer}>
          <button
            className={styles.placeOrderButton}
            onClick={handlePlaceOrder}
            data-testid={customerTestIds.basket.placeOrderButton}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}
