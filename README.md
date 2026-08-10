# Thaink Tank ER

Independent Solana Blitz V7 submission for anonymous collaborative ideation with MagicBlock Private ER proof.

## Demo Flow

1. Connect a Solana devnet wallet.
2. Set a tank topic.
3. Submit a salted private idea commitment.
4. Reveal the idea salt after the blind phase.
5. Score the contribution.
6. Settle the digest hash on Solana devnet.

## MagicBlock Use

- Private ER endpoint: `https://devnet-tee.magicblock.app`
- Solana devnet endpoint: `https://api.devnet.solana.com`
- Proof format: signed memo transactions for the MVP, with commit/reveal/digest hashes visible in the UI.

## Local Development

```bash
npm install
npm run dev
```

## Reference

Inspired by Thaink Tank's public ETHGlobal showcase and source architecture. This is a new Solana/MagicBlock implementation with new product framing and assets.
