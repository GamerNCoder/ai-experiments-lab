# Web → native mobile

Token + RAG helpers live in **`src/lib/rag.ts`**. Expo can reuse the same functions; swap `<textarea>` for multiline `TextInput` and keep corpus in state or file import.

## PWA

**vite-plugin-pwa** precaches the lab shell. Heavy model calls still need network unless you wire local inference later.
