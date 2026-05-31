CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  message TEXT NOT NULL,
  name TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  route TEXT NOT NULL,
  chapter INTEGER,
  step INTEGER,
  checkpoint_index INTEGER,
  event_index INTEGER,
  elapsed_ms INTEGER,
  theme TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_chapter_step ON feedback(chapter, step);
