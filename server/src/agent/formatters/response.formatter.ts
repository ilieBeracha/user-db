export interface QueryExecutionResult {
  request: string;
  generatedSQL: string;
  explanation: string;
  queryResult: any[];
  error: string | null;
  success: boolean;
  metadata: {
    executionTime: number;
    rowCount: number;
    columns?: string[];
  };
  tableFormat?: {
    headers: string[];
    rows: any[][];
  };
}

export interface ChatResponse {
  message: string;
  context: any;
  suggestedQueries?: string[];
  metadata: {
    timestamp: number;
    userId: string;
  };
}

export class ResponseFormatter {
  static formatQueryExecution(
    request: string,
    generatedSQL: string,
    explanation: string,
    queryResult: any,
    schema: any[],
    startTime: number
  ): QueryExecutionResult {
    const endTime = Date.now();
    const executionTime = endTime - startTime;

    const isSuccess = queryResult.success;
    const data = queryResult.data || [];
    const error = queryResult.error;

    let tableFormat: { headers: string[]; rows: any[] } | null = null;
    let columns: string[] = [];

    if (isSuccess && data.length > 0) {
      columns = Object.keys(data[0]) as string[];
      tableFormat = {
        headers: columns,
        rows: data.map((row) => columns.map((col) => row[col])),
      };
    }

    return {
      request,
      generatedSQL,
      explanation,
      queryResult: data,
      error,
      success: isSuccess,
      metadata: {
        executionTime,
        rowCount: data.length,
        columns,
      },
      tableFormat: tableFormat || undefined,
    };
  }

  static formatChatResponse(
    message: string,
    context: any,
    userId: string,
    suggestedQueries?: string[]
  ): ChatResponse {
    return {
      message,
      context,
      suggestedQueries,
      metadata: {
        timestamp: Date.now(),
        userId,
      },
    };
  }

  static formatError(error: string, context?: any) {
    return {
      success: false,
      error,
      context,
      timestamp: Date.now(),
    };
  }
}
