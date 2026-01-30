import { useEffect, useState } from "react";
import BurgerMenu from "../components/BurgerMenu";
import { supabase } from "../supabaseClient";
import styles from "./ProfilePage.module.css";
import { customerTestIds } from "../test/customerTestIds";

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
      {email ? (
        <div className={styles.container}>
          <div
            data-testid={customerTestIds.profile.signedInAs}
            className={styles.email}
          >
            signed in as:<br></br> {email}
          </div>
          <button
            data-testid={customerTestIds.profile.logoutButton}
            className={styles.logoutButton}
            onClick={logout}
          >
            LOGOUT
          </button>
        </div>
      ) : (
        <div data-testid={customerTestIds.profile.notSignedIn}>
          not signed in
        </div>
      )}
    </div>
  );
}
