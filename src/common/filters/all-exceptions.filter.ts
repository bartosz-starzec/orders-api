import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message: unknown = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            } else if (typeof res === 'object' && res !== null) {
                const maybe = res as Record<string, unknown>;
                if (typeof maybe.message === 'string') {
                    message = maybe.message;
                } else if (typeof maybe.error === 'string') {
                    message = maybe.error;
                } else {
                    message = res;
                }
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            Logger.error('[Unhandled Exception]', exception.message || exception);
        }

        const payload = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request?.url ?? null,
            message,
        };

        response.status(status).json(payload);
    }
}
