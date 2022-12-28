import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let headers = request.headers
        .set('x-time-zone', `${timezone}`)
        .set('Authorization', `Bearer ${token}`);

      request = request.clone({ headers });
    }
    return next.handle(request);
  }
}
