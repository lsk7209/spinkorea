-- SpinFlow D1 데이터베이스 스키마

-- URL 단축 테이블
CREATE TABLE IF NOT EXISTS shortened_urls (
  id TEXT PRIMARY KEY,
  original_url TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- 통계 테이블 (선택적)
CREATE TABLE IF NOT EXISTS spin_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  items_count INTEGER NOT NULL,
  result TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_shortened_urls_created_at ON shortened_urls(created_at);
CREATE INDEX IF NOT EXISTS idx_spin_stats_created_at ON spin_stats(created_at);

