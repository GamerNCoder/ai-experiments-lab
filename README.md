# AI Experiments Lab

Small **evaluation-minded** playground:

- Rough **token** estimates for two prompts side by side.
- **Keyword-overlap RAG** over a corpus you paste (no vectors, no API keys).

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
