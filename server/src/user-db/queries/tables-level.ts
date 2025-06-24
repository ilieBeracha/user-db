export const GET_TABLES_QUERY = `
  SELECT table_schema, table_name
  FROM information_schema.tables
  WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    AND table_type = 'BASE TABLE'
  ORDER BY table_schema, table_name
`;

export const GET_COLUMNS_QUERY = `
  SELECT table_schema, table_name, column_name, data_type
  FROM information_schema.columns
  WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
  ORDER BY table_schema, table_name, ordinal_position
`;

export const KILL_STALE_CONNECTIONS_QUERY = `
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle' AND pid <> pg_backend_pid();
`;

export const GET_LONG_RUNNING_QUERIES_QUERY = `
SELECT
  pid,
  query,
  (now() - query_start)::text AS duration
FROM pg_stat_activity
WHERE state != 'idle'
  AND pid <> pg_backend_pid()
  AND query NOT ILIKE pg_stat_activity.query
ORDER BY duration DESC
LIMIT 5;

`;

export const GET_SIZE_USED_DATABASES_QUERY = `
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) AS size,
  pg_database_size(datname) AS size_bytes
FROM pg_database
ORDER BY pg_database_size(datname) DESC
LIMIT 10;

`;

export const GET_BUFFER_CACHE_QUERY = `
SELECT
  c.relname AS table,
  count(*) AS buffers,
  count(*) * 8 / 1024 AS buffer_mb
FROM pg_buffercache b
JOIN pg_class c ON b.relfilenode = pg_relation_filenode(c.oid)
JOIN pg_database d ON b.reldatabase = d.oid
WHERE d.datname = current_database()
GROUP BY c.relname
ORDER BY buffers DESC;
`;

export const TOTAL_SIZE_QUERY = `
SELECT
  pg_size_pretty(pg_database_size(current_database())) AS total_size;
`;

export const GET_SIZE_USED_TABLES_QUERY = `
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) AS size,
  pg_database_size(datname) AS size_bytes
FROM pg_database
ORDER BY pg_database_size(datname) DESC
LIMIT 10;

`;

export const TOP_TABLES_I_O_QUERY = `
SELECT
  relname AS table,
  idx_blks_hit + heap_blks_hit AS cache_hits,
  idx_blks_read + heap_blks_read AS disk_reads
FROM pg_statio_user_tables
ORDER BY (idx_blks_read + heap_blks_read) DESC
LIMIT 10;

`;

export const INDEX_EFFICIENCY = `
SELECT
  relname AS table_name,
  idx_scan,
  seq_scan,
  ROUND(100 * idx_scan::decimal / NULLIF(seq_scan + idx_scan, 0), 1) AS index_efficiency_percent
FROM pg_stat_user_tables
ORDER BY index_efficiency_percent ASC NULLS LAST
LIMIT 10;
`;

export const AUTOVACUUM_STATUS = `
SELECT
  relname AS table,
  last_autovacuum,
  last_vacuum,
  last_analyze
FROM pg_stat_user_tables
ORDER BY last_autovacuum DESC NULLS LAST;
`;

export const TOP_DB_CONNECTIONS = `SELECT
  datname,
  COUNT(*) AS connection_count
FROM pg_stat_activity
GROUP BY datname
ORDER BY connection_count DESC;
`;

export const INDEX_EFFICIENCY_QUERY = `
SELECT
  relname AS table_name,
  idx_scan,
  seq_scan,
  ROUND(100 * idx_scan::decimal / NULLIF(seq_scan + idx_scan, 0), 1) AS index_efficiency_percent
FROM pg_stat_user_tables
ORDER BY index_efficiency_percent ASC NULLS LAST
LIMIT 10;
`;

export const DEAD_TUPLES_QUERY = `
SELECT
  schemaname || '.' || relname AS table,
  n_live_tup,
  n_dead_tup,
  ROUND(100 * n_dead_tup::decimal / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_ratio_percent
FROM pg_stat_user_tables
ORDER BY dead_ratio_percent DESC
LIMIT 10;
`;

// top 1
export const DEAD_TUPLES_TOP_1 = `
  SELECT
    schemaname || '.' || relname AS table,
    n_live_tup,
    n_dead_tup,
    ROUND(100 * n_dead_tup::decimal / NULLIF(n_live_tup + n_dead_tup, 0), 2) AS dead_ratio_percent
  FROM pg_stat_user_tables
  ORDER BY dead_ratio_percent DESC
  LIMIT 1;
`;

export const INDEX_EFFICIENCY_TOP_1 = `
SELECT
  relname AS table_name,
  idx_scan,
  seq_scan,
  ROUND(100 * idx_scan::decimal / NULLIF(seq_scan + idx_scan, 0), 1) AS index_efficiency_percent
FROM pg_stat_user_tables
ORDER BY index_efficiency_percent ASC NULLS LAST
LIMIT 1;
`;
export const LARGEST_DATABASE_TOP_1 = `
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) AS size,
  pg_database_size(datname) AS size_bytes
FROM pg_database
ORDER BY pg_database_size(datname) DESC
LIMIT 1;
`;
export const CONNECTION_DB_TOP_1 = `
SELECT
  datname,
  COUNT(*)::int AS connection_count
FROM pg_stat_activity
GROUP BY datname
ORDER BY COUNT(*) DESC
LIMIT 1;
`;

export const IO_TABLE_TOP_1 = `
SELECT
  relname AS table,
  idx_blks_hit + heap_blks_hit AS cache_hits,
  idx_blks_read + heap_blks_read AS disk_reads
FROM pg_statio_user_tables
ORDER BY (idx_blks_read + heap_blks_read) DESC
LIMIT 1;
`;

export const GET_RECENT_ACTIVITY_QUERY = `
  SELECT
    pid,
    usename AS username,
    application_name,
    client_addr,
    client_hostname,
    client_port,
    backend_start,
    query_start,
    state_change,
    state,
    query,
    (now() - query_start)::text AS query_duration,
    (now() - state_change)::text AS state_duration,
    (now() - backend_start)::text AS connection_duration
  FROM pg_stat_activity
  WHERE pid <> pg_backend_pid()
    AND state IS NOT NULL
  ORDER BY COALESCE(query_start, state_change, backend_start) DESC
  LIMIT $1;
`;
