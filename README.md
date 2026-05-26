# AI Experiments Lab

Small **evaluation-minded** playground:

- Rough **token** estimates for two prompts side by side.
- **Keyword-overlap RAG** over a corpus you paste (no vectors, no API keys).

## Status (May 2026)

- **Offline**: no model/API keys required.
- **PWA-ready**: includes manifest + mobile-friendly layout.
- **Reusable core**: `src/lib/rag.ts` (meant to be shared with an Expo app later).

## Why

Shows you understand **retrieval, chunking, and measurement**—not only calling `chat.completions`.

## Run

```bash
npm install && npm run dev
```

**PWA manifest**; RAG + token helpers in **`src/lib/rag.ts`**. **`MOBILE.md`** for Expo reuse.

## Next experiments

- Add cosine similarity with `transformers.js` embeddings.
- Log prompt runs to CSV for A/B charts.

MIT — portfolio.
