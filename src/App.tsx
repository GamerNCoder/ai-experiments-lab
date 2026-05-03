import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { keywordRag, roughTokens, SAMPLE_CORPUS } from './lib/rag'

export default function App() {
  const [corpus, setCorpus] = useState(SAMPLE_CORPUS)
  const [question, setQuestion] = useState('How should I evaluate a RAG system?')
  const [promptA, setPromptA] = useState('Explain RAG in two sentences for a high schooler.')
  const [promptB, setPromptB] = useState('Explain RAG with an analogy to a school library.')

  const hits = useMemo(() => keywordRag(corpus, question, 4), [corpus, question])

  const tokenGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: 12,
  }

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: 'clamp(0.75rem, 3vw, 1.25rem)' }}>
      <h1 style={{ marginTop: 0, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>AI experiments lab</h1>
      <p style={{ color: '#a1a1aa', lineHeight: 1.6 }}>
        No API keys: keyword-overlap RAG plus rough token counts. Logic in <code>src/lib/rag.ts</code> for reuse in Expo. See{' '}
        <code>MOBILE.md</code>.
      </p>

      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem' }}>1) Token budget (rough)</h2>
        <div style={tokenGrid}>
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
        <input value={question} onChange={(e) => setQuestion(e.target.value)} style={{ ...ta, width: '100%', minHeight: 0, height: 44, fontSize: 16 }} />
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
  padding: 12,
  borderRadius: 8,
  border: '1px solid #3f3f46',
  background: '#18181b',
  color: '#fafafa',
  resize: 'vertical' as const,
  fontSize: 16,
}
