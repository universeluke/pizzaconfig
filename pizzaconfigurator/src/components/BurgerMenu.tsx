import { useState } from "react";
import styles from "./BurgerMenu.module.css";
import { Link } from "react-router-dom";
import { customerTestIds } from "../test/customerTestIds";
import RecentPizzaTrack from "./RecentPizzaTrack";

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  function openMenu() {
    setOpen(true);
    setClosing(false);
  }

  function closeMenu() {
    setClosing(true);
  }

  function handleAnimationEnd() {
    if (closing) {
      setOpen(false);
      setClosing(false);
    }
  }

  return (
    <div>
      <button
        data-testid={customerTestIds.burger.openButton}
        onClick={openMenu}
        className={styles.openButton}
      >
        ≡
      </button>
      {open && (
        <div className={styles.overlay} onClick={closeMenu}>
          <div
            data-testid={customerTestIds.burger.panel}
            className={`${styles.menu} ${
              closing ? styles.closing : styles.open
            }`}
            onClick={(e) => e.stopPropagation()}
            onAnimationEnd={handleAnimationEnd}
          >
            <button
              data-testid={customerTestIds.burger.closeButton}
              onClick={closeMenu}
              className={styles.closeButton}
            >
              ×
            </button>
            <nav className={styles.nav}>
              <Link
                data-testid={customerTestIds.burger.link("home")}
                to="/"
                onClick={closeMenu}
                className={styles.link}
              >
                HOME
              </Link>
              <Link
                data-testid={customerTestIds.burger.link("history")}
                to="/history"
                onClick={closeMenu}
                className={styles.link}
              >
                ORDER HISTORY{" "}
              </Link>
              <Link
                data-testid={customerTestIds.burger.link("profile")}
                to="/profile"
                onClick={closeMenu}
                className={styles.link}
              >
                PROFILE
              </Link>
            </nav>
            <RecentPizzaTrack />
          </div>
        </div>
      )}
    </div>
  );
}
