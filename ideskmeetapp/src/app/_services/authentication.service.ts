import { first }            from 'rxjs/operators';
import { Injectable }       from '@angular/core';
import { HttpClient,
         HttpHeaders }      from '@angular/common/http';
import { BehaviorSubject, 
         Observable }       from 'rxjs';
import { map }              from 'rxjs/operators';
import { environment }      from '../../environments/environment';
import { User }             from '../_modal';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
       private currentUserSubject : BehaviorSubject<User>;
       public  currentUser        : Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser        = this.currentUserSubject.asObservable();
        
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password) {

        return this.http.post<any>(`${environment.apiUrl}/auth/signin`, { username, password })
        .pipe(map(user => {
            
            // login successful if there's a jwt token in the response
            if (user.user && user.user.access_token) {

                localStorage.setItem('currentUser', JSON.stringify(user.user));
                this.currentUserSubject.next(user.user);
                
            }
            return user;
        }));
    }

    logout() {
        
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

}