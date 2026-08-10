"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Loader2, LockKeyhole, Plus, Sparkles, Wallet } from "lucide-react";
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
    <main className="tank-board min-h-screen bg-[#ede7d8] text-[#1e2119]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
        <div className="flex items-center gap-3">
          <Image src="/brand-logo.png" alt="Thaink Tank ER logo" width={58} height={58} className="idea-badge h-[58px] w-[58px] rounded-2xl object-cover" priority />
          <div>
            <p className="tank-serif text-3xl font-bold">Thaink Tank ER</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#69705d]">sealed collaboration lab</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/judge" className="hidden rounded-full border border-[#1e2119]/15 px-4 py-3 text-sm font-semibold hover:bg-white/50 sm:block">Judge</a>
          <button onClick={onConnect} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1e2119] px-5 text-sm font-bold text-[#f7f0df] hover:bg-[#3d5c28]">
            {busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {wallet ? shortKey(wallet) : "Connect Wallet"}
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-6 lg:grid-cols-[86px_minmax(0,1fr)_340px]">
        <aside className="tool-spine hidden rounded-full border border-[#1e2119]/10 bg-[#fbf8ef]/80 p-3 lg:grid">
          {[LockKeyhole, Plus, Sparkles].map((Icon, index) => (
            <div key={index} className="grid h-14 w-14 place-items-center rounded-full border border-[#1e2119]/10 bg-white text-[#3d5c28] shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
          ))}
        </aside>

        <section className="canvas-area min-h-[720px] rounded-[28px] border border-[#1e2119]/10 bg-[#fbf8ef] p-5 shadow-xl shadow-[#1e2119]/10">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#6c755f]">Private ER brainstorm</p>
              <h1 className="tank-serif mt-3 max-w-3xl text-5xl font-bold leading-[1.02] sm:text-6xl">
                Brainstorm without groupthink.
              </h1>
            </div>
            <label className="paper-note rotate-1">
              <span className="block text-xs font-black uppercase tracking-[0.18em] text-[#6b5a18]">Peer impact score: {score}/10</span>
              <input type="range" min="1" max="10" value={score} onChange={(e) => setScore(Number(e.target.value))} className="mt-4 w-full accent-[#3d5c28]" />
            </label>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <label className="sticky-large -rotate-1">
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#3d5c28]">Tank topic</span>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-3 min-h-44 w-full resize-none bg-transparent text-2xl leading-9 outline-none" />
            </label>
            <label className="sticky-large rotate-1 bg-[#dff6cb]">
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-[#3d5c28]">Private contribution</span>
              <textarea value={idea} onChange={(e) => setIdea(e.target.value)} className="mt-3 min-h-44 w-full resize-none bg-transparent text-xl leading-8 outline-none" />
            </label>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
            <div className="hash-strip">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6c755f]">Idea commitment</p>
              <p className="mt-2 break-all font-mono text-xs text-[#2f6b22]">{ideaHash}</p>
              <p className="mt-2 break-all font-mono text-xs text-[#6c755f]">digest {digestHash}</p>
            </div>
            <button onClick={() => setSalt(Math.random().toString(36).slice(2, 10))} className="rounded-2xl border border-[#1e2119]/10 bg-white px-4 py-4 font-mono text-xs uppercase tracking-[0.16em] hover:bg-[#eef9db]">
              New salt<br /><span className="text-[#3d5c28]">{salt}</span>
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Commit idea", "MagicBlock Private ER", `THAINK_ER_COMMIT:${ideaHash}`)} className="action-pill bg-[#b7ef5f] text-[#11160d] disabled:opacity-40">
              Commit Private ER
            </button>
            <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Reveal idea", "MagicBlock Private ER", `THAINK_ER_REVEAL:${ideaHash}:${salt}`)} className="action-pill border border-[#1e2119]/15 bg-white disabled:opacity-40">
              Reveal
            </button>
            <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Finalize digest", "Solana Devnet", `THAINK_ER_DIGEST:${digestHash}:score=${score}`)} className="action-pill bg-[#1e2119] text-[#f7f0df] disabled:opacity-40">
              Settle Digest
            </button>
          </div>
          {error ? <p className="mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        </section>

        <aside className="proof-drawer rounded-[28px] border border-[#1e2119]/10 bg-[#1e2119] p-5 text-[#f7f0df] shadow-xl">
          <div className="flex items-center justify-between">
            <p className="tank-serif text-2xl font-bold">Proof Drawer</p>
            <Sparkles className="h-5 w-5 text-[#b7ef5f]" />
          </div>
          <div className="mt-5 grid gap-3">
            {proofs.length === 0 ? (
              <p className="rounded-2xl border border-white/10 p-6 text-center text-sm text-white/50">No proof yet.</p>
            ) : proofs.map((proof) => (
              <a key={proof.signature} href={explorerTx(proof.signature)} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08]">
                <span className="flex items-center justify-between gap-3 text-sm font-bold">{proof.label}<ExternalLink className="h-4 w-4 text-[#b7ef5f]" /></span>
                <span className="mt-1 block text-xs text-white/45">{proof.route}</span>
                <span className="mt-3 block break-all font-mono text-xs text-[#b7ef5f]">{proof.signature}</span>
              </a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
