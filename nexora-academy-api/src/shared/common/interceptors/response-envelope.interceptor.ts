import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{ headers: Record<string, string | undefined> }>();
    const response = http.getResponse<{ setHeader: (name: string, value: string) => void }>();

    const correlationId = request.headers['x-correlation-id'] ?? randomUUID();
    response.setHeader('x-correlation-id', correlationId);

    return next.handle().pipe(
      map((data) => ({
        data,
        meta: {
          correlationId,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}
