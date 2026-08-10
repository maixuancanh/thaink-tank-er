# Thaink Tank ER

Independent Solana Blitz V7 submission for anonymous collaborative ideation with MagicBlock ER proof.

## Demo Flow

1. Connect a Solana devnet wallet.
2. Set a tank topic.
3. Submit a salted private idea commitment.
4. Reveal the idea salt after the blind phase.
5. Score the contribution.
6. Settle the digest hash on Solana devnet.

## MagicBlock Use

- MagicBlock ER endpoint: `https://devnet.magicblock.app`
- Solana devnet endpoint: `https://api.devnet.solana.com`
- Custom program ID: `B6V9ZneUTRCMxAERJwEY5Q361beYDBSo55xo1S2QgW4Q`
- Deploy tx: `4FnCQ6qjgJRytDSypjHtbMXk7W24fXCWjWA5rpR3ieZQb5cTU32mtvCQLKrVP6sxyD2rmD88V25QsE9J4BiEZWsp`
- Proof format: wallet-signed custom program instructions carrying commit/reveal/digest payloads.

## Local Development

```bash
npm install
npm run dev
```

## Reference

Inspired by Thaink Tank's public ETHGlobal showcase and source architecture. This is a new Solana/MagicBlock implementation with new product framing and assets.
