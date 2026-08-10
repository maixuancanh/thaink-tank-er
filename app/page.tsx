"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, LockKeyhole, Sparkles, Wallet } from "lucide-react";
import { connectWallet, explorerTx, hashPayload, sendMemoProof, shortKey } from "@/lib/solana";

type Proof = { label: string; route: "MagicBlock Private ER" | "Solana Devnet"; signature: string; memo: string };

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [topic, setTopic] = useState("How should small DAOs coordinate emergency treasury decisions?");
  const [idea, setIdea] = useState("Use a short private commit phase, reveal only after enough independent perspectives arrive, then score novelty and actionability.");
  const [score, setScore] = useState(8);
  const [salt, setSalt] = useState(() => Math.random().toString(36).slice(2, 10));
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [proofs, setProofs] = useState<Proof[]>([]);

  const ideaHash = useMemo(() => hashPayload(`${topic}:${idea}:${salt}`), [topic, idea, salt]);
  const digestHash = useMemo(() => hashPayload(`${topic}:${ideaHash}:${score}`), [topic, ideaHash, score]);

  async function onConnect() {
    setError("");
    setBusy("connect");
    try {
      setWallet(await connectWallet());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed");
    } finally {
      setBusy("");
    }
  }

  async function writeProof(label: string, route: Proof["route"], memo: string) {
    setBusy(label);
    setError("");
    try {
      const signature = await sendMemoProof(route, memo);
      setProofs((items) => [{ label, route, signature, memo }, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proof transaction failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f0e8] text-[#15140f]">
      <div className="lab-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute right-10 top-16 h-52 w-52 rounded-full bg-lime-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-20 h-56 w-56 rounded-full bg-black/10 blur-3xl" />
      <section className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="privacy-sheen flex flex-col justify-between rounded-xl bg-[#15140f] p-6 text-white shadow-2xl shadow-black/20">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/brand-logo.png" alt="Thaink Tank ER logo" width={48} height={48} className="drift h-12 w-12 rounded-lg object-cover ring-1 ring-lime-200/40" priority />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-lime-200">Thaink Tank ER</p>
                <p className="text-xs text-stone-400">Anonymous collaboration lab</p>
              </div>
            </div>
            <a href="/judge" className="text-sm text-stone-300 hover:text-white">Judge</a>
          </nav>

          <div className="max-w-xl py-16">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-200/30 bg-lime-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-100">
              <LockKeyhole className="h-4 w-4" /> Sealed ideas
            </p>
            <h1 className="text-5xl font-semibold leading-[1.02]">Brainstorm without groupthink.</h1>
            <p className="mt-5 text-lg leading-8 text-stone-300">
              Contributors commit private idea hashes first, reveal later, score impact together, and settle the final digest proof on Solana devnet.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            {["Private commit", "Blind reveal", "Digest proof"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                <CheckCircle2 className="mb-3 h-5 w-5 text-lime-200" />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white/95 p-5 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
            <div>
              <h2 className="text-2xl font-semibold">Live Idea Tank</h2>
              <p className="text-sm text-stone-500">Commit, reveal, score, and finalize a collaborative digest.</p>
            </div>
            <button onClick={onConnect} className="inline-flex h-11 items-center gap-2 rounded-lg bg-black px-4 text-sm font-semibold text-white hover:bg-lime-700">
              {busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              {wallet ? shortKey(wallet) : "Connect Wallet"}
            </button>
          </div>

          <div className="grid gap-5 py-5">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Tank topic</span>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="min-h-20 rounded-lg border border-black/10 bg-stone-50 p-4 outline-none focus:border-lime-500" />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Private contribution</span>
              <textarea value={idea} onChange={(e) => setIdea(e.target.value)} className="min-h-32 rounded-lg border border-black/10 bg-stone-50 p-4 outline-none focus:border-lime-500" />
            </label>

            <div className="reveal-glow grid gap-3 rounded-lg border border-black/10 bg-stone-50 p-4 sm:grid-cols-[1fr_160px]">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Idea commitment</p>
                <p className="mt-2 break-all font-mono text-xs text-lime-800">{ideaHash}</p>
                <p className="mt-2 font-mono text-xs text-stone-500">salt: {salt}</p>
              </div>
              <button onClick={() => setSalt(Math.random().toString(36).slice(2, 10))} className="h-11 self-center rounded-lg border border-black/10 text-sm font-semibold hover:bg-white">
                New salt
              </button>
            </div>

            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Peer impact score: {score}/10</span>
              <input type="range" min="1" max="10" value={score} onChange={(e) => setScore(Number(e.target.value))} />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Commit idea", "MagicBlock Private ER", `THAINK_ER_COMMIT:${ideaHash}`)} className="h-12 rounded-lg bg-lime-300 font-semibold text-black disabled:opacity-40">
                Commit Private ER
              </button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Reveal idea", "MagicBlock Private ER", `THAINK_ER_REVEAL:${ideaHash}:${salt}`)} className="h-12 rounded-lg border border-black/10 font-semibold disabled:opacity-40">
                Reveal
              </button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Finalize digest", "Solana Devnet", `THAINK_ER_DIGEST:${digestHash}:score=${score}`)} className="h-12 rounded-lg bg-black font-semibold text-white disabled:opacity-40">
                Settle Digest
              </button>
            </div>

            <div className="rounded-lg border border-black/10">
              <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                <p className="font-semibold">Proof timeline</p>
                <Sparkles className="h-4 w-4 text-lime-700" />
              </div>
              <div className="grid gap-2 p-3">
                {proofs.length === 0 ? <p className="py-6 text-center text-sm text-stone-500">No proof yet.</p> : proofs.map((proof) => (
                  <a key={proof.signature} href={explorerTx(proof.signature)} target="_blank" rel="noreferrer" className="rounded-lg bg-stone-50 p-3 transition hover:-translate-y-0.5 hover:bg-lime-50 hover:shadow-lg hover:shadow-lime-300/20">
                    <span className="flex items-center justify-between text-sm font-semibold">{proof.label}<ExternalLink className="h-4 w-4" /></span>
                    <span className="mt-1 block text-xs text-stone-500">{proof.route}</span>
                    <span className="mt-2 block break-all font-mono text-xs text-lime-800">{proof.signature}</span>
                  </a>
                ))}
              </div>
            </div>

            {error ? <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
