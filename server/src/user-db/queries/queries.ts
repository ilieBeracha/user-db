export const LARGEST_DATABASE_QUERY = `
-- Shows database sizes ordered by size (largest first)
SELECT 
    datname AS database_name,
    pg_size_pretty(pg_database_size(datname)) AS size,
    pg_database_size(datname) AS size_bytes
FROM pg_database
WHERE datistemplate = false
ORDER BY pg_database_size(datname) DESC
LIMIT $1;
`;

export const GET_RECENT_ACTIVITY_QUERY = `
-- Shows recent activity with query details
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
SELECT 
    COALESCE(datname, 'System') as database_name,
    count(*) as connection_count,
    ROUND((count(*) * 100.0) / (SELECT count(*) FROM pg_stat_activity), 2) as percentage
FROM pg_stat_activity 
GROUP BY datname
ORDER BY connection_count DESC;
`;

export const EFFICIENCY_COMPARISON_QUERY = `
SELECT 
    datname as database_name,
    ROUND((blks_hit * 100.0) / NULLIF(blks_hit + blks_read, 0), 2) as cache_hit_ratio,
    CASE 
        WHEN (blks_hit * 100.0) / NULLIF(blks_hit + blks_read, 0) >= 95 THEN 'Excellent'
        WHEN (blks_hit * 100.0) / NULLIF(blks_hit + blks_read, 0) >= 90 THEN 'Good'
        WHEN (blks_hit * 100.0) / NULLIF(blks_hit + blks_read, 0) >= 80 THEN 'Fair'
        ELSE 'Poor'
    END as performance_rating
FROM pg_stat_database 
WHERE datname NOT IN ('template0', 'template1', 'postgres')
    AND blks_hit + blks_read > 0
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
