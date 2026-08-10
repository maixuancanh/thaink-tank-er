import Link from "next/link";
import { LockKeyhole } from "lucide-react";

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
            ["Eligibility", "Uses MagicBlock Private ER endpoint for sealed commit/reveal proof transactions."],
            ["Creativity", "Removes groupthink by hiding contributions until the reveal phase."],
            ["Technical depth", "Uses salted SHA-256 commitments and digest hashes before Solana devnet settlement."],
            ["Showcase", "Every demo phase creates an explorer-ready signature from the user's wallet."],
          ].map(([label, detail]) => (
            <div key={label} className="grid gap-2 rounded-lg border border-black/10 bg-stone-50 p-4 sm:grid-cols-[180px_1fr]">
              <p className="font-semibold text-lime-800">{label}</p>
              <p className="text-stone-600">{detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
