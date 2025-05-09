/**
 * HTTP Exception Filter
 * Handles and formats HTTP exceptions in a consistent way
 */

const { ExceptionFilter, Catch, ArgumentsHost, HttpException } = require('@nestjs/common');
const { Request, Response } = require('express');

@Catch(HttpException)
class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      error: exception.name,
      message: exceptionResponse.message || exceptionResponse || exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    this.logError(errorResponse);

    response.status(status).json(errorResponse);
  }

  logError(error) {
    if (error.statusCode >= 500) {
      console.error(error);
    } else {
      console.warn(error);
    }
  }
}

module.exports = HttpExceptionFilter;
