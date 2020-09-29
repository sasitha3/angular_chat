import { Injectable }            from '@angular/core';
import { HttpRequest, 
         HttpHandler, 
         HttpEvent, 
         HttpInterceptor }       from '@angular/common/http';
import { environment }           from '../../environments/environment'
import { Observable }            from 'rxjs';
import { AuthenticationService } from '../_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser  = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.access_token;
        const isApiUrl   = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {    
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.access_token}`
                }
            });
        }

        return next.handle(request);
    }
}