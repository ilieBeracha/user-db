import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DatabaseComparison {
  database_name: string;
  size_formatted: string;
  size_mb: string;
  size_gb: string;
  active_connections: string;
  connection_percentage: string;
  cache_hit_ratio: string;
  performance_rating: string;
  total_transactions: string;
  commit_ratio: string;
  tuples_returned: string;
  tuples_fetched: string;
  tuples_inserted: string;
  tuples_updated: string;
  tuples_deleted: string;
  blocks_read: string;
  blocks_hit: string;
}

@Component({
  selector: 'app-dashboard-comparison',
  imports: [CommonModule],
  templateUrl: './dashboard-comparison.component.html',
  styleUrl: './dashboard-comparison.component.css',
})
export class DashboardComparisonComponent {
  readonly comparisonData = input<DatabaseComparison[]>([]);

  aggregatedStats = computed(() => {
    const data = this.comparisonData();
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    const totalDatabases = data.length;
    const totalSize = data.reduce((sum, db) => sum + parseFloat(db.size_gb), 0);
    const totalConnections = data.reduce(
      (sum, db) => sum + parseInt(db.active_connections),
      0
    );
    const avgCacheHit =
      data.reduce((sum, db) => sum + parseFloat(db.cache_hit_ratio), 0) /
      totalDatabases;
    const totalTransactions = data.reduce(
      (sum, db) => sum + parseInt(db.total_transactions),
      0
    );

    const performanceDistribution = data.reduce((acc, db) => {
      acc[db.performance_rating] = (acc[db.performance_rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalTuples = data.reduce(
      (sum, db) =>
        sum +
        parseInt(db.tuples_inserted) +
        parseInt(db.tuples_updated) +
        parseInt(db.tuples_deleted),
      0
    );

    return {
      totalDatabases,
      totalSize: totalSize.toFixed(2),
      totalConnections,
      avgCacheHit: avgCacheHit.toFixed(1),
      totalTransactions,
      performanceDistribution,
      totalTuples,
      healthyDatabases: data.filter((db) => parseFloat(db.cache_hit_ratio) > 90)
        .length,
      activeDatabases: data.filter((db) => parseInt(db.active_connections) > 0)
        .length,
    };
  });

  keys = Object.keys;

  private getPerformanceColor(rating: string): string {
    switch (rating.toLowerCase()) {
      case 'excellent':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'good':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'poor':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      default:
        return 'text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800';
    }
  }

  private getCacheRating(ratio: number): string {
    if (ratio >= 99) return 'Excellent';
    if (ratio >= 95) return 'Good';
    if (ratio >= 85) return 'Fair';
    return 'Poor';
  }

  private getConnectionStatus(connections: number): {
    status: string;
    color: string;
  } {
    if (connections === 0)
      return {
        status: 'Inactive',
        color: 'text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800',
      };
    if (connections <= 2)
      return {
        status: 'Low',
        color:
          'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
      };
    if (connections <= 5)
      return {
        status: 'Medium',
        color:
          'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
      };
    return {
      status: 'High',
      color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900',
    };
  }
}
