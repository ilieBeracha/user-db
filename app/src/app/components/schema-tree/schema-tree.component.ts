// schema-tree.model.ts

export interface TreeNode {
  name: string;
  type: 'database' | 'table' | 'column';
  icon?: string;
  children?: TreeNode[];
  details?: any;
}

export interface DatabaseSchema {
  database: string;
  tables: {
    table_name: string;
    column_count: string;
    columns: {
      column: string;
      type: string;
      nullable: string;
      sample: any;
    }[];
  }[];
}

// schema-tree.component.ts
import { CommonModule } from '@angular/common';
import { Component, effect, input } from '@angular/core';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-schema-tree',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, MatButtonModule],
  templateUrl: './schema-tree.component.html',
  styleUrl: './schema-tree.component.css',
})
export class SchemaTreeComponent {
  schemaTree = input<DatabaseSchema[]>();

  treeControl = new NestedTreeControl<TreeNode>((node) => node.children || []);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  selectedNode: TreeNode | null = null;
  breadcrumbPath: TreeNode[] = [];

  constructor() {
    effect(() => {
      if (this.schemaTree()) {
        this.buildTreeData();
      }
    });
  }

  isColumn = (node: TreeNode) => node.type === 'column';
  isTable = (node: TreeNode) => node.type === 'table';

  hasChild = (_: number, node: TreeNode) => !!node.children?.length;

  private buildTreeData() {
    const schemas = this.schemaTree();
    if (!schemas) return;

    const treeData: TreeNode[] = schemas.map((schema) => ({
      name: schema.database,
      type: 'database',
      icon: 'storage',
      children: schema.tables.map((table) => ({
        name: `${table.table_name}`,
        type: 'table',
        schema: schema.database,
        icon: 'table_chart',
        children: table.columns.map((column) => ({
          name: `${column.column}`,
          type: 'column',
          icon: column.nullable === 'NO' ? 'key' : 'text_fields',
          details: column,
        })),
      })),
    }));

    this.dataSource.data = treeData;
  }

  onNodeClick(node: TreeNode, event: Event) {
    event.stopPropagation();
    this.selectedNode = node;
    console.log(node);
    this.updateBreadcrumb(node);
  }

  private updateBreadcrumb(node: TreeNode) {
    const path = this.findNodePath(node, this.dataSource.data);
    this.breadcrumbPath = path;
  }

  private findNodePath(
    target: TreeNode,
    nodes: TreeNode[],
    path: TreeNode[] = []
  ): TreeNode[] {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node === target) return newPath;
      if (node.children?.length) {
        const result = this.findNodePath(target, node.children, newPath);
        if (result.length) return result;
      }
    }
    return [];
  }

  getNodeTooltip(node: TreeNode): string {
    const path = this.findNodePath(node, this.dataSource.data);
    return path.map((n) => n.name.split(' (')[0]).join(' > ');
  }

  getNodeIcon(node: TreeNode) {
    return node.icon || 'help';
  }

  getNodeClass(node: TreeNode) {
    const selected = this.selectedNode === node ? 'selected' : '';
    const inPath = this.breadcrumbPath.includes(node)
      ? 'breadcrumb-active'
      : '';
    return `${this.getBaseNodeClass(node)} ${selected} ${inPath}`.trim();
  }

  private getBaseNodeClass(node: TreeNode) {
    switch (node.type) {
      case 'database':
        return 'database-node';
      case 'table':
        return 'table-node';
      case 'column':
        return 'column-node';
      default:
        return '';
    }
  }

  navigateToBreadcrumb(node: TreeNode) {
    this.selectedNode = node;
    this.updateBreadcrumb(node);
    this.findNodePath(node, this.dataSource.data).forEach((n) => {
      if (n.children?.length) this.treeControl.expand(n);
    });
  }
}
