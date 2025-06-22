import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError, EntityNotFoundError, CannotCreateEntityIdMapError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';
    let details: any = undefined;

    // Log the full exception for debugging
    this.logger.error('Exception caught:', exception);

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || message;
        error = (exceptionResponse as any).error || error;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle TypeORM query errors
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Query Failed';
      message = 'Database query failed';
      
      // In development, show more details
      if (process.env.NODE_ENV !== 'production') {
        details = {
          query: exception.query,
          parameters: exception.parameters,
          driverError: exception.driverError?.message || exception.message,
        };
      }
    } else if (exception instanceof EntityNotFoundError) {
      // Handle TypeORM entity not found errors
      status = HttpStatus.NOT_FOUND;
      error = 'Entity Not Found';
      message = exception.message;
    } else if (exception instanceof CannotCreateEntityIdMapError) {
      // Handle TypeORM entity ID map errors
      status = HttpStatus.BAD_REQUEST;
      error = 'Invalid Entity Data';
      message = exception.message;
    } else if (exception instanceof Error) {
      // Handle generic errors
      error = exception.name;
      message = exception.message;
      
      // In development, include stack trace
      if (process.env.NODE_ENV !== 'production') {
        details = {
          stack: exception.stack,
        };
      }
    }

    const errorResponse: any = {
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
    };

    // Add details in development mode
    if (details && process.env.NODE_ENV !== 'production') {
      errorResponse.details = details;
    }

    response.status(status).json(errorResponse);
  }
} 