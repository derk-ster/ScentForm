"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="mt-10 space-y-5 rounded-3xl border border-border/70 bg-card/40 p-8"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-border/80 bg-card/60 px-3 py-2 text-sm text-foreground shadow-inner shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <Button type="submit" className="rounded-full">
        Submit
      </Button>
      {sent ? (
        <p className="text-sm text-muted-foreground" role="status">
          Thanks — this demo does not send email yet.
        </p>
      ) : null}
    </form>
  );
}
