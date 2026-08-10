import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Buffer } from "buffer";

const DEVNET_RPC = "https://api.devnet.solana.com";
const MAGICBLOCK_PRIVATE_ER_RPC = "https://devnet-tee.magicblock.app";
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

type SolanaProvider = {
  publicKey?: PublicKey;
  connect: () => Promise<{ publicKey: PublicKey }>;
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
};

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}

export function shortKey(key: string) {
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export function explorerTx(signature: string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function hashPayload(payload: string) {
  return bytesToHex(sha256(new TextEncoder().encode(payload)));
}

export async function connectWallet() {
  if (!window.solana) throw new Error("No Solana wallet found. Install Phantom or Backpack and switch to devnet.");
  const response = await window.solana.connect();
  return response.publicKey.toBase58();
}

export async function sendMemoProof(route: "MagicBlock Private ER" | "Solana Devnet", memo: string) {
  if (!window.solana?.publicKey) throw new Error("Wallet is not connected");
  const endpoint = route === "MagicBlock Private ER" ? MAGICBLOCK_PRIVATE_ER_RPC : DEVNET_RPC;
  const connection = new Connection(endpoint, "confirmed");
  const transaction = new Transaction().add(
    new TransactionInstruction({
      keys: [],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memo, "utf8"),
    }),
  );
  transaction.feePayer = window.solana.publicKey;
  transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
  const { signature } = await window.solana.signAndSendTransaction(transaction);
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}
