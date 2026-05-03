/** Pure text helpers — portable to React Native / Expo. */

export function roughTokens(text: string): number {
  if (!text.trim()) return 0
  return Math.max(1, Math.round(text.length / 4))
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

export function scoreChunk(questionTokens: Set<string>, chunk: string): number {
  let s = 0
  for (const w of tokenize(chunk)) {
    if (questionTokens.has(w)) s += 1
  }
  return s
}

export function keywordRag(corpus: string, question: string, k: number): { chunk: string; score: number }[] {
  const qt = new Set(tokenize(question))
  const chunks = corpus
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean)
  const ranked = chunks.map((chunk) => ({ chunk, score: scoreChunk(qt, chunk) }))
  ranked.sort((a, b) => b.score - a.score)
  return ranked.filter((r) => r.score > 0).slice(0, k)
}

export const SAMPLE_CORPUS = `RAG means retrieval-augmented generation. You fetch relevant documents before asking the model to answer.

Chunking matters: smaller chunks improve precision but lose context. Hybrid search combines keyword and vector scores.

Evaluation: keep a golden set of questions with expected facts. Measure citation accuracy, not vibes.`
