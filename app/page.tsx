"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Loader2, LockKeyhole, Sparkles, Wallet } from "lucide-react";
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
    setError(""); setBusy("connect");
    try { setWallet(await connectWallet()); }
    catch (err) { setError(err instanceof Error ? err.message : "Wallet connection failed"); }
    finally { setBusy(""); }
  }

  async function writeProof(label: string, route: Proof["route"], memo: string) {
    setBusy(label); setError("");
    try {
      const signature = await sendMemoProof(route, memo);
      setProofs((items) => [{ label, route, signature, memo }, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proof transaction failed");
    } finally { setBusy(""); }
  }

  return (
    <main className="think-wall min-h-dvh text-[#172012]">
      <Image src="/hero-bg.png" alt="" fill priority className="object-cover" />
      <div className="paper-wash" />

      <nav className="think-nav">
        <div className="flex items-center gap-3">
          <Image src="/brand-logo.png" alt="Thaink Tank ER logo" width={54} height={54} className="size-[54px] rounded-2xl object-cover shadow-lg" />
          <div><h1>Thaink Tank ER</h1><p>private idea lab</p></div>
        </div>
        <div className="flex gap-2">
          <a href="/judge">Judge</a>
          <button onClick={onConnect}>{busy === "connect" ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}{wallet ? shortKey(wallet) : "Connect"}</button>
        </div>
      </nav>

      <section className="canvas-cluster">
        <label className="note topic-note">
          <span>Tank topic</span>
          <textarea value={topic} onChange={(e) => setTopic(e.target.value)} />
        </label>
        <label className="note idea-note">
          <span>Sealed contribution</span>
          <textarea value={idea} onChange={(e) => setIdea(e.target.value)} />
        </label>
        <div className="note score-note">
          <span>Peer score {score}/10</span>
          <input type="range" min="1" max="10" value={score} onChange={(e) => setScore(Number(e.target.value))} />
          <button onClick={() => setSalt(Math.random().toString(36).slice(2, 10))}>salt {salt}</button>
        </div>
        <div className="hash-note">
          <LockKeyhole className="size-5" />
          <p>idea hash</p>
          <code>{ideaHash}</code>
          <p>digest hash</p>
          <code>{digestHash}</code>
        </div>
      </section>

      <section className="think-actions">
        <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Commit idea", "MagicBlock Private ER", `THAINK_ER_COMMIT:${ideaHash}`)}>Commit Private ER</button>
        <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Reveal idea", "MagicBlock Private ER", `THAINK_ER_REVEAL:${ideaHash}:${salt}`)}>Reveal</button>
        <button disabled={!wallet || Boolean(busy)} onClick={() => writeProof("Finalize digest", "Solana Devnet", `THAINK_ER_DIGEST:${digestHash}:score=${score}`)}>Settle Digest</button>
      </section>
      {error ? <p className="think-error">{error}</p> : null}

      <aside className="proof-drawer-new">
        <div className="flex items-center justify-between"><b>Proof Drawer</b><Sparkles className="size-4" /></div>
        {proofs.length === 0 ? <p>No proof yet.</p> : proofs.map((proof) => (
          <a key={proof.signature} href={explorerTx(proof.signature)} target="_blank" rel="noreferrer">{proof.label}<ExternalLink className="size-3" /></a>
        ))}
      </aside>
    </main>
  );
}
