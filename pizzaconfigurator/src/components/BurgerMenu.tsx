import { useState } from "react";
import styles from "./BurgerMenu.module.css";
import { Link } from "react-router-dom";
import { customerTestIds } from "../test/customerTestIds";

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        data-testid={customerTestIds.burger.openButton}
        onClick={() => setOpen(true)}
      >
        OPEN
      </button>
      {open && (
        <div data-testid={customerTestIds.burger.panel} className={styles.menu}>
          <button
            data-testid={customerTestIds.burger.closeButton}
            onClick={() => setOpen(false)}
          >
            X
          </button>
          <nav className={styles.nav}>
            <Link
              data-testid={customerTestIds.burger.link("home")}
              to="/"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              data-testid={customerTestIds.burger.link("history")}
              to="/history"
              onClick={() => setOpen(false)}
            >
              Order history
            </Link>
            <Link
              data-testid={customerTestIds.burger.link("profile")}
              to="/profile"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
