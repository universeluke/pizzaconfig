import { useEffect, useState } from "react";
import BurgerMenu from "../components/BurgerMenu";
import { supabase } from "../supabaseClient";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div>
      <BurgerMenu />
      <h2 className={styles.title}>
        <span className={styles.titleGreen}>YOUR</span>
        <br />
        <span className={styles.titleRed}>PIE</span>

        <br />
        <span className={styles.titleGreen}>PROFILE</span>
      </h2>
      {email ? <div>email: {email}</div> : <div>not signed in</div>}
      <button onClick={logout}>logout</button>
    </div>
  );
}
