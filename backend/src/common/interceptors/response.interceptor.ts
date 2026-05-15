import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (request.url.startsWith('/images')) {
      return next.handle();
    }
    
    const statusCode = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(map(data => ({ statusCode, message: 'Success', data })));
  }
}