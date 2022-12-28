import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!event.body) {
            return event;
          }
          if (event.body instanceof Blob) {
            return event;
          }
          if (event.body) {
            return new HttpResponse({
              body: event.body
            });
          } else {
            throw new HttpErrorResponse({
              error: event.body.error
            });
          }
        }
        return event;
      }),
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 ) {
            window.location.href = '/login';
          }
        }
        return throwError(err);
      })
    );
  }
}
