export const LARGEST_DATABASE_QUERY = `
SELECT 
  d.datname AS database_name,
  pg_catalog.pg_get_userbyid(d.datdba) AS owner,
  pg_size_pretty(pg_database_size(d.datname)) AS size,
  pg_database_size(d.datname) AS size_bytes,
  has_database_privilege(d.datname, 'CONNECT') AS can_connect
FROM pg_database d
WHERE 
  d.datistemplate = false
  AND has_database_privilege(d.datname, 'CONNECT')
ORDER BY pg_database_size(d.datname) DESC
LIMIT $1;
`;

export const GET_RECENT_ACTIVITY_QUERY = `
-- Recent database activity including query and connection timing
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
  -- Durations
  (now() - query_start)::text          AS query_duration,
  (now() - state_change)::text         AS state_duration,
  (now() - backend_start)::text        AS connection_duration
FROM pg_stat_activity
WHERE
  pid <> pg_backend_pid()              -- Exclude current session
  AND state IS NOT NULL                -- Only active/idle queries
ORDER BY
  COALESCE(query_start, state_change, backend_start) DESC
LIMIT $1;
`;

export const PERFORMANCE_MATRIX = `
SELECT 
    db.datname as database_name,
    ROUND((stat.blks_hit * 100.0) / NULLIF(stat.blks_hit + stat.blks_read, 0), 2) as cache_hit_ratio,
    count(act.pid) as active_connections,
    ROUND(pg_database_size(db.datname) / (1024*1024.0), 0) as size_mb,
    stat.xact_commit + stat.xact_rollback as total_transactions
FROM pg_database db
LEFT JOIN pg_stat_database stat ON db.datname = stat.datname
LEFT JOIN pg_stat_activity act ON db.datname = act.datname
WHERE db.datname NOT IN ('template0', 'template1', 'postgres')
    AND db.datallowconn = true
GROUP BY db.datname, stat.blks_hit, stat.blks_read, stat.xact_commit, stat.xact_rollback
ORDER BY cache_hit_ratio DESC;
`;

export const CONNECTION_USAGE_BY_DB_QUERY = `
-- Show connection count per database with percentage of total
SELECT 
  COALESCE(datname, 'System') AS database_name,
  COUNT(*) AS connection_count,
  ROUND(
    (COUNT(*) * 100.0) / NULLIF((SELECT COUNT(*) FROM pg_stat_activity), 0),
    2
  ) AS percentage
FROM pg_stat_activity
GROUP BY datname
ORDER BY connection_count DESC;
`;

export const EFFICIENCY_COMPARISON_QUERY = `
-- Efficiency score based on buffer cache hit ratio
WITH hit_stats AS (
  SELECT 
    datname AS database_name,
    ROUND((blks_hit * 100.0) / NULLIF(blks_hit + blks_read, 0), 2) AS cache_hit_ratio
  FROM pg_stat_database
  WHERE 
    datname NOT IN ('template0', 'template1', 'postgres')
    AND blks_hit + blks_read > 0
)
SELECT
  database_name,
  cache_hit_ratio,
  CASE 
    WHEN cache_hit_ratio >= 95 THEN 'Excellent'
    WHEN cache_hit_ratio >= 90 THEN 'Good'
    WHEN cache_hit_ratio >= 80 THEN 'Fair'
    ELSE 'Poor'
  END AS performance_rating
FROM hit_stats
ORDER BY cache_hit_ratio DESC;
`;

export const RESOURCE_UTILIZATION_SUMMARY_QUERY = `
SELECT 
    db.datname as database_name,
    
    -- Size metrics
    pg_size_pretty(pg_database_size(db.datname)) as size_formatted,
    ROUND(pg_database_size(db.datname) / (1024*1024.0), 0) as size_mb,
    ROUND(pg_database_size(db.datname) / (1024*1024*1024.0), 2) as size_gb,
    
    -- Connection metrics
    COALESCE(conn_count.active_connections, 0) as active_connections,
    ROUND((COALESCE(conn_count.active_connections, 0) * 100.0) / (SELECT count(*) FROM pg_stat_activity), 2) as connection_percentage,
    
    -- Performance metrics
    ROUND((stat.blks_hit * 100.0) / NULLIF(stat.blks_hit + stat.blks_read, 0), 2) as cache_hit_ratio,
    CASE 
        WHEN (stat.blks_hit * 100.0) / NULLIF(stat.blks_hit + stat.blks_read, 0) >= 95 THEN 'Excellent'
        WHEN (stat.blks_hit * 100.0) / NULLIF(stat.blks_hit + stat.blks_read, 0) >= 90 THEN 'Good'
        WHEN (stat.blks_hit * 100.0) / NULLIF(stat.blks_hit + stat.blks_read, 0) >= 80 THEN 'Fair'
        ELSE 'Poor'
    END as performance_rating,
    
    -- Transaction metrics
    stat.xact_commit + stat.xact_rollback as total_transactions,
    ROUND((stat.xact_commit * 100.0) / NULLIF(stat.xact_commit + stat.xact_rollback, 0), 1) as commit_ratio,
    
    -- Activity metrics
    stat.tup_returned as tuples_returned,
    stat.tup_fetched as tuples_fetched,
    stat.tup_inserted as tuples_inserted,
    stat.tup_updated as tuples_updated,
    stat.tup_deleted as tuples_deleted,
    
    -- I/O metrics
    stat.blks_read as blocks_read,
    stat.blks_hit as blocks_hit

FROM pg_database db
LEFT JOIN pg_stat_database stat ON db.datname = stat.datname
LEFT JOIN (
    SELECT datname, count(*) as active_connections 
    FROM pg_stat_activity 
    WHERE state = 'active' 
    GROUP BY datname
) conn_count ON db.datname = conn_count.datname
WHERE db.datname NOT IN ('template0', 'template1', 'postgres')
    AND db.datallowconn = true
ORDER BY total_transactions DESC;
 `;

export const GET_TABLES_WITH_COLUMNS_QUERY = `
 SELECT
   t.table_name,
   COUNT(c.column_name) AS column_count,
   JSON_AGG(
     JSON_BUILD_OBJECT(
       'column', c.column_name,
       'type', c.data_type,
       'nullable', c.is_nullable
     ) ORDER BY c.ordinal_position
   ) AS columns
 FROM information_schema.tables t
 JOIN information_schema.columns c
   ON t.table_name = c.table_name
  AND t.table_schema = c.table_schema
 WHERE t.table_schema = 'public'
   AND t.table_type = 'BASE TABLE'
 GROUP BY t.table_name
 ORDER BY t.table_name;
`;

export const GET_TABLE_DATA_QUERY = `
SELECT * FROM get_table_data_dynamic($1) 
AS t(col1 TEXT, col2 INT, col3 TIMESTAMP);
`;
