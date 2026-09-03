"use client";

import { useState } from "react";
import { Lock, KeyRound, ChevronLeft, ArrowRight, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HandbookLockScreen({ title }: { title?: string }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/unlock-handbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 sm:py-24 px-6">
      <div className="mb-8">
        <Link
          href="/research"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-lg px-3 py-1.5 inline-flex items-center gap-1 bg-card"
        >
          <ChevronLeft className="size-4" />
          Back to Table of Contents
        </Link>
      </div>

      <div className="rounded-2xl border border-amber-500/30 bg-card p-8 sm:p-10 shadow-lg relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 opacity-90" />

        <div className="mx-auto size-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-inner">
          <Lock className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Restricted Research Handbook
          </h2>
          {title && (
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              {title}
            </p>
          )}
          <p className="text-sm text-muted-foreground max-w-md mx-auto pt-1">
            Access to this monograph is currently restricted to authorized IP addresses and lead researchers.
          </p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-3 pt-2 max-w-sm mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <KeyRound className="size-4" />
            </div>
            <input
              type="password"
              placeholder="Enter secret passcode..."
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${
                error ? "border-red-500 text-red-500 focus:ring-red-500/50" : "border-border"
              }`}
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-medium">
              <ShieldAlert className="size-3.5" />
              <span>Incorrect passcode. Please try again.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passcode}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{loading ? "Unlocking..." : "Unlock Access"}</span>
            <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="text-xs text-muted-foreground pt-4 border-t border-border/50">
          Tip: You can also unlock access directly via your secret query link or whitelisted IP.
        </p>
      </div>
    </div>
  );
}
