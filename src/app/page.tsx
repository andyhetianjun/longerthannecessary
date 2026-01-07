"use client";

import { useState } from "react";

type Mode = "normal" | "meme" | "nuclear";

export default function Home() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>("meme");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function elongate() {
    setLoading(true);
    setError(null);
    setResult(null);

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
            <button onClick={() => setMode("normal")}>Mildly Annoying</button>
            <button onClick={() => setMode("meme")}>Corporate Tracking Link</button>
            <button onClick={() => setMode("nuclear")}>Unsend This Please</button>
          </div>

          <button
            onClick={elongate}
            disabled={loading}
            className="w-full rounded-xl border px-4 py-3 font-semibold"
          >
            {loading ? "Elongating..." : "ELONGATE MY LINK"}
          </button>

          {error && <div className="text-sm text-red-500">{error}</div>}

          {result && (
            <div className="space-y-2">
              <div className="break-all text-sm">{result}</div>
              <button onClick={copy}>Copy</button>
              <a href={result} target="_blank" rel="noreferrer">
                Test redirect
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
