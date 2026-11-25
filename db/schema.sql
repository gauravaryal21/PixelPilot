CREATE TABLE IF NOT EXISTS scores (
  run_id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 12),
  score INTEGER NOT NULL CHECK(score >= 0 AND score <= 10000000),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS scores_leaderboard
ON scores(score DESC, created_at ASC);
