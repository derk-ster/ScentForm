"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as account from "@/lib/account/account-service";
import { useAccountStore } from "@/store/account-store";

export default function SignInPage() {
  const router = useRouter();
  const refresh = useAccountStore((s) => s.refresh);
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await account.signIn(email);
      await refresh();
      router.push("/account");
    } catch (er) {
      setErr(er instanceof Error ? er.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Account
      </p>
      <h1 className="mt-2 font-display text-4xl">Sign in</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Enter the email you used to register. This storefront stores session data
        in your browser until a real backend is connected.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@email.com"
          />
        </div>
        {err ? (
          <p className="text-sm text-destructive" role="alert">
            {err}
          </p>
        ) : null}
        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/account/register" className="text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
