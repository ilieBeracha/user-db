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
