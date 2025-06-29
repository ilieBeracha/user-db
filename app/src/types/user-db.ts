export interface connectUserDbDto {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl?: boolean;
}

export type UserDbFormComponent = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
};

export interface schemaExplorerResponse {
  results: DatabaseSchema[];
  query: string;
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
