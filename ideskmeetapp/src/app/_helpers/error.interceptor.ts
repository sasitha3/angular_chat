import { Injectable }           from '@angular/core';
import { HttpRequest, 
         HttpHandler, 
         HttpEvent, 
         HttpInterceptor, 
         HttpResponse}          from '@angular/common/http';
import { Observable, 
         throwError }           from 'rxjs';
import { catchError,tap }       from 'rxjs/operators';
import { AuthenticationService, 
         SpinnerService }       from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private spinnerService       : SpinnerService
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinnerService.requestStarted();
        
        return next.handle(request).pipe(tap(event => {

            if(event instanceof HttpResponse){

                this.spinnerService.requestEnded();
            }
        }),catchError(err => {

            if ([401, 403].indexOf(err.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }
            
            const error = err.error.message || err.statusText;
            this.spinnerService.resetSpinner();
            return throwError(error);
        }))
    }
}