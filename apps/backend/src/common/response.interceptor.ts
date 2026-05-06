import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { ApiResponse } from '@fbp/shared';
import { API_SUCCESS_CODE } from '@fbp/shared';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        code: API_SUCCESS_CODE,
        message: 'success',
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
