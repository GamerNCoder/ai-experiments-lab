import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'

/** Very rough GPT-style token estimate (~4 chars per token). */
function roughTokens(text: string): number {
  if (!text.trim()) return 0
  return Math.max(1, Math.round(text.length / 4))
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

function scoreChunk(questionTokens: Set<string>, chunk: string): number {
  let s = 0
  for (const w of tokenize(chunk)) {
    if (questionTokens.has(w)) s += 1
  }
  return s
}

function keywordRag(corpus: string, question: string, k: number): { chunk: string; score: number }[] {
  const qt = new Set(tokenize(question))
  const chunks = corpus
    .split(/\n\s*\n/)
    .map((c) => c.trim())
    .filter(Boolean)
  const ranked = chunks.map((chunk) => ({ chunk, score: scoreChunk(qt, chunk) }))
  ranked.sort((a, b) => b.score - a.score)
  return ranked.filter((r) => r.score > 0).slice(0, k)
}

const SAMPLE_CORPUS = `RAG means retrieval-augmented generation. You fetch relevant documents before asking the model to answer.

Chunking matters: smaller chunks improve precision but lose context. Hybrid search combines keyword and vector scores.

Evaluation: keep a golden set of questions with expected facts. Measure citation accuracy, not vibes.`

export default function App() {
  const [corpus, setCorpus] = useState(SAMPLE_CORPUS)
  const [question, setQuestion] = useState('How should I evaluate a RAG system?')
  const [promptA, setPromptA] = useState('Explain RAG in two sentences for a high schooler.')
  const [promptB, setPromptB] = useState('Explain RAG with an analogy to a school library.')

  const hits = useMemo(() => keywordRag(corpus, question, 4), [corpus, question])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1.25rem' }}>
      <h1 style={{ marginTop: 0 }}>AI experiments lab</h1>
      <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>
        No API keys: keyword-overlap RAG plus rough token counts. Swap in embeddings or hosted models when you are
        ready to compare quality vs cost.
      </p>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem' }}>1) Token budget (rough)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#a1a1aa' }}>Prompt A</label>
            <textarea value={promptA} onChange={(e) => setPromptA(e.target.value)} rows={5} style={ta} />
            <div>≈ {roughTokens(promptA)} tokens</div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#a1a1aa' }}>Prompt B</label>
            <textarea value={promptB} onChange={(e) => setPromptB(e.target.value)} rows={5} style={ta} />
            <div>≈ {roughTokens(promptB)} tokens</div>
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1rem' }}>2) Keyword RAG playground</h2>
        <label style={{ display: 'block', fontSize: 12, color: '#a1a1aa' }}>Corpus (paragraphs separated by blank line)</label>
        <textarea value={corpus} onChange={(e) => setCorpus(e.target.value)} rows={10} style={{ ...ta, width: '100%' }} />
        <label style={{ display: 'block', fontSize: 12, color: '#a1a1aa', marginTop: 8 }}>Question</label>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} style={{ ...ta, width: '100%', minHeight: 0, height: 40 }} />
        <h3 style={{ fontSize: 14 }}>Top chunks by overlap</h3>
        {hits.length === 0 ? (
          <p style={{ color: '#71717a' }}>No overlap — try different wording or add corpus text.</p>
        ) : (
          <ol style={{ color: '#d4d4d8', lineHeight: 1.5 }}>
            {hits.map((h, i) => (
              <li key={i}>
                <span style={{ color: '#86efac' }}>(score {h.score})</span> {h.chunk}
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

const ta: CSSProperties = {
  width: '100%',
  marginTop: 6,
  padding: 10,
  borderRadius: 8,
  border: '1px solid #3f3f46',
  background: '#18181b',
  color: '#fafafa',
  resize: 'vertical' as const,
}
