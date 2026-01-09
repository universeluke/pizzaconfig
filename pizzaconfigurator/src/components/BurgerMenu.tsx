import { useState } from "react";
import styles from "./BurgerMenu.module.css";
import { Link } from "react-router-dom";

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>OPEN</button>
      {open && (
        <div className={styles.menu}>
          <button onClick={() => setOpen(false)}>X</button>
          <nav className={styles.nav}>
            <Link to="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/history" onClick={() => setOpen(false)}>
              Order history
            </Link>
            <Link to="/profile" onClick={() => setOpen(false)}>
              Profile
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
