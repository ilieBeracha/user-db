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
