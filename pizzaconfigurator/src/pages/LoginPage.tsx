import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { customerTestIds } from "../test/customerTestIds";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return alert("email is required");
    if (!password) return alert("password is required");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    //TODO make into toast
    if (error) return alert(error.message);
    nav("/"); // go to home after login
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className={styles.header}>
        SIGN<br></br>
        <span className={styles.secondaryColour}>IN</span>
      </h2>
      <div className={styles.container}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid={customerTestIds.login.email}
          type="email"
          autoComplete="email"
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          data-testid={customerTestIds.login.password}
          autoComplete="current-password"
        />
        <button
          className={styles.signInButton}
          type="submit"
          data-testid={customerTestIds.login.submit}
        >
          sign in
        </button>
      </div>
    </form>
  );
}
