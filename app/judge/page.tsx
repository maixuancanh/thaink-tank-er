import Link from "next/link";
import { LockKeyhole } from "lucide-react";

const programId = "B6V9ZneUTRCMxAERJwEY5Q361beYDBSo55xo1S2QgW4Q";
const deployTx = "4FnCQ6qjgJRytDSypjHtbMXk7W24fXCWjWA5rpR3ieZQb5cTU32mtvCQLKrVP6sxyD2rmD88V25QsE9J4BiEZWsp";

export default function JudgePage() {
  return (
    <main className="min-h-screen bg-[#f4f0e8] px-5 py-8 text-[#15140f]">
      <section className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-xl">
        <Link href="/" className="text-sm text-stone-500 hover:text-black">Back to tank</Link>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime-900">
          <LockKeyhole className="h-4 w-4" /> Judge mode
        </p>
        <h1 className="mt-5 text-4xl font-semibold">Thaink Tank ER Proof Board</h1>
        <p className="mt-4 max-w-3xl leading-7 text-stone-600">
          An independent MagicBlock/Solana adaptation of anonymous collaborative ideation. The demo separates private idea
          commitment, reveal, peer scoring, and final digest settlement.
        </p>
        <div className="mt-8 grid gap-3">
          {[
            ["Eligibility", "Uses MagicBlock ER endpoint for sealed commit/reveal proof transactions against a deployed custom Solana program."],
            ["Creativity", "Removes groupthink by hiding contributions until the reveal phase."],
            ["Technical depth", "Uses salted SHA-256 commitments, custom program instruction logs, and digest hashes before Solana devnet settlement."],
            ["Showcase", "Every demo phase creates an explorer-ready signature from the user's wallet."],
          ].map(([label, detail]) => (
            <div key={label} className="grid gap-2 rounded-lg border border-black/10 bg-stone-50 p-4 sm:grid-cols-[180px_1fr]">
              <p className="font-semibold text-lime-800">{label}</p>
              <p className="text-stone-600">{detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-black/10 bg-stone-50 p-4">
          <p className="font-semibold text-lime-800">Onchain deployment</p>
          <a className="mt-3 block break-all text-sm text-lime-900" href={`https://explorer.solana.com/address/${programId}?cluster=devnet`} target="_blank" rel="noreferrer">Program ID: {programId}</a>
          <a className="mt-2 block break-all text-sm text-lime-900" href={`https://explorer.solana.com/tx/${deployTx}?cluster=devnet`} target="_blank" rel="noreferrer">Deploy tx: {deployTx}</a>
        </div>
      </section>
    </main>
  );
}
