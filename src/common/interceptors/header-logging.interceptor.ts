import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderLoggingInterceptor implements NestInterceptor {
    constructor() {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();
        if (req && req.headers) {
            Logger.debug(`Request headers: ${JSON.stringify(req.headers)}`);
        }

        return next.handle();
    }
}
