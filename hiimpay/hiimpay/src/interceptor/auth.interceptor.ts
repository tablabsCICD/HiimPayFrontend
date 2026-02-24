import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtAuthService } from '../app/auth/authservice/jwt-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private jwtAuthService: JwtAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isS3Url = req.url.includes('s3.amazonaws.com');

    if (isS3Url) {
      return next.handle(req);
    }

    const token = this.jwtAuthService.getToken();

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
