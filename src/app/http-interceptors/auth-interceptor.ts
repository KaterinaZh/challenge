import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {NEVER, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly TOKEN = 'challenge-token';

  constructor(
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>,
            next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem(this.TOKEN);

    if (token) {
      const payload = this.parseJwt(token);
      if (Date.now() >= payload.exp * 1000) {
        localStorage.removeItem(this.TOKEN);
        this.router.navigate(['/admin-login']);
        return NEVER;
      }
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + token)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}
