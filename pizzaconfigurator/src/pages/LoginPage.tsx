import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { customerTestIds } from "../test/customerTestIds";
import styles from "./LoginPage.module.css";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return alert("email is required");
    if (!password) return alert("password is required");

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      //TODO make into toast
      if (error) return alert(error.message);
      nav("/"); // go to home after login
      return;
    }

    if (mode === "signup") {
      if (password.length < 7) {
        return alert("password must be at least 7 characters");
      }

      if (password !== confirmPassword) {
        return alert("passwords do not match");
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return alert(error.message);
      alert("account created!");
      nav("/");
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className={styles.header}>
        {mode === "signin" ? (
          <>
            SIGN
            <br />
            <span className={styles.secondaryColour}>IN</span>
          </>
        ) : (
          <>
            SIGN
            <br />
            <span className={styles.secondaryColour}>UP</span>
          </>
        )}
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
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
        />
        {mode === "signup" && (
          <input
            placeholder="confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            data-testid={customerTestIds.login.confirmPassword}
            autoComplete="new-password"
          />
        )}

        <button
          className={styles.signInButton}
          type="submit"
          data-testid={customerTestIds.login.submit}
        >
          {mode === "signin" ? "sign in" : "sign up"}
        </button>

        <button
          type="button"
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className={styles.signUpButton}
        >
          {mode === "signin"
            ? "need an account? sign up"
            : "already have an account? sign in"}
        </button>
      </div>
    </form>
  );
}
