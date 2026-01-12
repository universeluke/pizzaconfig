import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
      <h2>Sign in</h2>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">sign in</button>
    </form>
  );
}
