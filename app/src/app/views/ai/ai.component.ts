import { Component, computed, effect, inject } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { UserDb } from '../../core/user-db';
import { toSignal } from '@angular/core/rxjs-interop';
import { SchemaTreeComponent } from '../../components/schema-tree/schema-tree.component';
import { AiGenComponent } from '../../components/ai-gen/ai-gen.component';
import { ResultsIdeComponent } from '../../components/results-ide/results-ide.component';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ResponseTableComponent } from '../../components/response-table-component/response-table-component';
import { DashboardActivitiesComponent } from '../../components/dashboard-activities/dashboard-activities.component';
import { Agents } from '../../core/ai';
@Component({
  selector: 'app-ai',
  imports: [
    MatGridListModule,
    NzSplitterModule,
    NzSwitchModule,
    SchemaTreeComponent,
    AiGenComponent,
    CommonModule,
    NzTableModule,  
    ResponseTableComponent,
    ResultsIdeComponent,
    SchemaTreeComponent,
    AiGenComponent,
    DashboardActivitiesComponent,
  ],
  templateUrl: './ai.component.html',
  styleUrl: './ai.component.css',
})
export class AiComponent {
  userDb = inject(UserDb);
  agents = inject(Agents);
  currentQuery: any = this.agents.currentQuery();
  protected schemaExplorer: any = toSignal(this.userDb.getSchemaExplorer());
  protected recentActivities = toSignal(this.userDb.getRecentActivities());

  // UI State
  activeView: 'raw' | 'diagram' = 'raw';
  showAnalytics = true;

  // Mock Data
  mockStats = {
    database: 'user_analytics_db',
    queriestoday: 47,
    lastQueryTime: 142,
    rowsReturned: 1247,
    memoryUsage: '2.3MB',
    totalTables: 23,
    activeConnections: 8,
    cacheHitRate: 94.7
  };

  mockRecentQueries = [
    { title: 'SELECT * FROM users WHERE active = true', time: '2 min ago', sql: 'SELECT * FROM users WHERE active = true' },
    { title: 'User growth analytics query', time: '15 min ago', sql: 'SELECT DATE(created_at), COUNT(*) FROM users GROUP BY DATE(created_at)' },
    { title: 'Revenue by month calculation', time: '1 hour ago', sql: 'SELECT EXTRACT(MONTH FROM order_date), SUM(amount) FROM orders GROUP BY EXTRACT(MONTH FROM order_date)' },
    { title: 'Top selling products analysis', time: '2 hours ago', sql: 'SELECT p.name, SUM(oi.quantity) FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.name' },
    { title: 'Customer retention metrics', time: 'Yesterday', sql: 'SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE created_at >= NOW() - INTERVAL 30 DAY' }
  ];

  mockFavorites = [
    { name: 'Daily Active Users', sql: 'SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE DATE(created_at) = CURDATE()' },
    { name: 'Monthly Revenue', sql: 'SELECT SUM(amount) FROM orders WHERE MONTH(created_at) = MONTH(NOW())' },
    { name: 'User Signup Trends', sql: 'SELECT DATE(created_at), COUNT(*) FROM users GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC LIMIT 30' },
    { name: 'Top Categories', sql: 'SELECT c.name, COUNT(p.id) FROM categories c JOIN products p ON c.id = p.category_id GROUP BY c.name' }
  ];

  mockSuggestions = [
    { text: 'Add INDEX on user_id for better performance', type: 'performance' },
    { text: 'Consider using LIMIT for large result sets', type: 'optimization' },
    { text: 'Use prepared statements for security', type: 'security' },
    { text: 'Add WHERE clause to filter results', type: 'functionality' },
    { text: 'Consider partitioning for large tables', type: 'scaling' }
  ];

  // Methods
  triggerQuery(query: string) {
    console.log(query);
  }

  setView(view: 'raw' | 'diagram') {
    this.activeView = view;
  }

  toggleAnalytics() {
    this.showAnalytics = !this.showAnalytics;
  }

  loadQuery(query: any) {
    console.log('Loading query:', query.sql || query.title);
    // Here you would load the query into the editor
  }

  exportResults() {
    console.log('Exporting results...');
    // Mock export functionality
  }

  saveQuery() {
    console.log('Saving current query...');
    // Mock save functionality
  }

  newQuery() {
    console.log('Creating new query...');
    // Mock new query functionality
  }

  applySuggestion(suggestion: any) {
    console.log('Applying suggestion:', suggestion.text);
    // Mock suggestion application
  }
}
