export interface DatabasePerformanceMetrics {
  database_name: string;

  // Size metrics
  size_formatted: string; // e.g., "8993 kB"
  size_mb: string | number; // Size in megabytes
  size_gb: string | number; // Size in gigabytes

  // Connection metrics
  active_connections: string | number; // Current active connections
  connection_percentage: string | number; // Percentage of total connections

  // Performance metrics
  cache_hit_ratio: string | number; // Cache hit ratio percentage
  performance_rating: "Excellent" | "Good" | "Fair" | "Poor"; // Performance classification

  // Transaction metrics
  total_transactions: string | number; // Total transactions (commits + rollbacks)
  commit_ratio: string | number; // Commit success ratio percentage

  // Activity metrics - tuple operations
  tuples_returned: string | number; // Total tuples returned by queries
  tuples_fetched: string | number; // Total tuples fetched via index scans
  tuples_inserted: string | number; // Total tuples inserted
  tuples_updated: string | number; // Total tuples updated
  tuples_deleted: string | number; // Total tuples deleted

  // I/O metrics - disk vs cache
  blocks_read: string | number; // Total blocks read from disk
  blocks_hit: string | number; // Total blocks found in cache
}

// Alternative version with strictly typed numbers (if you convert strings to numbers)
export interface DatabasePerformanceMetricsNumeric {
  database_name: string;

  // Size metrics
  size_formatted: string; // Keep formatted string for display
  size_mb: number; // Size in megabytes
  size_gb: number; // Size in gigabytes

  // Connection metrics
  active_connections: number; // Current active connections
  connection_percentage: number; // Percentage of total connections

  // Performance metrics
  cache_hit_ratio: number; // Cache hit ratio percentage
  performance_rating: "Excellent" | "Good" | "Fair" | "Poor";

  // Transaction metrics
  total_transactions: number; // Total transactions
  commit_ratio: number; // Commit success ratio percentage

  // Activity metrics
  tuples_returned: number; // Total tuples returned
  tuples_fetched: number; // Total tuples fetched
  tuples_inserted: number; // Total tuples inserted
  tuples_updated: number; // Total tuples updated
  tuples_deleted: number; // Total tuples deleted

  // I/O metrics
  blocks_read: number; // Total blocks read from disk
  blocks_hit: number; // Total blocks found in cache
}

// Array type for multiple databases
export type DatabasePerformanceArray = DatabasePerformanceMetrics[];
export type DatabasePerformanceNumericArray =
  DatabasePerformanceMetricsNumeric[];

// Utility type for chart data
export interface ChartDataPoint {
  label: string;
  value: number;
  database: string;
}
