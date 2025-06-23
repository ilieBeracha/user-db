export const GET_ALL_DATABASES_IN_SERVER_QUERY = `
SELECT
  d.datname,
  pg_catalog.pg_get_userbyid(d.datdba) AS owner,
  pg_size_pretty(pg_database_size(d.datname)) AS size,
  pg_database_size(d.datname) AS size_bytes,
  d.datistemplate,
  d.datallowconn,
  d.datconnlimit,
  d.encoding,
  d.datcollate,
  d.datctype,
  COALESCE(c.active_connections, 0) AS active_connections
FROM pg_database d
LEFT JOIN (
  SELECT datname, COUNT(*) AS active_connections
  FROM pg_stat_activity
  GROUP BY datname
) c ON d.datname = c.datname
ORDER BY d.datname;
`;
