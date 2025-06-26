import { Component, input, Signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDb } from '../../core/user-db';
import { format } from 'sql-formatter';

interface DatabaseActivity {
  pid: number;
  username: string;
  application_name: string;
  client_addr: string;
  client_hostname: string | null;
  client_port: number;
  backend_start: string;
  query_start: string;
  state_change: string;
  state: string;
  query: string;
  query_duration: string;
  state_duration: string;
  connection_duration: string;
}

@Component({
  selector: 'app-dashboard-activities',
  imports: [CommonModule],
  templateUrl: './dashboard-activities.component.html',
  styleUrl: './dashboard-activities.component.css',
})
export class DashboardActivitiesComponent {
  recentActivities = input<DatabaseActivity[]>([]);
  private expandedQueries = new Set<number>();

  processedActivities = computed(() => {
    const activities = this.recentActivities();
    return activities?.map((activity) => ({
      ...activity,
      timeAgo: this.getTimeAgo(activity.query_start),
      queryPreview: this.getQueryPreview(activity.query),
      formattedQuery: this.formatSQL(activity.query),
      activityType: this.getActivityType(activity.query),
      statusColor: this.getStatusColor(activity.state),
    }));
  });

  formatSQL(query: string): string {
    if (!query) return '';
    try {
      return format(query, {
        language: 'postgresql',
        keywordCase: 'upper',
        indentStyle: 'standard'
      });
    } catch (error) {
      // If formatting fails, return the original query
      return query;
    }
  }

  toggleQueryExpansion(pid: number): void {
    if (this.expandedQueries.has(pid)) {
      this.expandedQueries.delete(pid);
    } else {
      this.expandedQueries.add(pid);
    }
  }

  isQueryExpanded(pid: number): boolean {
    return this.expandedQueries.has(pid);
  }

  private getTimeAgo(timestamp: string): string {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }

  private getQueryPreview(query: string): string {
    if (!query) return '';
    const cleanQuery = query.replace(/\s+/g, ' ').trim();
    return cleanQuery.length > 80
      ? cleanQuery.substring(0, 80) + '...'
      : cleanQuery;
  }

  private getActivityType(query: string): string {
    if (!query) return 'UNKNOWN';
    const upperQuery = query.toUpperCase().trim();

    if (upperQuery.startsWith('SELECT')) return 'SELECT';
    if (upperQuery.startsWith('INSERT')) return 'INSERT';
    if (upperQuery.startsWith('UPDATE')) return 'UPDATE';
    if (upperQuery.startsWith('DELETE')) return 'DELETE';
    if (upperQuery.startsWith('CREATE')) return 'CREATE';
    if (upperQuery.startsWith('DROP')) return 'DROP';
    if (upperQuery.startsWith('ALTER')) return 'ALTER';
    if (upperQuery.startsWith('BEGIN')) return 'BEGIN';
    if (upperQuery.startsWith('COMMIT')) return 'COMMIT';
    if (upperQuery.startsWith('ROLLBACK')) return 'ROLLBACK';

    return 'QUERY';
  }

  private getStatusColor(state: string): string {
    if (!state) return 'text-gray-600 bg-gray-100';

    switch (state.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'idle':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'idle in transaction':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'idle in transaction (aborted)':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'fastpath function call':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'disabled':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  }
}
