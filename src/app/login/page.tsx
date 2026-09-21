"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "password" | "link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "link") {
      // emailRedirectTo is passed explicitly so the link comes back to whichever origin the
      // request came from (localhost in dev, the deployed host in prod) rather than depending
      // on Supabase's single Site URL setting. Both origins must be listed under
      // Authentication -> URL Configuration -> Redirect URLs.
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      setLoading(false);
      if (error) setError(error.message);
      else setSent(true);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setSent(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-3">OPFOR Proposal Generator</p>
          <h1 className="font-display text-2xl font-semibold text-fg">Sign in</h1>
          <p className="mt-1 text-sm text-text-2">
            {mode === "password"
              ? "Enter your credentials to continue"
              : "We'll email you a one-time sign-in link"}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-fg">
              Check <span className="font-medium">{email}</span> for a sign-in link.
            </p>
            <p className="text-sm text-text-2">
              It expires shortly and works once. Open it in this browser.
            </p>
            <button type="button" className="btn-secondary w-full justify-center" onClick={() => switchMode("link")}>
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode === "password" && (
              <div>
                <label className="label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {error && <p className="text-sm text-crit">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading
                ? mode === "password" ? "Signing in…" : "Sending…"
                : mode === "password" ? "Sign in" : "Email me a sign-in link"}
            </button>

            <button
              type="button"
              className="w-full text-center text-sm text-text-2 underline-offset-4 hover:underline"
              onClick={() => switchMode(mode === "password" ? "link" : "password")}
            >
              {mode === "password" ? "Email me a sign-in link instead" : "Use a password instead"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
