"use client";

import { useMemo, useState } from "react";

type Mode = "normal" | "meme" | "nuclear";

function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>("meme");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const charCount = useMemo(() => (result ? result.length : 0), [result]);

  async function elongate() {
    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch("/api/elongate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, mode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "something went wrong");

      setResult(data.elongated);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border p-6 shadow-sm">
        <h1 className="text-3xl font-bold">URL Elongator™</h1>
        <p className="mt-2 text-sm opacity-80">
          Why shorten links when you can make them{" "}
          <span className="font-semibold">unreasonably long</span>?
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border px-4 py-3 text-sm"
            placeholder="https://example.com/some/reasonable/link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            <ModeButton active={mode === "normal"} onClick={() => setMode("normal")}>
              Mildly Annoying
            </ModeButton>
            <ModeButton active={mode === "meme"} onClick={() => setMode("meme")}>
              You're a bad person.
            </ModeButton>
            <ModeButton active={mode === "nuclear"} onClick={() => setMode("nuclear")}>
              Bruh 
            </ModeButton>
          </div>

          <button
            onClick={elongate}
            disabled={loading}
            className="w-full rounded-xl border px-4 py-3 font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Elongating..." : "ELONGATE MY LINK"}
          </button>

          {error && (
            <div className="rounded-xl border p-3 text-sm">
              <div className="font-semibold">Error</div>
              <div className="opacity-80">{error}</div>
            </div>
          )}

          {result && (
            <div className="rounded-xl border p-3 text-sm space-y-3">
              <div className="font-semibold">
                Your link is <span className="underline">{formatNumber(charCount)}</span>{" "}
                characters long.
              </div>

              <div className="break-all rounded-lg border p-2">{result}</div>

              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={copy}
                  className="rounded-lg border px-3 py-2 hover:opacity-90"
                >
                  {copied ? "Copied 😈" : "Copy"}
                </button>

                <a
                  href={result}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border px-3 py-2 hover:opacity-90"
                >
                  Test redirect
                </a>

                <span className="text-xs opacity-70">
                  (Warning: this may ruin friendships.)
                </span>
              </div>
            </div>
          )}

          <p className="mt-4 text-xs opacity-70">
            Dev note: in-memory store resets on restart. Deploy later with KV for persistence.
          </p>
        </div>
      </div>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-sm ${
        active ? "font-semibold" : "opacity-70 hover:opacity-100"
      }`}
      type="button"
    >
      {children}
    </button>
  );
}
